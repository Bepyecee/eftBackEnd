# Google OAuth2 Setup

## 1. Create Credentials

1. Open [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. **APIs & Services → Library** → enable **Google Identity Services** (the legacy Google+ API is no longer required)
4. **APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID**
5. Configure the **OAuth consent screen** if prompted:
   - User type: External
   - Scopes: `profile`, `email`
6. Client settings:

| Field | Value |
|-------|-------|
| Application type | Web application |
| Authorized JS origins | `http://localhost:3000`, `http://localhost:8080` |
| Authorized redirect URIs | `http://localhost:8080/login/oauth2/code/google` |

7. Copy the **Client ID** and **Client Secret**

## 2. Configure Backend

Add your credentials to `backend/src/main/resources/application-local.properties`:

```properties
spring.security.oauth2.client.registration.google.client-id=YOUR_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_CLIENT_SECRET
```

> **Never commit real credentials.** Use environment variables or a `.properties.example` file.

## 3. Auth Flow

```
Browser → "Sign in with Google" → /oauth2/authorization/google (backend)
  → Google login page → callback to backend
  → OAuth2LoginSuccessHandler generates JWT
  → redirect to /oauth2/callback?token=<jwt> (frontend)
  → token stored in localStorage → dashboard
```

## 4. Verify

1. Start backend (`mvn spring-boot:run`) and frontend (`npm start`)
2. Go to `http://localhost:3000/login` → click **Sign in with Google**
3. After Google authentication you should land on the dashboard

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `redirect_uri_mismatch` | Ensure the redirect URI in Google Console matches exactly |
| Token not stored | Check browser console for CORS or network errors |
| 401 after login | JWT secret may differ between restarts — set a fixed `jwt.secret` in properties |

## Production Checklist

- Store secrets via environment variables or a vault
- Update origins and redirect URIs to your production domain
- Use BCrypt for any traditional password accounts

## Troubleshooting

### "Error 400: redirect_uri_mismatch"
- Ensure the redirect URI in Google Cloud Console exactly matches: `http://localhost:8080/login/oauth2/code/google`
- Check that there are no trailing slashes or typos

### "OAuth2 authentication failed"
- Verify your Client ID and Client Secret are correct
- Ensure the Google+ API is enabled
- Check that your OAuth consent screen is configured correctly

### Token not being stored
- Check browser console for errors
- Verify the OAuth2LoginSuccessHandler is redirecting correctly
- Ensure the frontend OAuth2Callback component is mounted at `/oauth2/callback`
