-- Orders table for manual payment system
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  order_code VARCHAR(20) UNIQUE NOT NULL,
  plan VARCHAR(50) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_company VARCHAR(255),
  notes TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(20) DEFAULT 'pending',
  payment_method VARCHAR(50),
  transaction_reference VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  paid_at TIMESTAMP,
  
  -- Indexes for performance
  INDEX idx_order_code (order_code),
  INDEX idx_customer_email (customer_email),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

-- Order status enum values: pending, paid, cancelled, refunded
-- Payment method enum values: instapay, vodafone_cash, bank_transfer, paypal

