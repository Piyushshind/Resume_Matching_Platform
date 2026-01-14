from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import AccessToken

class CookieJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        # Get token from HttpOnly cookie
        token = request.COOKIES.get('access_token')
        if not token:
            return None
        
        try:
            # Validate JWT token
            access_token = AccessToken(token)
            user_id = access_token['user_id']
            user = User.objects.get(id=user_id)
            return (user, token)
        except:
            return None
