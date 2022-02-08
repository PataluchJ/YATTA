import { Link } from "react-router-dom";
import "../../css/joinGame.css"
import { useContext } from "react";
import React from "react";
import {SocketContext} from './menu';
var currGameInfo;


function GiveMeHTML({ setUsername, setRoomID }) {
    const socket = useContext(SocketContext);
        return(
            <div className = "joinBody">
                <header className="joinTitle"> Join Game </header>
                <div className="restJoin">
                    <form className="joinForm">
                        <div className="forms">
                            <label htmlFor="uName" className="jTitle">Username:</label><br></br>
                            <input className="joinInput" typ="text" id="uName" name = "uName"></input><br></br>
                            <label htmlFor="roomID" className="jTitle"> Insert room id:</label><br></br>
                            <input className="joinInput" type="text" id="roomID" name = "roomID"></input>
                        </div>
                    </form>
                    <div className = "buttons">
                        <Link to={"/battlemap"}>
                            <button className="joinButton" onClick={() => {
                                    var roomID = document.getElementById("roomID").value ? document.getElementById("roomID").value : "";
                                    var username= document.getElementById("uName").value ? document.getElementById("uName").value : "";
                                    setUsername(username);
                                    setRoomID(roomID);
                                    
                                    console.log("roomID:" + roomID)
                                    localStorage.setItem('roomID', roomID);
                                    if(username!=="" && roomID!=="") {
                                        console.log("roomID2:" + roomID)

                                        var roomData = "{\"Room\":\""+roomID+"\"}";
                                        var jsonF = JSON.parse(roomData);
                                        
                                        socket.emit('join',jsonF);
                                    } 
                            }}>Enter</button>
                        </Link>
                        <Link to={`/`}>
                            <button className="joinButton">Back</button>
                        </Link>
                    </div>
                </div>
            </div>
        );
}
export {currGameInfo};
export default GiveMeHTML;