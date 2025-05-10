const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');
const mysql2 = require('mysql2/promise');

// Initialize express first
const app = express();
const port = 3000;

// Middleware
app.use(cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Add OPTIONS handling for preflight requests
app.options('*', cors());

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Add health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        error: err.message || 'Internal server error'
    });
});

// Root route handler
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Database connection with error handling
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Sairevanth@12',
    database: 'medimart'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to database');
    
    // Create tables after successful connection
    initializeTables();
});

// First, create the tables properly
const createEmployeeTable = `
CREATE TABLE IF NOT EXISTS employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
)`;

const createAdminTable = `
CREATE TABLE IF NOT EXISTS admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
)`;

const createOrdersTable = `
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    customer_name VARCHAR(100) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending'
)`;

// Create tables when server starts
// First, add the customers table creation to your initializeTables function
const createCustomersTable = `
CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

// Add this to your initializeTables function
const createMedicinesTable = `
CREATE TABLE IF NOT EXISTS medicines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    stock_status ENUM('In Stock', 'Low Stock', 'Out of Stock') DEFAULT 'In Stock',
    image_url VARCHAR(255),
    discount_percentage INT DEFAULT 0,
    quantity INT NOT NULL DEFAULT 0
)`;

// Update the initializeTables function to include the medicines table
async function initializeTables() {
    try {
        const connection = await mysql2.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Sairevanth@12',
            database: 'medimart'
        });

        // Create tables one by one
        await connection.execute(createEmployeeTable);
        await connection.execute(createAdminTable);
        await connection.execute(createOrdersTable);
        await connection.execute(createCustomersTable);
        await connection.execute(createMedicinesTable);  // Add this line
        
        console.log('All tables created successfully');
        await connection.end();
    } catch (error) {
        console.error('Error initializing tables:', error);
    }
}

// Call this function when your server starts
initializeTables();

// Registration endpoint
app.post('/api/register', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password } = req.body;

        // Check if user already exists
        const checkUserQuery = 'SELECT * FROM customers WHERE email = ?';
        db.query(checkUserQuery, [email], async (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (results.length > 0) {
                return res.status(400).json({ error: 'Email already registered' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert new user
            const insertQuery = `
                INSERT INTO customers (firstName, lastName, email, phone, password)
                VALUES (?, ?, ?, ?, ?)
            `;

            db.query(
                insertQuery,
                [firstName, lastName, email, phone, hashedPassword],
                (err, result) => {
                    if (err) {
                        console.error('Error registering user:', err);
                        return res.status(500).json({ error: 'Error registering user' });
                    }

                    res.status(201).json({
                        message: 'Registration successful',
                        userId: result.insertId
                    });
                }
            );
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const query = 'SELECT * FROM customers WHERE email = ?';
        db.query(query, [email], async (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (results.length === 0) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            const user = results[0];

            // Compare password
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            // Send success response with user data (excluding password)
            const { password: _, ...userData } = user;
            res.json({
                message: 'Login successful',
                user: userData
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to fetch all medicines
// Get all medicines endpoint
app.get('/api/medicines', async (req, res) => {
    try {
        const connection = await mysql2.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Sairevanth@12',
            database: 'medimart'
        });

        const query = req.query.category 
            ? 'SELECT * FROM medicines WHERE category = ? ORDER BY name'
            : 'SELECT * FROM medicines ORDER BY name';
        
        const params = req.query.category ? [req.query.category] : [];
        const [medicines] = await connection.execute(query, params);
        
        await connection.end();

        // Wrap the medicines array in an object with 'medicines' property
        res.json({
            medicines: medicines.map(medicine => ({
                ...medicine,
                quantity: parseInt(medicine.quantity) || 0,
                price: parseFloat(medicine.price),
                discount_percentage: parseInt(medicine.discount_percentage) || 0
            }))
        });
    } catch (error) {
        console.error('Error fetching medicines:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Orders endpoint
app.post('/api/orders', (req, res) => {
    try {
        console.log('Received order request body:', req.body);
        
        const order = req.body;
        
        // Validate required fields
        if (!order.orderId || !order.userId || !order.items || !order.orderDate) {
            const missingFields = [];
            if (!order.orderId) missingFields.push('orderId');
            if (!order.userId) missingFields.push('userId');
            if (!order.items) missingFields.push('items');
            if (!order.orderDate) missingFields.push('orderDate');
            
            console.error('Missing required fields:', missingFields);
            return res.status(400).json({ 
                success: false,
                error: `Missing required fields: ${missingFields.join(', ')}` 
            });
        }

        // Ensure items is properly stringified
        let itemsString;
        try {
            itemsString = typeof order.items === 'string' ? order.items : JSON.stringify(order.items);
            // Validate that it's proper JSON by parsing it
            JSON.parse(itemsString);
        } catch (error) {
            console.error('Invalid items format:', error);
            return res.status(400).json({
                success: false,
                error: 'Invalid items format'
            });
        }

        // Insert order into database
        const insertQuery = `
            INSERT INTO orders (orderId, userId, items, subtotal, discount, total, orderDate, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const queryParams = [
            order.orderId,
            order.userId,
            itemsString,
            parseFloat(order.subtotal),
            parseFloat(order.discount),
            parseFloat(order.total),
            order.orderDate,
            order.status || 'Completed'
        ];

        console.log('Query parameters:', queryParams);

        db.query(insertQuery, queryParams, (err, result) => {
            if (err) {
                console.error('Database error creating order:', {
                    error: err.message,
                    code: err.code,
                    sqlState: err.sqlState,
                    sqlMessage: err.sqlMessage
                });
                return res.status(500).json({ 
                    success: false,
                    error: 'Error creating order',
                    details: err.message 
                });
            }

            console.log('Order created successfully:', {
                orderId: order.orderId,
                insertId: result.insertId
            });

            res.status(201).json({
                success: true,
                message: 'Order created successfully',
                orderId: order.orderId
            });
        });
    } catch (error) {
        console.error('Server error in /api/orders:', {
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({ 
            success: false,
            error: 'Internal server error',
            details: error.message
        });
    }
});

// Endpoint to fetch user orders
app.get('/api/orders/:userId', (req, res) => {
    try {
        const userId = req.params.userId;
        
        const query = `
            SELECT 
                orderId,
                userId,
                items,
                subtotal,
                discount,
                total,
                DATE_FORMAT(orderDate, '%Y-%m-%d %H:%i:%s') as orderDate,
                status,
                DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at
            FROM orders 
            WHERE userId = ? 
            ORDER BY orderDate DESC
        `;

        db.query(query, [userId], (err, results) => {
            if (err) {
                console.error('Error fetching orders:', err);
                return res.status(500).json({ 
                    success: false, 
                    error: 'Error fetching orders' 
                });
            }

            // Parse the JSON items string for each order
            const orders = results.map(order => {
                try {
                    // If items is already an object, return as is
                    if (typeof order.items === 'object') {
                        return order;
                    }
                    // Try to parse the items string
                    const parsedItems = JSON.parse(order.items);
                    return {
                        ...order,
                        items: parsedItems
                    };
                } catch (error) {
                    console.error(`Error parsing items for order: ${order.orderId}`, error);
                    return {
                        ...order,
                        items: [] // Return empty array if parsing fails
                    };
                }
            });

            res.json({
                success: true,
                orders: orders
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error' 
        });
    }
});

// Employee Login endpoint
app.post('/api/employee/login', async (req, res) => {
    console.log('Received login request:', req.body); // Debug log

    const { email, password } = req.body;

    // Check if required fields are present
    if (!email || !password) {
        console.log('Missing required fields:', { email: !!email, password: !!password });
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const connection = await mysql2.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Sairevanth@12',
            database: 'medimart'
        });

        // Query to find the employee by email
        const [rows] = await connection.execute(
            'SELECT * FROM employee WHERE email = ?', 
            [email]
        );

        if (rows.length === 0) {
            console.log('No employee found with email:', email);
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const employee = rows[0];
        
        // Compare passwords
        if (employee.password !== password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        await connection.end();
        res.json({ 
            message: 'Login successful!',
            employee: {
                id: employee.id,
                firstName: employee.firstName,
                lastName: employee.lastName,
                email: employee.email
            }
        });

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin Registration endpoint
app.post('/api/admin/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        const connection = await mysql2.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Sairevanth@12',
            database: 'medimart'
        });

        // First check if any admin exists
        const [existingAdmins] = await connection.execute('SELECT * FROM admin');
        
        if (existingAdmins.length > 0) {
            await connection.end();
            return res.status(400).json({ 
                error: 'Admin already exists. Please login instead.',
                shouldLogin: true
            });
        }

        // If no admin exists, create the first admin
        // Insert into employee table
        await connection.execute(
            'INSERT INTO employee (firstName, lastName, email, password) VALUES (?, ?, ?, ?)',
            [firstName, lastName, email, password]
        );

        // Insert into admin table
        await connection.execute(
            'INSERT INTO admin (firstName, lastName, email, password) VALUES (?, ?, ?, ?)',
            [firstName, lastName, email, password]
        );

        await connection.end();
        
        res.json({ 
            message: 'Admin registered successfully',
            admin: {
                firstName,
                lastName,
                email,
                isAdmin: true
            }
        });

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin Login endpoint
app.post('/api/admin/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const connection = await mysql2.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Sairevanth@12',
            database: 'medimart'
        });

        // Check admin credentials
        const [admins] = await connection.execute(
            'SELECT * FROM admin WHERE email = ? AND password = ?',
            [email, password]
        );

        if (admins.length === 0) {
            await connection.end();
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const admin = admins[0];

        // Get dashboard data using the existing orders table
        const [totalOrders] = await connection.execute('SELECT COUNT(*) as count FROM orders');
        const [totalAmount] = await connection.execute('SELECT SUM(total) as total FROM orders');
        const [recentOrders] = await connection.execute('SELECT * FROM orders ORDER BY userId DESC LIMIT 5');

        await connection.end();

        res.json({ 
            message: 'Login successful',
            admin: {
                id: admin.id,
                firstName: admin.firstName,
                lastName: admin.lastName,
                email: admin.email,
                isAdmin: true
            },
            dashboardData: {
                totalOrders: totalOrders[0].count,
                totalSales: totalAmount[0].total || 0,
                recentOrders: recentOrders
            }
        });

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// General dashboard stats endpoint
app.get('/api/dashboard-stats', async (req, res) => {
    try {
        const connection = await mysql2.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Sairevanth@12',
            database: 'medimart'
        });

        // Get total customers
        const [customers] = await connection.execute('SELECT COUNT(*) as count FROM customers');
        
        // Get total orders for today
        const [orders] = await connection.execute(
            'SELECT COUNT(*) as count, SUM(total) as total FROM orders WHERE DATE(userId) = CURDATE()'
        );

        // Get medicines in stock
        const [medicines] = await connection.execute('SELECT COUNT(*) as count FROM medicines');

        // Get employees count
        const [employees] = await connection.execute('SELECT COUNT(*) as count FROM employee');

        await connection.end();

        res.json({
            totalCustomers: customers[0].count,
            totalEmployees: employees[0].count,
            medicinesInStock: medicines[0].count,
            totalSuppliers: '25', // Add suppliers table and query if available
            salesToday: orders[0].total || 0,
            purchasesToday: '42300' // Add purchases table and query if available
        });

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin dashboard data endpoint
app.get('/api/admin/dashboard-data', async (req, res) => {
    try {
        const connection = await mysql2.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Sairevanth@12',
            database: 'medimart'
        });

        // Get today's orders and total amount
        const [todayOrders] = await connection.execute(`
            SELECT 
                COUNT(*) as count,
                COALESCE(SUM(total), 0) as totalAmount
            FROM orders 
            WHERE DATE(orderDate) = CURDATE()`
        );

        // Get all time total orders and amount
        const [allOrders] = await connection.execute(`
            SELECT 
                COUNT(*) as count,
                COALESCE(SUM(total), 0) as totalAmount
            FROM orders`
        );

        // Get recent orders with details
        const [recentOrders] = await connection.execute(`
            SELECT 
                orderId,
                userId,
                items,
                subtotal,
                discount,
                total,
                orderDate,
                status
            FROM orders 
            ORDER BY orderDate DESC 
            LIMIT 5`
        );

        // Get other counts
        const [medicineCount] = await connection.execute('SELECT COUNT(*) as count FROM medicines');
        const [customerCount] = await connection.execute('SELECT COUNT(*) as count FROM customers');
        const [employeeCount] = await connection.execute('SELECT COUNT(*) as count FROM employee');

        await connection.end();

        // Process recent orders without trying to parse items again
        const processedRecentOrders = recentOrders.map(order => ({
            ...order,
            // items is already an object, no need to parse
            items: order.items,
            orderDate: new Date(order.orderDate).toLocaleString()
        }));

        res.json({
            medicinesInStock: medicineCount[0].count || 0,
            salesToday: todayOrders[0].totalAmount || 0,
            totalCustomers: customerCount[0].count || 0,
            activeEmployees: employeeCount[0].count || 0,
            totalSuppliers: 18,
            ordersToday: todayOrders[0].count || 0,
            totalSales: allOrders[0].totalAmount || 0,
            recentOrders: processedRecentOrders
        });

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start server with error handling
app.listen(port, '0.0.0.0', (err) => {
    if (err) {
        console.error('Error starting server:', err);
        return;
    }
    console.log(`Server running on http://localhost:${port}`);})

// Add Employee endpoint
app.post('/api/employee', async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;
        
        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const connection = await mysql2.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Sairevanth@12',
            database: 'medimart'
        });

        // Check if email already exists
        const [existingEmployee] = await connection.execute(
            'SELECT * FROM employee WHERE email = ?',
            [email]
        );

        if (existingEmployee.length > 0) {
            await connection.end();
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Insert new employee
        const [result] = await connection.execute(
            'INSERT INTO employee (firstName, lastName, email, password, role) VALUES (?, ?, ?, ?, ?)',
            [firstName, lastName, email, hashedPassword, role]
        );

        await connection.end();

        res.status(201).json({
            success: true,
            message: 'Employee added successfully',
            employeeId: result.insertId
        });

    } catch (error) {
        console.error('Error adding employee:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add employee'
        });
    }
});

// Add Medicine endpoint
app.post('/api/medicines', async (req, res) => {
    try {
        const { 
            name, 
            description, 
            price, 
            category, 
            image_url, 
            discount_percentage, 
            quantity 
        } = req.body;

        const connection = await mysql2.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Sairevanth@12',
            database: 'medimart'
        });

        // Check if medicine already exists
        const [existingMedicine] = await connection.execute(
            'SELECT * FROM medicines WHERE name = ?',
            [name]
        );

        if (existingMedicine.length > 0) {
            // Update quantity and stock status if medicine exists
            const newQuantity = existingMedicine[0].quantity + parseInt(quantity);
            const stock_status = newQuantity > 10 ? 'In Stock' : newQuantity > 0 ? 'Low Stock' : 'Out of Stock';
            
            await connection.execute(
                'UPDATE medicines SET quantity = ?, stock_status = ? WHERE name = ?',
                [newQuantity, stock_status, name]
            );

            await connection.end();
            return res.status(200).json({
                success: true,
                message: 'Medicine quantity updated successfully',
                medicine: {
                    ...existingMedicine[0],
                    quantity: newQuantity,
                    stock_status
                }
            });
        }

        // Set initial stock status based on quantity
        const stock_status = quantity > 10 ? 'In Stock' : quantity > 0 ? 'Low Stock' : 'Out of Stock';

        // Insert new medicine if it doesn't exist
        const [result] = await connection.execute(
            'INSERT INTO medicines (name, description, price, category, stock_status, image_url, discount_percentage, quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name, description, price, category, stock_status, image_url || null, discount_percentage || 0, quantity]
        );

        await connection.end();

        res.status(201).json({
            success: true,
            message: 'Medicine added successfully',
            medicineId: result.insertId
        });

    } catch (error) {
        console.error('Error adding medicine:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add medicine'
        });
    }
});

// Add this endpoint to check existing medicine
app.get('/api/medicines/check/:name', async (req, res) => {
    try {
        const connection = await mysql2.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Sairevanth@12',
            database: 'medimart'
        });

        const [medicines] = await connection.execute(
            'SELECT * FROM medicines WHERE name = ?',
            [req.params.name]
        );

        await connection.end();

        if (medicines && medicines.length > 0) {
            const medicine = medicines[0];
            res.json({
                exists: true,
                medicine: {
                    id: medicine.id,
                    name: medicine.name,
                    category: medicine.category,
                    price: medicine.price,
                    quantity: parseInt(medicine.quantity) || 0,
                    description: medicine.description,
                    stock_status: medicine.stock_status,
                    discount_percentage: medicine.discount_percentage
                }
            });
        } else {
            res.json({ exists: false, medicine: null });
        }
    } catch (error) {
        console.error('Error checking medicine:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});