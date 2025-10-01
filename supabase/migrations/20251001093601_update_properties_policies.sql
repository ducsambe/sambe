/*
  # Update Properties Table Policies
  
  1. Changes
    - Allow anonymous users to insert, update, and delete properties
    - This enables the admin panel to work without Supabase Auth
    - Properties remain publicly viewable
  
  2. Security Notes
    - In production, you should implement proper authentication
    - For now, this allows the admin panel to function
*/

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can insert properties" ON properties;
DROP POLICY IF EXISTS "Authenticated users can update properties" ON properties;
DROP POLICY IF EXISTS "Authenticated users can delete properties" ON properties;

-- Create new policies that allow anonymous access
CREATE POLICY "Anyone can insert properties"
  ON properties
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update properties"
  ON properties
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete properties"
  ON properties
  FOR DELETE
  TO anon, authenticated
  USING (true);