import React from "react";
import {SocketContext} from './menu';
import { Link } from "react-router-dom";
import "../../css/hostGame.css"
import { useState, useEffect,useContext } from "react";
function HostHTML({ setUsername }){
        const socket = useContext(SocketContext);
        return(
            <div className = "hostBody">
                <header className="hostTitle"> Host Game </header>
                <form className="hostForm">
                    <div className="forms">
                    <label htmlFor="uName">Username:</label><br></br>
                    <input className="hostInput" typ="text" id="uName" name = "uName"></input><br></br>
                    <label htmlFor="roomID"> Insert room id:</label><br></br>
                    <input className="hostInput" type="text" id="roomID" name = "roomID"></input><br></br>
                    <label htmlFor="roomID"> Insert battlemap id:</label><br></br>
                    <input className="hostInput" type="text" id="battlemapName" name = "battlemapName"></input>
                    </div>
                </form>
                <div className = "buttons">
                <Link to={"/battlemap"}>
                <button className="hostButton" onClick={() => {
                        var roomID = document.getElementById("roomID").value ? document.getElementById("roomID").value : "";
                        var username= document.getElementById("uName").value ? document.getElementById("uName").value : "";
                        var battlemap= document.getElementById("battlemapName").value ? document.getElementById("battlemapName").value : "";
                        console.log(username);
                        if(username!=="" && roomID!=="" && battlemap!=="" ) {
                            setUsername(username);
                            var roomData = "{\"Room\":\""+roomID+"\",\"Battlemap\":"+battlemap+"\"}";
                            var jsonF = JSON.parse(roomData);
                            
                            socket.emit('create',jsonF);
                            
                            
                        }
                        
                }}>Enter</button> </Link>
                <Link to={`/`}>
                 <button className="hostButton">Back</button>
                 </Link>
                </div>
            </div>
        );


}
export default HostHTML;