import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, googleProvider } from '../components/firebase';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import RegisterFragment from '../fragments/RegisterFragment';

// MUI Imports
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

// LOGO imports
import ImageButton from '../components/ImageButton';
import LoginImage from '../assets/images/farm_image.jpg'; // Replace with your agriculture-themed image

const Login = () => {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    const theme = useTheme();
    const [showRegistration, setShowRegistrationFragment] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // Handle login errors


    const handleCloseRegister = () => {
        setShowRegistrationFragment(false);
    };

    const handleRegister = () => {
        setShowRegistrationFragment(true);
    };

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            navigate('/home');
        } catch (err) {
            console.log(err);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // Reset error state

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/home');
        } catch (err) {
            setError(err.message); // Display error message
        }
    };

    if (loading) return <div>Loading...</div>;
    if (user) navigate('/home');

    return (
        <div style={{ display: 'flex', height: '100vh' ,   backgroundColor: '#f0f4c3'}}>
            {/* Left side agriculture-themed image */}
           
                <div style={{
                    flex: 0.8,
                    background: `url(${LoginImage}) no-repeat center center`,
                    backgroundSize: 'cover',
                    borderRadius: '10px',
                    marginTop: '10px',
                    marginBottom: '10px',
                    marginLeft:'30px'
                }}></div>
           
            {/* Right side login card */}
            <div style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backdropFilter: 'blur(5px)',
                borderRadius: '20px',
            }}>
                <Card sx={{ maxWidth: 500, width: '100%',  maxHeight: 1000 , backgroundColor: 'rgba(255, 255, 255, 0.5)', border: '2px solid #8bc34a'}} elevation={3}>
                    <CardContent>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Stack marginTop={2}>
                                {/* project logo goes here */}
                            </Stack>

                            <Typography variant="h2" gutterBottom marginTop={3} color="#4caf50">
                                Login
                            </Typography>

                            <Box
                                component="form"
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                    width: "100%",
                                    maxWidth: "25ch",
                                }}
                                noValidate
                                autoComplete="off"
                            >
                                <TextField
                                    id="outlined-basic"
                                    label="Email"
                                    variant="outlined"
                                    onChange={(e) => setEmail(e.target.value)}
                                    sx={{ marginBottom: 2 }}
                                />
                                <TextField
                                    id="outlined-basic"
                                    type="password"
                                    label="Password"
                                    variant="outlined"
                                    onChange={(e) => setPassword(e.target.value)}
                                    sx={{ marginBottom: 2 }}
                                />
                                <Button
                                    variant="contained"
                                    sx={{ width: "50%", alignSelf: "center", backgroundColor: '#8bc34a' }}
                                    onClick={handleLogin}
                                >
                                    Login
                                </Button>
                                <Button
                                    variant="text"
                                    sx={{ marginBottom: '12px', color: '#4caf50' }}
                                    onClick={handleRegister}
                                >
                                    New User Register
                                </Button>
                            </Box>

                            <Divider />

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: "center" }}>
                                <Divider />
                                <div>
                                    <ImageButton
                                        onClick={signInWithGoogle}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {showRegistration && <RegisterFragment open={showRegistration} handleClose={handleCloseRegister} />}
            </div>
        </div>
    );
};

export default Login;
