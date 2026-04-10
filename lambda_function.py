import json
import uuid
import os
import urllib.request
import urllib.error

def lambda_handler(event, context):
    try:
        # 1. Get the data from the frontend
        body = json.loads(event['body'])
        job_description = body['jobDescription']
        resume_text = body['resumeText']
        
        # 2. Get our secret Groq Key
        api_key = os.environ['GROQ_API_KEY']
        
        # 3. Create the prompt for the AI
        system_prompt = """You are a strict Applicant Tracking System (ATS) and expert HR recruiter. 
        Analyze the provided resume against the job description.
        You MUST respond ONLY in valid JSON format.
        Use this exact structure:
        {
          "score": 85,
          "matched_skills": ["skill1", "skill2"],
          "missing_skills": ["skill3"],
          "experience_match": "strong",
          "summary": "2-sentence honest assessment of their fit.",
          "improvements": ["Actionable tip 1", "Actionable tip 2"]
        }"""
        
        user_prompt = f"JOB DESCRIPTION:\n{job_description}\n\nRESUME:\n{resume_text}"

        # 4. Ask Groq for the score (Using the 2026 Production Instant Model)
        url = "https://api.groq.com/openai/v1/chat/completions"
        data = {
            "model": "llama-3.1-8b-instant", # Updated for 2026 Production specs
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0.1 # Lower temperature for more consistent scoring
        }
        
        # THE FIX: Added a standard User-Agent so Cloudflare lets us in
        req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        })
        
        try:
            with urllib.request.urlopen(req) as response:
                result_raw = json.loads(response.read().decode('utf-8'))
        except urllib.error.HTTPError as he:
            error_body = he.read().decode('utf-8')
            raise Exception(f"Groq API Error {he.code}: {error_body}")
            
        # Extract the JSON string from Groq's response
        ai_text = result_raw['choices'][0]['message']['content']
        result = json.loads(ai_text)
        
        resume_id = str(uuid.uuid4())
        
        # 5. Send the result back to the user's browser
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST'
            },
            'body': json.dumps({**result, 'resumeId': resume_id})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,POST'
            },
            'body': json.dumps({"error": str(e)})
        }
