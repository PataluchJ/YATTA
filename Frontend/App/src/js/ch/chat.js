import "../../css/chat.scss";
import React, { useState, useEffect, useRef } from "react";
import { sendMessage, getAllMessages, getMessageByID, getMessageSince } from "./message.js";

function Chat({ username }) {
  const [user, setUser] = useState(username);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [id, setId] = useState(0);
  const [logged, setLogged] = useState(false);

  if (user !== "") {
    localStorage.setItem('username', user);
  }

  useEffect(() => {
    setUser(localStorage.getItem('username'));

    const allMessages = getAllMessages();

    let temp = messages;
    allMessages.Messages.forEach(function(item, index, array) {
      temp.push({
        username: item.User,
        character: item.Character,
        text: item.Text
      });

    });

    setMessages([...temp]);

  }, [user]);

  useEffect(() => {
    setLogged(true)
  }, [logged]);

  const idSetter = () => {
    if (text !== "") {
      setId(id + 1);
    }
  }

  useEffect(() => {
    if (text !== "") {

      let temp = messages;
      temp.push({
        username: user,
        character: user,
        text: text,
      });
      setMessages([...temp]);

      sendMessage( username, username, text, false);
      setText("");
    }
  }, [id]);

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
              idSetter();
            }
          }}
        ></input>
        <button onClick={idSetter}>Send</button>
      </div>
    </div>
  );
}
export default Chat;