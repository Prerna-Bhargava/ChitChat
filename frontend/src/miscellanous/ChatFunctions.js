// find sender of a single chat
export const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

export const sameSender = (loggedUser,user)=>{
  return loggedUser._id == user.sender._id
}
export const showAvatar = (messages,msg,idx,user)=>{
  return idx==messages.length-1 || msg.sender._id!=messages[idx+1].sender._id ;
}

