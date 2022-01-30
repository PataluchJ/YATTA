
import { useState, useEffect,useContext } from "react";
import React from "react";
import {SocketContext} from '../m/menu';
import { Renderer } from "pixi.js";
var colToken;
var hTokens = [];
var sheets = ["Wojownik","Mag","Łotrzyk","Bard","Kapłan","Paladyn"];
var eq = {};
var ab = {};
var opisy = {};
eq["Wojownik"] = ["Potężny Dwuręczny Miecz","Zdobiona Tarcza","Zbroja Wojownika", "Woda Życia"];
eq["Mag"] = ["Spróchniały kostur","Lekka szata"];
eq["Łotrzyk"] = ["Zabójczy Sztylet","Moneta Modliszki","Peleryna Niewidka"];
eq["Bard"]=["Elfia Lutnia","Magiczna Flet","Minstreski Strój"];
eq["Kapłan"] =["Święta Księga","Kula Tornami"];
eq["Paladyn"] =["Święty Młot","Trzytonowa Tunika"];
ab["Wojownik"]=["Szarża","Podwójne uderzenie"];
ab["Mag"]=["Magiczny pocisk","Czarodziejska bariera"];
ab["Łotrzyk"]=["Zatrucie sztyletu"];
ab["Bard"]=["Ballada o JW","Ballada o spalonej synagodze","Ballada wrześniowa"];
ab["Kapłan"]=["Dotyk który leczy","Święte słowo"];
ab["Paladyn"]=["Aura prawości","Czas młota"];
opisy["Potężny Dwuręczny Miecz"] = ["Zadaj obrażenia 2d6, zasięg 1"];
opisy["Zdobiona Tarcza"] = ["Blok 1d4"];
opisy["Zbroja Wojownika"] = ["Negacja obrażeń fizycznych 4"];
opisy["Woda Życia"] = ["Leczenie 1d12"];
opisy["Spróchniały kostur"] = ["Zadaj obrażenia 1d6, zasięg 1"];
opisy["Lekka szata"] =["Negacja obrażeń magicznych 3"];
opisy["Zabójczy Sztylet"] = ["Zadaj obrażenia 3d4, zasięg 1"];
opisy["Moneta Modliszki"] = ["Porusz się maksymalnie o 4 pola"];
opisy["Peleryna Niewidka"] = ["Niewidzialność 2 tury"];
opisy["Elfia Lutnia"] = ["Odblokowuje dostęp do zaklęć barda"];
opisy["Magiczna Flet"] = ["Pozwala zagrać Mazurek Ojca Pijo"];
opisy["Minstreski Strój"] = ["Negacja obrażeń magicznych 2"];
opisy["Święta Księga"] = ["Odblokowuje dostęp do zaklęć kapłana"];
opisy["Kula Tornami"] = ["Wylecz maksymalnie dwóch towarzyszy 3d4, zasięg 4"];
opisy["Święty Młot"] = ["Zadaj obrażenia 2d6, zasięg 1"];
opisy["Trzytonowa Tunika"] = ["Negacja obrażeń fizycznych i magicznych 3"];
function setIt(i,setItem){
    setItem(i);
}
function setSh(i,setSheet){
    console.log(i);
    setSheet(i);
}
function SecondMenu({gameData}){
    const [activeSheet, setSheet] = useState("Wojownik");
    const [activeItem, setItem] = useState("Woda Życia");
    const [gD,setGameData]= useState(" ");
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
                        <tr onClick={() => setIt(i,setItem)} classId={i} className="e">
                           {i} 
                        </tr>
                    );

                })
            

            }
        </tr>
        <tr  className="colThree">
        {
                
                ab[activeSheet].map((i) => { 
                    return(
                        <tr onClick={() => setIt(i,setItem)}  classId={i} className="e">
                           {i} 
                        </tr>
                    );

                })
            

            }
        </tr>
        <tr  className="colFour">
            {
        opisy[activeItem].map((i) => { 
            return(
                <tr classId={i} className="e">{i}</tr>
            );
        
        })}
        </tr>

    </table>

);



}
export default SecondMenu;