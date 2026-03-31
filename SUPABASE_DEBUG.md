# Supabase Score Save Debugging

## Issue
Scores appear to not be persisting to Supabase, but form data (name, email, whatsapp) is saving correctly.

## Verification Steps

### 1. Check LEADS Table Schema in Supabase Console
Go to: https://app.supabase.com → Select your project → Tables → LEADS

Verify these columns exist with correct types:

| Column Name | Expected Type | Required |
|------------|--------------|----------|
| nome | text | ✅ |
| email | text | ✅ |
| whatsApp | text | ✅ |
| espiritual | smallint/int | ✅ |
| casamento | smallint/int | ✅ |
| filhos | smallint/int | ✅ |
| lar | smallint/int | ✅ |
| saude | smallint/int | ✅ |
| mente | smallint/int | ✅ |
| intelectual | smallint/int | ✅ |
| profissional | smallint/int | ✅ |
| social | smallint/int | ✅ |
| relacionamentos | smallint/int | ✅ |

### 2. Common Issues to Check

**Column Name Case Sensitivity:**
- All column names in the code are lowercase (correct)
- Check if any column names in Supabase are UPPERCASE or CamelCase

**Data Type Mismatch:**
- The scores are calculated as numbers 0-10
- BUT they're being multiplied by 10 for chart display (0-100)
- Verify column types are `integer` or `smallint` (not `text` or `float`)

**Column Naming Specifics:**
- Check if column is named `whatsApp` (camelCase with lowercase 'w')
- Not `whatsapp` or `WhatsApp` or `whatsapNumber`

### 3. Test Insert with Browser Console

Open DevTools (F12) → Console and run:

```javascript
import supabase from './supabase.js'

// Test insert with sample data
supabase.from('LEADS')
  .insert([{
    nome: 'Test User',
    email: 'test@test.com',
    whatsApp: '11999999999',
    espiritual: 8,
    casamento: 7,
    filhos: 6,
    lar: 9,
    saude: 5,
    mente: 8,
    intelectual: 7,
    profissional: 6,
    social: 9,
    relacionamentos: 8,
  }])
  .select()
  .then(res => console.log('Success:', res))
  .catch(err => console.error('Error:', err))
```

### 4. Check Browser Console Logs

When completing the diagnosis, look for:
- ✅ Log: "Lead inserted successfully with all data"
- ❌ Log: "Error inserting lead with scores:" + detailed error

## Possible Causes & Fixes

**Issue 1: Column Names Don't Match**
- Delete extra columns or rename existing ones to match exactly
- Use lowercase only: `espiritual, casamento, filhos, lar, saude, mente, intelectual, profissional, social, relacionamentos`

**Issue 2: Wrong Data Types**
- If columns are `text` type, change to `integer`
- Use SQL in Supabase to alter: `ALTER TABLE LEADS ALTER COLUMN espiritual TYPE integer`

**Issue 3: NULL Values Allowed**
- Check if columns have `NOT NULL` constraint
- If yes and you're sending undefined, the INSERT will fail
- Ensure all 10 score columns have default value or accept NULL

**Issue 4: RLS (Row Level Security) Policy Issues**
- Go to LEADS table → RLS Policies
- Verify there's an INSERT policy that allows unauthenticated users
- If not, add: `-- Allow all with true` or `(true)` policy

## Quick Fix to Try

If the issue is data type, run this SQL in Supabase SQL Editor:

```sql
-- Ensure all score columns are integer type
ALTER TABLE LEADS 
  ALTER COLUMN espiritual TYPE integer,
  ALTER COLUMN casamento TYPE integer,
  ALTER COLUMN filhos TYPE integer,
  ALTER COLUMN lar TYPE integer,
  ALTER COLUMN saude TYPE integer,
  ALTER COLUMN mente TYPE integer,
  ALTER COLUMN intelectual TYPE integer,
  ALTER COLUMN profissional TYPE integer,
  ALTER COLUMN social TYPE integer,
  ALTER COLUMN relacionamentos TYPE integer;
```

## After Fix
1. Test with the diagnosis flow
2. Check browser console for success log
3. Verify in Supabase table that scores are populated
4. Test download button (now with 1000ms timeout)
