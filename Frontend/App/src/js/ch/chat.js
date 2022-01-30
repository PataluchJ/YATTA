import "../../css/chat.scss";
import React, { useState, useEffect, useRef, useContext } from "react";
import {SocketContext} from '../m/menu';

function Chat({ username }) {
  const socket = useContext(SocketContext);

  const [user, setUser] = useState(username);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMess, setNewMess] = useState(0);
  const [logged, setLogged] = useState(false);
  const id = useRef(0);

  if (user !== "") {
    localStorage.setItem('username', user);
  }

  useEffect(() => {
    setUser(localStorage.getItem('username'));
    
    socket.on("join", data => {
      let temp = [];
        data.Messages.forEach(function(item, index, array) {
          temp.push({
            id: item.Id,
            username: item.User,
            character: item.Character,
            text: item.Text
          });
        });
        id.current = data.Messages.length;

      setMessages([...temp]);
    });

    socket.on("new_message", data => {

      let temp = [];
      temp.push({
        id: id,
        username: data.User,
        character: data.Character,
        text: data.Text,
      });
      id.current++;

      setMessages(prev => prev.concat(temp));
    })

    socket.on("exec_results", data => {

      let temp = [];
      temp.push({
        id: id,
        username: data.User,
        character: data.Character,
        text: data.Results,
      });
      id.current++;

      setMessages(prev => prev.concat(temp));
    })

  }, [user]);

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

      var msg = '{"Room":"Test", "User":"' + user + '","Character":"' + user + '","Text":"' + text + '"}';
      var jsonF = JSON.parse(msg);
      
      if (text.startsWith("/")) {
        socket.emit('exec_command', jsonF);
      } else {
        socket.emit('send_message', jsonF);
      }

      setText("");
    }
  }, [newMess]);

  const messagesEndRef = useRef(null);

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