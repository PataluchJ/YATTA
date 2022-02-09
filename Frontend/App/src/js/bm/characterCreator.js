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

    const [activeName, setActiveName] = useState(null);
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
        var jsonF = JSON.parse(roomData);                    
        socket.emit('sheets_get',jsonF);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [room]);

    useEffect(() => {
        socket.on("sheets_get", data => {
            let tempNames = [];
            let tempEq = {};
            let tempAb = {};
            let tempDesc = {};

            data.forEach(function(item) {
                tempNames.push({
                    id: item.Id,
                    name: item.Name
                });

                item.Equipment.forEach(function(item2) {
                    tempEq[item.Name].concat(item2.Name);
                    tempDesc[item2.Name] = [...tempDesc[item2.Name], item2.Description];
                });

                item.Abilities.forEach(function(item2) {
                    tempAb[item.Name] = [...tempAb[item.Name], item2.Name];
                    tempDesc[item2.Name] = [...tempDesc[item2.Name], item2.Description];
                });
            });
            id.current = data.length;
            setCharNames([...tempNames]);
            setCharEquipment({...tempEq});
            setCharAbilities({...tempAb});
            setCharItemsDescription({...tempDesc});
        });

        socket.on("sheet_new", data => {
            let temp = [];
            temp.push({
                id: id,
                name: currentCharName
            });
            id.current++;
            setCharNames(prev => prev.concat(temp));
        });

        socket.emit('sheet_edit', data => {

        });
    
        return () => {
          socket.off("sheets_get");
          socket.off("sheet_new");
          socket.off("sheet_edit");
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
                    if (currentCharName !== "" && !charNames.some(e => e.name === currentCharName)) {
                        var msg = '{"Room":"' + room + '", "Name":"' + currentCharName + '","Equipment":[], "Abilities":[]}';
                        var jsonF = JSON.parse(msg);
                        socket.emit('sheet_new', jsonF);
                    }
                }}>New character</button><br></br>
                <div className="tabTitle">Equipment</div>
                <label className="tTitle">Item name</label><br></br>
                <input className="tabInput" type="text" id="itemNameInput" name = "itemNameInput" value={currentEqName} onChange={(e) => setCurrentEqName(e.target.value)}></input><br></br>
                <label className="tTitle">Item description</label><br></br>
                <textarea  className="descInput" type="text" id="itemDInput" name = "itemDInput" value={currentEqDesc} onChange={(e) => setCurrentEqDesc(e.target.value)}></textarea ><br></br>
                <button className="tabBut" onClick={() => {
                    if ((currentCharName !== "" || activeName !== null) && !charNames.some(e => e.name === currentCharName) && currentEqName !== "" && currentEqDesc !== "") {
                        var eqString = "";
                        Object.keys(charEquipment).forEach(function(item) {
                            if (activeName.name !== charEquipment[item]) {
                                eqString += '{"Name":"' + charEquipment[item] + '","Description":"' + charItemsDescription[charEquipment[item]] + '"},';
                            } else {
                                eqString += '{"Name":"' + charEquipment[item] + '","Description":"' + currentEqDesc + '"},';
                            }
                        });
                        if (!Object.entries(charEquipment).includes(currentEqName)) {
                            eqString += '{"Name":"' + currentEqName + '","Description":"' + currentEqDesc + '"}';
                        } else {
                            eqString.slice(0, -1);
                        }

                        var abString = "";
                        Object.keys(charAbilities).forEach(function(item) {
                            abString += '{"Name":"' + charAbilities[item] + '","Description":"' + charItemsDescription[charAbilities[item]] + '"},';
                        });
                        abString.slice(0, -1);

                        var tempId = id;
                        var tempName = currentCharName;
                        if (activeName !== null) {
                            tempId = activeName.id;
                            tempName = activeName.name;
                        }

                        var msg = '{"Room":"' + room + '", "Name":"' + tempName + '", "Id":' + tempId + ', "Equipment":[' + eqString + '], "Abilities":[' + abString + ']}';
                        console.log(msg);
                        var jsonF = JSON.parse(msg);
                        socket.emit("sheet_edit", jsonF);
                        setCharEquipment(prev => prev[tempName].push(currentEqName));
                        setCharItemsDescription(prev => prev[tempName].push(currentEqDesc));
                        console.log(charEquipment);
                    }
                }}>Add item</button>
                <div className="tabTitle">Abilities</div>
                <label className="tTitle">Ability name</label><br></br>
                <input className="tabInput" type="text" id="abilityNameInput" name = "abilityNameInput" value={currentAbName} onChange={(e) => setCurrentAbName(e.target.value)}></input><br></br>
                <label className="tTitle">Ability description</label><br></br>
                <textarea className="descInput" type="text" id="abilityDInput" name = "abilityDInput" value={currentAbDesc} onChange={(e) => setCurrentAbDesc(e.target.value)}></textarea ><br></br>
                <button className="tabBut" onClick={() => {
                    if (currentCharName !== "" && !charNames.some(e => e.name === currentCharName) && currentAbName !== "" && currentAbDesc !== "") {
                        var abString = "";
                        Object.keys(charAbilities).forEach(function(item) {
                            if (currentAbName !== charAbilities[item]) {
                                abString += '{"Name":"' + charAbilities[item] + '","Description":"' + charItemsDescription[charAbilities[item]] + '"},';
                            } else {
                                abString += '{"Name":"' + charAbilities[item] + '","Description":"' + currentEqDesc + '"},';
                            }
                        });

                        if (!Object.entries(charAbilities).includes(currentAbName)) {
                            abString += '{"Name":"' + currentAbName + '","Description":"' + currentAbDesc + '"}';
                        } else {
                            abString.slice(0, -1);
                        }

                        var eqString = "";
                        Object.keys(charEquipment).forEach(function(item) {
                            eqString += '{"Name":"' + charEquipment[item] + '","Description":"' + charItemsDescription[charEquipment[item]] + '"},';
                        });
                        eqString.slice(0, -1);

                        var msg = '{"Room":"' + room + '", "Name":"' + currentCharName + '", "Id":' + activeName.Id + ', "Equipment":[' + eqString + '], "Abilities":[' + abString + ']}';
                        var jsonF = JSON.parse(msg);
                        socket.emit("sheet_edit", jsonF);

                        setCharAbilities(prev => Object.entries(prev).concat(currentAbName));
                        setCharItemsDescription(prev => Object.entries(prev).concat(currentAbDesc));
                    }
                }}>Add ability</button>
                <button className="backBut">Back</button><br></br>
            </tr>
            <tr className="currChars">
            {charNames.map((i) => { 
                return(
                    <tr className="e" onClick={() => setActiveName(i)} classId={i}>
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