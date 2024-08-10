// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Login from './components/Login';
// import Register from './components/Register';
// import FileExplorer from './components/FileExplorer';
// import axios from 'axios';
// import { CssBaseline } from '@mui/material';

// function App() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const fetchUser = async () => {
//       const token = localStorage.getItem('token');
//       if (token) {
//         try {
//           const response = await axios.get('http://localhost:5000/api/auth/me', {
//             headers: {
//               'x-auth-token': token,
//             },
//           });
//           setUser(response.data);
//         } catch (error) {
//           console.error(error);
//         }
//       }
//     };

//     fetchUser();
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     setUser(null);
//   };

//   return (
//     <Router>
//       <CssBaseline />
//       <Routes>
//         <Route path="/login" element={<Login setUser={setUser} />} />
//         <Route path="/register" element={<Register />} />
//         <Route
//           path="/"
//           element={user ? <FileExplorer onLogout={handleLogout} currentUser={user.email} /> : <Navigate to="/login" />}
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

// new ui updated
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import FileExplorer from './components/FileExplorer';
import axios from 'axios';
import { CssBaseline } from '@mui/material';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:5000/api/auth/me', {
            headers: {
              'x-auth-token': token,
            },
          });
          setUser(response.data);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <Router>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={user ? <FileExplorer onLogout={handleLogout} currentUser={user.email} /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
