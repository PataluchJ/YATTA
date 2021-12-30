
import { useState, useEffect,useContext } from "react";
import React from "react";
import {SocketContext} from '../m/menu';
function SecondMenu({gameData}){
    const [gD,setGameData]= useState("");
    const socket = useContext(SocketContext);
    useEffect(() => {
        socket.on("join",data=>{setGameData(data);} );
            
          },[]);

        console.log("GAME DATA");
        console.log(gD);
   
   
return(
    <table className="mainTable">
        <tr className="colOne">
        <td>Postac 1</td>
        </tr>
        <tr className="colTwo">
        <td>Umiejki</td>
        </tr>
        <tr  className="colThree">

        </tr>
        <tr  className="colFour">

        </tr>


    </table>

);



}
export default SecondMenu;