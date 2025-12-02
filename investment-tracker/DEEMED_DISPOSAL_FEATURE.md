# Deemed Disposal Date Feature

## Overview
This feature adds support for tracking deemed disposal dates for ETF transactions. In certain tax jurisdictions, there is a taxable event called "deemed disposal" that occurs 8 years after purchasing an ETF. On this date, you need to either:
- Sell the units purchased 8 years previously, OR
- Calculate the tax you would owe if you sold them and pay that tax (without actually selling)

## Implementation

### Backend Changes
1. **EtfTransaction Entity** (`backend/src/main/java/com/example/investmenttracker/model/EtfTransaction.java`)
   - Added `deemedDisposalDate` field (LocalDate)
   - The field is automatically calculated as `transactionDate + 8 years`
   - Calculation happens in multiple places to ensure consistency:
     - Constructor
     - `@PrePersist` lifecycle method (when entity is first saved)
     - `@PreUpdate` lifecycle method (when entity is updated)
     - `setTransactionDate()` method (when transaction date changes)

### Frontend Changes
1. **Messages Constants** (`frontend/src/constants/messages.js`)
   - Added `TAX_CALCULATOR` section with labels for the Tax Calculator UI

2. **EtfForm Component** (`frontend/src/components/EtfForm.js`)
   - Added Tax Calculator section that displays after the Transactions section
   - Shows a table with two columns:
     - Transaction Date
     - Deemed Disposal Date (calculated as transaction date + 8 years)
   - Only visible when editing an existing ETF with transactions
   - Falls back to client-side calculation if `deemedDisposalDate` is not present in the backend response

3. **EtfForm Styles** (`frontend/src/components/EtfForm.css`)
   - Added styling for the Tax Calculator section to match the existing design system

### Database Migration
- The new `deemed_disposal_date` column will be automatically added when the application starts (using Hibernate's auto-update feature)
- For existing transactions, run the SQL script at `backend/src/main/resources/db/migration/backfill_deemed_disposal_dates.sql` to populate the deemed disposal dates

## Usage
1. **Creating New Transactions**: The deemed disposal date is automatically calculated and saved
2. **Updating Transactions**: If you change the transaction date, the deemed disposal date is recalculated
3. **Viewing Tax Information**: 
   - Navigate to Edit ETF page
   - Scroll to the "Tax Calculator" section below the transactions
   - View the deemed disposal date for each transaction

## Future Enhancements
Potential improvements for this feature:
- Add notifications/alerts for upcoming deemed disposal dates
- Calculate estimated tax liability based on current vs. purchase price
- Generate tax reports for a given tax year
- Support for partial disposals
- Track actual vs. deemed disposals
