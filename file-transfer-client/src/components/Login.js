// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { Container, TextField, Button, Typography, Box } from '@mui/material';

// const Login = ({ setUser }) => {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const navigate = useNavigate();

//   const onChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('http://localhost:5000/api/auth/login', formData);
//       localStorage.setItem('token', res.data.token);
//       setUser(res.data.user);
//       navigate('/');
//     } catch (err) {
//       console.error(err.response.data);
//       alert('Login failed: ' + (err.response.data.msg || 'An error occurred'));
//     }
//   };

//   return (
//     <Container component="main" maxWidth="xs">
//       <Box
//         sx={{
//           marginTop: 8,
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//         }}
//       >
//         <Typography component="h1" variant="h5">
//           Sign in
//         </Typography>
//         <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             id="email"
//             label="Email Address"
//             name="email"
//             autoComplete="email"
//             autoFocus
//             value={formData.email}
//             onChange={onChange}
//           />
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             name="password"
//             label="Password"
//             type="password"
//             id="password"
//             autoComplete="current-password"
//             value={formData.password}
//             onChange={onChange}
//           />
//           <Button
//             type="submit"
//             fullWidth
//             variant="contained"
//             sx={{ mt: 3, mb: 2 }}
//           >
//             Sign In
//           </Button>
//         </Box>
//         <Button onClick={() => navigate('/register')}>Don't have an account? Register</Button>
//       </Box>
//     </Container>
//   );
// };

// export default Login;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Form data:', formData);
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      alert('Login successful');
      navigate('/');  // Redirect to home
    } catch (err) {
      console.error('Login error:', err.response.data);
      alert('Login failed: ' + (err.response.data.msg || 'An error occurred'));
    }
  };
  

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={onChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={onChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
        <Button onClick={() => navigate('/register')}>Don't have an account? Register</Button>
      </Box>
    </Container>
  );
};

export default Login;
