/*
  # POS System Database Schema

  ## Overview
  This migration creates the complete database schema for a modern Point of Sale system with support for:
  - Multi-user authentication and role-based access control
  - Product and inventory management
  - Sales transactions and invoicing
  - Customer and supplier management
  - Expense tracking
  - Reporting and analytics

  ## New Tables

  ### 1. `profiles`
  User profiles extending Supabase auth.users
  - `id` (uuid, FK to auth.users)
  - `full_name` (text)
  - `role` (text) - admin, manager, cashier, accountant
  - `phone` (text)
  - `avatar_url` (text)
  - `is_active` (boolean)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. `categories`
  Product categories for organization
  - `id` (uuid, primary key)
  - `name` (text)
  - `description` (text)
  - `parent_id` (uuid, self-reference for subcategories)
  - `created_at` (timestamptz)

  ### 3. `products`
  Product catalog with full inventory details
  - `id` (uuid, primary key)
  - `sku` (text, unique)
  - `barcode` (text, unique)
  - `name` (text)
  - `description` (text)
  - `category_id` (uuid, FK)
  - `brand` (text)
  - `size` (text)
  - `color` (text)
  - `cost_price` (decimal)
  - `selling_price` (decimal)
  - `tax_rate` (decimal)
  - `stock_quantity` (integer)
  - `reorder_level` (integer)
  - `expiry_date` (date)
  - `image_url` (text)
  - `is_active` (boolean)
  - `created_by` (uuid, FK)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 4. `customers`
  Customer database with loyalty tracking
  - `id` (uuid, primary key)
  - `customer_code` (text, unique)
  - `name` (text)
  - `email` (text)
  - `phone` (text)
  - `address` (text)
  - `city` (text)
  - `loyalty_points` (integer)
  - `total_spent` (decimal)
  - `notes` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 5. `suppliers`
  Supplier management
  - `id` (uuid, primary key)
  - `supplier_code` (text, unique)
  - `name` (text)
  - `email` (text)
  - `phone` (text)
  - `address` (text)
  - `city` (text)
  - `total_purchased` (decimal)
  - `notes` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 6. `sales`
  Sales transaction headers
  - `id` (uuid, primary key)
  - `invoice_number` (text, unique)
  - `customer_id` (uuid, FK)
  - `cashier_id` (uuid, FK)
  - `subtotal` (decimal)
  - `tax_amount` (decimal)
  - `discount_amount` (decimal)
  - `total_amount` (decimal)
  - `payment_method` (text) - cash, card, wallet, etc.
  - `payment_status` (text) - paid, partial, pending
  - `notes` (text)
  - `sale_date` (timestamptz)
  - `created_at` (timestamptz)

  ### 7. `sale_items`
  Individual items in each sale
  - `id` (uuid, primary key)
  - `sale_id` (uuid, FK)
  - `product_id` (uuid, FK)
  - `quantity` (integer)
  - `unit_price` (decimal)
  - `tax_rate` (decimal)
  - `tax_amount` (decimal)
  - `discount_amount` (decimal)
  - `total_amount` (decimal)

  ### 8. `quotations`
  Sales quotations/estimates
  - `id` (uuid, primary key)
  - `quote_number` (text, unique)
  - `customer_id` (uuid, FK)
  - `created_by` (uuid, FK)
  - `subtotal` (decimal)
  - `tax_amount` (decimal)
  - `discount_amount` (decimal)
  - `total_amount` (decimal)
  - `status` (text) - pending, accepted, rejected, converted
  - `valid_until` (date)
  - `notes` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 9. `quotation_items`
  Items in quotations
  - `id` (uuid, primary key)
  - `quotation_id` (uuid, FK)
  - `product_id` (uuid, FK)
  - `quantity` (integer)
  - `unit_price` (decimal)
  - `tax_rate` (decimal)
  - `discount_amount` (decimal)
  - `total_amount` (decimal)

  ### 10. `purchases`
  Purchase orders and stock receiving
  - `id` (uuid, primary key)
  - `purchase_number` (text, unique)
  - `supplier_id` (uuid, FK)
  - `received_by` (uuid, FK)
  - `subtotal` (decimal)
  - `tax_amount` (decimal)
  - `total_amount` (decimal)
  - `payment_status` (text)
  - `notes` (text)
  - `purchase_date` (timestamptz)
  - `created_at` (timestamptz)

  ### 11. `purchase_items`
  Items in purchase orders
  - `id` (uuid, primary key)
  - `purchase_id` (uuid, FK)
  - `product_id` (uuid, FK)
  - `quantity` (integer)
  - `unit_cost` (decimal)
  - `tax_rate` (decimal)
  - `total_amount` (decimal)

  ### 12. `expenses`
  Business expense tracking
  - `id` (uuid, primary key)
  - `expense_number` (text, unique)
  - `category` (text)
  - `description` (text)
  - `amount` (decimal)
  - `payment_method` (text)
  - `receipt_url` (text)
  - `expense_date` (date)
  - `created_by` (uuid, FK)
  - `created_at` (timestamptz)

  ### 13. `cash_sessions`
  Cash register sessions for reconciliation
  - `id` (uuid, primary key)
  - `session_number` (text, unique)
  - `cashier_id` (uuid, FK)
  - `opening_amount` (decimal)
  - `closing_amount` (decimal)
  - `expected_amount` (decimal)
  - `difference` (decimal)
  - `total_sales` (decimal)
  - `total_transactions` (integer)
  - `opened_at` (timestamptz)
  - `closed_at` (timestamptz)
  - `notes` (text)

  ### 14. `gift_cards`
  Gift card management
  - `id` (uuid, primary key)
  - `card_number` (text, unique)
  - `initial_balance` (decimal)
  - `current_balance` (decimal)
  - `customer_id` (uuid, FK)
  - `status` (text) - active, used, expired
  - `issued_date` (timestamptz)
  - `expiry_date` (timestamptz)
  - `created_by` (uuid, FK)

  ### 15. `settings`
  System-wide settings and configuration
  - `id` (uuid, primary key)
  - `key` (text, unique)
  - `value` (jsonb)
  - `category` (text)
  - `updated_at` (timestamptz)
  - `updated_by` (uuid, FK)

  ## Security
  - Enable RLS on all tables
  - Policies restrict access based on user roles
  - Authenticated users only
  - Audit trail with created_by/updated_by fields
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'cashier' CHECK (role IN ('admin', 'manager', 'cashier', 'accountant')),
  phone text,
  avatar_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM profiles WHERE id = auth.uid()));

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  parent_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read categories"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and managers can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager')
    )
  );

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku text UNIQUE NOT NULL,
  barcode text UNIQUE,
  name text NOT NULL,
  description text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  brand text,
  size text,
  color text,
  cost_price decimal(10,2) NOT NULL DEFAULT 0,
  selling_price decimal(10,2) NOT NULL DEFAULT 0,
  tax_rate decimal(5,2) DEFAULT 0,
  stock_quantity integer DEFAULT 0,
  reorder_level integer DEFAULT 10,
  expiry_date date,
  image_url text,
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read active products"
  ON products FOR SELECT
  TO authenticated
  USING (is_active = true OR EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'manager')
  ));

CREATE POLICY "Admins and managers can manage products"
  ON products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager')
    )
  );

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_code text UNIQUE NOT NULL,
  name text NOT NULL,
  email text,
  phone text,
  address text,
  city text,
  loyalty_points integer DEFAULT 0,
  total_spent decimal(10,2) DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read customers"
  ON customers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create customers"
  ON customers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins and managers can update customers"
  ON customers FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager')
    )
  );

-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_code text UNIQUE NOT NULL,
  name text NOT NULL,
  email text,
  phone text,
  address text,
  city text,
  total_purchased decimal(10,2) DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read suppliers"
  ON suppliers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and managers can manage suppliers"
  ON suppliers FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager')
    )
  );

-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text UNIQUE NOT NULL,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  cashier_id uuid REFERENCES auth.users(id) NOT NULL,
  subtotal decimal(10,2) NOT NULL DEFAULT 0,
  tax_amount decimal(10,2) DEFAULT 0,
  discount_amount decimal(10,2) DEFAULT 0,
  total_amount decimal(10,2) NOT NULL DEFAULT 0,
  payment_method text NOT NULL DEFAULT 'cash',
  payment_status text DEFAULT 'paid' CHECK (payment_status IN ('paid', 'partial', 'pending')),
  notes text,
  sale_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own sales"
  ON sales FOR SELECT
  TO authenticated
  USING (
    cashier_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager', 'accountant')
    )
  );

CREATE POLICY "Authenticated users can create sales"
  ON sales FOR INSERT
  TO authenticated
  WITH CHECK (cashier_id = auth.uid());

-- Create sale_items table
CREATE TABLE IF NOT EXISTS sale_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id uuid REFERENCES sales(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price decimal(10,2) NOT NULL,
  tax_rate decimal(5,2) DEFAULT 0,
  tax_amount decimal(10,2) DEFAULT 0,
  discount_amount decimal(10,2) DEFAULT 0,
  total_amount decimal(10,2) NOT NULL
);

ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read sale items for accessible sales"
  ON sale_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sales
      WHERE sales.id = sale_items.sale_id
      AND (
        sales.cashier_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role IN ('admin', 'manager', 'accountant')
        )
      )
    )
  );

CREATE POLICY "Authenticated users can create sale items"
  ON sale_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sales
      WHERE sales.id = sale_items.sale_id
      AND sales.cashier_id = auth.uid()
    )
  );

-- Create quotations table
CREATE TABLE IF NOT EXISTS quotations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_number text UNIQUE NOT NULL,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  created_by uuid REFERENCES auth.users(id) NOT NULL,
  subtotal decimal(10,2) NOT NULL DEFAULT 0,
  tax_amount decimal(10,2) DEFAULT 0,
  discount_amount decimal(10,2) DEFAULT 0,
  total_amount decimal(10,2) NOT NULL DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'converted')),
  valid_until date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read relevant quotations"
  ON quotations FOR SELECT
  TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Authenticated users can create quotations"
  ON quotations FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update own quotations"
  ON quotations FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager')
    )
  )
  WITH CHECK (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager')
    )
  );

-- Create quotation_items table
CREATE TABLE IF NOT EXISTS quotation_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id uuid REFERENCES quotations(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price decimal(10,2) NOT NULL,
  tax_rate decimal(5,2) DEFAULT 0,
  discount_amount decimal(10,2) DEFAULT 0,
  total_amount decimal(10,2) NOT NULL
);

ALTER TABLE quotation_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read quotation items for accessible quotations"
  ON quotation_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quotations
      WHERE quotations.id = quotation_items.quotation_id
      AND (
        quotations.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role IN ('admin', 'manager')
        )
      )
    )
  );

CREATE POLICY "Users can manage quotation items for own quotations"
  ON quotation_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quotations
      WHERE quotations.id = quotation_items.quotation_id
      AND quotations.created_by = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quotations
      WHERE quotations.id = quotation_items.quotation_id
      AND quotations.created_by = auth.uid()
    )
  );

-- Create purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_number text UNIQUE NOT NULL,
  supplier_id uuid REFERENCES suppliers(id) ON DELETE SET NULL,
  received_by uuid REFERENCES auth.users(id) NOT NULL,
  subtotal decimal(10,2) NOT NULL DEFAULT 0,
  tax_amount decimal(10,2) DEFAULT 0,
  total_amount decimal(10,2) NOT NULL DEFAULT 0,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('paid', 'partial', 'pending')),
  notes text,
  purchase_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authorized users can read purchases"
  ON purchases FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager', 'accountant')
    )
  );

CREATE POLICY "Admins and managers can create purchases"
  ON purchases FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager')
    )
  );

-- Create purchase_items table
CREATE TABLE IF NOT EXISTS purchase_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id uuid REFERENCES purchases(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_cost decimal(10,2) NOT NULL,
  tax_rate decimal(5,2) DEFAULT 0,
  total_amount decimal(10,2) NOT NULL
);

ALTER TABLE purchase_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authorized users can read purchase items"
  ON purchase_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager', 'accountant')
    )
  );

CREATE POLICY "Admins and managers can manage purchase items"
  ON purchase_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager')
    )
  );

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_number text UNIQUE NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  amount decimal(10,2) NOT NULL,
  payment_method text DEFAULT 'cash',
  receipt_url text,
  expense_date date NOT NULL DEFAULT CURRENT_DATE,
  created_by uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authorized users can read expenses"
  ON expenses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager', 'accountant')
    )
  );

CREATE POLICY "Authorized users can create expenses"
  ON expenses FOR INSERT
  TO authenticated
  WITH CHECK (
    created_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager', 'accountant')
    )
  );

-- Create cash_sessions table
CREATE TABLE IF NOT EXISTS cash_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_number text UNIQUE NOT NULL,
  cashier_id uuid REFERENCES auth.users(id) NOT NULL,
  opening_amount decimal(10,2) DEFAULT 0,
  closing_amount decimal(10,2),
  expected_amount decimal(10,2),
  difference decimal(10,2),
  total_sales decimal(10,2) DEFAULT 0,
  total_transactions integer DEFAULT 0,
  opened_at timestamptz DEFAULT now(),
  closed_at timestamptz,
  notes text
);

ALTER TABLE cash_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own cash sessions"
  ON cash_sessions FOR SELECT
  TO authenticated
  USING (
    cashier_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Users can create own cash sessions"
  ON cash_sessions FOR INSERT
  TO authenticated
  WITH CHECK (cashier_id = auth.uid());

CREATE POLICY "Users can update own cash sessions"
  ON cash_sessions FOR UPDATE
  TO authenticated
  USING (cashier_id = auth.uid())
  WITH CHECK (cashier_id = auth.uid());

-- Create gift_cards table
CREATE TABLE IF NOT EXISTS gift_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_number text UNIQUE NOT NULL,
  initial_balance decimal(10,2) NOT NULL,
  current_balance decimal(10,2) NOT NULL,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired')),
  issued_date timestamptz DEFAULT now(),
  expiry_date timestamptz,
  created_by uuid REFERENCES auth.users(id) NOT NULL
);

ALTER TABLE gift_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read gift cards"
  ON gift_cards FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authorized users can manage gift cards"
  ON gift_cards FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager')
    )
  );

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  category text NOT NULL,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read settings"
  ON settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage settings"
  ON settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_sales_cashier ON sales(cashier_id);
CREATE INDEX IF NOT EXISTS idx_sales_customer ON sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_sale_items_sale ON sale_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_purchases_supplier ON purchases(supplier_id);
CREATE INDEX IF NOT EXISTS idx_cash_sessions_cashier ON cash_sessions(cashier_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotations_updated_at BEFORE UPDATE ON quotations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings
INSERT INTO settings (key, value, category) VALUES
  ('business_name', '{"value": "My POS Store"}', 'general'),
  ('currency', '{"code": "USD", "symbol": "$"}', 'general'),
  ('tax_enabled', '{"value": true}', 'tax'),
  ('default_tax_rate', '{"value": 10}', 'tax'),
  ('low_stock_threshold', '{"value": 10}', 'inventory'),
  ('theme', '{"value": "light"}', 'appearance'),
  ('language', '{"value": "en"}', 'general')
ON CONFLICT (key) DO NOTHING;