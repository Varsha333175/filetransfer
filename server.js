// const express = require('express');
// const connectDB = require('./config/db');
// const cors = require('cors');
// const fileUpload = require('express-fileupload');

// const app = express();
// connectDB();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(fileUpload());

// // Routes
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/files', require('./routes/fileRoutes'));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const fileUpload = require('express-fileupload');
require('dotenv').config();

const app = express();
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/files', require('./routes/fileRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
