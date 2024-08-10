// // // // const bcrypt = require('bcryptjs');
// // // // const jwt = require('jsonwebtoken');
// // // // const User = require('../models/User');

// // // // exports.register = async (req, res) => {
// // // //   const { username, email, password } = req.body;

// // // //   try {
// // // //     let user = await User.findOne({ email });
// // // //     if (user) {
// // // //       return res.status(400).json({ msg: 'User already exists' });
// // // //     }

// // // //     user = new User({ username, email, password });

// // // //     const salt = await bcrypt.genSalt(10);
// // // //     user.password = await bcrypt.hash(password, salt);

// // // //     await user.save();

// // // //     const payload = {
// // // //       user: {
// // // //         id: user.id,
// // // //       },
// // // //     };

// // // //     jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' }, (err, token) => {
// // // //       if (err) throw err;
// // // //       res.json({ token, user: { email: user.email, id: user.id } });
// // // //     });
// // // //   } catch (error) {
// // // //     console.error(error.message);
// // // //     res.status(500).send('Server error');
// // // //   }
// // // // };

// // // // exports.login = async (req, res) => {
// // // //   const { email, password } = req.body;

// // // //   try {
// // // //     let user = await User.findOne({ email });
// // // //     if (!user) {
// // // //       return res.status(400).json({ msg: 'Invalid credentials' });
// // // //     }

// // // //     const isMatch = await bcrypt.compare(password, user.password);
// // // //     if (!isMatch) {
// // // //       return res.status(400).json({ msg: 'Invalid credentials' });
// // // //     }

// // // //     const payload = {
// // // //       user: {
// // // //         id: user.id,
// // // //       },
// // // //     };

// // // //     jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' }, (err, token) => {
// // // //       if (err) throw err;
// // // //       res.json({ token, user: { email: user.email, id: user.id } });
// // // //     });
// // // //   } catch (error) {
// // // //     console.error(error.message);
// // // //     res.status(500).send('Server error');
// // // //   }
// // // // };

// // // // exports.getMe = async (req, res) => {
// // // //   try {
// // // //     const user = await User.findById(req.user.id).select('-password');
// // // //     res.json(user);
// // // //   } catch (error) {
// // // //     console.error(error.message);
// // // //     res.status(500).send('Server error');
// // // //   }
// // // // };


// // // // Function to send email
// // // // const sendEmail = async (email, subject, text) => {
// // // //   try {
// // // //     const transporter = nodemailer.createTransport({
// // // //       service: 'Gmail',
// // // //       auth: {
// // // //         user: 'varshareddy2k@gmail.com ',
// // // //         pass: 'bkhf budc ylii hisn',  // Use an app-specific password if 2FA is enabled
// // // //       },
// // // //     });

// // // //     await transporter.sendMail({
// // // //       from: 'varshareddy2k@gmail.com',
// // // //       to: email,
// // // //       subject: subject,
// // // //       text: text,
// // // //     });

// // // //     console.log('Email sent successfully');
// // // //   } catch (error) {
// // // //     console.error('Email not sent', error);
// // // //   }
// // // // };

// // // // gofb bbxw zlnt olju

// // // const nodemailer = require('nodemailer');
// // // const jwt = require('jsonwebtoken');
// // // const bcrypt = require('bcryptjs');
// // // const User = require('../models/User');
// // // const Token = require('../models/Token');

// // // // Function to send email
// // // const sendEmail = async (email, subject, text) => {
// // //   try {
// // //     const transporter = nodemailer.createTransport({
// // //       service: 'Gmail',
// // //       auth: {
// // //         user: process.env.EMAIL_USER,
// // //         pass: process.env.EMAIL_PASS,
// // //       },
// // //     });

// // //     await transporter.sendMail({
// // //       from: process.env.EMAIL_USER,
// // //       to: email,
// // //       subject: subject,
// // //       text: text,
// // //     });
// // //     console.log('Email sent successfully to', email);
// // //   } catch (error) {
// // //     console.error('Email not sent', error);
// // //   }
// // // };

// // // // Register new user
// // // exports.registerUser = async (req, res) => {
// // //   const { username, email, password } = req.body;

// // //   try {
// // //     let user = await User.findOne({ email });

// // //     if (user) {
// // //       return res.status(400).json({ msg: 'User already exists' });
// // //     }

// // //     user = new User({
// // //       username,
// // //       email,
// // //       password,
// // //     });

// // //     const salt = await bcrypt.genSalt(10);
// // //     user.password = await bcrypt.hash(password, salt);

// // //     await user.save();

// // //     const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, {
// // //       expiresIn: 360000,
// // //     });

// // //     // Create a verification token
// // //     const verificationToken = new Token({
// // //       userId: user._id,
// // //       token: jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: '1d' }),
// // //     });

// // //     await verificationToken.save();

// // //     // Send verification email
// // //     const verificationLink = `http://localhost:3000/verify/${verificationToken.token}`;
// // //     await sendEmail(
// // //       user.email,
// // //       'Email Verification',
// // //       `Please verify your email by clicking the following link: ${verificationLink}`
// // //     );

// // //     res.status(200).json({ token });
// // //   } catch (err) {
// // //     console.error('Error during user registration:', err.message);
// // //     res.status(500).json({ msg: 'Server error' });
// // //   }
// // // };

// // // // Verify email
// // // exports.verifyEmail = async (req, res) => {
// // //   try {
// // //     const token = req.params.token;
// // //     console.log('Token received:', token);
// // //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// // //     console.log('Token decoded:', decoded);
// // //     const userId = decoded.user.id;

// // //     const user = await User.findById(userId);
// // //     console.log('User found:', user);
// // //     if (!user) {
// // //       return res.status(400).json({ msg: 'Invalid token' });
// // //     }

// // //     user.isVerified = true;
// // //     await user.save();
// // //     console.log('User verified:', user);

// // //     res.status(200).json({ msg: 'Email verified successfully' });
// // //   } catch (err) {
// // //     console.error('Error during email verification:', err.message);
// // //     res.status(500).json({ msg: 'Server error' });
// // //   }
// // // };

// // // // Login user
// // // exports.loginUser = async (req, res) => {
// // //   const { email, password } = req.body;

// // //   try {
// // //     let user = await User.findOne({ email });
// // //     console.log('User found:', user);

// // //     if (!user) {
// // //       return res.status(400).json({ msg: 'Invalid credentials' });
// // //     }

// // //     const isMatch = await bcrypt.compare(password, user.password);
// // //     console.log('Password match:', isMatch);

// // //     if (!isMatch) {
// // //       return res.status(400).json({ msg: 'Invalid credentials' });
// // //     }

// // //     if (!user.isVerified) {
// // //       return res.status(400).json({ msg: 'Email not verified' });
// // //     }

// // //     const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, {
// // //       expiresIn: 360000,
// // //     });

// // //     res.json({ token });
// // //   } catch (err) {
// // //     console.error('Error during user login:', err.message);
// // //     res.status(500).json({ msg: 'Server error' });
// // //   }
// // // };


// // // // Get authenticated user's data
// // // exports.getAuthUser = async (req, res) => {
// // //   try {
// // //     const user = await User.findById(req.user.id).select('-password');
// // //     res.json(user);
// // //   } catch (err) {
// // //     console.error('Error fetching authenticated user data:', err.message);
// // //     res.status(500).json({ msg: 'Server error' });
// // //   }
// // // };


// // // const nodemailer = require('nodemailer');
// // // const jwt = require('jsonwebtoken');
// // // const bcrypt = require('bcryptjs');
// // // const User = require('../models/User');
// // // const Token = require('../models/Token');

// // // // Function to send email
// // // const sendEmail = async (email, subject, text) => {
// // //   try {
// // //     const transporter = nodemailer.createTransport({
// // //       service: 'Gmail',
// // //       auth: {
// // //         user: process.env.EMAIL_USER,
// // //         pass: process.env.EMAIL_PASS,
// // //       },
// // //     });

// // //     await transporter.sendMail({
// // //       from: process.env.EMAIL_USER,
// // //       to: email,
// // //       subject: subject,
// // //       text: text,
// // //     });
// // //     console.log('Email sent successfully to', email);
// // //   } catch (error) {
// // //     console.error('Email not sent', error);
// // //   }
// // // };

// // // // Register new user
// // // exports.registerUser = async (req, res) => {
// // //   const { username, email, password } = req.body;

// // //   try {
// // //     let user = await User.findOne({ email });

// // //     if (user) {
// // //       return res.status(400).json({ msg: 'User already exists' });
// // //     }

// // //     const salt = await bcrypt.genSalt(10);
// // //     const hashedPassword = await bcrypt.hash(password, salt);

// // //     user = new User({
// // //       username,
// // //       email,
// // //       password: hashedPassword,
// // //     });

// // //     await user.save();

// // //     const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, {
// // //       expiresIn: 360000,
// // //     });

// // //     // Create a verification token
// // //     const verificationToken = new Token({
// // //       userId: user._id,
// // //       token: jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: '1d' }),
// // //     });

// // //     await verificationToken.save();

// // //     // Send verification email
// // //     const verificationLink = `http://localhost:5000/api/auth/verify/${verificationToken.token}`;
// // //     await sendEmail(
// // //       user.email,
// // //       'Email Verification',
// // //       `Please verify your email by clicking the following link: ${verificationLink}`
// // //     );

// // //     res.status(200).json({ token });
// // //   } catch (err) {
// // //     console.error('Error during user registration:', err.message);
// // //     res.status(500).json({ msg: 'Server error' });
// // //   }
// // // };

// // // // Verify email
// // // exports.verifyEmail = async (req, res) => {
// // //   try {
// // //     const token = req.params.token;
// // //     console.log('Token received:', token);
// // //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// // //     console.log('Token decoded:', decoded);
// // //     const userId = decoded.user.id;

// // //     const user = await User.findById(userId);
// // //     console.log('User found:', user);
// // //     if (!user) {
// // //       return res.status(400).json({ msg: 'Invalid token' });
// // //     }

// // //     user.isVerified = true;
// // //     await user.save();
// // //     console.log('User verified:', user);

// // //     res.status(200).json({ msg: 'Email verified successfully' });
// // //   } catch (err) {
// // //     console.error('Error during email verification:', err.message);
// // //     res.status(500).json({ msg: 'Server error' });
// // //   }
// // // };

// // // // Login user
// // // exports.loginUser = async (req, res) => {
// // //   const { email, password } = req.body;

// // //   try {
// // //     let user = await User.findOne({ email });
// // //     console.log('User found:', user);

// // //     if (!user) {
// // //       return res.status(400).json({ msg: 'Invalid credentials' });
// // //     }

// // //     const isMatch = await bcrypt.compare(password, user.password);
// // //     console.log('Password match:', isMatch);

// // //     if (!isMatch) {
// // //       return res.status(400).json({ msg: 'Invalid credentials' });
// // //     }

// // //     if (!user.isVerified) {
// // //       return res.status(400).json({ msg: 'Email not verified' });
// // //     }

// // //     const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, {
// // //       expiresIn: 360000,
// // //     });

// // //     res.json({ token });
// // //   } catch (err) {
// // //     console.error('Error during user login:', err.message);
// // //     res.status(500).json({ msg: 'Server error' });
// // //   }
// // // };

// // // // Get authenticated user's data
// // // exports.getAuthUser = async (req, res) => {
// // //   try {
// // //     const user = await User.findById(req.user.id).select('-password');
// // //     res.json(user);
// // //   } catch (err) {
// // //     console.error('Error fetching authenticated user data:', err.message);
// // //     res.status(500).json({ msg: 'Server error' });
// // //   }
// // // };

// // const nodemailer = require('nodemailer');
// // const jwt = require('jsonwebtoken');
// // const bcrypt = require('bcryptjs');
// // const User = require('../models/User');
// // const Token = require('../models/Token');

// // // Function to send email
// // const sendEmail = async (email, subject, text) => {
// //   try {
// //     const transporter = nodemailer.createTransport({
// //       service: 'Gmail',
// //       auth: {
// //         user: process.env.EMAIL_USER,
// //         pass: process.env.EMAIL_PASS,
// //       },
// //     });

// //     await transporter.sendMail({
// //       from: process.env.EMAIL_USER,
// //       to: email,
// //       subject: subject,
// //       text: text,
// //     });
// //     console.log('Email sent successfully to', email);
// //   } catch (error) {
// //     console.error('Email not sent', error);
// //   }
// // };

// // // Register new user
// // exports.registerUser = async (req, res) => {
// //   const { username, email, password } = req.body;

// //   try {
// //     let user = await User.findOne({ email });

// //     if (user) {
// //       return res.status(400).json({ msg: 'User already exists' });
// //     }

// //     const salt = await bcrypt.genSalt(10);
// //     const hashedPassword = await bcrypt.hash(password, salt);

// //     console.log('Salt rounds:', 10);
// //     console.log('Original password:', password);
// //     console.log('Hashed password:', hashedPassword);

// //     user = new User({
// //       username,
// //       email,
// //       password: hashedPassword,
// //     });

// //     await user.save();

// //     const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, {
// //       expiresIn: 360000,
// //     });

// //     // Create a verification token
// //     const verificationToken = new Token({
// //       userId: user._id,
// //       token: jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: '1d' }),
// //     });

// //     await verificationToken.save();

// //     // Send verification email
// //     const verificationLink = `http://localhost:5000/api/auth/verify/${verificationToken.token}`;
// //     await sendEmail(
// //       user.email,
// //       'Email Verification',
// //       `Please verify your email by clicking the following link: ${verificationLink}`
// //     );

// //     res.status(200).json({ token });
// //   } catch (err) {
// //     console.error('Error during user registration:', err.message);
// //     res.status(500).json({ msg: 'Server error' });
// //   }
// // };


// // // Verify email
// // exports.verifyEmail = async (req, res) => {
// //   try {
// //     const token = req.params.token;
// //     console.log('Token received:', token);
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //     console.log('Token decoded:', decoded);
// //     const userId = decoded.user.id;

// //     const user = await User.findById(userId);
// //     console.log('User found:', user);
// //     if (!user) {
// //       return res.status(400).json({ msg: 'Invalid token' });
// //     }

// //     user.isVerified = true;
// //     await user.save();
// //     console.log('User verified:', user);

// //     res.status(200).json({ msg: 'Email verified successfully' });
// //   } catch (err) {
// //     console.error('Error during email verification:', err.message);
// //     res.status(500).json({ msg: 'Server error' });
// //   }
// // };

// // exports.loginUser = async (req, res) => {
// //   const { email, password } = req.body;

// //   try {
// //     let user = await User.findOne({ email });
// //     console.log('User found:', user);

// //     if (!user) {
// //       return res.status(400).json({ msg: 'Invalid credentials' });
// //     }

// //     console.log('Password entered:', password);
// //     console.log('Hashed password from database:', user.password);

// //     const isMatch = await bcrypt.compare(password, user.password);
// //     console.log('Password match:', isMatch);

// //     if (!isMatch) {
// //       return res.status(400).json({ msg: 'Invalid credentials' });
// //     }

// //     if (!user.isVerified) {
// //       return res.status(400).json({ msg: 'Email not verified' });
// //     }

// //     const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, {
// //       expiresIn: 360000,
// //     });

// //     res.json({ token });
// //   } catch (err) {
// //     console.error('Error during user login:', err.message);
// //     res.status(500).json({ msg: 'Server error' });
// //   }
// // };


// // // Get authenticated user's data
// // exports.getAuthUser = async (req, res) => {
// //   try {
// //     const user = await User.findById(req.user.id).select('-password');
// //     res.json(user);
// //   } catch (err) {
// //     console.error('Error fetching authenticated user data:', err.message);
// //     res.status(500).json({ msg: 'Server error' });
// //   }
// // };


// const nodemailer = require('nodemailer');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const User = require('../models/User');
// const Token = require('../models/Token');

// // Function to send email
// const sendEmail = async (email, subject, text) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: 'Gmail',
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: subject,
//       text: text,
//     });
//     console.log('Email sent successfully to', email);
//   } catch (error) {
//     console.error('Email not sent', error);
//   }
// };

// // Register new user
// exports.registerUser = async (req, res) => {
//   const { username, email, password } = req.body;

//   try {
//     let user = await User.findOne({ email });

//     if (user) {
//       return res.status(400).json({ msg: 'User already exists' });
//     }

    
//     user = new User({
//       username,
//       email,
//       password: password,
//     });

//     await user.save();

//     const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, {
//       expiresIn: 360000,
//     });

//     const verificationToken = new Token({
//       userId: user._id,
//       token: jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: '1d' }),
//     });

//     await verificationToken.save();

//     const verificationLink = `http://localhost:5000/api/auth/verify/${verificationToken.token}`;
//     await sendEmail(
//       user.email,
//       'Email Verification',
//       `Please verify your email by clicking the following link: ${verificationLink}`
//     );

//     res.status(200).json({ token });
//   } catch (err) {
//     console.error('Error during user registration:', err.message);
//     res.status(500).json({ msg: 'Server error' });
//   }
// };

// // Verify email
// exports.verifyEmail = async (req, res) => {
//   try {
//     const token = req.params.token;
//     console.log('Token received:', token);
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log('Token decoded:', decoded);
//     const userId = decoded.user.id;

//     const user = await User.findById(userId);
//     console.log('User found:', user);
//     if (!user) {
//       return res.status(400).json({ msg: 'Invalid token' });
//     }

//     user.isVerified = true;
//     await user.save();
//     console.log('User verified:', user);

//     res.status(200).json({ msg: 'Email verified successfully' });
//   } catch (err) {
//     console.error('Error during email verification:', err.message);
//     res.status(500).json({ msg: 'Server error' });
//   }
// };

// // Login user
// exports.loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     let user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ msg: 'Invalid credentials' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(400).json({ msg: 'Invalid credentials' });
//     }

//     sendToken(user, res);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// };

// // Get authenticated user's data
// exports.getAuthUser = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select('-password');
//     res.json(user);
//   } catch (err) {
//     console.error('Error fetching authenticated user data:', err.message);
//     res.status(500).json({ msg: 'Server error' });
//   }
// };

const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Token = require('../models/Token');

// Function to send email
const sendEmail = async (email, subject, text) => {
  try {
    console.log("Sending email to:", email); // Debug
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      logger: true, // Enable debugging
      debug: true,  // Enable debugging
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      text: text,
    });
    console.log('Email sent successfully to', email);
  } catch (error) {
    console.error('Email not sent', error);
  }
};

// Function to send token
const sendToken = (user, res) => {
  const payload = {
    user: {
      id: user.id,
    },
  };

  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: 3600 }, // 1 hour
    (err, token) => {
      if (err) throw err;
      res.json({ token, user: { email: user.email, id: user.id } });
    }
  );
};

// Register new user
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      username,
      email,
      password,
    });

    await user.save();

    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, {
      expiresIn: 360000,
    });

    // Create a verification token
    const verificationToken = new Token({
      userId: user._id,
      token: jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: '1d' }),
    });

    await verificationToken.save();

    // Send verification email
    const verificationLink = `http://localhost:5000/api/auth/verify/${verificationToken.token}`;
    await sendEmail(
      user.email,
      'Email Verification',
      `Please verify your email by clicking the following link: ${verificationLink}`
    );

    res.status(200).json({ token });
  } catch (err) {
    console.error('Error during user registration:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Verify email
exports.verifyEmail = async (req, res) => {
  try {
    const token = req.params.token;
    console.log('Token received:', token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded:', decoded);
    const userId = decoded.user.id;

    const user = await User.findById(userId);
    console.log('User found:', user);
    if (!user) {
      return res.status(400).json({ msg: 'Invalid token' });
    }

    user.isVerified = true;
    await user.save();
    console.log('User verified:', user);

    res.status(200).json({ msg: 'Email verified successfully' });
  } catch (err) {
    console.error('Error during email verification:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(400).json({ msg: 'Email not verified' });
    }

    sendToken(user, res);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get authenticated user's data
exports.getAuthUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error('Error fetching authenticated user data:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Log environment variables for debugging
console.log('Environment Variables:');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***' : 'undefined');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '***' : 'undefined');
