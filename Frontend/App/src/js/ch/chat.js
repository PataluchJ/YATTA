import "../../css/chat.scss";
import React, { useState, useEffect, useRef, useContext } from "react";
import {SocketContext} from '../m/menu';
import BattleMap from "../bm/battlemapReact";

function Chat({ username, roomID }) {
  const socket = useContext(SocketContext);

  const [user, setUser] = useState(username);
  const [room, setRoom] = useState(roomID);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMess, setNewMess] = useState(0);
  const [logged, setLogged] = useState(false);
  const id = useRef(0);

  if (user !== "") {
    localStorage.setItem('username', user);
    localStorage.setItem('roomID', room);
  }

  useEffect(() => {
    setUser(localStorage.getItem('username'));
    setRoom(localStorage.getItem('roomID'));
    
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
      
      if (text.startsWith("/")) {
        var msg = '{"Room":"' + room + '", "User":"' + user + '","Character":"' + user + '","Command":"' + text + '"}';
      var jsonF = JSON.parse(msg);
        socket.emit('exec_command', jsonF);
      } else {
        var msg = '{"Room":"' + room + '", "User":"' + user + '","Character":"' + user + '","Text":"' + text + '"}';
      var jsonF = JSON.parse(msg);
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
        
      </div>
      <button onClick={newMessSetter}>Send</button>
    </div>
  );
}
export default Chat;