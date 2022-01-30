
import { useState, useEffect,useContext } from "react";
import React from "react";
import {SocketContext} from '../m/menu';
import { Renderer } from "pixi.js";
var colToken;
var hTokens = [];
var sheets = ["Wojownik","Mag","Łotrzyk","Bard","Kapłan","Paladyn"];
var eq = {};
eq["Wojownik"] = ["Potężny Dwuręczny Miecz","Tarcza"];
eq["Mag"] = ["magiczny pocisk","kula ognia","kostur"];
eq["Łotrzyk"] = ["nożyk", "skrytobójczy skok"];
eq["Bard"]=[""];
eq["Kapłan"] =[""];
eq["Paladyn"] =[""];
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