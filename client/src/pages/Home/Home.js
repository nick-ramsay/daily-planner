import React, { useState, useEffect } from 'react';
import { useInput } from '../../sharedFunctions/sharedFunctions';
import API from "../../utils/API";
import moment from 'moment';
import logo from '../../../src/logo.svg';
import GithubLogo from '../../images/github_logos/GitHub_Logo_White.png';
import mongoLogo from '../../images/mongo_logo.png';
import "./style.css";


const Home = () => {

    var [newMessage, setNewMessage] = useInput("");
    var [messages, setMessages] = useState([]);

    const renderMessages = () => {
        API.findAllMessages().then(
            (res) => {
                setMessages(messages => res.data);
            }
        );
    }

    const saveMessage = (event) => {
        if (newMessage !== "") {
            API.createMessage(newMessage, new Date()).then(
                (res) => {
                    renderMessages();
                    document.getElementById('messageInput').value = "";
                }
            );
        }
    };

    const deleteMessage = (event) => {
        let messageDeletionID = event.currentTarget.dataset.message_id;
        API.deleteOneMessage(messageDeletionID).then(
            (res) => {
                renderMessages();
            }
        );
    }

    useEffect(() => {
        renderMessages();
    }, [])

    return (
        <div>
            <div className="App">
                <header className="App-header p-4">
                    <h1>Daily Planner</h1>
                    <img src={logo} className="App-logo" alt="logo" />
                    <img src={mongoLogo} className="mongo-logo" alt="mongo_logo" />
                    <p>Edit <code>src/pages/Home/Home.js</code> and save to reload.</p>
                    <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">Learn React</a>
                </header>
                <div className="container">
                    <div className="col-md-12">
                        <form className="mt-3">
                            <div className="form-row text-center">
                                <div className="col">
                                    <input type="text" placeholder="Enter your message here" className="form-control" id="messageInput" name="messageInput" onChange={setNewMessage} aria-describedby="messageHelp" />
                                </div>
                            </div>
                            <div className="form-row text-center">
                                <div className="col mt-3">
                                    <div type="button" className="btn btn-custom" tabIndex="0" onClick={saveMessage}>Submit</div>
                                </div>
                            </div>
                        </form>
                        <p style={{ color: "#e83e8c" }} className="mt-3 mb-1">
                            {messages.length === 0 ? "No Messages" : messages.length + (messages.length > 1 ? " messages" : " message")}
                        </p>
                        {messages.map((message, i) =>
                            <div className="col-md-12 mt-2 mb-2 message-card" key={i}>
                                <div className="pt-1">
                                    <div style={{ fontStyle: "italic" }} className="mt-1 mb-1">"{message.message}"</div>
                                    <div style={{ color: "#61dafb" }} className="mb-2">{moment(message.created_date).format("DD MMMM YYYY h:mm A")}</div>
                                    <div className="btn btn-sm btn-custom-red mb-1 mt-1" data-message_id={message._id} onClick={deleteMessage}>Delete</div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="col-md-12 pt-3 pb-3">
                        <a href="https://github.com/nick-ramsay/daily-planner" target="_blank" rel="noopener noreferrer" title="Check out this repo on GitHub!" className="github-link">
                            <img className="github-logo" src={GithubLogo} alt="GitHub_logo" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;