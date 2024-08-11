const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');
require('dotenv').config();

const app = express();
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/files', require('./routes/fileRoutes'));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'file-transfer-client', 'build')));

// The "catchall" handler: for any request that doesn't match one of your API routes, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'file-transfer-client', 'build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
