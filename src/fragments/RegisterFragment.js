import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


/***********FIREBASE IMPORTS******************* */
import { auth } from '../components/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';


//****************MUI Imports ******************* */
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';



const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));


export default function ProfileFragement({ open, handleClose }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            handleClose();  // Close the modal after registration
            navigate('/home'); // Redirect to home page
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <React.Fragment>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}

            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Register
                </DialogTitle>


                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>


                <DialogContent dividers >
                    <Box
                        component="form"
                        sx={{
                            display: "flex",
                            flexDirection: "column", // Aligns items vertically
                            gap: 3, // Adds spacing between elements
                            width: "100%", // Ensures proper width
                            maxWidth: "100ch", // Limits width for a compact form
                          }}
                        noValidate
                        autoComplete="off"
                    >
                      
                     
                        <TextField id="filled-basic" label="Email" variant="filled"   onChange={(e) => setEmail(e.target.value)}/>
                        <TextField id="filled-basic" type ='password'   label="Password" variant="filled"  onChange={(e) => setPassword(e.target.value)} />
                        <Button variant="contained" sx = {{ width: "50%", alignSelf: "center"}} onClick={handleRegister}>Register</Button>

                    </Box>
                </DialogContent>

            </BootstrapDialog>
        </React.Fragment>
    );
}
