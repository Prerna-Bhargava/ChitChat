
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import { Avatar, Button, MenuList, Paper } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import SearchUser from './SearchUser';
import ProfileModal from './ProfileModal'
import { useNavigate } from 'react-router-dom';
import { ChatState } from '../context/ChatProvider';
import { getSender } from '../miscellanous/ChatFunctions';
import axios from 'axios';
import { errorToast } from '../notifications';

export default function Nav() {
    const { selectedChat, setSelectedchat, chats, user, setAllChats, notifications, setNotifications, setUser } = ChatState();


    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorE2, setAnchorE2] = React.useState(null);
    const [isNotifyOpen, setIsNotifcationOpen] = React.useState(false);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const [mobileMoreAnchorE2, setMobileMoreAnchorE2] = React.useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const isNotifyMenuOpen = Boolean(anchorE2);

    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });
    const history = useNavigate();

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => (
        <Box sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}>
            <SearchUser state={state} setState={setState} />
        </Box>
    );

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMobileNotifyMenuClose = () => {
        setMobileMoreAnchorE2(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };
    const handleNotifyMenuClose = () => {
        setAnchorE2(null);
        handleMobileNotifyMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };
    const Logout = () => {
        localStorage.removeItem('userInfo');
        handleMenuClose();
        setUser(null)
        history('/')
    }

    const handleClickNotifications = (event) => {
        setIsNotifcationOpen(true)
        setAnchorE2(event.currentTarget);
    }
    const getAllNotifications = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`/api/message/getAll/${user._id}`, config);
            setNotifications([...data])

        } catch (error) {
            errorToast(error?.response?.data?.message)
        }
    }
    const updateNotifications = async (notidu) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const payload = {
                messageId: notidu._id,
                userId: user._id,
                isSeen: true
            }
            const { data } = await axios.put('/api/message/updateNoti', payload, config);
        } catch (error) {
            errorToast(error?.response?.data?.message)
        }

    }

    const deleteAllMessagesWithSameChatId = async (notidu) => {
        try {
            for (const noti of notifications) {
                if ((notidu && notidu.chat._id === noti.chat._id) || (!notidu && selectedChat._id == noti.chat._id)) {
                    await updateNotifications(noti);
                }
            }
            if(notidu)setNotifications(notifications.filter((msg) => msg.chat._id !== notidu.chat._id));
            else setNotifications(notifications.filter((msg) => msg.chat._id !== selectedChat._id));
        } catch (error) {
            console.error(error);
        }
    }
    
    React.useEffect(() => {
        if (user) {
            getAllNotifications()
        }
    }, [user])

    React.useEffect(() => {
        if (selectedChat) {
            deleteAllMessagesWithSameChatId()
        }
    }, [selectedChat])


    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            keepMounted
            open={isMenuOpen}
            onClose={handleMenuClose}
        >

            <MenuItem sx={{ padding: "10px 50px" }} onClick={handleMenuClose} ><ProfileModal User={user} /> </MenuItem>

            <MenuItem sx={{ padding: "10px 50px" }} onClick={Logout}>Logout</MenuItem>
            {/* <MenuItem sx={{ padding: "10px 50px" }} onClick={Logout}>{user.token}</MenuItem> */}

        </Menu>
    );
    const renderNotifcations = (
        <Menu
            anchorEl={anchorE2}
            keepMounted
            open={isNotifyMenuOpen}
            onClose={handleNotifyMenuClose}
        >
            <MenuList sx={{ px: 2 }}>
                {notifications.length == 0 && "No New Messages"}

                {notifications.map((notidu, index) => (
                    <MenuItem key={index} onClick={() => {
                        setSelectedchat(notidu.chat)
                        deleteAllMessagesWithSameChatId(notidu)
                        setIsNotifcationOpen(false)
                    }}>

                        {notidu.chat.isGroupChat ? `New Message from ${notidu.chat.chatName}` : `New Message from ${getSender(user, notidu.chat.users)}`}
                    </MenuItem>
                ))}
            </MenuList>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem onClick={handleClickNotifications}>
                <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                >
                    <Badge badgeContent={notifications.length} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    );
    return (
        <Box >
            <AppBar position="static" color="">
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>

                    <React.Fragment key={'left'}>
                        <Button variant="text" startIcon={<SearchIcon />} sx={{ color: 'black', fontWeight: 600 }} onClick={toggleDrawer('left', true)}>Search user</Button>
                        <Drawer
                            anchor={'left'}
                            open={state['left']}
                            onClose={toggleDrawer('left', false)}
                        >
                            {list('left')}
                        </Drawer>
                    </React.Fragment>
                    <Box>
                        <h3>CHITCHAT</h3>
                    </Box>
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>

                        <IconButton
                            sx={{ marginRight: "10px" }}
                            aria-label="show 17 new notifications"
                            color="inherit"
                            onClick={handleClickNotifications}
                        >
                            <Badge badgeContent={notifications.length} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>


                        <Avatar onClick={handleProfileMenuOpen} src={JSON.parse(localStorage.getItem("userInfo")).pic} alt="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" />
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {!isNotifyOpen && renderMenu}
            {isNotifyOpen && renderNotifcations}
        </Box>
    );
}
