import { Link } from "react-router-dom";
import "../../css/joinGame.css"
import { useState, useEffect,useContext } from "react";
import React from "react";
import {SocketContext} from './menu';
// function tryToConnect(setUsername) {
//     var roomID = document.getElementById("roomID").value ? document.getElementById("roomID").value : "";
//     var username= document.getElementById("uName").value ? document.getElementById("uName").value : "";
//     console.log(username);
//     if(username!=null && roomID!=null) {


//     }
//     setUsername(username);
//     return;
// }
var currGameInfo;


function GiveMeHTML({ setUsername, setRoomID }) {
    const socket = useContext(SocketContext);
        return(
            <div className = "joinBody">
                <header className="joinTitle"> Join Game </header>
                <form className="joinForm">
                    <div className="forms">
                    <label htmlFor="uName">Username:</label><br></br>
                    <input className="joinInput" typ="text" id="uName" name = "uName"></input><br></br>
                    <label htmlFor="roomID"> Insert room id:</label><br></br>
                    <input className="joinInput" type="text" id="roomID" name = "roomID"></input>
                    </div>
                </form>
                <div className = "buttons">
                <Link to={"/battlemap"}>
                <button className="joinButton" onClick={() => {
                        var roomID = document.getElementById("roomID").value ? document.getElementById("roomID").value : "";
                        var username= document.getElementById("uName").value ? document.getElementById("uName").value : "";
                        console.log(username);
                        setUsername(username);
                        setRoomID(roomID);
                        if(username!=="" && roomID!=="") {
                           
                            var roomData = "{\"Room\":\""+roomID+"\"}";
                            var jsonF = JSON.parse(roomData);
                            
                            socket.emit('join',jsonF);
                            
                            
                        }
                        
                }}>Enter</button> </Link>
                <Link to={`/`}>
                 <button className="joinButton">Back</button>
                 </Link>
                </div>
            </div>
        );
}
export {currGameInfo};
export default GiveMeHTML;