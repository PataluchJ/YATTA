
import { useState, useEffect,useContext } from "react";
import React from "react";
import {SocketContext} from '../m/menu';
import { Renderer } from "pixi.js";
var colToken;
var hTokens = [];
var sheets = ["sheet 1","sheet 2","sheet 3"];
var eq = {};
eq["sheet 1"] = ["mieczyk","łuk","tarczka"];
eq["sheet 2"] = ["magiczny pocisk","kula ognia","kostur"];
eq["sheet 3"] = ["nożyk", "skrytobójczy skok"];
eq[""]=[""];
function setSh(i,setSheet){
    console.log(i);
    setSheet(i);
}
function SecondMenu({gameData}){
    const [activeSheet, setSheet] = useState("");
    const [gD,setGameData]= useState("");
    const socket = useContext(SocketContext);
    useEffect(() => {
        socket.on("join",data=>{setGameData(data);} ); },[]);

        console.log("GAME DATA");
        console.log(gD);
        

return(
    
    <table className="mainTable" key="sheets">
        <tr className="colOne">
        {sheets.map((i) => {
            
            return(
                <tr onClick={() => setSh(i,setSheet)} classId={i} className="e">
                   {i} 
                </tr>
            );


        })}
        </tr>
        <tr className="colTwo">
            {
                
                eq[activeSheet].map((i) => { 
                    return(
                        <tr classId={i} className="e">
                           {i} 
                        </tr>
                    );

                })
            

            }
        </tr>
        <tr  className="colThree">

        </tr>
        <tr  className="colFour">

        </tr>

    </table>

);



}
export default SecondMenu;