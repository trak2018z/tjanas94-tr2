from django.conf import settings
from urllib.parse import urlencode
from urllib.request import Request, urlopen
import json


def check_captcha(captcha):
    if not captcha:
        return False

    url = 'https://www.google.com/recaptcha/api/siteverify'
    values = {
        'secret': settings.RECAPTCHA_SECRET_KEY,
        'response': captcha
    }

    data = urlencode(values)
    request = Request(url, data.encode())
    response = urlopen(request)
    result = json.load(response)

    return bool(result['success'])
