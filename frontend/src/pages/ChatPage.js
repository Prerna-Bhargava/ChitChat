import { Box } from '@mui/material'
import React, { useState, useEffect } from 'react'
import CurrentChat from '../components/CurrentChat'
import MyChats from '../components/MyChats'
import Nav from '../components/Nav'

function ChatPage() {

  const [showMyChats, setShowMyChats] = useState(window.innerWidth > 930)
  const [fetchChatsAgain,setFetchChatsAgain] = useState(true)
  const handleResize = () => {
    setShowMyChats(window.innerWidth > 930)
  };

  useEffect(() => {

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
    
  }, []); 


  return (
    <Box>

      <Nav />
      <Box sx={{ display: "grid", gridTemplateColumns: showMyChats ? "30% 70%" : "100%", margin: "20px" }}>
        {showMyChats && <MyChats />}

        <Box>
          <CurrentChat setFetchChatsAgain={setFetchChatsAgain} fetchChatsAgain={fetchChatsAgain} showIcon={!showMyChats} setShowMyChats={setShowMyChats} />
        </Box>

      </Box>
    </Box>
  )
}

export default ChatPage
