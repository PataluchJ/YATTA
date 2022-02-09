import "../../css/chat.scss";

import React, { useState, useEffect, useRef, useContext } from "react";
import {SocketContext} from '../m/menu';
import ImageUpload from './image_upload'
import AddToken from './add_token'
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
  const [showAddObject, setShowAddObject] = useState(false)
  const [isRequiringImages, setIsRequiringImages] = useState(false)
  const [imagesReceived, setImagesReceived] = useState(false)
  const [imageList, setImageList] = useState([])
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

    socket.on("image_get_all", data => {
      if(isRequiringImages) {
        setImageList(data);
        setImagesReceived(true);
        toggleAddTokenPopup();
      }
    });

    return () => {
      socket.off("join");
      socket.off("new_message");
      socket.off("exec_results");
      socket.off("image_new");
      socket.off('image_get_all');
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
    console.log("toggleUploadPopup");
    setShowUpload(!showUpload);
  }

  const uploadImage = (image,name) => {
    const json = {'Room': room, 'Image': image, 'Name': name};
    socket.emit('image_new', json);
    toggleUploadPopup();
  }

  const toggleAddTokenPopup = () => {
    console.log("toggleAddTokenPopup");
    setShowAddObject(!showAddObject);
    console.log("Set showAddObject to ", showAddObject)
  }

  const addToken = (name) => {
    console.log("Add token with name ", name);
    let json = {
      'Image_Name': name,
      'Room': room,
      'Position':{
          'Level': 0,
          'Layer': 0,
          'Coords':{
            'x': 10.0,
            'y': 10.0,
            'z_layer': 0
        }
      }
    };
    socket.emit('object_new', json);
   // toggleAddTokenPopup();
  }

  const setBackground = (name) => {
    let json = {
      'Room': room,
      'Image': name
    }
    socket.emit('set_background', json);
  }

  const askForAllImages = () => {
    const json = {'Room': room};
    socket.emit('image_get_all', json);
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
      <button className="chatButtons" onClick={() => {
        var roomData = "{\"Room\":\""+room+"\"}";
        var jsonF = JSON.parse(roomData);                    
        socket.emit('sheets_get',jsonF);
      }}>Create new character sheet</button>
      </Link>
      <button className="chatButtons" onClick={() => {setIsRequiringImages(true); askForAllImages();}}>Add object</button>
      <Link to={`/`}>
      <button className="chatButtons" onClick={() => {logOutButton();}}>Logout</button>
      </Link>
      <button className="chatButtons" onClick={() => {toggleUploadPopup();}} >Upload image</button>
    
          {showUpload ? 
            <ImageUpload
            closePopup={toggleUploadPopup.bind(this)}
            sendImage={uploadImage.bind(this)}
            />
            : null
          }

          {showAddObject ? 
            <AddToken
            closePopup={toggleAddTokenPopup.bind(this)}
            addToken={addToken.bind(this)}
            setBackground={setBackground.bind(this)}
            askForImages={askForAllImages.bind(this)}
            setReqFlag={setIsRequiringImages.bind(this)}
            imgRec = {imagesReceived}
            imageList = {imageList}
            />
          : null
          }
    </div>
  );
}
export default Chat;