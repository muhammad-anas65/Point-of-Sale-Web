# POS System - Setup Guide

## Overview
This is a modern web-based Point of Sale (POS) system built with React, TypeScript, Tailwind CSS, and Supabase.

## Features Implemented

### Core Features
- ✅ **Authentication System** - Email/password login with role-based access control
- ✅ **Dashboard** - Real-time business metrics and analytics
- ✅ **Sales Register** - Fast POS interface with cart management
- ✅ **Product Management** - Inventory tracking with low stock alerts
- ✅ **Customer Management** - Customer database with loyalty points
- ✅ **Reports & Analytics** - Sales, expenses, and profit/loss reports
- ✅ **Settings** - Configurable business preferences, currency, and tax settings

### User Roles
- **Admin** - Full system access
- **Manager** - Access to all modules except settings
- **Cashier** - Sales register and customer management
- **Accountant** - View-only access to reports and expenses

### Database Schema
Complete database with the following tables:
- profiles (user management)
- products (inventory)
- categories (product organization)
- customers (customer database)
- suppliers (vendor management)
- sales & sale_items (transaction records)
- quotations & quotation_items (estimates)
- purchases & purchase_items (stock receiving)
- expenses (business expenses)
- cash_sessions (cash register reconciliation)
- gift_cards (gift card management)
- settings (system configuration)

## Getting Started

### 1. Create Demo User

To use the system, you need to create a user account. Run this SQL in your Supabase SQL Editor:

```sql
-- Create a demo admin user
-- Note: Replace the email and password as needed

-- First, sign up through the login screen, then run this to set the role:
UPDATE profiles
SET role = 'admin', is_active = true
WHERE id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com');
```

**Or use the built-in Supabase Auth UI:**

1. Go to the login screen
2. Enter email and password to create an account
3. Run the SQL above to set yourself as admin

### 2. Add Sample Data (Optional)

Add some sample products to get started:

```sql
-- Insert sample categories
INSERT INTO categories (name, description) VALUES
  ('Electronics', 'Electronic devices and accessories'),
  ('Clothing', 'Apparel and fashion items'),
  ('Food & Beverage', 'Food and drink products');

-- Insert sample products
INSERT INTO products (sku, name, description, brand, cost_price, selling_price, tax_rate, stock_quantity, is_active, created_by) VALUES
  ('SKU-001', 'Wireless Mouse', 'Ergonomic wireless mouse', 'TechBrand', 15.00, 29.99, 10, 50, true, (SELECT id FROM auth.users LIMIT 1)),
  ('SKU-002', 'USB Cable', 'USB-C charging cable', 'TechBrand', 5.00, 12.99, 10, 100, true, (SELECT id FROM auth.users LIMIT 1)),
  ('SKU-003', 'T-Shirt', 'Cotton t-shirt', 'FashionCo', 8.00, 19.99, 10, 75, true, (SELECT id FROM auth.users LIMIT 1)),
  ('SKU-004', 'Coffee Beans', 'Premium coffee beans 500g', 'CoffeeCo', 12.00, 24.99, 5, 30, true, (SELECT id FROM auth.users LIMIT 1));

-- Insert sample customers
INSERT INTO customers (customer_code, name, email, phone, city, loyalty_points, total_spent) VALUES
  ('CUST-001', 'John Doe', 'john@example.com', '+1234567890', 'New York', 150, 450.00),
  ('CUST-002', 'Jane Smith', 'jane@example.com', '+1234567891', 'Los Angeles', 200, 680.00),
  ('CUST-003', 'Bob Johnson', 'bob@example.com', '+1234567892', 'Chicago', 100, 320.00);
```

### 3. Start Using the System

1. **Login** with your created account
2. **Dashboard** - View your business metrics
3. **Add Products** - Navigate to Products and add your inventory
4. **Add Customers** - Create customer records
5. **Make a Sale** - Go to Sales Register and start processing transactions
6. **View Reports** - Check your sales and profit reports

## Usage Guide

### Making a Sale

1. Navigate to **Sales Register**
2. Search for products using the search bar
3. Click on products to add them to cart
4. Adjust quantities using +/- buttons
5. Select payment method
6. Apply discount if needed
7. Click **Complete Sale**

### Managing Products

1. Go to **Products**
2. Click **Add Product**
3. Fill in product details (SKU, name, prices, stock)
4. Save the product
5. Products with low stock will show alerts

### Viewing Reports

1. Navigate to **Reports**
2. Select date range
3. View metrics:
   - Total Revenue
   - Net Profit
   - Expenses
   - Transaction count
   - Average transaction value
4. Export reports as PDF (coming soon)

### Configuring Settings

1. Go to **Settings** (Admin only)
2. Configure:
   - Business name
   - Currency
   - Tax settings
   - Low stock threshold
   - Theme and language

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Build Tool**: Vite

## Security Features

- Row Level Security (RLS) enabled on all tables
- Role-based access control
- Secure password authentication
- Protected API endpoints
- Audit trails with created_by/updated_by fields

## Future Enhancements

The following features are planned:
- Quotation management (UI ready, backend pending)
- Purchase orders and receiving
- Expense tracking with receipt uploads
- Gift card system
- Barcode generation and scanning
- Invoice PDF generation
- Email/SMS notifications
- Multi-language support
- Dark mode
- Cash session management
- Advanced reporting with charts
- Export to Excel/CSV

## Troubleshooting

### Cannot Login
- Ensure you've created a user account
- Run the SQL to set user role to 'admin'
- Check Supabase Auth settings

### Products Not Showing
- Make sure products are marked as `is_active = true`
- Check stock quantity is greater than 0

### Permission Errors
- Verify your user role in the profiles table
- Check RLS policies are enabled

## Support

For issues or questions:
1. Check the browser console for errors
2. Verify Supabase connection in .env file
3. Review RLS policies in Supabase dashboard
4. Check user role and permissions

## Demo Credentials

After setting up your first user:
- Email: your-email@example.com
- Password: your-password
- Role: Set via SQL to 'admin'
