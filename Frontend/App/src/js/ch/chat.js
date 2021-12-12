import "../../css/chat.scss";
import React, { useState, useEffect, useRef } from "react";
import { sendMessage, getAllMessages, getMessageByID, getMessageSince } from "./message.js";

function Chat({ username }) {
  const [user, setUser] = useState(username);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMess, setNewMess] = useState(0);
  const [logged, setLogged] = useState(false);
  const [id, setId] = useState(0);

  if (user !== "") {
    localStorage.setItem('username', user);
  }

  useEffect(() => {
    setUser(localStorage.getItem('username'));
    setMessages([]);
    getAllMessages().then(data=>{
      console.log(data)

      let temp = [];
      data.Messages.forEach(function(item, index, array) {
        temp.push({
          id: item.Id,
          username: item.User,
          character: item.Character,
          text: item.Text
        });
      });
      setId(data.Messages.length);
      console.log("data Messages length " + data.Messages.length)
      console.log("message id " + id)
      setMessages([...temp]);

    });
    
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Trying to get message sincy with id=: " + (id - 1))
      getMessageSince(id - 1).then(data=>{
        console.log("DATA TEST:")
        console.log(data)
        if(data == null)
          return;
        let temp = messages;
        data.Messages.forEach(function(item, index, array) {
        temp.push({
          id: item.Id,
          username: item.User,
          character: item.Character,
          text: item.Text
        });
        setId(id + 1);
      });
      setMessages([...temp]);
    });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setLogged(true)
  }, [logged]);

  const newMessSetter = () => {
    if (text !== "") {
      setNewMess(newMess + 1);
    }
  }

  useEffect(() => {
    if (text !== "") {

      let temp = messages;
      temp.push({
        id: id,
        username: user,
        character: user,
        text: text,
      });
      setMessages([...temp]);

      sendMessage(user, user, text, false);
      setText("");
    }
  }, [newMess]);

  const messagesEndRef = useRef(null);

  console.log(messages, "mess");

  return (
    <div className="chat" id= "chat">
      <div className="user-name">
        <h2>
          {user} <span style={{ fontSize: "0.7rem" }} />
        </h2>
      </div>
      <div className="chat-message">
        {messages.map((i) => {
          if (i.username === user) {
            return (
              <div className="message mess-right">
                <p>{i.text}</p>
                <span>{i.username}</span>
                <span>{i.character}</span>
              </div>
            );
          } else {
            return (
              <div className="message">
                <p>{i.text} </p>
                <span>{i.username}</span>
                <span>{i.character}</span>
              </div>
            );
          }
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="send">
        <input
          placeholder="enter your message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              newMessSetter();
            }
          }}
        ></input>
        <button onClick={newMessSetter}>Send</button>
      </div>
    </div>
  );
}
export default Chat;