import { useState, useEffect,useContext } from "react";
import React from "react";
import {socket} from '../m/menu';
import {SocketContext} from '../m/menu';
import { Renderer } from "pixi.js";
import "../../css/charSheets.css"
import { Socket } from "socket.io-client";
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
opisy["Szarża"] = ["Porusz się o 2 pola, zadaj 2d6 obrażeń"];
opisy["Podwójne uderzenie"] = ["Zadaj dwukrotnie większą ilość obrażeń następnym atakiem"];
opisy["Magiczny pocisk"] = ["Zadaj 1d12 obrażeń magicznych, zasięg 4"];
opisy["Czarodziejska bariera"] = ["Zaneguj 2d6 magicznych obrażeń"];
opisy["Zatrucie szkieletu"] = ["Twoja broń zadaje 2d4 więcej obrażeń przez 3 następne tury"];
opisy["Ballada o JW"] = ["Twoi towarzysze w promieniu 2 pól zadają 2d4 więcej obrażeń. Trwa 3 tury"];
opisy["Ballada o spalonej synagodze"] = ["Twoi towarzysze w promieniu 2 pól mogą przemieścić się o 2 pola więcej. Trwa 2 tury"];
opisy["Ballada wrześniowa"]=["Przeciwnicy w promieniu 3 pól tracą 3pkt dowolnej defensywy"];
opisy["Dotyk który leczy"]=["Ulecz towarzysza w promieniu 3 pól o 3d4"];
opisy["Święte słowo"]=["Twoi towarzysze w promieniu 3 leczą się o 2d3 przy zadawaniu obrażeń. Trwa 3 tury"];
opisy["Aura prawości"]=["Pasywnie zwiększa negację obrażeń fizycznych o 2pkt wszystkich sojuszników w promieniu 3 pól"];
opisy["Czas młota"]=["Dokonujesz egzekucji przeciwników mających poniżej 3hp przy zadawaniu obrażeń. Trwa 3 tury"];
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
    console.log("GAME DATA enter");
    socket.on("join", data => {
        setGameData(data);
        console.log("GAME DATA");
        console.log(gD);
    });

        
        

return(
    
    <table className="mainTable" key="sheets">
        <tr className="colOne">
        {sheets.map((i) => {
            
            return(
                <tr className="e" onClick={() => setSh(i,setSheet)} classId={i} className="e">
                   {i} 
                </tr>
            );


        })}
        </tr>
        <tr className="colTwo">
            {
                
                eq[activeSheet].map((i) => { 
                    return(
                        <tr className="e" onClick={() => setIt(i,setItem)} classId={i} className="e">
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
                        <tr className="e"  onClick={() => setIt(i,setItem)}  classId={i} className="e">
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
                <tr className="e" classId={i} className="e">{i}</tr>
            );
        
        })}
        </tr>

    </table>

);



}
export default SecondMenu;