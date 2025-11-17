# Investment Tracker Backend

## Overview
The Investment Tracker is a self-hosted application designed to manage investments in various ETFs and assets. This backend component is built using Java 21 and Spring Boot, allowing for CRUD operations without the need for a database.

## Features
- Manage investments in different ETFs and assets.
- Perform CRUD operations for both ETFs and assets.
- Track changes over time.
- Data is stored in files for persistence.

## Project Structure
```
investment-tracker
├── backend
│   ├── src
│   │   ├── main
│   │   │   ├── java
│   │   │   │   └── com
│   │   │   │       └── example
│   │   │   │           └── investmenttracker
│   │   │   │               ├── InvestmentTrackerApplication.java
│   │   │   │               ├── controller
│   │   │   │               │   ├── AssetController.java
│   │   │   │               │   └── EtfController.java
│   │   │   │               ├── model
│   │   │   │               │   ├── Asset.java
│   │   │   │               │   └── Etf.java
│   │   │   │               ├── service
│   │   │   │               │   ├── AssetService.java
│   │   │   │               │   └── EtfService.java
│   │   │   │               └── storage
│   │   │   │                   └── FileStorage.java
│   │   │   └── resources
│   │   │       └── application.properties
│   ├── build.gradle
│   └── README.md
```

## Setup Instructions
1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd investment-tracker/backend
   ```

2. **Build the project**:
   Ensure you have Gradle installed, then run:
   ```
   ./gradlew build
   ```

3. **Run the application**:
   ```
   ./gradlew bootRun
   ```

4. **Access the API**:
   The backend will be available at `http://localhost:8080/api`.

## Usage
- Use the provided REST API endpoints to manage your investments.
- Refer to the individual controller files for specific API endpoints and their usage.

## Contributing
Feel free to submit issues or pull requests for improvements and features.