import { Box } from '@mui/material'
import React, { useState, useEffect } from 'react'
import CurrentChat from '../components/CurrentChat'
import MyChats from '../components/MyChats'
import Nav from '../components/Nav'
import axios from 'axios'
import { ChatState } from '../context/ChatProvider'
import { useNavigate } from 'react-router-dom'
import { errorToast } from '../notifications'

function ChatPage() {

  const [showMyChats, setShowMyChats] = useState(window.innerWidth > 930)
  const [fetchChatsAgain, setFetchChatsAgain] = useState(true)
  const [isAuth, setisAuthenticated] = useState(false)
  const navigate = useNavigate();
  const { user } = ChatState();

  const handleResize = () => {
    setShowMyChats(window.innerWidth > 930)
  };

  useEffect(() => {

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };

  }, []);


  useEffect(() => {
    const isValid = async () => {
      try {
        const { data } = await axios.get(`/api/user/${user.token}`)
        setisAuthenticated(true)
      } catch (err) {
        setisAuthenticated(false)
        errorToast(err.response.data.message)
        navigate('/')
      }
    }
    if(user)
    isValid();
  }, [user])
  return (
    <Box>
      {isAuth && <>
        <Nav />
        <Box sx={{ display: "grid", gridTemplateColumns: showMyChats ? "30% 70%" : "100%", margin: "20px" }}>
          {showMyChats && <MyChats />}
          <Box>
            <CurrentChat setFetchChatsAgain={setFetchChatsAgain} fetchChatsAgain={fetchChatsAgain} showIcon={!showMyChats} setShowMyChats={setShowMyChats} />
          </Box>

        </Box>
      </>}

    </Box>
  )
}

export default ChatPage
