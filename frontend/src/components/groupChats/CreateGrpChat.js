import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import AddIcon from '@mui/icons-material/Add';
import { useForm } from "react-hook-form";
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { infoToast, errorToast, warningToast } from '../../notifications/index.js';
import axios from 'axios';
import UserList from '../user/UserList.js';
import { Chip } from '@mui/material';
import { ChatState } from '../../context/ChatProvider.js';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function BasicModal() {
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [selectedgrpChats, setSelectedgrpchats] = React.useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm();
  const [searchResult, setSearchResult] = React.useState([]);
  const { selectedChat, setSelectedchat, setAllChats } = ChatState();

  const SearchUserHandler = async (e) => {
    setSearch(e.target.value)
    var val = e.target.value
    console.log(search)
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
      console.log(data);
      setSearchResult(data);
    } catch (error) {
      console.log("error")
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
    const users = selectedgrpChats.map(({ id }) => id);
    if (users.length < 2){
      setError(true)
      return;
    }
 
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("userInfo")).token}`

        }
      }

      const { data } = await axios.post("/api/chats/group", {
        users:users,
        ...Userdata
      }, config)
      setAllChats((chats)=>[...chats,data])
      setSelectedchat(data)
      reset();
      setSelectedgrpchats([])
      setSearch("")
      setSearchResult([])
      handleClose();
      // isLoading(false);

    } catch (err) {
      errorToast(err.response.data.message)
      reset();
      // isLoading(false)
    }
  }
  const handleDelete = (user) => {
    setSelectedgrpchats((prevChats) => {
      const updatedChats = prevChats.filter((chat) => chat.id !== user.id);
      return updatedChats;
    });
  };
  return (
    <div>
      <Button onClick={handleOpen} variant="outlined" sx={{ color: "black", border: "1px solid gray", backgroundColor: "#F0F0F0" }} endIcon={<AddIcon />}>
         Group chat
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h5" component="h2">
            Create Group Chat
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} >

            <FormControl sx={{ m: 1, width: '95%' }} variant="outlined" >
              <TextField
                autoComplete="off"
                label="Group Name"
                name="chatName"
                id="standard-basic"
                variant="standard"
                fullWidth
                {...register("chatName", { required: "Group Name Required" })}
                error={Boolean(errors.chatName)}
              />
              {errors.chatName && (
                <span className="invalid-field-text">
                  <Typography sx={{ fontSize: "14px", paddingLeft: "5px" }} color="error" >
                    {errors.chatName.message}
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
              {selectedgrpChats?.map((user, idx) => (
                <Chip
                  sx={{ bgcolor: "rgb(165, 236, 243)" }}
                  key={idx}
                  label={user.name}
                  variant="outlined"
                  onDelete={() => handleDelete(user)}
                />
              ))}
            </Box>

            <Box>
              {searchResult?.map((user) => (
                <UserList
                  key={user._id}
                  user={user}
                  handleFunction={() => addChat(user)}
                ></UserList>
              ))}
            </Box>


            <Button variant="contained" sx={{ padding: '5px', marginLeft: 'auto !important', display: "flex" }} type="submit">Create Chat</Button>

          </form>


        </Box>


      </Modal>
    </div>
  );
}