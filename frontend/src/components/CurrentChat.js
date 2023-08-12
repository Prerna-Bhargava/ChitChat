import { Box, Drawer, IconButton, Typography } from '@mui/material'
import axios from 'axios';
import ClearIcon from '@mui/icons-material/Clear';
import React, { useState, useEffect } from 'react'
import { ChatState } from '../context/ChatProvider'
import { infoToast, errorToast, warningToast } from '../notifications/index';
import { getSender } from '../miscellanous/ChatFunctions';
import './chats/chatStyle.css'
import EditGrpChat from './groupChats/EditGrpChat';
import ProfileModal from './ProfileModal';
import DispalyMessages from './DispalyMessages';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MyChats from './MyChats';


function CurrentChat({ showIcon, fetchChatsAgain, setFetchChatsAgain }) {

    const { selectedChat, setSelectedchat, chats, user, setAllChats } = ChatState();
    const [showMyChats, setShowMyChats] = useState(false)

    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get("/api/chats", config);
            if(selectedChat){
            const updatedSelectedChat = data.find(chat => chat._id === selectedChat._id);

            // Update the selected chat state
            setSelectedchat(updatedSelectedChat);}
            setAllChats(data);

        } catch (error) {
            errorToast(error?.response?.data?.message)
        }
    }
    const toggleMyChats = () => {
        setShowMyChats(!showMyChats)
    }
    const removeChat = async () => {
        setSelectedchat(null)
    }
    useEffect(() => {
        if (user) {
            fetchChats();
        }
    }, [user, fetchChatsAgain])

    return (
        <Box sx={{ backgroundColor: "whitesmoke", marginLeft: "10px", padding: "10px 20px", borderRadius: "7px", height: "80vh" }}>

            <Box>

                <Box className='flex'>
                    {showIcon &&
                        <IconButton onClick={toggleMyChats} aria-label="toggle my chats">
                            <ArrowBackIcon />
                        </IconButton>
                    }

                    <Drawer anchor="left" open={showMyChats} onClose={toggleMyChats} PaperProps={{ style: { width: 240 } }}>
                        <MyChats drawer={true} />
                    </Drawer>

                    {selectedChat && <>
                        <span style={{ marginTop: "5px" }}>

                            {!selectedChat.isGroupChat
                                ? getSender(JSON.parse(localStorage.getItem('userInfo')), selectedChat.users)
                                : selectedChat.chatName}
                        </span>

                        <Box className='flex'>
                            {selectedChat.isGroupChat ? <EditGrpChat /> : <ProfileModal isAvatar={true} User={selectedChat.users.find((curUser) => curUser._id != user._id)} />}
                            <IconButton aria-label="delete" color="primary" onClick={removeChat}>
                                <ClearIcon />
                            </IconButton>
                        </Box>
                    </>}

                </Box>
            </Box>
            {!selectedChat &&
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                    <Typography>Click on a user to start chatting</Typography>
                </Box>}

            {user && selectedChat &&
                <Box className='chatBox'>

                    {user && <DispalyMessages setFetchChatsAgain={setFetchChatsAgain} fetchChatsAgain={fetchChatsAgain} />}

                </Box>
            }

        </Box>
    )
}

export default CurrentChat