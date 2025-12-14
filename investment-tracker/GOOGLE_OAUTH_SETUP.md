# Google OAuth2 Authentication Setup

This application now supports Google OAuth2 authentication in addition to traditional username/password login.

## Setup Instructions

### 1. Create Google OAuth2 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. Create OAuth2 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client ID"
   - If prompted, configure the OAuth consent screen:
     - Choose "External" user type
     - Fill in required fields (App name, User support email, Developer contact)
     - Add scopes: `profile` and `email`
     - Save and continue
   
5. Configure the OAuth2 Client:
   - Application type: "Web application"
   - Name: "Investment Tracker" (or your preferred name)
   - Authorized JavaScript origins:
     - `http://localhost:3000`
     - `http://localhost:8080`
   - Authorized redirect URIs:
     - `http://localhost:8080/login/oauth2/code/google`
   - Click "Create"
   
6. Copy the generated Client ID and Client Secret

### 2. Configure the Backend

Update the `backend/src/main/resources/application.properties` file:

```properties
spring.security.oauth2.client.registration.google.client-id=YOUR_ACTUAL_CLIENT_ID_HERE
spring.security.oauth2.client.registration.google.client-secret=YOUR_ACTUAL_CLIENT_SECRET_HERE
```

Replace `YOUR_ACTUAL_CLIENT_ID_HERE` and `YOUR_ACTUAL_CLIENT_SECRET_HERE` with the credentials you obtained from Google Cloud Console.

### 3. Start the Application

1. Start the backend:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm start
   ```

### 4. Test Google Login

1. Navigate to `http://localhost:3000/login`
2. Click the "Sign in with Google" button
3. You'll be redirected to Google's login page
4. After successful authentication, you'll be redirected back to the application dashboard

## How It Works

1. **Frontend**: When user clicks "Sign in with Google", they're redirected to `/oauth2/authorization/google` on the backend
2. **Backend**: Spring Security handles the OAuth2 flow with Google
3. **Google**: User authenticates with Google
4. **Backend**: After successful authentication, the `OAuth2LoginSuccessHandler` generates a JWT token
5. **Frontend**: User is redirected to `/oauth2/callback` with the JWT token in the URL
6. **Frontend**: The token is stored in localStorage and user is redirected to the dashboard

## Security Notes

- The OAuth2 client secret should be kept secure and never committed to version control
- For production, use environment variables or a secure configuration management system
- Consider using BCryptPasswordEncoder instead of NoOpPasswordEncoder for traditional login
- Update CORS and redirect URLs for your production domain

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
