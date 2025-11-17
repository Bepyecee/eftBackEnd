# Investment Tracker

## Overview
The Investment Tracker is a self-hosted application designed to manage investments in various ETFs and assets. It allows users to perform CRUD operations on ETFs and other asset types, track changes over time, and provides a user-friendly front end for interaction.

## Project Structure
The project is divided into two main parts: the backend and the frontend.

### Backend
The backend is built using Java 21 and Spring Boot. It handles the business logic and data management without the use of a traditional database, instead utilizing file storage for persistence.

- **Entry Point**: `backend/src/main/java/com/example/investmenttracker/InvestmentTrackerApplication.java`
- **Controllers**: 
  - `AssetController.java`: Manages asset-related operations.
  - `EtfController.java`: Manages ETF-related operations.
- **Models**: 
  - `Asset.java`: Represents an investment asset.
  - `Etf.java`: Represents an exchange-traded fund.
- **Services**: 
  - `AssetService.java`: Contains business logic for assets.
  - `EtfService.java`: Contains business logic for ETFs.
- **Storage**: 
  - `FileStorage.java`: Handles file-based data storage.
- **Configuration**: 
  - `application.properties`: Contains application configuration settings.
- **Build Configuration**: 
  - `build.gradle`: Specifies project dependencies and build settings.

### Frontend
The frontend is developed using React and provides a dynamic user interface for managing investments.

- **Main Component**: `frontend/src/App.js`
- **Components**: 
  - `AssetList.js`: Displays and manages a list of assets.
  - `EtfList.js`: Displays and manages a list of ETFs.
  - `InvestmentHistory.js`: Shows the investment history over time.
- **Entry Point**: `frontend/src/index.js`
- **Configuration**: 
  - `package.json`: Lists dependencies and scripts for the React application.

## Setup Instructions

### Backend
1. Navigate to the `backend` directory.
2. Build the project using Gradle:
   ```
   ./gradlew build
   ```
3. Run the application:
   ```
   ./gradlew bootRun
   ```
4. The backend will be accessible at `http://localhost:8080`.

### Frontend
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```
   npm install
   ```
3. Start the React application:
   ```
   npm start
   ```
4. The frontend will be accessible at `http://localhost:3000`.

## Usage
- Use the frontend interface to manage your investments in ETFs and assets.
- Perform CRUD operations to add, update, or delete investments.
- Track your investment history over time.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is open-source and available under the MIT License.