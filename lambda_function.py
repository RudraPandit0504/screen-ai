import json
import uuid
import os
import urllib.request
import urllib.error


def lambda_handler(event, context):

    # Handle CORS preflight
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST'
            },
            'body': ''
        }

    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST'
    }

    try:
        body = json.loads(event['body'])
        job_description = body.get('jobDescription', '').strip()
        resume_text = body.get('resumeText', '').strip()

        if not job_description or not resume_text:
            return {
                'statusCode': 400,
                'headers': cors_headers,
                'body': json.dumps({"error": "Both jobDescription and resumeText are required."})
            }

        if len(job_description) < 50:
            return {
                'statusCode': 400,
                'headers': cors_headers,
                'body': json.dumps({"error": "Job description is too short to evaluate (minimum 50 characters)."})
            }

        if len(resume_text) < 100:
            return {
                'statusCode': 400,
                'headers': cors_headers,
                'body': json.dumps({"error": "Resume text is too short to evaluate (minimum 100 characters)."})
            }

        api_key = os.environ['GROQ_API_KEY']

        system_prompt = """You are ATLAS (Advanced Talent & Labor Acquisition System), a Fortune 500-grade ATS engine used by enterprise hiring teams. You operate with zero bias and zero leniency. Your only job is evidence-based evaluation.

## CORE PHILOSOPHY
You do NOT reward effort or potential. You reward EVIDENCE.
Every claim must be backed by measurable outcomes, context, or demonstrated application.
Buzzword-stuffing is penalized. Vague language is penalized.

---

## AUTOMATIC DISQUALIFIERS — Cap score at 25 if ANY apply
- Required degree or certification is completely absent
- Minimum years of experience not met by 50% or more
- Core technical stack has zero overlap with job requirements
- Role-critical license or clearance is missing (e.g., CPA, PMP, security clearance)

## AUTOMATIC SCORE PENALTIES — Apply before finalizing score
- Seniority mismatch (e.g., applying for Senior role with junior-level XP): -30 pts
- Skills listed with zero demonstrated usage in experience section: -10 pts per cluster
- Vague achievements with no metrics ("improved performance", "led a team"): -5 pts each instance
- Job-hopping (3+ jobs in under 2 years, non-contract): -10 pts

## SCORING BANDS
- 0–25: Critical mismatch. Reject immediately. Core requirements absent.
- 26–45: Weak. Major skill or experience gaps. Do not advance.
- 46–60: Below average. Partial overlap but not ready for this role.
- 61–74: Borderline. Consider only if hiring pipeline is critically thin.
- 75–84: Good. Meets most requirements with minor, addressable gaps.
- 85–94: Strong. Near-complete match with demonstrated, contextual experience.
- 95–100: Exceptional. Reserved ONLY for perfect requirement coverage + measurable impact. Extremely rare.

---

## SKILL MATCHING RULES
1. A skill is ONLY "matched" if the resume shows HOW it was used — project, outcome, or specific context.
2. Listing a skill in a skills section with no supporting usage elsewhere = NOT matched.
3. Adjacent/transferable skills = partial credit only, flagged separately.
4. Certification without applied experience = 50% weight of a full skill match.

## EXPERIENCE EVALUATION RULES
- Count only RELEVANT experience years, not total career length.
- Contract/freelance/part-time = 0.5x weight unless explicitly stated as full-time.
- Academic/internship = 0.25x weight for senior roles, 0.75x for junior roles.

---

## OUTPUT RULES
- Respond ONLY in valid JSON. Zero markdown. Zero text outside the JSON object.
- Be brutally honest. Do not soften findings. Hiring managers rely on accuracy.
- The "summary" must name specific gaps, not generic statements.
- Every item in "improvements" must be concrete and actionable — no vague advice.

{
  "score": <integer 0–100, strictly derived from methodology above>,

  "score_breakdown": {
    "skills_match": <integer 0–40, points earned from matched skills with evidence>,
    "experience_relevance": <integer 0–30, relevant years and quality of experience>,
    "seniority_alignment": <integer 0–15, role level vs candidate level>,
    "achievements_quality": <integer 0–15, use of metrics and concrete outcomes>
  },

  "matched_skills": [
    {
      "skill": "<skill name>",
      "evidence": "<one sentence: where and how this skill appears in the resume>"
    }
  ],

  "missing_skills": [
    {
      "skill": "<missing skill name>",
      "criticality": "required" | "preferred",
      "impact": "<one sentence: why this gap hurts the candidacy>"
    }
  ],

  "experience_match": "poor" | "moderate" | "strong",

  "seniority_verdict": "under-qualified" | "matched" | "over-qualified",

  "red_flags": [
    "<specific red flag observed in the resume - e.g., 4 jobs in 18 months, claimed Python expertise but no Python projects>"
  ],

  "summary": "<3 sentences: (1) overall verdict with score rationale, (2) single strongest qualifying factor, (3) single biggest disqualifying factor or risk>",

  "improvements": [
    {
      "action": "<specific, concrete action the candidate must take>",
      "priority": "critical" | "high" | "medium"
    }
  ],

  "hiring_recommendation": "strong_no" | "no" | "maybe" | "yes" | "strong_yes"
}"""

        user_prompt = f"JOB DESCRIPTION:\n{job_description}\n\nRESUME:\n{resume_text}"

        url = "https://api.groq.com/openai/v1/chat/completions"
        payload = {
            "model": "llama-3.3-70b-versatile",
            "max_tokens": 1500,
            "temperature": 0.0,
            "response_format": {"type": "json_object"},
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
        }

        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode('utf-8'),
            headers={
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        )

        try:
            with urllib.request.urlopen(req) as response:
                raw = json.loads(response.read().decode('utf-8'))
        except urllib.error.HTTPError as http_error:
            error_body = http_error.read().decode('utf-8')
            raise Exception(f"Groq API Error {http_error.code}: {error_body}")

        ai_text = raw['choices'][0]['message']['content'].strip()
        if ai_text.startswith("```"):
            ai_text = ai_text.split("```")[-2] if "```" in ai_text else ai_text
            ai_text = ai_text.lstrip("json").strip()

        result = json.loads(ai_text)

        return {
            'statusCode': 200,
            'headers': cors_headers,
            'body': json.dumps({**result, 'resumeId': str(uuid.uuid4())})
        }

    except json.JSONDecodeError as json_error:
        return {
            'statusCode': 502,
            'headers': cors_headers,
            'body': json.dumps({"error": f"AI returned malformed JSON. Please retry. Detail: {str(json_error)}"})
        }
    except Exception as error:
        return {
            'statusCode': 500,
            'headers': cors_headers,
            'body': json.dumps({"error": str(error)})
        }
