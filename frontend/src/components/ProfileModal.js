import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import IconButton from '@mui/material/IconButton';
import { Avatar } from '@mui/material';


export default function ProfileModal({ User, isAvatar = false, chats = false }) {

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [width, setWidth] = React.useState(window.innerWidth)

  const handleResize = () => {
    setWidth(window.innerWidth)
  };

  React.useEffect(() => {

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); 


  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: width > 450 ? 350 : 200,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column"
  };


  return (
    <div>


      {!isAvatar && <div onClick={handleOpen}>Profile</div>}

      {isAvatar && !chats &&
        <IconButton onClick={handleOpen} color='primary'>
          <AccountCircleIcon />
        </IconButton>
      }

      {isAvatar && chats &&
        <Avatar
          sx={{ paddingRight: "4px", width: "30px", height: "30px" }}
          cursor="pointer"
          name={User.name}
          src={User.pic}
          onClick={handleOpen}
        />
      }
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h4" component="h2" sx={{ mt: 1, fontSize: width > 450 ? "2rem" : "1rem" }}>
            {User?.name}
          </Typography>
          <Avatar sx={{ width: "150px", height: "150px", mt: 2 }} alt="Remy Sharp" src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" />
          <Typography id="modal-modal-description" variant='h6' sx={{ mt: 1, fontSize: width > 450 ? "20px" : "1rem" }}>
            Email : {User?.email}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
