import requests
import uuid
from django.conf import settings
import json

def translate_text(text, target_language):
    key = settings.AZURE_TRANSLATOR_KEY
    location = settings.AZURE_TRANSLATOR_REGION
    endpoint = "https://api.cognitive.microsofttranslator.com"
    path = '/translate'

    constructed_url = endpoint + path

    params = {
        'api-version': '3.0',
        # 'from': 'en',
        'to': [target_language],
    }

    headers = {
        'Ocp-Apim-Subscription-Key': key,
        'Ocp-Apim-Subscription-Region': location,
        'Content-type': 'application/json',
        'X-ClientTraceId': str(uuid.uuid4())
    }

    body = [{
        'text': text
    }]

    response = requests.post(constructed_url, params=params, headers=headers, json=body)

    if response.status_code == 200:
        return response.json()
    else:
        return {"error": response.text}