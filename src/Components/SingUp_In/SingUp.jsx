import { useState } from "react";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";



import { auth } from "../../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../../config/firebase";
import { doc,setDoc} from "firebase/firestore";


const defaultTheme = createTheme();

export default function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [userType, setUserType] = useState("vendor");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (userType === "admin") {
        try {
          setError(null);

            const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );

          const user = userCredential.user;
          console.log('Successfully signed up:', user);
          console.log('Successfully signed up:', user.uid);
          

    
          try {
            const userDocRef = doc(db, 'admin', user.uid);
            await setDoc(userDocRef, {
              name: name,
              phone: phone,
              email: email,
              type: "admin"
            });
    
            console.log('Document written with ID: ', user.uid);
          } catch (error) {
            console.error('Error adding/updating document: ', error);
          }
    
          localStorage.setItem('admin_email', email);
          localStorage.setItem('adminid', user.uid);
          navigate('/admin');
        } catch (error) {
          console.error('Error signing up:', error.message);
          setError(error.message);
        }
        // navigate("/admin");
      } 
      
      else {
        try {
          setError(null);

            const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );

          const user = userCredential.user;
          console.log('Successfully signed up:', user);
          console.log('Successfully signed up:', user.uid);
          

    
          try {
            const userDocRef = doc(db, 'vendor', user.uid);
            await setDoc(userDocRef, {
              name: name,
              phone: phone,
              email: email,
              profile:"",

              type: "vendor"
            });
    
            console.log('Document written with ID: ', user.uid);
          } catch (error) {
            console.error('Error adding/updating document: ', error);
          }
    
          localStorage.setItem('vendor_email', email);
          localStorage.setItem('vid', user.uid);
          navigate('/vendor');
        } catch (error) {
          console.error('Error signing up:', error.message);
          setError(error.message);
        }
        // navigate("/vendor");
      }
    } catch (err) {
      setError("Error signing up");
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="Name"
                  required
                  fullWidth
                  id="Name"
                  label="Name"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="phone"
                  label="Phone number"
                  name="phone"
                  autoComplete="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
            </Grid>
            <Typography variant="body1">User Type:</Typography>
            <div>
              <label>
                <input
                  type="radio"
                  value="admin"
                  checked={userType === "admin"}
                  onChange={() => setUserType("admin")}
                />
                Admin
              </label>
              <label style={{ marginLeft: "20px" }}>
                <input
                  type="radio"
                  value="vendor"
                  checked={userType === "vendor"}
                  onChange={() => setUserType("vendor")}
                />
                Vendor
              </label>
            </div>
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/signin" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
