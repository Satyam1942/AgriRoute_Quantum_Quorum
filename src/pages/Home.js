import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { auth } from '../components/firebase';
import ProfileFragement from '../fragments/ProfileFragment';
import BackgroundSlideshow from '../components/BackgroundSlideshow';


//--------MUI imports----------------//
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Fab from '@mui/material/Fab';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

//-----------HOOKS-----------------------------//
import { useAuth } from '../components/AuthProvider';
import { useState } from 'react';


//------------------ICONS---------------------------//
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import NavigationIcon from '@mui/icons-material/Dataset';



//----------CONSTANTS--------------//
const drawerWidth = 240;
const topNavBarTitle = "AgriRoute";

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [showProfileFragment, setShowProfileFragment] = useState(false);

  const drawerItemArray = ['Profile', 'Sign Out'];
  const drawerItemIconArray = [<PersonIcon />, <LogoutIcon />];
  const navigate = useNavigate();

  const handleGenerateTestCase = () => {
    navigate('/graph');
  };


  const handleCloseProfile = () => {
    setShowProfileFragment(false);
  };


  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleProfile = () => {
    setShowProfileFragment(true);
    console.log(setShowProfileFragment);
  };

  const handleSignOut = async () => {
    await auth.signOut();
    navigate('/');
  };

  const drawerItemHandler = [handleProfile, handleSignOut];


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {topNavBarTitle}
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#f0f4c3'
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <Avatar alt="DP" src={user.photoURL} style={{ marginRight: '25px' }} />
          <Typography variant="body1" gutterBottom>
            Welcome <br />
            {user.displayName}
          </Typography>

          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>

        <Divider />

        <List>
          {drawerItemArray.map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton onClick={drawerItemHandler[index]}>
                <ListItemIcon>
                  {drawerItemIconArray[index]}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

      </Drawer>

      <BackgroundSlideshow />

      <Main open={open}>
        <DrawerHeader />
        <Card
          sx={{
            backgroundColor: '#f2f2f28a',
            border: '5px solid #f0f4c3 ',
            borderRadius: '5px',
            padding: '10px',
            marginInline: '300px',
            marginTop: '120px',
            transition: 'transform 0.5s ease',
            '&:hover': {
              transform: 'scale(1.05)', // Slight zoom effect on hover
            },
          }}
        >
          <CardContent>
            <Typography
              variant="h3"
              sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '10px' }}
            >
              AgriRoute
            </Typography>
            <Typography
              variant="h6"
              sx={{ textAlign: 'center', color: 'black' }}
            >
              Revolutionizing the Supply Chain for Modern Farmers
            </Typography>
          </CardContent>
        </Card>
        <div style={{
          position: 'relative', // Parent container should be relative
          height: '100vh', // Full height of the viewport (or adjust as needed)
        }}>
          <Fab
            variant="extended"
            onClick={handleGenerateTestCase}
            style={{
              position: 'absolute',
              left: '50%',
              marginTop: '120px',
              backgroundColor: '#f0f4c3',
              transform: 'translate(-50%, -50%)', // Centering horizontally and vertically
              transition: 'transform 0.3s ease', // Smooth transition
            }}
            sx={{
              '&:hover': {
                transform: 'scale(1.5)', // Increase the size on hover
              },
            }}
          >
            <NavigationIcon sx={{ mr: 1 }} />
            Generate Graph
          </Fab>

        </div>

      </Main>

      {showProfileFragment && < ProfileFragement open={showProfileFragment} handleClose={handleCloseProfile} />}
    </Box>
  );
}
