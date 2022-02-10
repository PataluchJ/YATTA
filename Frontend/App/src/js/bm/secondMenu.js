import { useState, useEffect,useContext, useRef } from "react";
import React from "react";
import {socket} from '../m/menu';
import {SocketContext} from '../m/menu';
import { Renderer } from "pixi.js";
import "../../css/charSheets.css"
import { Socket } from "socket.io-client";
function SecondMenu({ username, roomID }){
    const [user, setUser] = useState(username);
    const [room, setRoom] = useState(roomID);

    const [charNames, setCharNames] = useState([]);
    const [charEquipment, setCharEquipment] = useState({});
    const [charAbilities, setCharAbilities] = useState({});
    const [charItemsDescription, setCharItemsDescription] = useState({});

    const [activeName, setActiveName] = useState(null);
    const [activeItem, setActiveItem] = useState("");
    const id = useRef(0);

    if (user !== "") {
        console.log("AAAAAAAAAAAAAAAAAAA:" + room)
        localStorage.setItem('username', user);
        localStorage.setItem('roomID', room);
      }
    
    // useEffect(() => {
    //     socket.on("sheet_new", () => {
    //         var roomData = "{\"Room\":\""+room+"\"}";
    //         var jsonF = JSON.parse(roomData);    
                        
    //         socket.emit('sheets_get',jsonF);
    //     })
    //     socket.on("sheet_edit", () => {
    //         var roomData = "{\"Room\":\""+room+"\"}";
    //         var jsonF = JSON.parse(roomData);                    
    //         socket.emit('sheets_get',jsonF);
    //     })
        
    //     socket.on("sheets_get", data => {
    //         let tempNames = [];
    //         let tempEq = {};
    //         let tempAb = {};
    //         let tempDesc = {};
    //       console.log("SIEAM SHEETS GET " +roomID);
           
           
    //         data.forEach(function(item) {
    //             console.log(item.Name);
    //             tempNames.push({
    //                 id: item.Id,
    //                 name: item.Name
    //             });
    //             var tempTempEq = [];
    //             item.Equipment.forEach(function(item2) {
                    
    //                 var tempTempDc = [];
    //                 tempTempEq.push(item2.Name);
    //                 tempTempDc.push(item2.Description);
    //                 tempDesc[item2.Name] = tempTempDc;
    //                 tempEq[item.Name] = tempTempEq;
    //                 console.log("Name "+item2.Name+" "+item.Name);
    //             });
                
    //             var tempTempAb = [];
    //             item.Abilities.forEach(function(item2) {
                    
    //                 var tempTempDc = [];
    //                 tempTempAb.push(item2.Name);
    //                 tempTempDc.push(item2.Description);
    //                 tempAb[item.Name] = tempTempAb;
    //                 tempDesc[item2.Name] = tempTempDc;
    //                 console.log("Name "+item2.Name+" "+item.Name);
    //             });
    //         });
    //         id.current = data.length;
    //         console.log("eq ");
    //         console.log(tempEq);
    //         setCharNames([...tempNames]);
    //         setCharEquipment({...tempEq});
    //         setCharAbilities({...tempAb});
    //         setCharItemsDescription({...tempDesc});
    //     });
    
    //     return () => {
    //       socket.off("sheets_get");
    //       socket.off("sheet_new");
    //       socket.off("sheet_edit");
    //     }
    // });
    useEffect(() => {
        console.log("SIEAM ENTER");
        setUser(localStorage.getItem('username'));
        setRoom(localStorage.getItem('roomID'));
        var roomData = "{\"Room\":\""+room+"\"}";
        var jsonF = JSON.parse(roomData);                    
        socket.emit("sheets_get",jsonF);
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [user, room]);
   

        
        

return(
    
    <table className="mainTable" key="sheets">
        <tr className="colOne">
        {charNames.map((i) => { 
                return(
                    <tr className="e" onClick={() => {setActiveName(i);setActiveItem("");console.log(i);console.log(charEquipment[i.name]);}} classId={i}>
                    {i.name} 
                    </tr>
                );
            })}
        </tr>
        <tr className="colTwo">
        {charEquipment[activeName?.name]?.map((i) => { 
                return(
                    <tr className="e" onClick={() => setActiveItem(i)} classId={i}>
                    {i} 
                    </tr>
                );
            })}
        </tr>
        <tr  className="colThree">
        {charAbilities[activeName?.name]?.map((i) => { 
                return(
                    <tr className="e" onClick={() => setActiveItem(i)} classId={i}>
                    {i} 
                    </tr>
                );
            })}
        </tr>
        <tr  className="colFour">
        
                    <tr className="e" classId={activeItem}>
                    {charItemsDescription[activeItem]} 
                    </tr>
        </tr>

    </table>

);



}
export default SecondMenu;