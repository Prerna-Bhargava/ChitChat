import LandingPage from './pages/landingPage/LandingPage';
import ChatPage from './pages/ChatPage';
import './App.css'
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";

function App() {
  return (
    <>
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/chats" element={<ChatPage />} />
        </Routes>
    </>
  );
}

export default App;
