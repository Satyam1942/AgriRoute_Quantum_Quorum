import React, { useEffect, useState } from 'react';
import { Container, TextField, Box} from '@mui/material';
import { useAuth } from './AuthProvider';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';

//----------ICONS and Animations--------------------//
import SendIcon from '@mui/icons-material/Send';
import '../animations.css'

//--------------CONSTANTS--------------//
const timeAlertDisplay = 3000;

//---FETCHING DATA LOGIC------------//
const fetchData = async (data) => {
    try {
        const response = await fetch('https://fake-news-detection-system-8gjm.onrender.com/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data }) // Data to be sent in the request body
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        console.log(responseData);
        return responseData;

    } catch (error) {
        console.error('Error:', error);
    }
};

//----------------MAIN FUNCTION------------//
export default function PromptMainUI() {
    const [prompt, setPrompt] = useState('');
    const [displaySuccessAlert, setDisplaySuccessAlert] = useState(false);
    const [displayFailureAlert, setDisplayFailureAlert] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (displaySuccessAlert) {
            const timer = setTimeout(() => {
                setDisplaySuccessAlert(false);
            }, timeAlertDisplay); // 5 seconds delay

            return () => clearTimeout(timer);
        }
    }, [displaySuccessAlert]);

    useEffect(() => {
        if (displayFailureAlert) {
            const timer = setTimeout(() => {
                setDisplayFailureAlert(false);
            }, timeAlertDisplay); // 5 seconds delay

            return () => clearTimeout(timer);
        }
    }, [displayFailureAlert]);

    const handleSubmit = async () => {
        setDisplayCircularProgress(true);
        let response = { data: "", response: "" };
        let finalReponse = ["",""];
        let hasError = false;
        if (prompt != "") {
            response = await fetchData(prompt);
            try {
                finalReponse [0] = user.displayName + ":\n" + response.data ;
                finalReponse[1] = " AI: " + response.response;
            }
            catch (e) {
                finalReponse[0] = "Sorry !! Error fetching details!!"
                hasError = true;
            }
        }

        setDisplayCircularProgress(false);
        setDisplayedPrompt(finalReponse);
        if (!hasError && prompt!="")
            setDisplaySaveButton(true);
        else
            setDisplaySaveButton(false);

        setPrompt('');
    };

    return (
        <>
            <Container maxWidth="sm" style={{ marginTop: '80px' }}>
              
                {displaySuccessAlert && <Alert severity="success" style={{marginBottom:"10px"}}>Save successful.</Alert>}
                {displayFailureAlert && <Alert severity="error" style={{marginBottom:"10px"}}>Saving Data Failed!</Alert>}

                <Box
                    sx={{
                        padding: '16px',
                        borderRadius: '8px',
                        minHeight: '300px',
                        minWidth: '250px',
                        display: 'flex',    
                        overflowY: 'auto',
                        justifyContent: 'center',
                        marginBottom: '20px',
                        position: 'relative'
                    }}
                    style={{ whiteSpace: 'pre-line' }}
                >
                </Box>


                <footer style={{ display: 'flex', alignItems: 'center', }}>
                    <TextField
                        label="Enter News articles/headlines"
                        variant="outlined"
                        fullWidth
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        style={{ marginRight: '8px', animation:'slideInRight 1s' }}
                        onKeyDown={(e) => {
                            if (e.key == "Enter") {
                                handleSubmit();
                            }
                        }}
                    />

                    <IconButton
                        aria-label="Send"
                        onClick={handleSubmit}
                        style = {{animation:'slideInLeft 1s'}}
                    >
                        <SendIcon style = {{color:'#3f51b5'}}/>
                    </IconButton>
                </footer>
            </Container>
        </>
    );
}

