# Investment Tracker

A full-stack self-hosted investment tracking application for managing ETF and asset investments with real-time tracking, authentication, and comprehensive CRUD operations.

## 🎯 Overview

Investment Tracker helps you manage your investment portfolio with features including:

- **JWT-based Authentication** - Secure login with token management
- **ETF Management** - Track Exchange-Traded Funds with 13+ fields including priority, type, risk, TER, investments, and more
- **Asset Management** - Monitor asset allocations with percentage-based tracking
- **Time-based Tracking** - Automatic timestamps for created and updated records
- **Self-hosted** - Complete control over your investment data
- **Database-free Option** - File-based H2 database for easy local setup
- **Responsive UI** - Modern React interface that works on all devices

## 📋 Table of Contents

- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Running the Application](#running-the-application)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Frontend Features](#frontend-features)
- [Architecture](#architecture)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [Future Enhancements](#future-enhancements)

## 🛠️ Technology Stack

### Backend
- **Java 21** - Modern Java with latest features
- **Spring Boot 3.5.0** - Application framework
- **Spring Security** - Authentication and authorization
- **JWT (JJWT 0.12.5)** - Token-based authentication
- **Spring Data JPA** - Database abstraction layer
- **H2 Database** - Embedded file-based database (development)
- **PostgreSQL** - Production database support
- **Maven** - Build and dependency management
- **SpringDoc OpenAPI** - API documentation

### Frontend
- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Modern CSS** - Responsive design with gradients and animations

## 📁 Project Structure

```
investment-tracker/
├── backend/                          # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/investmenttracker/
│   │   │   │   ├── InvestmentTrackerApplication.java
│   │   │   │   ├── controller/
│   │   │   │   │   ├── AuthenticationController.java
│   │   │   │   │   ├── EtfController.java
│   │   │   │   │   ├── AssetController.java
│   │   │   │   │   └── GlobalErrorController.java
│   │   │   │   ├── model/
│   │   │   │   │   ├── Etf.java              # ETF entity (13+ fields)
│   │   │   │   │   ├── Asset.java            # Asset entity
│   │   │   │   │   ├── ETFPriority.java      # Priority enum
│   │   │   │   │   ├── ETFType.java          # Type enum
│   │   │   │   │   ├── AuthenticationRequest.java
│   │   │   │   │   └── AuthenticationResponse.java
│   │   │   │   ├── security/
│   │   │   │   │   ├── SecurityConfig.java    # Security configuration
│   │   │   │   │   ├── JwtUtil.java           # JWT utility
│   │   │   │   │   ├── JwtRequestFilter.java  # JWT filter
│   │   │   │   │   └── DevUserDetailsService.java
│   │   │   │   ├── service/
│   │   │   │   │   ├── EtfService.java
│   │   │   │   │   └── AssetService.java
│   │   │   │   ├── storage/
│   │   │   │   │   └── FileStorage.java
│   │   │   │   └── exception/
│   │   │   │       ├── GlobalExceptionHandler.java
│   │   │   │       ├── ApiError.java
│   │   │   │       ├── ResourceConflictException.java
│   │   │   │       └── ValidationException.java
│   │   │   └── resources/
│   │   │       ├── application.properties           # Main config
│   │   │       ├── application-h2.properties        # H2 config
│   │   │       ├── application-postgres.properties  # PostgreSQL config
│   │   │       └── application-file.properties      # File storage config
│   │   └── test/
│   └── pom.xml                           # Maven dependencies
│
└── frontend/                             # React frontend
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Login.js                  # Login page
    │   │   ├── Login.css
    │   │   ├── Dashboard.js              # Main dashboard
    │   │   ├── Dashboard.css
    │   │   ├── EtfList.js                # ETF listing
    │   │   ├── EtfList.css
    │   │   ├── EtfForm.js                # ETF create/edit form
    │   │   ├── EtfForm.css
    │   │   ├── AssetList.js              # Asset listing
    │   │   ├── AssetList.css
    │   │   ├── AssetForm.js              # Asset create/edit form
    │   │   ├── AssetForm.css
    │   │   ├── Navigation.js             # Navigation bar
    │   │   ├── Navigation.css
    │   │   └── PrivateRoute.js           # Route protection
    │   ├── services/
    │   │   ├── authService.js            # Authentication logic
    │   │   ├── etfService.js             # ETF API calls
    │   │   └── assetService.js           # Asset API calls
    │   ├── App.js                         # Main app component
    │   ├── App.css                        # Global styles
    │   └── index.js                       # Entry point
    ├── package.json
    └── README.md                          # Frontend docs
```

## ✅ Prerequisites

### Required Software
- **Java 21** or higher
- **Maven 3.6+** (for backend builds)
- **Node.js 14+** and npm (for frontend)
- **Git** (optional, for version control)

### Verify Installation
```bash
# Check Java version
java -version

# Check Maven version
mvn -version

# Check Node.js version
node --version

# Check npm version
npm --version
```

## 🚀 Quick Start

### 1. Clone or Download the Project

```bash
git clone <your-repository-url>
cd investment-tracker
```

### 2. Start the Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend will start on **http://localhost:8080**

### 3. Start the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

Frontend will start on **http://localhost:3000**

### 4. Login

Open your browser to **http://localhost:3000** and login with:
- **Username:** `admin`
- **Password:** `abc123`

## 🎮 Running the Application

### Backend Options

#### Option 1: Using Maven (Recommended for Development)
```bash
cd backend
mvn spring-boot:run
```

#### Option 2: Build JAR and Run
```bash
cd backend
mvn clean package
java -jar target/investment-tracker-backend-1.0.0-SNAPSHOT.jar
```

#### Option 3: Run with Specific Profile
```bash
# Run with H2 database (default)
mvn spring-boot:run -Dspring-boot.run.profiles=h2

# Run with PostgreSQL
mvn spring-boot:run -Dspring-boot.run.profiles=postgres

# Run with file storage
mvn spring-boot:run -Dspring-boot.run.profiles=file
```

### Frontend Options

#### Development Mode (Hot Reload)
```bash
cd frontend
npm start
```
- Automatic browser refresh on code changes
- Opens at **http://localhost:3000**

#### Production Build
```bash
cd frontend
npm run build
```
Creates optimized build in `build/` directory

#### Run Tests
```bash
cd frontend
npm test
```

## ⚙️ Configuration

### Backend Configuration

#### Main Configuration File: `backend/src/main/resources/application.properties`

```properties
# Server Configuration
server.port=8080

# Active Profile (h2, postgres, or file)
spring.profiles.active=h2

# JWT Configuration
jwt.secret=your-secret-key-change-this-in-production-minimum-256-bits-required-for-hs256
jwt.expiration=86400000

# Development Authentication Credentials
app.auth.dev.username=admin
app.auth.dev.password=abc123

# Logging
logging.level.org.springframework=INFO
logging.level.com.example.investmenttracker=DEBUG
```

#### H2 Database Configuration: `application-h2.properties`

```properties
# H2 Database (File-based)
spring.datasource.url=jdbc:h2:file:./data/investmentdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# H2 Console (Development only)
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=update
```

**Access H2 Console:** http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:file:./data/investmentdb`
- Username: `sa`
- Password: (leave empty)

#### PostgreSQL Configuration: `application-postgres.properties`

```properties
# PostgreSQL Database
spring.datasource.url=jdbc:postgresql://localhost:5432/investment_tracker
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.datasource.driverClassName=org.postgresql.Driver

# JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

#### Switching Databases

1. Open `application.properties`
2. Change `spring.profiles.active` to desired profile:
   - `h2` - File-based H2 database (default)
   - `postgres` - PostgreSQL database
   - `file` - Pure file-based storage

### Frontend Configuration

#### API URL Configuration: `frontend/src/services/authService.js`

```javascript
const API_URL = 'http://localhost:8080/api';
```

To change backend URL (e.g., for production):
```javascript
const API_URL = 'https://your-domain.com/api';
```

#### Environment Variables (Optional)

Create `.env` file in frontend directory:
```
REACT_APP_API_URL=http://localhost:8080/api
```

Then update `authService.js`:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
```

### Security Configuration

#### Development (Current Setup)
- **Authentication:** Simple username/password
- **Credentials:** Stored in `application.properties`
- **Password Encoding:** None (NoOpPasswordEncoder)
- **Profile:** Dev profile only

#### Production Recommendations
1. **Use BCrypt for passwords:**
```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```

2. **Change JWT secret** to a strong, random value (min 256 bits)
3. **Use environment variables** for sensitive data
4. **Implement OAuth2/SSO** for enterprise authentication
5. **Add HTTPS** for all communications
6. **Enable CSRF** protection if using session-based auth

## 📚 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Authentication

#### POST `/api/auth/login`
Login and receive JWT token

**Request:**
```json
{
  "username": "admin",
  "password": "abc123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### ETF Endpoints (Protected)

#### GET `/api/etfs`
Get all ETFs

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Vanguard S&P 500 ETF",
    "ticker": "VOO",
    "priority": "HIGH",
    "type": "EQUITY",
    "globalCoverage": "US",
    "domicile": "Ireland",
    "risk": "Moderate",
    "dividend": "Distributing",
    "ter": 0.03,
    "currentValue": 25000.00,
    "investedAmount": 23500.00,
    "notes": "Core holding for US equity exposure",
    "createdAt": "2025-11-30T10:30:00",
    "updatedAt": "2025-11-30T10:30:00"
  }
]
```

#### GET `/api/etfs/{id}`
Get ETF by ID

#### POST `/api/etfs`
Create new ETF

**Request Body:**
```json
{
  "name": "Vanguard S&P 500 ETF",
  "ticker": "VOO",
  "priority": "HIGH",
  "type": "EQUITY",
  "globalCoverage": "US",
  "domicile": "Ireland",
  "risk": "Moderate",
  "dividend": "Distributing",
  "ter": 0.03,
  "currentValue": 25000.00,
  "investedAmount": 23500.00,
  "notes": "Core holding"
}
```

#### PUT `/api/etfs/{id}`
Update existing ETF

#### DELETE `/api/etfs/{id}`
Delete ETF

**Response:** 204 No Content

### Asset Endpoints (Protected)

#### GET `/api/assets`
Get all assets

#### GET `/api/assets/{id}`
Get asset by ID

#### POST `/api/assets`
Create new asset

**Request Body:**
```json
{
  "name": "Stocks",
  "allocationPercentage": 60.0
}
```

#### PUT `/api/assets/{id}`
Update existing asset

#### DELETE `/api/assets/{id}`
Delete asset

### Error Responses

```json
{
  "timestamp": "2025-11-30T10:30:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid credentials",
  "path": "/api/auth/login"
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `204` - No Content (successful deletion)
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## 🎨 Frontend Features

### Components

#### 1. Login Page
- Gradient background design
- Form validation
- Error handling
- Dev credentials display
- Token storage in localStorage

#### 2. Dashboard
- Overview cards for ETFs and Assets
- Quick navigation links
- Responsive grid layout

#### 3. ETF List
- Grid view of all ETFs
- Color-coded priority indicators
- Search and filter capabilities (future)
- Edit and delete actions
- Empty state handling
- Loading indicators

#### 4. ETF Form
- Create new ETF or edit existing
- 13+ input fields
- Form validation
- Dropdown selectors for enums
- Numeric inputs with step values
- Text area for notes
- Cancel and submit buttons

#### 5. Asset List
- Table view of assets
- Allocation percentage display
- CRUD operations
- Responsive design

#### 6. Asset Form
- Simple form with name and allocation
- Percentage validation (0-100)
- Create and edit modes

#### 7. Navigation
- Persistent top navigation
- Links to all main sections
- Logout functionality
- Gradient styling

### Service Layer

#### authService.js
- Login/logout functionality
- Token management
- Axios interceptors for automatic token injection
- 401 error handling with redirect

#### etfService.js
- All ETF CRUD operations
- Uses authenticated axios instance

#### assetService.js
- All Asset CRUD operations
- Uses authenticated axios instance

### Routing

- `/login` - Public login page
- `/` - Protected dashboard
- `/etfs` - ETF list
- `/etfs/new` - Create ETF
- `/etfs/edit/:id` - Edit ETF
- `/assets` - Asset list
- `/assets/new` - Create asset
- `/assets/edit/:id` - Edit asset

All routes except `/login` require authentication.

## 🏗️ Architecture

### Design Principles

1. **Loose Coupling**
   - Backend and frontend communicate only via REST APIs
   - Frontend can be swapped for different technology
   - Backend can serve multiple frontends

2. **Separation of Concerns**
   - Controllers handle HTTP
   - Services contain business logic
   - Models represent data
   - Security layer handles authentication

3. **Service Layer Pattern**
   - Frontend: All API calls through service modules
   - Backend: Business logic in service classes

4. **Security by Design**
   - JWT tokens with expiration
   - Protected API endpoints
   - Interceptor pattern for token management
   - Profile-based authentication

### Data Flow

```
User → Frontend Component → Service Layer → Axios Interceptor → Backend Controller → Service → Repository → Database
```

**Authentication Flow:**
1. User submits credentials
2. Frontend calls `/api/auth/login`
3. Backend validates and returns JWT
4. Frontend stores token in localStorage
5. Axios interceptor adds token to all requests
6. Backend validates token on each request
7. On 401, frontend redirects to login

### ETF Entity Model

```java
@Entity
public class Etf {
    @Id @GeneratedValue
    private Long id;
    
    private String name;
    private ETFPriority priority;      // Enum: LOW, MEDIUM, HIGH, VERY_HIGH
    private ETFType type;              // Enum: BOND, EQUITY
    private String globalCoverage;
    private String domicile;
    private String risk;
    private String ticker;
    private String dividend;
    private BigDecimal ter;
    private String notes;
    private BigDecimal currentValue;
    private BigDecimal investedAmount;
    
    @ElementCollection
    private List<Investment> investments;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() { /* ... */ }
    
    @PreUpdate
    protected void onUpdate() { /* ... */ }
}
```

### Database Storage

**H2 File Structure:**
```
investment-tracker/
└── data/
    ├── investmentdb.mv.db    # H2 database file
    └── investmentdb.trace.db # H2 trace log
```

Data persists between application restarts.

## 👨‍💻 Development

### Adding New Features

#### Backend: Add New Endpoint

1. Create model in `model/` package
2. Create service in `service/` package
3. Create controller in `controller/` package
4. Add any necessary configuration

#### Frontend: Add New Feature

1. Create component in `src/components/`
2. Create service method in `src/services/`
3. Add route in `App.js`
4. Create corresponding CSS file

### Code Style

**Backend:**
- Follow Java naming conventions
- Use constructor injection for dependencies
- Handle errors with appropriate HTTP codes
- Document public methods

**Frontend:**
- Use functional components with hooks
- Keep components small and focused
- Handle loading and error states
- Use PropTypes or TypeScript (future)

### Testing

**Backend:**
```bash
cd backend
mvn test
```

**Frontend:**
```bash
cd frontend
npm test
```

### Building for Production

**Backend:**
```bash
cd backend
mvn clean package
# Creates: target/investment-tracker-backend-1.0.0-SNAPSHOT.jar
```

**Frontend:**
```bash
cd frontend
npm run build
# Creates: build/ directory with optimized files
```

## 🔧 Troubleshooting

### Backend Issues

#### Port 8080 Already in Use
```properties
# Change in application.properties
server.port=8081
```

#### Database Locked
```bash
# Stop all instances of the application
# Delete database files
rm -rf data/investmentdb*
# Restart application
```

#### JWT Token Errors
```properties
# Ensure secret is at least 256 bits (32 characters)
jwt.secret=your-very-long-secret-key-at-least-256-bits-long-for-hs256-algorithm
```

### Frontend Issues

#### CORS Errors
```java
// Verify in SecurityConfig.java
configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
```

#### Authentication Fails
1. Check credentials in `application.properties`
2. Clear localStorage: `localStorage.clear()`
3. Verify backend is running
4. Check browser console for errors

#### API Connection Failed
1. Verify backend is running on port 8080
2. Check `API_URL` in `authService.js`
3. Check browser Network tab for failed requests
4. Verify CORS configuration

#### NPM Install Fails
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Common Issues

#### "Cannot find module" errors
```bash
# Backend
mvn clean install

# Frontend
npm install
```

#### Changes Not Reflecting
```bash
# Backend - rebuild
mvn clean compile

# Frontend - hard refresh
Ctrl+Shift+R (or Cmd+Shift+R on Mac)
```

## 🚀 Future Enhancements

### High Priority
- [ ] **Form Validation** - Client and server-side validation
- [ ] **Investment History** - Track individual investments within ETFs
- [ ] **Charts & Graphs** - Visualize portfolio performance
- [ ] **Search & Filter** - Find ETFs/assets quickly
- [ ] **Pagination** - Handle large datasets
- [ ] **Export Data** - CSV/Excel export functionality

### Security Enhancements
- [ ] **OAuth2 Integration** - Google, GitHub, Microsoft
- [ ] **Role-Based Access Control** - Admin/User roles
- [ ] **Password Reset** - Email-based password reset
- [ ] **User Registration** - Self-service registration
- [ ] **BCrypt Passwords** - Secure password hashing
- [ ] **Audit Logging** - Track all data changes

### Features
- [ ] **Portfolio Dashboard** - Total value, gains/losses
- [ ] **Rebalancing Tool** - Suggest portfolio adjustments
- [ ] **Historical Tracking** - View value over time
- [ ] **Notifications** - Email/push alerts
- [ ] **Multi-currency** - Support multiple currencies
- [ ] **Benchmarking** - Compare against indices

### Technical
- [ ] **Unit Tests** - Comprehensive test coverage
- [ ] **Integration Tests** - API and E2E testing
- [ ] **API Documentation** - Swagger/OpenAPI UI
- [ ] **Docker** - Containerize application
- [ ] **CI/CD Pipeline** - Automated builds and deployments
- [ ] **Database Migrations** - Flyway or Liquibase
- [ ] **Caching** - Redis for performance
- [ ] **WebSockets** - Real-time updates
- [ ] **Mobile App** - React Native version

### UI/UX
- [ ] **Dark Mode** - Theme switcher
- [ ] **Internationalization** - Multi-language support
- [ ] **Accessibility** - WCAG compliance
- [ ] **Advanced Filtering** - Multi-criteria filters
- [ ] **Drag & Drop** - Reorder priorities
- [ ] **Keyboard Shortcuts** - Power user features

## 📝 License

This project is for personal use. Modify and distribute as needed.

## 👥 Contributing

This is a self-hosted personal project. Feel free to fork and customize for your needs.

## 📧 Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review the error logs in the console
3. Verify all configuration settings

## 🎉 Acknowledgments

Built with:
- Spring Boot - https://spring.io/projects/spring-boot
- React - https://reactjs.org/
- JWT - https://jwt.io/

---

**Happy Investing! 📈💰**
