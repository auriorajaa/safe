-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  full_name VARCHAR(255),
  customer_id VARCHAR(255) UNIQUE,
  price_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'inactive'
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  amount INTEGER NOT NULL,
  status VARCHAR(50) NOT NULL,
  stripe_payment_id VARCHAR(255) UNIQUE NOT NULL,
  price_id VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL REFERENCES users(email),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Detection sessions table
CREATE TABLE detection_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  detection_type VARCHAR(20) NOT NULL CHECK (detection_type IN ('CREDIT_CARD', 'TRANSACTION')),
  is_fraud BOOLEAN NOT NULL,
  detection_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Credit card detections table
CREATE TABLE credit_card_detections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES detection_sessions(id),
  distance_from_home FLOAT NOT NULL,
  distance_from_last_transaction FLOAT NOT NULL,
  ratio_to_median_purchase_price FLOAT NOT NULL,
  repeat_retailer BOOLEAN NOT NULL,
  used_chip BOOLEAN NOT NULL,
  used_pin_number BOOLEAN NOT NULL,
  online_order BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Transaction detections table
CREATE TABLE transaction_detections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES detection_sessions(id),
  type VARCHAR(50) NOT NULL,
  amount NUMERIC(15,2) NOT NULL,
  old_balance_orig NUMERIC(15,2) NOT NULL,
  new_balance_orig NUMERIC(15,2) NOT NULL,
  old_balance_dest NUMERIC(15,2) NOT NULL,
  new_balance_dest NUMERIC(15,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Detection results table for storing full JSON outputs
CREATE TABLE detection_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES detection_sessions(id),
  result_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpsql';

-- Add triggers to update updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add triggers to update updated_at for new tables
CREATE TRIGGER update_detection_sessions_updated_at
    BEFORE UPDATE ON detection_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_credit_card_detections_updated_at
    BEFORE UPDATE ON credit_card_detections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transaction_detections_updated_at
    BEFORE UPDATE ON transaction_detections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_detection_results_updated_at
    BEFORE UPDATE ON detection_results
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_detection_sessions_user_id ON detection_sessions(user_id);
CREATE INDEX idx_detection_sessions_type ON detection_sessions(detection_type);
CREATE INDEX idx_detection_sessions_fraud ON detection_sessions(is_fraud);
CREATE INDEX idx_detection_sessions_timestamp ON detection_sessions(detection_timestamp);
CREATE INDEX idx_credit_card_detections_session_id ON credit_card_detections(session_id);
CREATE INDEX idx_transaction_detections_session_id ON transaction_detections(session_id);
CREATE INDEX idx_detection_results_session_id ON detection_results(session_id);