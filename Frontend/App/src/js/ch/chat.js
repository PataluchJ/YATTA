import "../../css/chat.scss";

import React, { useState, useEffect, useRef, useContext } from "react";
import {SocketContext} from '../m/menu';
import PopUp from './upload'
import ReactDOM from 'react-dom'
import { Link } from "react-router-dom";
import { TilingSprite } from "pixi.js";

function Chat({ username, roomID }) {
  const socket = useContext(SocketContext);

  const [user, setUser] = useState(username);
  const [room, setRoom] = useState(roomID);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMess, setNewMess] = useState(0);
  const [logged, setLogged] = useState(false);
  const [showUpload, setShowUpload] = useState(false)
  const id = useRef(0);

  if (user !== "") {
    console.log("AAAAAAAAAAAAAAAAAAA:" + room)
    localStorage.setItem('username', user);
    localStorage.setItem('roomID', room);
  }

  useEffect(() => {
    setUser(localStorage.getItem('username'));
    setRoom(localStorage.getItem('roomID'));
    setLogged(true);

    var roomData = "{\"Room\":\""+room+"\"}";
    var jsonF = JSON.parse(roomData);                    
    socket.emit('join',jsonF);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, room]);

  useEffect(() => {
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

    socket.on("image_new", data => {
      let name = data['Name'];
      console.log(name);
    });

    socket.on("new_message", data => {
      console.log("Message")
      let temp = [];
      temp.push({
        id: id,
        username: data.User,
        character: data.Character,
        text: data.Text,
      });
      id.current++;

      setMessages(prev => prev.concat(temp));
    });

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
    });

    return () => {
      socket.off("join");
      socket.off("new_message");
      socket.off("exec_results");
      socket.off("image_new");
    }
  });

  const newMessSetter = () => {
    if (text !== "") {
      setNewMess(newMess + 1);
    }
  }

  const logOutButton = () => {
    setLogged(false);
    localStorage.removeItem('username');
    localStorage.removeItem('roomID');
  }

  const toggleUploadPopup = () => {
    setShowUpload(!showUpload);
  }

  const uploadImage = (image,name) => {
    const json = {'Room': room, 'Image': image, 'Name': name}
    socket.emit('image_new', json)
  }

  useEffect(() => {
    if (text !== "") {
      var msg;
      var jsonF;

      if (text.startsWith("/")) {
        msg = '{"Room":"' + room + '", "User":"' + user + '","Character":"' + user + '","Command":"' + text + '"}';
        jsonF = JSON.parse(msg);
        socket.emit('exec_command', jsonF);
      } else {
        msg = '{"Room":"' + room + '", "User":"' + user + '","Character":"' + user + '","Text":"' + text + '"}';
        jsonF = JSON.parse(msg);
        socket.emit('send_message', jsonF);
      }

      setText("");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <button className="chatButtons" onClick={newMessSetter}>Send</button>
      <Link to={`/creator`}>
      <button className="chatButtons">Create new character sheet</button>
      </Link>
      <button className="chatButtons">Add object</button>
      <Link to={`/`}>
      <button className="chatButtons" onClick={logOutButton}>Logout</button>
      </Link>
      <button className="chatButtons" onClick={toggleUploadPopup} >Upload image</button>
    
          {showUpload ? 
            <PopUp
            closePopup={toggleUploadPopup.bind(this)}
            sendImage={uploadImage.bind(this)}
            
            />
            : null
          }
    </div>
  );
}
export default Chat;