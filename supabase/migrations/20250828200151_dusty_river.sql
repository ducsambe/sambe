/*
  # Insert Sample Data for GEOCASA GROUP

  1. Sample Users
    - Regular clients
    - Admin users

  2. Sample Properties
    - Various property types across Cameroon
    - Different price ranges and locations

  3. Sample Transactions
    - Purchase and reservation examples
    - Payment history

  4. Sample Favorites
    - User favorite properties
*/

-- Utilisateurs exemple
INSERT INTO users (id, username, email, password_hash, first_name, last_name, phone) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'client1', 'client1@example.com', '$2b$10$examplehashedpassword1', 'Jean', 'Dupont', '+237 612 345 678'),
    ('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'client2', 'client2@example.com', '$2b$10$examplehashedpassword2', 'Marie', 'Martin', '+237 677 890 123'),
    ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'admin1', 'admin1@geocasa.com', '$2b$10$examplehashedpassword3', 'Pierre', 'Admin', '+237 699 456 789'),
    ('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'user_demo', 'user@geocasa.com', 'user123', 'Demo', 'User', '+237 670 123 456'),
    ('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'geocasa_admin', 'geocasa_admin@geocasa.com', 'geocasa2024', 'GEOCASA', 'Administrator', '+237 699 000 000')
ON CONFLICT (id) DO NOTHING;

-- Admins exemple
INSERT INTO admins (id, user_id, role, permissions, department) VALUES
    (gen_random_uuid(), 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'admin', '{"all"}', 'Direction'),
    (gen_random_uuid(), 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'admin', '{"all"}', 'Direction')
ON CONFLICT DO NOTHING;

-- Propriétés exemple avec coordonnées du Cameroun
INSERT INTO properties (id, title, description, type, location, city, area_sqm, status, price, latitude, longitude, features, images) VALUES
    (gen_random_uuid(), 'Terrain à bâtir - Zone résidentielle Douala', 'Beau terrain plat de 500m² dans un quartier calme de Douala. Idéal pour construction villa. Proche de toutes commodités.', 'terrain', 'Quartier des Fleurs, Akwa', 'Douala', 500, 'disponible', 15000000, 4.051056, 9.767869,
     '{"eau courante", "électricité", "proche école", "accès goudronné", "quartier sécurisé"}', 
     '{"https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800"}'),
    
    (gen_random_uuid(), 'Villa moderne 4 chambres Douala', 'Magnifique villa moderne avec piscine et jardin à Bonneko. Climatisation dans toutes les pièces, garage double.', 'maison', 'Bonneko', 'Douala', 280, 'disponible', 45000000, 4.048272, 9.718365,
     '{"piscine", "jardin", "garage double", "climatisation", "sécurité 24h", "cuisine équipée"}', 
     '{"https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1396127/pexels-photo-1396127.jpeg?auto=compress&cs=tinysrgb&w=800"}'),
    
    (gen_random_uuid(), 'Appartement 3 pièces meublé Akwa', 'Appartement lumineux avec vue sur la mer à Akwa. Entièrement meublé et équipé, prêt à habiter.', 'appartement', 'Akwa Nord', 'Douala', 95, 'réservé', 25000000, 4.041107, 9.703949,
     '{"meublé", "vue mer", "ascenseur", "gardien", "internet fibre", "balcon"}', 
     '{"https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800"}'),
    
    (gen_random_uuid(), 'Studio meublé centre-ville Yaoundé', 'Studio entièrement meublé et équipé au cœur de Yaoundé. Idéal étudiant ou jeune travailleur.', 'studio', 'Centre-ville', 'Yaoundé', 35, 'disponible', 8000000, 3.848032, 11.502075,
     '{"meublé", "cuisine équipée", "eau chaude", "proche transports", "wifi inclus"}', 
     '{"https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1571467/pexels-photo-1571467.jpeg?auto=compress&cs=tinysrgb&w=800"}'),
    
    (gen_random_uuid(), 'Lotissement Bonamoussadi Douala', 'Lot de 200m² dans lotissement sécurisé avec toutes les commodités à proximité. Titre foncier disponible.', 'lot', 'Bonamoussadi', 'Douala', 200, 'disponible', 12000000, 4.084421, 9.774891,
     '{"sécurisé", "électricité", "eau courante", "voirie", "proche marché", "titre foncier"}', 
     '{"https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg?auto=compress&cs=tinysrgb&w=800"}'),

    (gen_random_uuid(), 'Terrain commercial Yaoundé Bastos', 'Terrain commercial de 800m² dans le quartier huppé de Bastos. Idéal pour bureaux ou commerce.', 'commercial', 'Bastos', 'Yaoundé', 800, 'disponible', 65000000, 3.866667, 11.516667,
     '{"zone commerciale", "accès principal", "parking", "sécurité", "proche ambassades"}', 
     '{"https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1396127/pexels-photo-1396127.jpeg?auto=compress&cs=tinysrgb&w=800"}'),

    (gen_random_uuid(), 'Maison 3 chambres Bafoussam', 'Belle maison familiale de 3 chambres avec jardin à Bafoussam. Construction récente, finitions de qualité.', 'maison', 'Centre-ville', 'Bafoussam', 150, 'disponible', 28000000, 5.4737, 10.4178,
     '{"jardin", "garage", "eau courante", "électricité", "carrelage", "plafond moderne"}', 
     '{"https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800"}'),

    (gen_random_uuid(), 'Appartement 2 pièces Bamenda', 'Appartement moderne de 2 pièces dans le centre de Bamenda. Vue sur les montagnes, très lumineux.', 'appartement', 'Commercial Avenue', 'Bamenda', 65, 'disponible', 18000000, 5.9597, 10.1453,
     '{"vue montagne", "lumineux", "moderne", "proche centre", "parking"}', 
     '{"https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800", "https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800"}')
ON CONFLICT (id) DO NOTHING;

-- Transactions exemple
INSERT INTO transactions (id, user_id, property_id, transaction_type, total_amount, amount_paid, status, installments_allowed, number_of_installments, next_payment_date) VALUES
    (gen_random_uuid(), 
     'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 
     (SELECT id FROM properties WHERE title LIKE '%Appartement 3 pièces%' LIMIT 1), 
     'achat', 
     25000000, 
     10000000, 
     'en cours', 
     TRUE, 
     5, 
     NOW() + INTERVAL '30 days'),
     
    (gen_random_uuid(), 
     'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 
     (SELECT id FROM properties WHERE title LIKE '%Studio meublé%' LIMIT 1), 
     'réservation', 
     8000000, 
     2000000, 
     'en cours', 
     TRUE, 
     4, 
     NOW() + INTERVAL '15 days')
ON CONFLICT (id) DO NOTHING;

-- Paiements exemple
INSERT INTO payments (id, transaction_id, amount, payment_method, reference_number, status) VALUES
    (gen_random_uuid(), 
     (SELECT id FROM transactions WHERE amount_paid = 10000000 LIMIT 1), 
     10000000, 
     'virement bancaire', 
     'VIR20240101ABC123', 
     'réussi'),
     
    (gen_random_uuid(), 
     (SELECT id FROM transactions WHERE amount_paid = 2000000 LIMIT 1), 
     2000000, 
     'mobile money', 
     'MOMO20240102XYZ789', 
     'réussi')
ON CONFLICT (id) DO NOTHING;

-- Favoris exemple
INSERT INTO favorites (id, user_id, property_id) VALUES
    (gen_random_uuid(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM properties WHERE title LIKE '%Villa moderne%' LIMIT 1)),
    (gen_random_uuid(), 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', (SELECT id FROM properties WHERE title LIKE '%Terrain à bâtir%' LIMIT 1)),
    (gen_random_uuid(), 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', (SELECT id FROM properties WHERE title LIKE '%Villa moderne%' LIMIT 1))
ON CONFLICT (user_id, property_id) DO NOTHING;