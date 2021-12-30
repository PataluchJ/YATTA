import { Link } from "react-router-dom";
import "../../css/joinGame.css"
import React from "react";
import {socket} from "./menu";
// function tryToConnect(setUsername) {
//     var roomID = document.getElementById("roomID").value ? document.getElementById("roomID").value : "";
//     var username= document.getElementById("uName").value ? document.getElementById("uName").value : "";
//     console.log(username);
//     if(username!=null && roomID!=null) {


//     }
//     setUsername(username);
//     return;
// }

function giveMeHTML({ setUsername }) {
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
                <Link to={`/battleMap`}>
                <button className="joinButton" onClick={() => {
                        var roomID = document.getElementById("roomID").value ? document.getElementById("roomID").value : "";
                        var username= document.getElementById("uName").value ? document.getElementById("uName").value : "";
                        console.log(username);
                        if(username!=null && roomID!=null) {
                            setUsername(username);
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
        );
}

export default giveMeHTML;