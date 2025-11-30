# Investment Tracker Frontend

A React-based frontend application for managing ETF and asset investments.

## Features

- **Authentication**: Secure login with JWT token-based authentication
- **ETF Management**: View, create, edit, and delete ETF investments
- **Asset Management**: Track and manage asset allocations
- **Responsive Design**: Mobile-friendly interface
- **Protected Routes**: Automatic authentication checks and redirects

## Architecture

### Design Principles

The frontend is designed with the following principles in mind:

1. **Loose Coupling**: The frontend is completely separate from the backend, communicating only through REST APIs
2. **Service Layer**: Business logic is encapsulated in service modules (`authService`, `etfService`, `assetService`)
3. **Component Reusability**: UI components are modular and can be reused across the application
4. **Separation of Concerns**: Authentication, routing, and data fetching are handled separately
5. **Interceptor Pattern**: Axios interceptors handle token injection and automatic authentication checks

### Project Structure

```
frontend/
├── public/                 # Static files
├── src/
│   ├── components/        # React components
│   │   ├── Login.js       # Login page
│   │   ├── Dashboard.js   # Main dashboard
│   │   ├── EtfList.js     # ETF listing and management
│   │   ├── AssetList.js   # Asset listing and management
│   │   ├── Navigation.js  # Navigation bar
│   │   └── PrivateRoute.js # Protected route wrapper
│   ├── services/          # API service layer
│   │   ├── authService.js # Authentication logic
│   │   ├── etfService.js  # ETF API calls
│   │   └── assetService.js # Asset API calls
│   ├── App.js             # Main application component
│   ├── App.css            # Global styles
│   └── index.js           # Application entry point
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

### Key Technologies

- **React**: UI library for building the user interface
- **React Router**: Client-side routing and navigation
- **Axios**: HTTP client for API communication
- **JWT**: Token-based authentication

### Authentication Flow

1. User submits credentials on the login page
2. Frontend sends POST request to `/api/auth/login`
3. Backend validates credentials and returns JWT token
4. Token is stored in `localStorage`
5. Axios interceptor automatically adds token to all subsequent requests
6. If a request returns 401 (Unauthorized), user is redirected to login

### API Integration

The frontend communicates with the backend through the following endpoints:

- **Authentication**:
  - POST `/api/auth/login` - User login

- **ETF Management**:
  - GET `/api/etfs` - Get all ETFs
  - GET `/api/etfs/:id` - Get ETF by ID
  - POST `/api/etfs` - Create new ETF
  - PUT `/api/etfs/:id` - Update ETF
  - DELETE `/api/etfs/:id` - Delete ETF

- **Asset Management**:
  - GET `/api/assets` - Get all assets
  - GET `/api/assets/:id` - Get asset by ID
  - POST `/api/assets` - Create new asset
  - PUT `/api/assets/:id` - Update asset
  - DELETE `/api/assets/:id` - Delete asset

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running on `http://localhost:8080`

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Development Mode

Start the development server:
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

### Production Build

Create an optimized production build:
```bash
npm run build
```

The build files will be generated in the `build/` directory.

### Testing

Run the test suite:
```bash
npm test
```

## Configuration

### Backend URL

The backend API URL is configured in `src/services/authService.js`:
```javascript
const API_URL = 'http://localhost:8080/api';
```

To change the backend URL, update this constant.

### Authentication Credentials (Development)

For development purposes, the default credentials are:
- **Username**: `admin`
- **Password**: `abc123`

These credentials are configured in the backend `application.properties` file.

## Development Workflow

### Adding New Features

1. **Create Component**: Add new component in `src/components/`
2. **Create Service** (if needed): Add API service in `src/services/`
3. **Update Routing**: Add route in `src/App.js`
4. **Add Styles**: Create corresponding CSS file

### Making API Calls

All API calls should go through the service layer:

```javascript
import etfService from '../services/etfService';

// In your component
const loadData = async () => {
  try {
    const data = await etfService.getAllEtfs();
    // Handle data
  } catch (error) {
    // Handle error
  }
};
```

### Protected Routes

Wrap any component that requires authentication with `PrivateRoute`:

```javascript
<Route
  path="/protected"
  element={
    <PrivateRoute>
      <YourComponent />
    </PrivateRoute>
  }
/>
```

## Future Enhancements

The architecture supports the following future improvements:

1. **Multiple Frontend Frameworks**: The decoupled design allows switching to Vue, Angular, or other frameworks
2. **Enhanced Authentication**: OAuth2, SSO, or other authentication providers
3. **State Management**: Redux or Context API for complex state management
4. **Form Validation**: Add comprehensive form validation library
5. **Testing**: Expand test coverage with React Testing Library
6. **TypeScript**: Migrate to TypeScript for type safety
7. **Internationalization**: Add multi-language support
8. **Theming**: Implement dark mode and customizable themes

## Troubleshooting

### CORS Issues

If you encounter CORS errors, ensure the backend has CORS configured for `http://localhost:3000`:

```java
configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
```

### Authentication Errors

1. Verify the backend is running on `http://localhost:8080`
2. Check that credentials match backend configuration
3. Clear `localStorage` and try logging in again:
```javascript
localStorage.clear();
```

### API Connection Issues

1. Verify backend is running: `http://localhost:8080`
2. Check network tab in browser DevTools for request/response details
3. Verify JWT token is being sent in request headers

## Best Practices

1. **Always use the service layer** for API calls - never call axios directly from components
2. **Handle loading and error states** in all components that fetch data
3. **Keep components small and focused** on a single responsibility
4. **Use meaningful variable and function names**
5. **Add error boundaries** for graceful error handling
6. **Keep sensitive data out of the frontend** - never store passwords or secrets

## License

This project is part of the Investment Tracker application.
