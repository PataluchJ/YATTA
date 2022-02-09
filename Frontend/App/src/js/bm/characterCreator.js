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

    const [isModified, setModified] = useState(false);

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
        socket.on('sheet_edit', data => {
            setCharEquipment({...charEquipment});
            setCharAbilities({...charAbilities});
            setCharItemsDescription({...charItemsDescription});

            var roomData = "{\"Room\":\""+room+"\"}";
            var jsonF = JSON.parse(roomData);                    
            socket.emit('sheets_get',jsonF);
        });

        socket.on("sheet_new", data => {
            let temp = [];
            temp.push({
                id: id,
                name: currentCharName
            });
            id.current++;
            setCharNames(prev => prev.concat(temp));

            var roomData = "{\"Room\":\""+room+"\"}";
            var jsonF = JSON.parse(roomData);                    
            socket.emit('sheets_get',jsonF);
        });

        return () => {
            socket.off("sheet_edit");
            socket.off("sheet_new");
        }
    }, [isModified]);
    
    useEffect(() => {
        socket.on("sheets_get", data => {
            let tempNames = [];
            let tempEq = {};
            let tempAb = {};
            let tempDesc = {};
            var tempTempEq = [];
            var tempTempAb = [];
           
            data.forEach(function(item) {
                tempNames.push({
                    id: item.Id,
                    name: item.Name
                });

                item.Equipment.forEach(function(item2) {
                    var tempTempDc = [];
                    
                    tempTempEq.push(item2.Name);
                    tempTempDc.push(item2.Description);
                    tempEq[item.Name] = tempTempEq;
                    tempDesc[item2.Name] = tempTempDc;
                    console.log("Name "+item2.Name+" "+tempDesc[item2.Name]);
                });

                item.Abilities.forEach(function(item2) {
                    var tempTempDc = [];
                    tempTempAb.push(item2.Name);
                    tempTempDc.push(item2.Description);
                    tempAb[item.Name] = tempTempAb;
                    tempDesc[item2.Name] = tempTempDc;
                });
            });
            id.current = data.length;
            
            setCharNames([...tempNames]);
            setCharEquipment({...tempEq});
            setCharAbilities({...tempAb});
            setCharItemsDescription({...tempDesc});
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
                <input className="tabInput" type="text" id="charNameInput" name ="charNameInput"  value={currentCharName} onChange={(e) => setCurrentCharName(e.target.value)}></input><br></br>
                <button className="tabBut" onClick={() => {
                    if (currentCharName !== "" && !charNames.some(e => e.name === currentCharName)) {
                        var msg = '{"Room":"' + room + '", "Name":"' + currentCharName + '","Equipment":[], "Abilities":[]}';
                        var jsonF = JSON.parse(msg);
                        socket.emit('sheet_new', jsonF);
                        setModified(!isModified);
                    }
                }}>New character</button>
                <div className="tabTitle">Equipment</div>
                <label className="tTitle">Item name</label><br></br>
                <input className="tabInput" type="text" id="itemNameInput" name = "itemNameInput" value={currentEqName} onChange={(e) => setCurrentEqName(e.target.value)}></input><br></br>
                <label className="tTitle">Item description</label><br></br>
                <textarea  className="descInput" type="text" id="itemDInput" name = "itemDInput" value={currentEqDesc} onChange={(e) => setCurrentEqDesc(e.target.value)}></textarea ><br></br>
                <button className="tabBut" onClick={() => {

                    if ((currentCharName !== "" || activeName !== null) && !charNames.some(e => e.name === currentCharName) && currentEqName !== "" && currentEqDesc !== "") {
                        var eqString = "";
                        var temp = [];
                        var exists = false;
                        if (!charEquipment[activeName?.name]) {
                            eqString += '{"Name":"' + currentEqName + '","Description":"' + currentEqDesc + '"}';
                            temp.push(currentEqName);
                            charEquipment[activeName?.name] = temp;
                            charItemsDescription[currentEqName] = currentEqDesc;
                        } else {
                            Object.keys(charEquipment).forEach(function(item) {
                                charEquipment[item].forEach(function(eq) {
                                    if (currentEqName !== eq) {
                                        eqString += '{"Name":"' + eq + '","Description":"' + charItemsDescription[eq] + '"},';
                                    } else {
                                        eqString += '{"Name":"' + eq + '","Description":"' + currentEqDesc + '"},';
                                        exists = true;
                                    }
                                    temp.push(eq);
                                    charEquipment[activeName?.name] = temp;
                                    charItemsDescription[currentEqName] = currentEqDesc;
                                });
                            });
                            if (!exists) {
                                eqString += '{"Name":"' + currentEqName + '","Description":"' + currentEqDesc + '"}';
                                temp.push(currentEqName);
                                charEquipment[activeName?.name] = temp;
                                charItemsDescription[currentEqName] = currentEqDesc;
                            } else {
                                eqString.slice(0, -1);
                            }
                        }

                        var abString = "";
                        Object.keys(charAbilities).forEach(function(item) {
                            abString += '{"Name":"' + charAbilities[item] + '","Description":"' + charItemsDescription[charAbilities[item]] + '"},';
                        });
                        abString.slice(0, -1);

                        var msg = '{"Room":"' + room + '", "Id":' + activeName.id + ', "Name":"' + activeName.name + '", "Equipment":[' + eqString + '], "Abilities":[' + abString + ']}';
                        console.log(msg);
                        var jsonF = JSON.parse(msg);
                        socket.emit("sheet_edit", jsonF);
                        setModified(!isModified);
                    }
                }}>Add item</button>
                <div className="tabTitle">Abilities</div>
                <label className="tTitle">Ability name</label><br></br>
                <input className="tabInput" type="text" id="abilityNameInput" name = "abilityNameInput" value={currentAbName} onChange={(e) => setCurrentAbName(e.target.value)}></input><br></br>
                <label className="tTitle">Ability description</label><br></br>
                <textarea className="descInput" type="text" id="abilityDInput" name = "abilityDInput" value={currentAbDesc} onChange={(e) => setCurrentAbDesc(e.target.value)}></textarea ><br></br>
                <button className="tabBut" onClick={() => {
                    if ((currentCharName !== "" || activeName !== null) && !charNames.some(e => e.name === currentCharName) && currentAbName !== "" && currentAbDesc !== "") {
                        var abString = "";
                        var temp = [];
                        var exists = false;
                        if (!charAbilities[activeName?.name]) {
                            abString += '{"Name":"' + currentAbName + '","Description":"' + currentAbDesc + '"}';
                            temp.push(currentAbName);
                            charAbilities[activeName?.name] = temp;
                            charItemsDescription[currentAbName] = currentAbDesc;
                        } else {
                            Object.keys(charAbilities).forEach(function(item) {
                                charAbilities[item].forEach(function(ab) {
                                    if (currentAbName !== ab) {
                                        abString += '{"Name":"' + ab + '","Description":"' + charItemsDescription[ab] + '"},';
                                    } else {
                                        abString += '{"Name":"' + ab + '","Description":"' + currentAbDesc + '"},';
                                        exists = true;
                                    }
                                    temp.push(ab);
                                    charAbilities[activeName?.name] = temp;
                                    charItemsDescription[currentAbName] = currentAbDesc;
                                });
                            });
                            if (!exists) {
                                abString += '{"Name":"' + currentAbName + '","Description":"' + currentAbDesc + '"}';
                                temp.push(currentAbName);
                                charAbilities[activeName?.name] = temp;
                                charItemsDescription[currentAbName] = currentAbDesc;
                            } else {
                                abString.slice(0, -1);
                            }
                        }

                        var eqString = "";
                        Object.keys(charEquipment).forEach(function(item) {
                            eqString += '{"Name":"' + charEquipment[item] + '","Description":"' + charItemsDescription[charEquipment[item]] + '"},';
                        });
                        eqString.slice(0, -1);

                        var msg = '{"Room":"' + room + '", "Id":' + activeName.id + ', "Name":"' + activeName.name + '", "Equipment":[' + eqString + '], "Abilities":[' + abString + ']}';
                        console.log(msg);
                        var jsonF = JSON.parse(msg);
                        socket.emit("sheet_edit", jsonF);
                        setModified(!isModified);
                    }
                }}>Add ability</button>
                <Link to={"/battlemap"}>
                <button className="backBut">Back</button><br></br>
                </Link>
            </tr>
            <tr className="currChars">
            {charNames.map((i) => { 
                return(
                    <tr className="e" onClick={() => {setActiveName(i);console.log(i);console.log(charEquipment[i.name]);}} classId={i}>
                    {i.name} 
                    </tr>
                );
            })}
            </tr>
            <tr className="currEq"> 
            {charEquipment[activeName?.name]?.map((i) => { 
                return(
                    <tr className="e" onClick={() => setActiveItem(i)} classId={i}>
                    {i} 
                    </tr>
                );
            })}
            </tr>
            <tr className="currAb"> 
            {charAbilities[activeName?.name]?.map((i) => { 
                return(
                    <tr className="e" onClick={() => setActiveItem(i)} classId={i}>
                    {i} 
                    </tr>
                );
            })}
            </tr>
            <tr className="currDesc"> 
                    <tr className="e" classId={activeItem}>
                    {charItemsDescription[activeItem]} 
                    </tr>
            </tr>
        </table>
    </div>


);



}
export default CharacterCreator;