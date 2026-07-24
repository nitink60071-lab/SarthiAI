import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
    const {allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats, sidebarOpen, setSidebarOpen} = useContext(MyContext);

    const getAllThreads = async () => {

        try {
            const response = await fetch("https://sarthiai-3xaj.onrender.com/api/thread");
            const res = await response.json();
            const filteredData = res.map(thread => ({threadId: thread.threadId, title: thread.title}));
            //console.log(filteredData);
            setAllThreads(filteredData);

        } catch(err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId])


    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    }

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);

        try {
             const response = await fetch(`https://sarthiai-3xaj.onrender.com/api/thread/${newThreadId}`);
             const res = await response.json();
             console.log(res);
             setPrevChats(res);
             setNewChat(false);
             setReply(null);
        } catch(err) {
            console.log(err);
        }
    }


    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`https://sarthiai-3xaj.onrender.com/api/thread/${threadId}`, {method: "DELETE"});
            const res = await response.json();
            console.log(res);

            setAllThreads(prev => prev.filter(thread => thread.threadId != threadId));

            if(threadId === currThreadId) {
                createNewChat();
            }

        } catch(err) {
            console.log(err);
        }
    }


    return (
        <>

        {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)}></div>}
        <section className={`sidebar ${sidebarOpen ? "open" : ""}`}>
            <button onClick={createNewChat}>
                <img src="src/assets/logo.png" alt="AI logo" className="logo"></img>
                <span>
                <i className="fa-solid fa-pen-to-square"></i>
                </span>
            </button>


            <ul className="history">
                {
                    allThreads?.map((thread, idx) => (
                        <li key={idx}
                            onClick={() => changeThread(thread.threadId)}
                            className={thread.threadId === currThreadId ? "highlighted": " "} 
                        >
                            {thread.title}
                            <i className="fa-solid fa-trash"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteThread(thread.threadId);
                                }}
                            ></i>
                            </li>
                    ))
                }
            </ul>

            
            <div className="sign">
                <p>By Nitin &hearts;</p>
            </div>
        </section>
        </>
    )
}

export default Sidebar;