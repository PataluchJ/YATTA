import React from "react";
import {SocketContext} from './menu';
import { Link } from "react-router-dom";
import "../../css/hostGame.css"
import { useContext } from "react";
function HostHTML({ setUsername, setRoomID }){
        const socket = useContext(SocketContext);
        return(
            <div className = "hostBody">
                <header className="hostTitle"> Host Game </header>
                <div className="restJoin">
                    <form className="hostForm">
                        <div className="forms">
                            <label htmlFor="uName" className="jTitle">Username:</label><br></br>
                            <input className="hostInput" typ="text" id="uName" name = "uName"></input><br></br>
                            <label htmlFor="roomID" className="jTitle"> Insert room id:</label><br></br>
                            <input className="hostInput" type="text" id="roomID" name = "roomID"></input><br></br>
                            </div>
                    </form>
                    <div className = "buttons">
                    <Link to={"/battlemap"}>
                        <button className="hostButton" onClick={() => {
                                var roomID = document.getElementById("roomID").value ? document.getElementById("roomID").value : "";
                                var username= document.getElementById("uName").value ? document.getElementById("uName").value : "";
                                
                                if(username!=="" && roomID!==""  ) {
                                    setUsername(username);
                                    setRoomID(roomID);
                                    localStorage.setItem('roomID', roomID);
                                    var roomData = "{\"Name\":\""+roomID+"\",\"Battlemap\":\""+battlemap+"\"}";
                                    var jsonF = JSON.parse(roomData);
                                    
                                    socket.emit('create',jsonF);
                                }   
                        }}>Enter</button>
                    </Link>
                    <Link to={`/`}>
                        <button className="hostButton">Back</button>
                    </Link>
                    </div>
                </div>
            </div>
        );


}
export default HostHTML;