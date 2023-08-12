import { Box, Button, Divider, Stack, TextField, Typography } from '@mui/material'
import React from 'react'
import { ChatState } from '../context/ChatProvider';
import { getSender } from '../miscellanous/ChatFunctions';
import CreateGrpChat from './groupChats/CreateGrpChat'

function MyChats({drawer=false}) {
    const { selectedChat, chats, setSelectedchat } = ChatState();
    
    return (
        <Box sx={{ backgroundColor: "whitesmoke", padding: "10px 20px", borderRadius: "7px", height: !drawer?"80vh":"100vh" }}>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>

                <Typography variant="h5" component="h2">
                    My Chats
                </Typography>

                <CreateGrpChat />
               
            </Box>

            <Divider sx={{ marginBottom: "5%" }} />

            {chats ? (
                <Stack spacing={2} overflowy="scroll">
                    {chats.map((chat) => (
                        <Box
                            onClick={() => {setSelectedchat(chat)}}
                            cursor="pointer"
                            sx={{ backgroundColor: selectedChat?._id === chat?._id ? "#38B2AC" : "#E8E8E8", color: selectedChat?._id === chat._id ? "white" : "black", borderRadius: "8px" }}
                            px={3}
                            py={2}
                            key={chat._id}
                        >
                            <Typography>
                                {!chat.isGroupChat
                                    ? getSender(JSON.parse(localStorage.getItem('userInfo')), chat.users)
                                    : chat.chatName}
                            </Typography>
                            {chat.latestMessage && (
                                <Typography fontSize="xs">
                                    <b>{chat?.latestMessage?.sender?.name} : </b>
                                    {chat?.latestMessage?.content?.length > 50
                                        ? chat.latestMessage.content.substring(0, 51) + "..."
                                        : chat?.latestMessage?.content}
                                </Typography>
                            )}
                        </Box>
                    ))}
                </Stack>
            ) : ""}



        </Box>
    )
}

export default MyChats