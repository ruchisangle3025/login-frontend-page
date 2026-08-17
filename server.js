const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// ==========================================
// 1. DATABASE SETUP
// ==========================================
mongoose.connect('mongodb://127.0.0.1:27017/suvarnas_salon')
    .then(() => console.log('Connected to MongoDB: suvarnas_salon'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

const bookingSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    service: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true }
});
const Booking = mongoose.model('Booking', bookingSchema);

// ==========================================
// 2. BACKEND API ROUTES
// ==========================================
// Save a new booking
app.post('/api/bookings', async(req, res) => {
    try {
        const newBooking = new Booking(req.body);
        await newBooking.save();
        res.status(201).json({ message: 'Booking successfully saved!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save booking.' });
    }
});

// Fetch all bookings
app.get('/api/bookings', async(req, res) => {
    try {
        const bookings = await Booking.find().sort({ date: 1, time: 1 });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookings.' });
    }
});

// ==========================================
// 3. FRONTEND PAGES (Served via Express)
// ==========================================

// CUSTOMER BOOKING PAGE
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Suvarna's Beauty Salon</title>
        <style>
            :root { --primary: #d4af37; --secondary: #fff0f5; --dark: #333; }
            body { font-family: sans-serif; margin: 0; background: #fafafa; color: var(--dark); }
            header { background: var(--dark); color: var(--primary); text-align: center; padding: 2rem 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 2rem; }
            .hero { background: var(--secondary); padding: 2rem; text-align: center; border-radius: 10px; margin-bottom: 2rem; }
            form { background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .form-group { margin-bottom: 1.2rem; }
            label { display: block; margin-bottom: 0.5rem; font-weight: bold; }
            input, select { width: 100%; padding: 0.8rem; border: 1px solid #ccc; border-radius: 5px; box-sizing: border-box; }
            button { width: 100%; padding: 1rem; background: var(--primary); color: white; border: none; border-radius: 5px; font-weight: bold; cursor: pointer; }
            button:hover { background: #b5952f; }
            #message { margin-top: 1rem; text-align: center; font-weight: bold; }
            .success { color: green; } .error { color: red; }
        </style>
    </head>
    <body>
        <header>
            <h1>Suvarna's Beauty Salon</h1>
            <p>Enhancing Your Natural Glow</p>
        </header>
        <div class="container">
            <div class="hero">
                <h2>Book Your Appointment</h2>
            </div>
            <form id="bookingForm">
                <div class="form-group"><label>Full Name</label><input type="text" id="customerName" required></div>
                <div class="form-group"><label>Phone</label><input type="tel" id="phone" required></div>
                <div class="form-group"><label>Service</label>
                    <select id="service" required>
                        <option value="">-- Choose --</option>
                        <option value="Haircut & Styling">Haircut & Styling</option>
                        <option value="Bridal Makeup">Bridal Makeup</option>
                        <option value="Facial & Skincare">Facial & Skincare</option>
                    </select>
                </div>
                <div class="form-group"><label>Date</label><input type="date" id="date" required></div>
                <div class="form-group"><label>Time</label><input type="time" id="time" required></div>
                <button type="submit">Confirm Booking</button>
                <div id="message"></div>
            </form>
        </div>
        <script>
            document.getElementById('bookingForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const msg = document.getElementById('message');
                const data = {
                    customerName: document.getElementById('customerName').value,
                    phone: document.getElementById('phone').value,
                    service: document.getElementById('service').value,
                    date: document.getElementById('date').value,
                    time: document.getElementById('time').value
                };
                try {
                    const response = await fetch('/api/bookings', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                    const result = await response.json();
                    if (response.ok) {
                        msg.innerHTML = '<span class="success">' + result.message + '</span>';
                        document.getElementById('bookingForm').reset();
                    } else {
                        msg.innerHTML = '<span class="error">' + result.error + '</span>';
                    }
                } catch (err) {
                    msg.innerHTML = '<span class="error">Connection failed.</span>';
                }
            });
        </script>
    </body>
    </html>
    `);
});

// ADMIN DASHBOARD PAGE
app.get('/admin', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Dashboard</title>
        <style>
            :root { --primary: #d4af37; --dark: #333; }
            body { font-family: sans-serif; margin: 0; background: #f4f4f4; color: var(--dark); }
            header { background: var(--dark); color: var(--primary); text-align: center; padding: 1.5rem 0; }
            .container { max-width: 1000px; margin: 2rem auto; padding: 0 1rem; }
            table { width: 100%; background: white; border-collapse: collapse; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            th, td { padding: 1rem; text-align: left; border-bottom: 1px solid #ddd; }
            th { background: var(--primary); color: white; }
            tr:hover { background: #f9f9f9; }
        </style>
    </head>
    <body>
        <header><h2>Salon Admin Dashboard</h2></header>
        <div class="container">
            <table>
                <thead>
                    <tr><th>Name</th><th>Phone</th><th>Service</th><th>Date</th><th>Time</th></tr>
                </thead>
                <tbody id="bookingsTableBody">
                    <tr><td colspan="5">Loading...</td></tr>
                </tbody>
            </table>
        </div>
        <script>
            document.addEventListener('DOMContentLoaded', async () => {
                const tbody = document.getElementById('bookingsTableBody');
                try {
                    const res = await fetch('/api/bookings');
                    const bookings = await res.json();
                    
                    if (bookings.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No bookings yet.</td></tr>';
                        return;
                    }
                    
                    tbody.innerHTML = '';
                    bookings.forEach(b => {
                        tbody.innerHTML += '<tr>' +
                            '<td><strong>' + b.customerName + '</strong></td>' +
                            '<td>' + b.phone + '</td>' +
                            '<td>' + b.service + '</td>' +
                            '<td>' + b.date + '</td>' +
                            '<td>' + b.time + '</td>' +
                        '</tr>';
                    });
                } catch (err) {
                    tbody.innerHTML = '<tr><td colspan="5" style="color:red;text-align:center;">Error loading bookings.</td></tr>';
                }
            });
        </script>
    </body>
    </html>
    `);
});

// ==========================================
// 4. START SERVER
// ==========================================
app.listen(3000, () => {
    console.log('Server running!');
    console.log('👉 Customer Page: http://localhost:3000');
    console.log('👉 Admin Page: http://localhost:3000/admin');
});