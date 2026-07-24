import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import {PulseLoader} from "react-spinners";

function ChatWindow () {
    const {prompt, setPrompt, reply, setReply, currThreadId, setPrevChats, setNewChat, setAllThreads, sidebarOpen, setSidebarOpen} = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const getReply = async () => {
        setLoading(true);
        setNewChat(false);

        console.log("message", prompt, "threadId", currThreadId);
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        };

        try {
            const response = await fetch("https://sarthiai-3xaj.onrender.com/api/chat", options);
            const res = await response.json();
            console.log(res);
            setReply(res.reply);

            const threadsRes = await fetch("https://sarthiai-3xaj.onrender.com/api/thread");
            const threadsData = await threadsRes.json();
            const filtered = threadsData.map(t => ({threadId: t.threadId, title: t.title}));
            setAllThreads(filtered);

        } catch(err) {
            console.log(err);
        }
        setLoading(false);
    }


    useEffect(() => {
        if(prompt && reply) {
            setPrevChats(prevChats => (
                [...prevChats, {
                    role: "user",
                    content: prompt
                },{
                    role: "assistant",
                    content: reply
                }]
            ));
        }

        setPrompt("");
    }, [reply]);


    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    }


    return (
        <div className="chatWindow">
            <div className="navbar">
                <i className="fa-solid fa-bars hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}></i>
                <span>SarthiAI<i className="fa-solid fa-angle-down"></i></span>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon">
                        <i className="fa-solid fa-user"></i>
                    </span>
                </div>
            </div>
            {
                isOpen && 
                <div className="dropDown">
                    <div className="dropDownItem"><i className="fa-solid fa-gear"></i> &nbsp;Settings</div>
                    <div className="dropDownItem"> <i className="fa-solid fa-cloud-arrow-up"></i> &nbsp; Upgrade Plan</div>
                    <div className="dropDownItem"> <i className="fa-solid fa-arrow-right-from-bracket"></i> &nbsp; Log out</div>
                </div>
            }

            <Chat></Chat>

            <PulseLoader color="#fff" loading={loading}>

            </PulseLoader>
            <div className="chatInput">
                <div className="inputBox">
                    <input placeholder="Ask anything"
                        value = {prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter'? getReply() : ''}
                    >
                    
                    </input>
                    <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
                    </div>
                    <p className="info">
                        SarthiAI can make mistakes. Check important info. See Cookie Preferences.
                    </p>
                </div>
            </div>
    )
}

export default ChatWindow;