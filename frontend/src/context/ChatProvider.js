import { useState, useEffect, useContext, createContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ChatContext = createContext();
const ChatProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [selectedChat, setSelectedchat] = useState();
    const [chats, setAllChats] = useState([]);
    const [notifications, setNotifications] = useState([]);


    const navigate = useNavigate();
    const location = useLocation();

    const { pathname } = location;

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userData)

        if (!userData) {
            navigate('/')
        }
    }, [pathname]);
    return (
        <ChatContext.Provider value={{ user, selectedChat, chats, notifications,setUser, setSelectedchat, setAllChats,setNotifications }}>
            {children}
        </ChatContext.Provider>
    );
};

export const ChatState = () => {
    return useContext(ChatContext)
}

export default ChatProvider



