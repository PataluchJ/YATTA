import { Link } from "react-router-dom";
import "../../css/joinGame.css"
import React from "react";

// function tryToConnect(setUsername) {
//     var StringIP = document.getElementById("gmip").value ? document.getElementById("gmip").value : "";
//     var username= document.getElementById("uName").value ? document.getElementById("uName").value : "";
//     console.log(username);
//     if(username!=null && StringIP!=null) {


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
                    <label htmlFor="gmip"> Insert GM IP:</label><br></br>
                    <input className="joinInput" type="text" id="gmip" name = "gmip"></input>
                    </div>
                </form>
                <div className = "buttons">
                <Link to={`/battleMap`}>
                <button className="joinButton" onClick={() => {
                        var StringIP = document.getElementById("gmip").value ? document.getElementById("gmip").value : "";
                        var username= document.getElementById("uName").value ? document.getElementById("uName").value : "";
                        console.log(username);
                        if(username!=null && StringIP!=null) {
                    
                    
                        }
                        setUsername(username);
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