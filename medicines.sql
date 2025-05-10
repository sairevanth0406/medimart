-- Create medicines table
CREATE TABLE IF NOT EXISTS medicines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    stock_status ENUM('In Stock', 'Low Stock', 'Out of Stock') DEFAULT 'In Stock',
    image_url VARCHAR(255),
    discount_percentage INT DEFAULT 0
);

-- Pain Relief Category
INSERT INTO medicines (name, description, price, category, stock_status, discount_percentage) VALUES
('Paracetamol', 'Relieves pain and reduces fever. Effective for headaches, toothaches, and body pain.', 50.00, 'Pain Relief', 'In Stock', 20),
('Ibuprofen', 'Anti-inflammatory medication for pain relief and fever reduction.', 75.00, 'Pain Relief', 'In Stock', 0),
('Aspirin', 'Pain reliever and blood thinner. Helps with headaches and heart health.', 65.00, 'Pain Relief', 'In Stock', 15),
('Naproxen', 'Long-lasting pain relief for arthritis and muscle pain.', 120.00, 'Pain Relief', 'Low Stock', 0),
('Diclofenac Gel', 'Topical pain relief for joint and muscle pain.', 180.00, 'Pain Relief', 'In Stock', 10),
('Tramadol', 'Strong pain reliever for moderate to severe pain.', 250.00, 'Pain Relief', 'In Stock', 0),
('Muscle Rub Cream', 'Soothing relief for sore muscles and joints.', 95.00, 'Pain Relief', 'In Stock', 5),
('Heat Patch', 'Heat therapy patch for back pain and muscle soreness.', 45.00, 'Pain Relief', 'Low Stock', 0);

-- Antibiotics Category
INSERT INTO medicines (name, description, price, category, stock_status, discount_percentage) VALUES
('Amoxicillin', 'Broad-spectrum antibiotic for bacterial infections.', 120.00, 'Antibiotics', 'In Stock', 0),
('Azithromycin', 'Antibiotic for respiratory tract infections.', 180.00, 'Antibiotics', 'In Stock', 10),
('Ciprofloxacin', 'Antibiotic for urinary tract and skin infections.', 150.00, 'Antibiotics', 'Low Stock', 0),
('Doxycycline', 'Antibiotic for various bacterial infections and acne.', 135.00, 'Antibiotics', 'In Stock', 15),
('Cephalexin', 'First-generation cephalosporin antibiotic.', 160.00, 'Antibiotics', 'In Stock', 0),
('Metronidazole', 'Antibiotic for anaerobic bacterial infections.', 95.00, 'Antibiotics', 'In Stock', 5),
('Clarithromycin', 'Macrolide antibiotic for respiratory infections.', 210.00, 'Antibiotics', 'Low Stock', 20),
('Nitrofurantoin', 'Antibiotic specifically for urinary tract infections.', 145.00, 'Antibiotics', 'In Stock', 0);

-- Cold & Cough Category
INSERT INTO medicines (name, description, price, category, stock_status, discount_percentage) VALUES
('Cough Syrup', 'Relieves cough and soothes throat irritation.', 80.00, 'Cold & Cough', 'In Stock', 15),
('Decongestant Tablets', 'Clears nasal congestion and sinuses.', 65.00, 'Cold & Cough', 'In Stock', 0),
('Throat Lozenges', 'Soothes sore throat and reduces cough.', 45.00, 'Cold & Cough', 'In Stock', 10),
('Nasal Spray', 'Provides quick relief from nasal congestion.', 95.00, 'Cold & Cough', 'Low Stock', 5),
('Cold Relief Combo', 'Complete relief from cold symptoms.', 150.00, 'Cold & Cough', 'In Stock', 20),
('Chest Rub', 'Medicated rub for congestion relief.', 85.00, 'Cold & Cough', 'In Stock', 0),
('Flu Relief Tablets', 'Comprehensive relief from flu symptoms.', 120.00, 'Cold & Cough', 'In Stock', 15),
('Herbal Cough Drops', 'Natural relief from cough and sore throat.', 55.00, 'Cold & Cough', 'Low Stock', 0);

-- Vitamins Category
INSERT INTO medicines (name, description, price, category, stock_status, discount_percentage) VALUES
('Vitamin C', 'Boosts immunity and promotes skin health.', 90.00, 'Vitamins', 'In Stock', 0),
('Multivitamin', 'Complete daily vitamin and mineral supplement.', 150.00, 'Vitamins', 'In Stock', 25),
('Vitamin D3', 'Supports bone health and immunity.', 120.00, 'Vitamins', 'In Stock', 10),
('B-Complex', 'Essential B vitamins for energy and metabolism.', 180.00, 'Vitamins', 'Low Stock', 15),
('Vitamin E', 'Antioxidant for skin health and immunity.', 160.00, 'Vitamins', 'In Stock', 0),
('Zinc Supplements', 'Supports immune system and wound healing.', 95.00, 'Vitamins', 'In Stock', 5),
('Iron Tablets', 'Prevents and treats iron deficiency anemia.', 110.00, 'Vitamins', 'In Stock', 0),
('Calcium + D3', 'Promotes strong bones and dental health.', 175.00, 'Vitamins', 'Low Stock', 20);

-- Diabetes Category
INSERT INTO medicines (name, description, price, category, stock_status, discount_percentage) VALUES
('Metformin', 'Oral diabetes medicine to control blood sugar.', 145.00, 'Diabetes', 'In Stock', 0),
('Insulin Pen', 'Injectable insulin for diabetes management.', 850.00, 'Diabetes', 'In Stock', 10),
('Blood Sugar Strips', 'Test strips for glucose monitoring.', 425.00, 'Diabetes', 'Low Stock', 15),
('Glimepiride', 'Helps release insulin for type 2 diabetes.', 165.00, 'Diabetes', 'In Stock', 0),
('Diabetes Control Tea', 'Herbal tea for supporting diabetes care.', 95.00, 'Diabetes', 'In Stock', 5),
('Sugar Free Sweetener', 'Natural sweetener for diabetics.', 125.00, 'Diabetes', 'In Stock', 20),
('Diabetic Foot Cream', 'Special cream for diabetic foot care.', 235.00, 'Diabetes', 'Low Stock', 0),
('Glucose Monitor', 'Digital blood glucose monitoring device.', 1250.00, 'Diabetes', 'In Stock', 25);

-- Skin Care Category
INSERT INTO medicines (name, description, price, category, stock_status, discount_percentage) VALUES
('Antiseptic Cream', 'For cuts, burns and minor wounds.', 110.00, 'Skin Care', 'In Stock', 0),
('Acne Treatment Gel', 'Treats and prevents acne breakouts.', 175.00, 'Skin Care', 'In Stock', 15),
('Moisturizing Lotion', 'Hydrates and nourishes dry skin.', 145.00, 'Skin Care', 'Low Stock', 10),
('Anti-fungal Cream', 'Treats fungal skin infections.', 195.00, 'Skin Care', 'In Stock', 0),
('Sunscreen SPF 50', 'Protects skin from UV damage.', 250.00, 'Skin Care', 'In Stock', 20),
('Eczema Relief Cream', 'Soothes and treats eczema symptoms.', 285.00, 'Skin Care', 'In Stock', 5),
('Anti-aging Serum', 'Reduces fine lines and wrinkles.', 450.00, 'Skin Care', 'Low Stock', 25),
('Scar Treatment Gel', 'Helps reduce appearance of scars.', 325.00, 'Skin Care', 'In Stock', 0); 