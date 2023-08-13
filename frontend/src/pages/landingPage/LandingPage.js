import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Login from '../../components/Login/Login';
import Register from '../../components/SignUp/Register'
import './LandingPage.css'
import { useNavigate } from 'react-router-dom';
import { ChatState } from '../../context/ChatProvider';
import axios from 'axios';
import { errorToast } from '../../notifications';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


export default function LandingPage() {
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();
  const { user } = ChatState();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const isValid = async ()=> {
    try {
      const { data } = await axios.get(`/api/user/${user.token}`)
      navigate('/chats')
    } catch (err) {
    }
  }

  React.useEffect(() => {
    if(user)
    isValid()
  }, [user])


  return (
    <Box className='main-box'>
      <Box className='header-box'>
        <h1>Chit-Chat</h1>
      </Box>
      <Box className='outer-box'>

        <Box >
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">

              <Tab label="Login" {...a11yProps(0)} />
              <Tab label="Sign Up" {...a11yProps(1)} />

            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <Login handleChange={handleChange} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Register />
          </TabPanel>

        </Box>
      </Box>
    </Box>


  );
}