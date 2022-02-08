import { Link } from "react-router-dom";
import {SocketContext} from '../m/menu';
import React, { useState, useEffect, useContext, useRef } from "react";

function CharacterCreator({ username, roomID }){
    const socket = useContext(SocketContext);

    const [user, setUser] = useState(username);
    const [room, setRoom] = useState(roomID);

    const [charNames, setCharNames] = useState([]);
    const [charEquipment, setCharEquipment] = useState({});
    const [charAbilities, setCharAbilities] = useState({});
    const [charItemsDescription, setCharItemsDescription] = useState({});

    const [activeName, setActiveName] = useState("");
    const [activeItem, setActiveItem] = useState("");

    const [currentCharName, setCurrentCharName] = useState("");
    const [currentEqName, setCurrentEqName] = useState("");
    const [currentEqDesc, setCurrentEqDesc] = useState("");
    const [currentAbName, setCurrentAbName] = useState("");
    const [currentAbDesc, setCurrentAbDesc] = useState("");

    const id = useRef(0);

    if (user !== "") {
        localStorage.setItem('username', user);
        localStorage.setItem('roomID', room);
    }
    
    useEffect(() => {
        setUser(localStorage.getItem('username'));
        setRoom(localStorage.getItem('roomID'));

        var roomData = "{\"Room\":\""+room+"\"}";
        console.log(roomData);
        var jsonF = JSON.parse(roomData);                    
        socket.emit('sheets_get',jsonF);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [room]);

    useEffect(() => {
        socket.on("sheets_get", data => {
            let tempNames = [];
            let tempEq = {};
            let tempEqDesc = {};
            let tempAb = {};
            let tempAbDesc = {};

            data.forEach(function(item) {
                tempNames.push({
                    id: item.Id,
                    name: item.Name
                });

                item.Equipment.forEach(function(item2) {
                    tempEq[item.Name].push(item2.Name);
                    tempEqDesc[item2.Name].push(item2.Description);

                    setCharEquipment(temp => temp.concat(tempEq));
                    setCharItemsDescription(temp => temp.concat(tempEqDesc));

                    // tempEq[item.Name].push({
                    //     name: item2.Name,
                    //     description: item2.Description
                    // });
                });

                item.Abilities.forEach(function(item2) {
                    tempAb[item.Name].push(item2.Name);
                    tempAbDesc[item2.Name].push(item2.Description);

                    setCharAbilities(temp => temp.concat(tempAb));
                    setCharItemsDescription(temp => temp.concat(tempAbDesc));
                    
                    // tempAb[item.Name].push({
                    //     name: item2.Name,
                    //     description: item2.Description
                    // });
                });
            });
            id.current = data.length;
            setCharNames([...tempNames]);
        });
    
        return () => {
          socket.off("sheets_get");
        }
    });

return (
    <div className="creatorDiv">
        
        <table className="creatorTable" >
            <tr className="creatorMenu"> 
                <div className="tabTitle">Character</div>
                <label className="tTitle">Character name</label><br></br>
                <input className="tabInput" type="text" id="charNameInput" name ="charNameInput" value={currentCharName} onChange={(e) => setCurrentCharName(e.target.value)}></input><br></br>
                <button className="tabBut" onClick={() => {
                    if (currentCharName !== "" && !charNames.includes(currentCharName)) {
                        var msg = '{"Room":"' + room + '", "Name":"' + currentCharName + '","Equipment":[], "Abilities":[]}';
                        console.log(msg);
                        var jsonF = JSON.parse(msg);
                        socket.emit('sheet_new', jsonF);

                        setCharNames(prev => prev.concat(currentCharName));
                    }
                }}>New character</button><br></br>
                <div className="tabTitle">Equipment</div>
                <label className="tTitle">Item name</label><br></br>
                <input className="tabInput" type="text" id="itemNameInput" name = "itemNameInput" value={currentEqName} onChange={(e) => setCurrentEqName(e.target.value)}></input><br></br>
                <label className="tTitle">Item description</label><br></br>
                <textarea  className="descInput" type="text" id="itemDInput" name = "itemDInput" value={currentEqDesc} onChange={(e) => setCurrentEqDesc(e.target.value)}></textarea ><br></br>
                <button className="tabBut" onClick={() => {
                    if (currentCharName !== "" && !charNames.includes(currentCharName) && currentEqName !== "" && currentEqDesc !== "") {
                        var eqString = "";
                        Object.entries(charEquipment).forEach(function(item) {
                            if (currentEqName !== item) {
                                eqString += '{"Name":"' + item + '","Description":"' + charItemsDescription[item] + '"}';
                            } else {
                                eqString += '{"Name":"' + item + '","Description":"' + currentEqDesc + '"}';
                            }
                        });

                        var abString = "";
                        Object.entries(charAbilities).forEach(function(item) {
                            abString += '{"Name":"' + item + '","Description":"' + charItemsDescription[item] + '"}';
                        });

                        var msg = '{"Room":"' + room + '", "Name":"' + currentCharName + '","Equipment":[' + eqString + '], "Abilities":[' + abString + ']}';
                        console.log(msg);
                        var jsonF = JSON.parse(msg);
                        socket.emit('sheet_edit', jsonF);

                        setCharEquipment(prev => Object.entries(prev).concat(currentEqName));
                        setCharItemsDescription(prev => Object.entries(prev).concat(currentEqDesc));
                    }
                }}>Add item</button>
                <div className="tabTitle">Abilities</div>
                <label className="tTitle">Ability name</label><br></br>
                <input className="tabInput" type="text" id="abilityNameInput" name = "abilityNameInput" value={currentAbName} onChange={(e) => setCurrentAbName(e.target.value)}></input><br></br>
                <label className="tTitle">Ability description</label><br></br>
                <textarea className="descInput" type="text" id="abilityDInput" name = "abilityDInput" value={currentAbDesc} onChange={(e) => setCurrentAbDesc(e.target.value)}></textarea ><br></br>
                <button className="tabBut" onClick={() => {
                    if (currentCharName !== "" && !charNames.includes(currentCharName) && currentAbName !== "" && currentAbDesc !== "") {
                        var abString = "";
                        Object.entries(charAbilities).forEach(function(item) {
                            if (currentAbName !== item) {
                                abString += '{"Name":"' + item + '","Description":"' + charItemsDescription[item] + '"}';
                            } else {
                                abString += '{"Name":"' + item + '","Description":"' + currentEqDesc + '"}';
                            }
                        });

                        var eqString = "";
                        Object.entries(charEquipment).forEach(function(item) {
                            eqString += '{"Name":"' + item + '","Description":"' + charItemsDescription[item] + '"}';
                        });

                        var msg = '{"Room":"' + room + '", "Name":"' + currentCharName + '","Equipment":[' + eqString + '], "Abilities":[' + abString + ']}';
                        console.log(msg);
                        var jsonF = JSON.parse(msg);
                        socket.emit('sheet_edit', jsonF);

                        setCharAbilities(prev => Object.entries(prev).concat(currentAbName));
                        setCharItemsDescription(prev => Object.entries(prev).concat(currentAbDesc));
                    }
                }}>Add ability</button>
                <button className="backBut">Back</button><br></br>
            </tr>
            <tr className="currChars">
            {charNames.map((i) => { 
                return(
                    <tr className="e" onClick={() => setActiveName(i.name)} classId={i}>
                    {i.name} 
                    </tr>
                );
            })}
            </tr>
            <tr className="currEq"> 
            {charEquipment[activeName]?.map((i) => { 
                return(
                    <tr className="e" onClick={() => setActiveItem(i)} classId={i}>
                    {i} 
                    </tr>
                );
            })}
            </tr>
            <tr className="currAb"> 
            {charAbilities[activeName]?.map((i) => { 
                return(
                    <tr className="e" onClick={() => setActiveItem(i)} classId={i}>
                    {i} 
                    </tr>
                );
            })}
            </tr>
            <tr className="currDesc"> 
            {charItemsDescription[activeItem]?.map((i) => { 
                return(
                    <tr className="e" classId={i}>
                    {i} 
                    </tr>
                );
            })}
            </tr>
        </table>
    </div>


);



}
export default CharacterCreator;