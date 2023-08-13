import React, { useState } from "react";
import Chip from "@mui/material/Chip";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import axios from "axios";
import { ChatState } from "../../context/ChatProvider";
import { infoToast, errorToast, warningToast, successToast } from '../../notifications/index.js';
import io from 'socket.io-client'

const ENDPOINT = "https://chit-chat-31cy.onrender.com/"
var socket

const DeleteConfirmation = ({ user, setSelectedgrpchats, handleClose, handleCloseModal, isModalOpen }) => {
    const { selectedChat, setSelectedchat, setAllChats, chats } = ChatState();
   
    const handleDelete = async () => {
        handleCloseModal();
        // delete chat from db
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("userInfo")).token}`

                }
            }

            const { data } = await axios.put("/api/chats/groupRemove", {
                userId: user != selectedChat ? user.id : selectedChat.groupAdmin._id,
                chatId: selectedChat._id,
            }, config)
            socket.emit("group_chat_updated", { chatId: selectedChat._id });
            if (user != selectedChat) {
                setSelectedgrpchats((prevChats) => {
                    const updatedChats = prevChats.filter((chat) => chat.id !== user.id);
                    return updatedChats;
                });
                const allChats = chats.filter(user => user._id !== data._id)
                setAllChats([...allChats, data])
                setSelectedchat(data)
                successToast("User Removed Successfully")
            }
            else {
                const allChats = chats.filter(user => user._id !== selectedChat._id)
                setAllChats([...allChats])
                setSelectedchat(null)
                successToast("Group Left and Chat Deleted Successfully")
            }
            handleClose()

            // isLoading(false);

        } catch (err) {
            errorToast(err.response.data.message)
            // isLoading(false)
        }

    };
    React.useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user)
    }, [])
    return (
        <>
          
            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "background.paper",
                        border: "2px solid #000",
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <h2 id="modal-title">Confirm Deletion</h2>
                    <p id="modal-description">
                        Are you sure you want to remove {user.name}?
                    </p>
                    <Button onClick={handleDelete}>OK</Button>
                    <Button onClick={handleCloseModal}>Cancel</Button>
                </Box>
            </Modal>

        </>
    );
};

export default DeleteConfirmation;
