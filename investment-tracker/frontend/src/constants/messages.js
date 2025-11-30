/**
 * Centralized message constants for the application.
 * This file contains all UI text, error messages, labels, and buttons
 * to facilitate maintenance and future internationalization.
 */

const messages = {
  // Generic Messages
  GENERIC: {
    LOADING: 'Loading...',
    SAVE: 'Save',
    CANCEL: 'Cancel',
    DELETE: 'Delete',
    EDIT: 'Edit',
    CREATE: 'Create',
    BACK: 'Back',
    CONFIRM: 'Confirm',
    SUCCESS: 'Success',
    ERROR: 'Error',
    WARNING: 'Warning',
    INFO: 'Info',
  },

  // Authentication Messages
  AUTH: {
    LOGIN: 'Login',
    LOGOUT: 'Logout',
    USERNAME: 'Username',
    PASSWORD: 'Password',
    USERNAME_PLACEHOLDER: 'Enter your username',
    PASSWORD_PLACEHOLDER: 'Enter your password',
    LOGIN_BUTTON: 'Sign In',
    LOGIN_TITLE: 'Investment Tracker Login',
    LOGIN_SUBTITLE: 'Sign in to manage your investments',
    INVALID_CREDENTIALS: 'Invalid username or password',
    SESSION_EXPIRED: 'Your session has expired. Please login again.',
    UNAUTHORIZED: 'You are not authorized to access this resource',
  },

  // Dashboard Messages
  DASHBOARD: {
    TITLE: 'Pantaloons and Gav\s ETF Investment tracker ',
    WELCOME: 'Welcome to Pantaloons and Gav\s ETF Investment tracker',
    OVERVIEW: 'Overview',
    ETF_CARD_TITLE: 'Exchange Traded Funds',
    ETF_CARD_DESCRIPTION: 'Manage your ETF portfolio',
    ASSET_CARD_TITLE: 'Assets',
    ASSET_CARD_DESCRIPTION: 'Track and manage your assets',
  },

  // Navigation Messages
  NAV: {
    HOME: 'Home',
    ETFS: 'ETFs',
    ASSETS: 'Assets',
    SETTINGS: 'Settings',
    PROFILE: 'Profile',
  },

  // ETF Messages
  ETF: {
    TITLE: 'ETFs',
    LIST_TITLE: 'ETF Portfolio',
    CREATE_TITLE: 'Add new ETF Ticker',
    EDIT_TITLE: 'Edit ETF',
    ADD_NEW: 'Add New ETF',
    NO_ETFS: 'No ETFs found. Add your first ETF to get started.',
    CONFIRM_DELETE: 'Are you sure you want to delete this ETF?',
    DELETED_SUCCESS: 'ETF deleted successfully',
    CREATED_SUCCESS: 'ETF created successfully',
    UPDATED_SUCCESS: 'ETF updated successfully',
    DELETE_ERROR: 'Failed to delete ETF',
    LOAD_ERROR: 'Failed to load ETFs',
    SAVE_ERROR: 'Failed to save ETF',
    
    // ETF Fields
    NAME: 'Name',
    NAME_PLACEHOLDER: 'Enter ETF name',
    TICKER: 'Ticker Symbol',
    TICKER_PLACEHOLDER: 'e.g., VTI, SPY',
    PRIORITY: 'Priority',
    TYPE: 'Type',
    MARKET_CONCENTRATION: 'Market Concentration',
    MARKET_CONCENTRATION_PLACEHOLDER: 'Select market concentration',
    DOMICILE: 'Domicile',
    DOMICILE_PLACEHOLDER: 'Select domicile',
    RISK: 'Risk Level',
    RISK_PLACEHOLDER: 'Low, Medium, High',
    DIVIDEND: 'Dividend',
    DIVIDEND_PLACEHOLDER: 'Accumulating or Distributing',
    TER: 'Total Expense Ratio (%)',
    TER_PLACEHOLDER: '0.00',
    FEES: 'Transaction Fees',
    FEES_PLACEHOLDER: '1.00',
    PURCHASE_DATE: 'Date of Purchase',
    UNITS_PURCHASED: 'Units Purchased',
    UNITS_PURCHASED_PLACEHOLDER: '0.000',
    NOTES: 'Notes',
    NOTES_PLACEHOLDER: 'Additional information about this ETF',
    CURRENT_VALUE: 'Current Value',
    CURRENT_VALUE_PLACEHOLDER: '0.00',
    INVESTED_AMOUNT: 'Transaction Cost',
    INVESTED_AMOUNT_PLACEHOLDER: '0.00',
    
    // ETF Priority Options
    PRIORITY_LOW: 'Low',
    PRIORITY_MEDIUM: 'Medium',
    PRIORITY_HIGH: 'High',
    PRIORITY_VERY_HIGH: 'Very High',
    
    // ETF Risk Options
    RISK_LOW: 'Low',
    RISK_MEDIUM: 'Medium',
    RISK_HIGH: 'High',
    RISK_VERY_HIGH: 'Very High',
    
    // ETF Domicile Options
    DOMICILE_IRELAND: 'Ireland',
    DOMICILE_EUROPE: 'Europe',
    DOMICILE_OTHER: 'Other',
    
    // ETF Market Concentration Options
    MARKET_US: 'US',
    MARKET_US_TECH: 'US Tech',
    MARKET_EUROPE: 'Europe',
    MARKET_EUROPE_TECH: 'Europe Tech',
    MARKET_GLOBAL_DEVELOPED: 'Global Developed',
    MARKET_GLOBAL_DEVELOPED_TECH: 'Global Developed Tech',
    MARKET_GLOBAL_INCL_EMERGING: 'Global incl Emerging',
    MARKET_CORPORATE: 'Corporate',
    
    // ETF Type Options
    TYPE_BOND: 'Bond',
    TYPE_EQUITY: 'Equity',
    
    // Validation Messages
    VALIDATION: {
      NAME_REQUIRED: 'Name is required',
      TICKER_REQUIRED: 'Ticker symbol is required',
      PRIORITY_REQUIRED: 'Priority is required',
      TYPE_REQUIRED: 'Type is required',
      TER_INVALID: 'TER must be a valid number',
      TER_NEGATIVE: 'TER cannot be negative',
      CURRENT_VALUE_INVALID: 'Current value must be a valid number',
      INVESTED_AMOUNT_INVALID: 'Invested amount must be a valid number',
    },
  },

  // Asset Messages
  ASSET: {
    TITLE: 'Assets',
    LIST_TITLE: 'Asset Portfolio',
    CREATE_TITLE: 'Create New Asset',
    EDIT_TITLE: 'Edit Asset',
    ADD_NEW: 'Add New Asset',
    NO_ASSETS: 'No assets found. Add your first asset to get started.',
    CONFIRM_DELETE: 'Are you sure you want to delete this asset?',
    DELETED_SUCCESS: 'Asset deleted successfully',
    CREATED_SUCCESS: 'Asset created successfully',
    UPDATED_SUCCESS: 'Asset updated successfully',
    DELETE_ERROR: 'Failed to delete asset',
    LOAD_ERROR: 'Failed to load assets',
    SAVE_ERROR: 'Failed to save asset',
    
    // Asset Fields
    NAME: 'Asset Name',
    NAME_PLACEHOLDER: 'Enter asset name',
    ALLOCATION: 'Allocation Percentage',
    ALLOCATION_PLACEHOLDER: '0.00',
    
    // Validation Messages
    VALIDATION: {
      NAME_REQUIRED: 'Asset name is required',
      ALLOCATION_REQUIRED: 'Allocation percentage is required',
      ALLOCATION_INVALID: 'Allocation must be a valid number',
      ALLOCATION_RANGE: 'Allocation must be between 0 and 100',
    },
  },

  // Error Messages
  ERROR: {
    GENERIC: 'An unexpected error occurred. Please try again.',
    NETWORK: 'Network error. Please check your connection.',
    SERVER: 'Server error. Please try again later.',
    NOT_FOUND: 'Resource not found',
    FORBIDDEN: 'You do not have permission to perform this action',
    VALIDATION: 'Please check the form for errors',
    TIMEOUT: 'Request timed out. Please try again.',
  },

  // Success Messages
  SUCCESS: {
    SAVE: 'Changes saved successfully',
    DELETE: 'Deleted successfully',
    CREATE: 'Created successfully',
    UPDATE: 'Updated successfully',
  },

  // Confirmation Messages
  CONFIRM: {
    DELETE: 'Are you sure you want to delete this item?',
    DISCARD: 'Are you sure you want to discard your changes?',
    LOGOUT: 'Are you sure you want to logout?',
  },
};

export default messages;
