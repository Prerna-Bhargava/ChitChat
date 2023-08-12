
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import AddIcon from '@mui/icons-material/Add';
import { useForm } from "react-hook-form";
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { infoToast, errorToast, warningToast, successToast } from '../../notifications/index.js';
import axios from 'axios';
import UserList from '../user/UserList.js';
import { Chip, IconButton } from '@mui/material';
import { ChatState } from '../../context/ChatProvider.js';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteConfirmation from './DeleteConfirmation.js';
import io from 'socket.io-client'

const ENDPOINT = "http://localhost:5000"
var socket



export default function EditGrpChat() {
    const [width, setWidth] = React.useState(window.innerWidth)

    const handleResize = () => {
      setWidth(window.innerWidth)
    };
    
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width:  width > 450 ? 400 : 230,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    
    const { selectedChat, setSelectedchat, setAllChats, chats,user } = ChatState();
    const [open, setOpen] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const [chatName, setChatName] = React.useState("");
    const [emptyChat, setChatStatus] = React.useState(false);
    const [selectedUser, setSelectedUser] = React.useState(null)
    const [selectedgrpChats, setSelectedgrpchats] = React.useState([]);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const { register, handleSubmit, reset, control, formState: { errors } } = useForm();
    const [searchResult, setSearchResult] = React.useState([]);

    const history = useNavigate();

    const [isModalOpen, setIsModalOpen] = React.useState(false);


    const handleOpenModal = (user) => {
        setSelectedUser(user)
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedUser(null)
        setIsModalOpen(false);
    };

    const SearchUserHandler = async (e) => {
        setSearch(e.target.value)
        var val = e.target.value
        if (val == "") {
            // warningToast("Please enter a username to search");
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("userInfo")).token}`
                }
            }
            const { data } = await axios.get(`/api/user?search=${search}`, config);
            setSearchResult(data);
        } catch (error) {
            errorToast(error.response.data.message)
        }

    }
    const addChat = async (user) => {
        if (!selectedgrpChats.some((obj) => obj.id === user._id))
            setSelectedgrpchats((prevUser) => [...prevUser, { "id": user._id, "name": user.name }]);
    }
    const onSubmit = async Userdata => {
        // isLoading(true)
        setError(false)
        setChatStatus(false)
        const users = selectedgrpChats.map(({ id }) => id);
        if (users.length < 2) {
            setError(true)
            return;
        }
        if (chatName == "" || !chatName) {
            setChatStatus(true);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("userInfo")).token}`
                }
            }

            const { data } = await axios.put("/api/chats/groupUpdate", {
                userIds: users,
                chatId: selectedChat._id,
                chatName: chatName
            }, config)
            socket.emit("group_chat_updated", { chatId: selectedChat._id });
            const allChats = chats.filter(user => user._id !== data._id)
            setAllChats([...allChats, data])
            setSelectedchat(data)
            reset();
            setSearch("")
            setSearchResult([])
            handleClose();
            successToast("Chat Updated Successfully")
            // isLoading(false);

        } catch (err) {
            errorToast(err.response.data.message)
            reset();
            // isLoading(false)
        }
    }

    React.useEffect(() => {
        const loggedId = JSON.parse(localStorage.getItem("userInfo"))._id
        setSelectedgrpchats(selectedChat.users.filter(user => user._id !== loggedId).map(({ _id, name }) => ({ id: _id, name })));
        setChatName(selectedChat.chatName)

    }, [selectedChat])

    React.useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user)

        window.addEventListener('resize', handleResize);
        // Clean up the event listener on component unmount
        return () => {
          window.removeEventListener('resize', handleResize);
        };
        
    }, [])
    return (
        <div>

            <IconButton aria-label="delete" color="primary" sx={{ px: 1 }} onClick={handleOpen}>
                <VisibilityIcon />
            </IconButton>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h5" component="h2" sx={{ textAlign: "center" }}>
                        {selectedChat.chatName}
                    </Typography>
                    <Box sx={{ marginTop: 2 }}>
                        {selectedgrpChats?.map((curUser, idx) => (
                            <Chip
                                key={idx}
                                sx={{ bgcolor: "rgb(165, 236, 243)" }}
                                label={curUser.name}
                                variant="outlined"
                               onDelete={selectedChat.groupAdmin._id == user._id ?()=>handleOpenModal(curUser) : undefined}
                                
                            />

                        ))}

                    </Box>

                    {isModalOpen && (
                        <DeleteConfirmation
                            user={selectedUser}
                            handleCloseModal={handleCloseModal}
                            handleClose={handleClose}
                            isModalOpen={isModalOpen}
                            setSelectedgrpchats={setSelectedgrpchats}
                        />
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} >

                        <FormControl sx={{ m: 1, width: '95%' }} variant="outlined" >
                            <TextField
                                autoComplete="off"
                                label="Group Name"
                                name="chatName"
                                id="standard-basic"
                                variant="standard"
                                fullWidth
                                value={chatName}
                                onChange={(e) => setChatName(e.target.value)}
                            />
                            {emptyChat && (
                                <span className="invalid-field-text">
                                    <Typography sx={{ fontSize: "14px", paddingLeft: "5px" }} color="error" >
                                        "Chat Name is required"
                                    </Typography>
                                </span>
                            )}

                            <TextField
                                autoComplete="off"
                                label="Add Users"
                                name="user"
                                id="standard-basic"
                                fullWidth
                                sx={{ my: 1 }}
                                value={search}
                                onChange={SearchUserHandler}
                            />
                            {error && (
                                <span className="invalid-field-text">
                                    <Typography sx={{ fontSize: "14px", paddingLeft: "5px" }} color="error" >
                                        "Atleast 2 Users are required"
                                    </Typography>
                                </span>
                            )}
                        </FormControl>

                        <Box>
                            {searchResult?.map((user) => (
                                <UserList
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => addChat(user)}
                                ></UserList>
                            ))}
                        </Box>

                        <Box className='flex'>

                            <Button variant="contained" onClick={() => handleOpenModal(selectedChat)} color="error" sx={{ padding: '5px' }} >Leave Group</Button>
                            <Button variant="contained" sx={{ padding: '5px' }} type="submit">Update Chat</Button>

                        </Box>

                    </form>


                </Box>


            </Modal>
        </div>
    );
}