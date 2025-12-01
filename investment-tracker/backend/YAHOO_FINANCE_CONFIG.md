# Yahoo Finance Integration Configuration Guide

This guide explains how to configure the Yahoo Finance price integration for your ETF Investment Tracker.

## Overview

The application fetches real-time ETF prices from Yahoo Finance. All configuration is managed through Spring Boot properties files, making it easy to customize without code changes.

## Configuration Files

### 1. `application.properties` (Default Settings)
Contains the default configuration that applies to all environments:

```properties
# Yahoo Finance Configuration
yahoo.finance.timeout=10
yahoo.finance.cache-expiration-minutes=30
yahoo.finance.cache-max-size=100
yahoo.finance.default-european-suffix=.DE

# Default Ticker Mappings
yahoo.finance.ticker-mappings.VWCE=VWCE.DE
yahoo.finance.ticker-mappings.EUNL=EUNL.DE
yahoo.finance.ticker-mappings.SXPX=SXPX.SW
yahoo.finance.ticker-mappings.SMH=SMH
```

### 2. `application-local.properties` (Your Custom Settings)
Override defaults with your local settings. This file is gitignored for privacy.

**To create your local config:**
```bash
cd backend/src/main/resources
cp application-local.properties.example application-local.properties
```

Then edit `application-local.properties` with your custom settings.

## Configuration Properties

### API Settings

| Property | Default | Description |
|----------|---------|-------------|
| `yahoo.finance.timeout` | 10 | API call timeout in seconds |
| `yahoo.finance.cache-expiration-minutes` | 30 | How long to cache prices before refreshing |
| `yahoo.finance.cache-max-size` | 100 | Maximum number of prices to cache |
| `yahoo.finance.default-european-suffix` | .DE | Default exchange suffix for unmapped European tickers |

### Ticker Mappings

Map your local ticker symbols to Yahoo Finance symbols using this format:
```properties
yahoo.finance.ticker-mappings.<YOUR_TICKER>=<YAHOO_SYMBOL>
```

#### Common Exchange Suffixes

| Exchange | Suffix | Example |
|----------|--------|---------|
| Deutsche Börse Xetra (Germany) | .DE | VWCE.DE |
| Euronext Amsterdam (Netherlands) | .AS | IWDA.AS |
| SIX Swiss Exchange (Switzerland) | .SW | SXPX.SW |
| London Stock Exchange (UK) | .L | VUSA.L |
| NYSE/NASDAQ (US) | none | SMH, SPY, QQQ |

## Examples

### Example 1: Change Cache Duration
To cache prices for 1 hour instead of 30 minutes:

```properties
# application-local.properties
yahoo.finance.cache-expiration-minutes=60
```

### Example 2: Add Custom Ticker Mappings
To track Amsterdam-listed ETFs:

```properties
# application-local.properties
yahoo.finance.ticker-mappings.IWDA=IWDA.AS
yahoo.finance.ticker-mappings.EMIM=EMIM.AS
yahoo.finance.ticker-mappings.VUSA=VUSA.L
```

### Example 3: Change Default Exchange
If most of your ETFs are on Euronext Amsterdam:

```properties
# application-local.properties
yahoo.finance.default-european-suffix=.AS
```

### Example 4: Increase Timeout for Slow Connections
```properties
# application-local.properties
yahoo.finance.timeout=20
```

## How Ticker Mapping Works

When you request a price for a ticker like "VWCE", the system:

1. **Checks for explicit mapping** in `ticker-mappings`
   - If found, uses the mapped Yahoo symbol (e.g., VWCE → VWCE.DE)

2. **Checks if ticker already has suffix**
   - If ticker contains ".", uses it as-is (e.g., IWDA.AS)

3. **Applies default suffix**
   - If no mapping and no suffix, adds `default-european-suffix`
   - Example: IWDA → IWDA.DE (if default is .DE)

## Finding Yahoo Finance Symbols

To find the correct Yahoo Finance symbol for your ETF:

1. Go to [Yahoo Finance](https://finance.yahoo.com)
2. Search for your ETF
3. The symbol in the URL is what you need
   - Example: `https://finance.yahoo.com/quote/VWCE.DE/` → use `VWCE.DE`

## Runtime Ticker Mapping (Advanced)

You can also add ticker mappings at runtime using the REST API:

```bash
# Add a new mapping without restarting
POST /api/etf-prices/mappings
{
  "ticker": "NEWETF",
  "yahooSymbol": "NEWETF.L"
}
```

## Troubleshooting

### Issue: "Invalid response from Yahoo Finance"
**Solution:** Check if your ticker mapping is correct. Try searching on Yahoo Finance first.

### Issue: Prices not updating
**Solution:** Clear the cache or reduce `cache-expiration-minutes`.

### Issue: Timeout errors
**Solution:** Increase `yahoo.finance.timeout` value.

### Issue: Wrong exchange prices
**Solution:** Verify your ticker mapping includes the correct exchange suffix.

## Best Practices

1. **Use application-local.properties** for personal settings
2. **Document your mappings** with comments in the properties file
3. **Keep default settings** in application.properties as a reference
4. **Test ticker mappings** before adding to production
5. **Monitor cache hit rates** and adjust expiration time accordingly

## Related Files

- `YahooFinanceProperties.java` - Configuration class
- `YahooFinanceService.java` - Service that uses the configuration
- `CacheConfig.java` - Cache configuration using properties
- `application.properties` - Default configuration
- `application-local.properties.example` - Template for local overrides
