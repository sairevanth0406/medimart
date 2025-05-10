💊 Medimart - A Comprehensive Pharmacy Management System
Medimart is a full-stack e-pharmacy web application designed to provide a seamless experience for purchasing medicines online. It serves both customers and pharmacy administrators by facilitating medicine browsing, ordering, and inventory management through a web-based system.

🧾 About the Project
Access to medicines is often hindered by factors like location, mobility, or time constraints. Medimart addresses this by offering a responsive and scalable online platform for customers to buy medicines and for admins to manage real-time inventory, track orders, and analyze trends.

✨ Features

Customer Functionality:

Registration and secure login

Browse categorized medicines (Pain Relief, Antibiotics, Vitamins, etc.)

View detailed medicine descriptions, stock status, and discounts

Add to cart and place orders

View order history

Admin Functionality:

Admin login and dashboard

Add/update medicines and stock

Monitor recent orders and sales

Manage users and employees


| Layer        | Technologies Used                    |
| ------------ | ------------------------------------ |
| Frontend     | HTML, CSS, Bootstrap, JavaScript     |
| Backend      | Node.js, Express.js                  |
| Database     | MySQL                                |
| ORM/Querying | mysql2, bcrypt for password security |
| Deployment   | Localhost (port 3000)                |


🗃️ Database Schema Overview

Tables:

admin (id, firstName, lastName, email, password)

employee (id, firstName, lastName, email, password, role)

customers (id, firstName, lastName, email, phone, password, created_at)

medicines (id, name, description, price, category, stock_status, discount_percentage, quantity, image_url)

orders (id, orderId, userId, items, subtotal, discount, total, orderDate, status, created_at)

Full DDL and DML commands available in medicines.sql and implementation script (server.js).





🔮 Future Enhancements

🔐 JWT & MFA Authentication

💳 Payment Gateway Integration

🔍 Live Search with Auto-Suggestions

📦 Real-Time Stock Notifications

📱 Mobile App (React Native / Flutter)

📷 Prescription Upload & Verification

📈 Advanced Analytics Dashboard

🌐 Multi-language & Accessibility Support

📩 Email/SMS Notifications with Nodemailer & Twilio
