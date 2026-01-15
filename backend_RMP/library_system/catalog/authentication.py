from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth.models import User

class CookieJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        # Get token from cookie
        raw_token = request.COOKIES.get('access_token')
        if not raw_token:
            return None
        
        try:
            # Validate JWT token
            token = AccessToken(raw_token)
            user_id = token['user_id']
            user = User.objects.get(id=user_id)
            return (user, token)
        except:
            return None
