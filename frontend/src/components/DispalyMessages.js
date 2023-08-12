import React, { useState, useEffect } from 'react'
import { ChatState } from '../context/ChatProvider';
import { infoToast, errorToast, warningToast, successToast } from '../notifications/index';
import axios from 'axios';
import { Avatar, Box, FormControl, Input, TextField, Tooltip, Typography } from '@mui/material';
import { sameSender, showAvatar } from '../miscellanous/ChatFunctions';
import ProfileModal from './ProfileModal';
import ScrollableFeed from 'react-scrollable-feed'
import io from 'socket.io-client'
import Lottie from "react-lottie"
import typingAnim from "../animations/typing.json"
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';


const ENDPOINT = "https://chit-chat-31cy.onrender.com"
var socket, selectedChatCompare;


function DispalyMessages({ setFetchChatsAgain, fetchChatsAgain }) {
    const { selectedChat, setSelectedchat, chats, user, setAllChats, notifications, setNotifications } = ChatState();
    const [socketConnected, setSocketConnected] = useState(false)
    const [showDelIcons, setShowDelIcons] = useState([]);
    const [typing, setTyping] = useState(false);
    const [isTyping, setisTyping] = useState(false);


    const [messages, setMesssges] = useState([]);
    const [newMessge, setMsgContent] = useState();

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: typingAnim,
        renderSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    }

    const setMessageValue = (e) => {
        setMsgContent(e.target.value)

        //   real time typing display logic here

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true)
            socket.emit("typing", selectedChat._id)
        }

        // stoping
        let lastTypingTime = new Date().getTime();
        var timerlength = 2000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timediff = timeNow - lastTypingTime;
            if (timediff >= timerlength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerlength);

    }
    const fetchMsg = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
            setMesssges(data);

            socket.emit('join chat', selectedChat._id)

        } catch (error) {
            errorToast(error?.response?.data?.message)
        }
    }
    const updateSeenStatus = async (newMsg) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const payload = {
                messageId: newMsg._id,
                userId: user._id,
                isSeen: false
            }
            const { data } = await axios.put('/api/message/updateNoti', payload, config);
        } catch (error) {
            errorToast(error?.response?.data?.message)
        }
    }
    const sendMsg = async (event) => {
        if (event.key == "Enter" && newMessge) {
            socket.emit("stop tying", selectedChat._id)
            try {
                const payload = {
                    content: newMessge,
                    chatId: selectedChat._id
                }
                setMsgContent("")
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }
                const { data } = await axios.post('/api/message/', payload,
                    config);

                socket.emit("new message", data)
                setMesssges([...messages, data]);
                setFetchChatsAgain(!fetchChatsAgain);


            } catch (error) {
                errorToast(error?.response?.data?.message)
            }
        }
    }
    const deleteMsg = async (event) => {

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.delete(`/api/message/deleteMsg/${event._id}`, config);
            fetchMsg()
            successToast(data.message)

        } catch (error) {
            errorToast(error?.response?.data?.message)
        }
    }
    const showDeleteIcon = (index) => {
        const updatedIcons = [...showDelIcons];
        updatedIcons[index] = !updatedIcons[index];
        setShowDelIcons(updatedIcons);
    }

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user)
        socket.on("connected", () => {
            setSocketConnected(true)
        })
        socket.on("typing", () => setisTyping(true))
        socket.on("stop typing", () => setisTyping(false))

    }, [])
    useEffect(() => {
        if (selectedChat)
            fetchMsg();
        selectedChatCompare = selectedChat
        socket.on("group_chat_updated", (data) => {
            setFetchChatsAgain(!fetchChatsAgain);
        });

    }, [selectedChat])

    useEffect(() => {
        socket.on("message received", (newMsg) => {
            if (!selectedChatCompare || selectedChatCompare._id != newMsg.chat._id) {   //if this is not selected chat or none is selected chat/ give notification
                if (!notifications.includes(newMsg)) {
                    updateSeenStatus(newMsg);
                    setNotifications([newMsg, ...notifications])
                    setFetchChatsAgain(!fetchChatsAgain);   //  updateChatListMessage by calling fetchchats of current chat

                }
            }
            else {
                setMesssges([...messages, newMsg]);
            }
        })
    })

    return (
        <>

            <ScrollableFeed >
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    {messages &&
                        messages.map((msg, idx) => (
                            <Box key={idx} sx={{ display: "flex" }}>
                                {(!sameSender(user, msg) && showAvatar(messages, msg, idx, user._id)) && (
                                    <ProfileModal User={msg.sender} isAvatar={true} chats={true}></ProfileModal>
                                )}
                                <span onClick={() => showDeleteIcon(idx)} className={`msgBox ${sameSender(user, msg) ? "align-right" : "align-left"} ${(!sameSender(user, msg) && !showAvatar(messages, msg, idx, user._id)) ? "mL" : ""}  `} >
                                    {msg.content}
                                    {showDelIcons[idx] && sameSender(user, msg) && <>
                                        <ClearIcon onClick={() => deleteMsg(msg)} />
                                    </>}
                                </span>
                            </Box>

                        ))}
                </Box>
            </ScrollableFeed>
            <FormControl onKeyDown={sendMsg} fullWidth>
                {isTyping && <div>
                    <Lottie options={defaultOptions} width={70} style={{ marginBottom: 15, marginLeft: 0 }}></Lottie>
                </div>}
                <TextField id='msgField' variant="filled" placeholder='Enter a message' value={newMessge} onChange={setMessageValue}  >
                </TextField>
            </FormControl>

        </>

    )
}

export default DispalyMessages