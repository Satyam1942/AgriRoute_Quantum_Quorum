import React from 'react';
import { Button } from '@mui/material';
import GoogleLogo from '../assets/images/google_logo.png'; // Path to your Google logo image

const GoogleSignInButton = ({ onClick }) => {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      sx={{
        backgroundColor: '#8bc34a', // Google's blue color
        color: '#fff', // White text color
        width: '100%', // Full width button
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: 'none',
      }}
    >
      {/* Google logo inside the button */}
      <img
        src={GoogleLogo}
        alt="Google logo"
        style={{
          width: '20px',
          height: '20px',
          marginRight: '10px', // Space between logo and text
        }}
      />
      Sign in with Google
    </Button>
  );
};

export default GoogleSignInButton;
