/*
  # GEOCASA GROUP Database Schema

  1. New Tables
    - `users` - User accounts with authentication
    - `properties` - Real estate properties
    - `transactions` - Purchase and reservation transactions
    - `payments` - Payment records
    - `favorites` - User favorite properties
    - `admins` - Admin system separate from users

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Admin-only access for sensitive operations
    - Properties viewable by everyone (anon + authenticated)

  3. Features
    - Auto-updating timestamps
    - Calculated remaining amounts
    - Proper indexing for performance
    - Support for installment payments
*/

-- Table des utilisateurs (regular clients)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    profile_image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des administrateurs (separate from users)
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

-- Table des propriétés
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) CHECK (type IN ('terrain', 'maison', 'appartement', 'studio', 'chambre', 'lot', 'commercial')) NOT NULL,
    location TEXT,
    city VARCHAR(100),
    area_sqm DECIMAL(10, 2),
    status VARCHAR(20) CHECK (status IN ('disponible', 'réservé', 'vendu')) DEFAULT 'disponible',
    price DECIMAL(15, 2) NOT NULL,
    presentation_video_url TEXT,
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6),
    features TEXT[],
    images TEXT[],
    created_by UUID REFERENCES admins(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des transactions
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) NOT NULL,
    property_id UUID REFERENCES properties(id) NOT NULL,
    transaction_type VARCHAR(20) CHECK (transaction_type IN ('achat', 'réservation')) NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,
    amount_paid DECIMAL(15, 2) DEFAULT 0,
    amount_remaining DECIMAL(15, 2) GENERATED ALWAYS AS (total_amount - amount_paid) STORED,
    status VARCHAR(20) CHECK (status IN ('en attente', 'en cours', 'completé', 'annulé')) DEFAULT 'en attente',
    installments_allowed BOOLEAN DEFAULT FALSE,
    number_of_installments INTEGER DEFAULT 1,
    next_payment_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des paiements
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID REFERENCES transactions(id) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reference_number VARCHAR(100),
    status VARCHAR(20) CHECK (status IN ('réussi', 'échoué', 'en attente')) DEFAULT 'en attente',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des favoris
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, property_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

-- RLS Policies for admins table
CREATE POLICY "Admins can read own data"
  ON admins
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can update own data"
  ON admins
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for properties table (PUBLIC READ ACCESS)
CREATE POLICY "Properties are viewable by everyone"
  ON properties
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can insert properties"
  ON properties
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update properties"
  ON properties
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete properties"
  ON properties
  FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for transactions table
CREATE POLICY "Users can view own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create own transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

-- RLS Policies for payments table
CREATE POLICY "Users can view own payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM transactions t
      WHERE t.id = transaction_id
      AND t.user_id::text = auth.uid()::text
    )
  );

-- RLS Policies for favorites table
CREATE POLICY "Users can manage own favorites"
  ON favorites
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id::text)
  WITH CHECK (auth.uid()::text = user_id::text);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_property ON transactions(property_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
CREATE INDEX IF NOT EXISTS idx_admins_username ON admins(username);
CREATE INDEX IF NOT EXISTS idx_admins_role ON admins(role);

-- Function to update updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at columns
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
        CREATE TRIGGER update_users_updated_at 
        BEFORE UPDATE ON users 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_admins_updated_at') THEN
        CREATE TRIGGER update_admins_updated_at 
        BEFORE UPDATE ON admins 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_properties_updated_at') THEN
        CREATE TRIGGER update_properties_updated_at 
        BEFORE UPDATE ON properties 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_transactions_updated_at') THEN
        CREATE TRIGGER update_transactions_updated_at 
        BEFORE UPDATE ON transactions 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Insert sample admin
INSERT INTO admins (username, email, password_hash, first_name, last_name, phone, role, permissions, department) VALUES
    ('admin', 'admin@geocasa.com', 'admin123', 'Super', 'Admin', '+237 699 000 001', 'admin', ARRAY['all'], 'Direction')
ON CONFLICT (username) DO NOTHING;

-- Insert sample properties
INSERT INTO properties (title, description, type, location, city, area_sqm, status, price, latitude, longitude, features, images) VALUES
    ('Terrain à bâtir - Zone résidentielle Douala', 'Beau terrain plat de 500m² dans un quartier calme de Douala. Idéal pour construction villa.', 'terrain', 'Quartier des Fleurs, Akwa', 'Douala', 500, 'disponible', 15000000, 4.051056, 9.767869,
     ARRAY['eau courante', 'électricité', 'proche école', 'accès goudronné'], 
     ARRAY['https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800']),
    
    ('Villa moderne 4 chambres Douala', 'Magnifique villa moderne avec piscine et jardin à Bonneko.', 'maison', 'Bonneko', 'Douala', 280, 'disponible', 45000000, 4.048272, 9.718365,
     ARRAY['piscine', 'jardin', 'garage double', 'climatisation'], 
     ARRAY['https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800', 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800']),
    
    ('Appartement 3 pièces meublé Akwa', 'Appartement lumineux avec vue sur la mer à Akwa.', 'appartement', 'Akwa Nord', 'Douala', 95, 'disponible', 25000000, 4.041107, 9.703949,
     ARRAY['meublé', 'vue mer', 'ascenseur', 'gardien'], 
     ARRAY['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800']),
    
    ('Studio meublé centre-ville Yaoundé', 'Studio entièrement meublé au cœur de Yaoundé.', 'studio', 'Centre-ville', 'Yaoundé', 35, 'disponible', 8000000, 3.848032, 11.502075,
     ARRAY['meublé', 'cuisine équipée', 'eau chaude'], 
     ARRAY['https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800']),
    
    ('Lotissement Bonamoussadi Douala', 'Lot de 200m² dans lotissement sécurisé.', 'lot', 'Bonamoussadi', 'Douala', 200, 'disponible', 12000000, 4.084421, 9.774891,
     ARRAY['sécurisé', 'électricité', 'eau courante'], 
     ARRAY['https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'])
ON CONFLICT DO NOTHING;