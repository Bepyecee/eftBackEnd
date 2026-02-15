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
    TITLE: "Pantaloons and Gav's ETF Investment tracker",
    WELCOME: "Welcome to Pantaloons and Gav's ETF Investment tracker",
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
    TITLE: 'Ticker Manager',
    LIST_TITLE: 'ETF Ticker Manager',
    CREATE_TITLE: 'ETF ETF creator',
    EDIT_TITLE: 'Ticker Manager',
    ADD_NEW: 'Add New ETF',
    MANAGE_TRANSACTIONS: 'Manage Transactions',
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
    VOLATILITY: 'Volatility',
    VOLATILITY_PLACEHOLDER: 'Low, Moderate, High',
    DIVIDEND: 'Dividend',
    DIVIDEND_PLACEHOLDER: 'Accumulating or Distributing',
    TER: 'Total Expense Ratio (%)',
    TER_PLACEHOLDER: '0.00',
    NOTES: 'Notes',
    NOTES_PLACEHOLDER: 'Additional information about this ETF',
    
    // ETF Priority Options
    PRIORITY_LOW: 'Low',
    PRIORITY_MEDIUM: 'Medium',
    PRIORITY_HIGH: 'High',
    PRIORITY_VERY_HIGH: 'Very High',
    
    // ETF Volatility Options
    VOLATILITY_LOW: 'Low',
    VOLATILITY_MODERATE: 'Moderate',
    VOLATILITY_HIGH: 'High',
    VOLATILITY_VERY_HIGH: 'Very High',
    
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

  // Transaction Messages
  TRANSACTION: {
    TITLE: 'Transactions',
    LIST_TITLE: 'Transaction History',
    CREATE_TITLE: 'Add New Transaction',
    ADD_NEW: 'Add Transaction',
    NO_TRANSACTIONS: 'No transactions found. Add your first transaction to get started.',
    CONFIRM_DELETE: 'Are you sure you want to delete this transaction?',
    DELETED_SUCCESS: 'Transaction deleted successfully',
    CREATED_SUCCESS: 'Transaction created successfully',
    DELETE_ERROR: 'Failed to delete transaction',
    LOAD_ERROR: 'Failed to load transactions',
    SAVE_ERROR: 'Failed to save transaction',
    
    // Transaction Fields
    TRANSACTION_DATE: 'Transaction Date',
    TRANSACTION_TYPE: 'Transaction Type',
    TRANSACTION_COST: 'Transaction Cost',
    TRANSACTION_COST_PLACEHOLDER: '0.00',
    TRANSACTION_FEES: 'Transaction Fees',
    TRANSACTION_FEES_PLACEHOLDER: '0.00',
    UNITS_PURCHASED: 'Units',
    UNITS_PURCHASED_PLACEHOLDER: '0.000',
    
    // Transaction Types
    TYPE_BUY: 'Buy',
    TYPE_SELL: 'Sell',
    
    // Summary Fields
    TOTAL_UNITS: 'Total Units',
    TOTAL_INVESTED: 'Total Invested',
  },

  // Tax Calculator Messages
  TAX_CALCULATOR: {
    TITLE: 'ETF Deemed Disposal Tracker',
    TRANSACTION_DATE: 'Transaction Date',
    DEEMED_DISPOSAL_DATE: 'Deemed Disposal Date',
    NO_TRANSACTIONS: 'No transactions available for tax calculation.',
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

  // Settings Messages
  SETTINGS: {
    TITLE: 'Settings',
    DESCRIPTION: 'Configure your application preferences',
    LOAD_ERROR: 'Failed to load settings',
    SAVE_SUCCESS: 'Settings saved successfully',
    SAVE_ERROR: 'Failed to save settings',
    SAVING: 'Saving...',
    RESET: 'Reset',
    EXPAND_TOOLTIP: 'Click to expand',
    COLLAPSE_TOOLTIP: 'Click to collapse',

    // Appearance
    APPEARANCE_TITLE: 'Appearance',
    APPEARANCE_DESC: 'Customize the visual theme of the application.',
    THEME: 'Theme',
    THEME_LIGHT: 'Light',
    THEME_DARK: 'Dark',

    // Yahoo Finance
    YAHOO_TITLE: 'Yahoo Finance Configuration',
    YAHOO_DESC: 'Configure how the application fetches and caches stock prices from Yahoo Finance.',
    YAHOO_TIMEOUT: 'API Timeout (seconds)',
    YAHOO_CACHE_EXPIRY: 'Cache Expiration (minutes)',
    YAHOO_CACHE_MAX: 'Cache Max Size',
    YAHOO_SUFFIX: 'Default European Suffix',
    YAHOO_SUFFIX_PLACEHOLDER: '.DE',

    // Logging
    LOGGING_TITLE: 'Logging Configuration',
    LOGGING_DESC: 'Control the verbosity of application logging. Changes require application restart.',
    LOGGING_ROOT: 'Root Logging Level',
    LOGGING_SPRING: 'Spring Framework Level',
    LOGGING_APP: 'Application Level',

    // Cache
    CACHE_TITLE: 'Cache Configuration',
    CACHE_DESC: 'Configure caching behavior. Changes require application restart.',
    CACHE_TYPE: 'Cache Type',
    CACHE_CAFFEINE: 'Caffeine',
    CACHE_SIMPLE: 'Simple',
    CACHE_NONE: 'None',
    CACHE_SPEC: 'Caffeine Specification',
    CACHE_SPEC_PLACEHOLDER: 'maximumSize=100,expireAfterWrite=30m',
    CACHE_SPEC_HELP: 'Format: maximumSize=X,expireAfterWrite=Ym',

    // Tax
    TAX_TITLE: 'Tax Configuration',
    TAX_DESC: 'Configure tax calculation parameters.',
    TAX_EXIT_PERCENTAGE: 'ETF Exit Tax Percentage (%)',
    TAX_EXIT_HELP: 'Percentage applied to calculate exit tax on ETF deemed/actual disposal',
  },

  // Login extras
  LOGIN: {
    OR_DIVIDER: 'OR',
    GOOGLE_SIGN_IN: 'Sign in with Google',
    DEV_CREDENTIALS: 'Dev credentials: admin / abc123',
  },

  // Portfolio / Asset List
  PORTFOLIO: {
    EXPORT_FAILED: 'Failed to export portfolio. Please try again.',
    DELETE_VERSION_CONFIRM: 'Are you sure you want to delete this portfolio version?',
    DELETE_VERSION_FAILED: 'Failed to delete portfolio version.',
    ALLOCATION_TITLE: 'Allocation Strategy',
    ALLOCATION_DESC: 'Define your investment allocation strategy across different asset classes, risk profiles, and geographical regions.',
    CONTENT_COMING_SOON: 'Content coming soon',
    VERSIONS_TITLE: 'Portfolio Versions',
    VERSIONS_DESC: (count) => `View and manage historical portfolio snapshots (${count} versions)`,
    LOADING_VERSIONS: 'Loading versions...',
    NO_VERSIONS: 'No portfolio versions found. Versions are created automatically when you make changes.',
    VERSION_ID: 'Version ID',
    CREATED: 'Created',
    TRIGGER: 'Trigger',
    DETAILS: 'Details',
    ACTIONS: 'Actions',
    DOWNLOAD: 'Download',
    MANUAL_EXPORT: 'Manual portfolio export',
    EXPORT_TOOLTIP: 'Export current portfolio to JSON',
    IMPORT_TOOLTIP: 'Import portfolio from JSON file',
    TRIGGER_ACTIONS: {
      ETF_CREATED: 'ETF Created',
      ETF_UPDATED: 'ETF Updated',
      ETF_DELETED: 'ETF Deleted',
      TRANSACTION_ADDED: 'Transaction Added',
      TRANSACTION_UPDATED: 'Transaction Updated',
      TRANSACTION_DELETED: 'Transaction Deleted',
      ASSET_CREATED: 'Asset Created',
      ASSET_UPDATED: 'Asset Updated',
      ASSET_DELETED: 'Asset Deleted',
      MANUAL_EXPORT: 'Manual Export',
      UNKNOWN: 'Unknown',
    },
  },

  // Tax Manager
  TAX: {
    TITLE: 'ETF Deemed Disposal Tracker',
    SUMMARY: 'View all ETF transactions with deemed disposal dates for tax planning.',
    FILTER_TICKERS: 'Tickers:',
    FILTER_ALL_TICKERS: 'All tickers',
    FILTER_SELECTED: (count) => `${count} selected`,
    FILTER_NO_TICKERS: 'No tickers available',
    FILTER_FROM: 'From:',
    FILTER_TO: 'To:',
    CLEAR_FILTERS: 'Clear Filters',
    EXPORT_EXCEL: 'Export to Excel',
    EXPORT_TOOLTIP: 'Export visible transactions to Excel',
    NO_TRANSACTIONS: 'No transactions found. Add transactions to your ETFs to see tax calculations.',
    COL_DATE: 'Date',
    COL_TICKER: 'Ticker',
    COL_TYPE: 'Type',
    COL_UNITS: 'Units',
    COL_PRICE_UNIT: 'Price/Unit',
    COL_COST: 'Cost',
    COL_FEES: 'Fees',
    COL_TOTAL: 'Total',
    COL_DEEMED_DISPOSAL: 'Deemed Disposal',
    ROW_TOTAL: 'TOTAL',
  },

  // EtfForm extras
  ETF_FORM: {
    YAHOO_TICKER: 'Yahoo Finance Ticker',
    YAHOO_TICKER_PLACEHOLDER: 'Yahoo ETF url Symbol e.g. XXXX.DE',
    DUPLICATE_TICKER: (ticker) => `An ETF with ticker "${ticker}" already exists. Please use a different ticker.`,
    UPDATE_TRANSACTION: 'Update Transaction',
    SAVE_TRANSACTION: 'Save Transaction',
    ACTIONS: 'Actions',
    TOTAL: 'TOTAL',
  },

  // Navigation extras
  NAV_EXTRA: {
    USER_FALLBACK: 'User',
    TOGGLE_THEME: 'Toggle theme',
    LOGOUT_TOOLTIP: 'Logout',
  },

  // Dashboard extras
  DASHBOARD_EXTRA: {
    WELCOME_USER: (name) => `Welcome, ${name}!`,
  },

  // Asset form extras
  ASSET_FORM: {
    ALLOCATION_HELP: 'Enter a value between 0 and 100',
  },

  // Confirmation Messages
  CONFIRM: {
    DELETE: 'Are you sure you want to delete this item?',
    DISCARD: 'Are you sure you want to discard your changes?',
    LOGOUT: 'Are you sure you want to logout?',
  },
};

export default messages;
