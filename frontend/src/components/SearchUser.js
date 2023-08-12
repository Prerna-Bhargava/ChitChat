import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import { Box, Divider, IconButton, Input, InputAdornment, TextField } from '@mui/material';
import { infoToast, errorToast, warningToast } from '../notifications/index';
import axios from 'axios';
import UserList from './user/UserList';
import { ChatState } from '../context/ChatProvider';

function SearchUser({ state, setState }) {
  const { user, selectedChat, setSelectedchat,chats,setAllChats } = ChatState();
  const [search, setSearch] = React.useState("");
  const [searchResult, setSearchResult] = React.useState([]);


  const SearchUserHandler = async () => {
    console.log(search)
    if (search == "") {
      warningToast("Please enter something to search");
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

  const accessChat = async (userId) => {

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("userInfo")).token}`
        }
      }
      const { data } = await axios.post("/api/chats", { userId }, config);
      setSelectedchat(data);
      if(!chats.find((c)=>c._id===data._id)) setAllChats([data,...chats])
      setState({ ...state, "left":false });
     
    } catch (error) {
      console.log("error")
      errorToast(error.response.data.message)
    }
  }
  return (
    <Box sx={{ padding: "0 10px" }}>
      <h2>Search Users</h2>
      <Divider />
      <Box sx={{ mt: 2 }}>
        <TextField
          label="Find user"
          sx={{ width: "85%", padding: "-10px" }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}

          InputProps={{
            endAdornment: (
              <InputAdornment>
                <IconButton>
                  <SearchIcon onClick={SearchUserHandler} />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Box>
      {searchResult?.map((user) => (
        <UserList
          key={user._id}
          user={user}
          handleFunction={() => accessChat(user._id)}
        ></UserList>
      ))
      }


    </Box>
  )
}

export default SearchUser