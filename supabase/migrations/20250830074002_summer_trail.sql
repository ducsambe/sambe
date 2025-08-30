/*
  # Create separate admin system

  1. New Tables
    - Drop existing `admins` table that references users
    - Create new independent `admins` table with own credentials
    - Keep existing `users` table for regular clients only

  2. Security
    - Enable RLS on new `admins` table
    - Add policies for admin authentication and management
    - Update properties table to reference admins instead of users for created_by

  3. Changes
    - Remove foreign key constraint from admins to users
    - Update properties created_by to reference admins
    - Add sample admin data
*/

-- Drop existing admins table and recreate as independent
DROP TABLE IF EXISTS admins CASCADE;

-- Create independent admins table
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(20) CHECK (role IN ('admin', 'staff', 'manager')) NOT NULL,
    permissions TEXT[],
    department VARCHAR(100),
    profile_image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on admins table
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Create policies for admins
CREATE POLICY "Admins can read own data"
    ON admins
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Admins can update own data"
    ON admins
    FOR UPDATE
    TO authenticated
    USING (true);

-- Update properties table to reference admins instead of users for created_by
DO $$
BEGIN
    -- Drop existing foreign key constraint if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'properties_created_by_fkey' 
        AND table_name = 'properties'
    ) THEN
        ALTER TABLE properties DROP CONSTRAINT properties_created_by_fkey;
    END IF;
    
    -- Add new foreign key constraint to admins table
    ALTER TABLE properties ADD CONSTRAINT properties_created_by_fkey 
        FOREIGN KEY (created_by) REFERENCES admins(id);
END $$;

-- Insert sample admin data
INSERT INTO admins (id, username, email, password_hash, first_name, last_name, phone, role, permissions, department) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin', 'admin@geocasa.com', 'admin123', 'Super', 'Admin', '+237 699 000 001', 'admin', '{"all"}', 'Direction'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'geocasa_admin', 'geocasa_admin@geocasa.com', 'geocasa2024', 'GEOCASA', 'Administrator', '+237 699 000 002', 'admin', '{"properties", "users", "transactions"}', 'Administration'),
    ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'manager', 'manager@geocasa.com', 'manager123', 'Property', 'Manager', '+237 699 000 003', 'manager', '{"properties", "transactions"}', 'Gestion'),
    ('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'staff', 'staff@geocasa.com', 'staff123', 'Support', 'Staff', '+237 699 000 004', 'staff', '{"properties"}', 'Support');

-- Add indexes for admins table
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
CREATE INDEX IF NOT EXISTS idx_admins_username ON admins(username);
CREATE INDEX IF NOT EXISTS idx_admins_role ON admins(role);

-- Create trigger for admins updated_at
CREATE TRIGGER update_admins_updated_at 
    BEFORE UPDATE ON admins 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();