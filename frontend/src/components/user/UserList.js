import { Avatar, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'

function UserList({ user, handleFunction }) {
    return (
        <Box
            onClick={handleFunction}
            cursor="pointer"
            w="100%"
            d="flex"
            _hover={{
                background: "purple",
                color: "white"
            }}
            px={2}
            py={1}
            my={2}
            sx={{ backgroundColor: "#F2F2F2", borderRadius: "15px",alignItems:"center", "&:hover": {
                // border: "1px solid #00FF00",
                backgroundColor: '#89CFF0'
              }, }}

        >
            <Avatar
                cursor="pointer"
                src={user.pic}
                sx={{ float: "left", marginRight: "10px" }}
            ></Avatar>

            <Typography id="modal-modal-description" sx={{ mt: -2 }}>
                <p style={{ lineHeight: "1", marginBottom: "5px" }}>{user.name}</p>
                <p style={{ fontSize: "12px", margin: 0 }} >Email : {user.email}</p>
            </Typography>


        </Box>
    )
}

export default UserList