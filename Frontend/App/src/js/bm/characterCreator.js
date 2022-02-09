import { Link } from "react-router-dom";
import { socket } from '../m/menu';
import React, { useState, useEffect, useContext, useRef } from "react";

function CharacterCreator({ username, roomID }){

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
            console.log("sheet_edit");
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
            console.log("sheet_new");
            id.current++;
            var roomData = "{\"Room\":\""+room+"\"}";
            var jsonF = JSON.parse(roomData);                    
            socket.emit('sheets_get',jsonF);
            setCharNames(prev => prev.concat(temp));
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
          
           
           
            data.forEach(function(item) {
                console.log(item.Name);
                tempNames.push({
                    id: item.Id,
                    name: item.Name
                });
                var tempTempEq = [];
                item.Equipment.forEach(function(item2) {
                    
                    var tempTempDc = [];
                    tempTempEq.push(item2.Name);
                    tempTempDc.push(item2.Description);
                    tempDesc[item2.Name] = tempTempDc;
                    tempEq[item.Name] = tempTempEq;
                    console.log("Name "+item2.Name+" "+item.Name);
                });
                
                var tempTempAb = [];
                item.Abilities.forEach(function(item2) {
                    
                    var tempTempDc = [];
                    tempTempAb.push(item2.Name);
                    tempTempDc.push(item2.Description);
                    tempAb[item.Name] = tempTempAb;
                    tempDesc[item2.Name] = tempTempDc;
                    console.log("Name "+item2.Name+" "+item.Name);
                });
            });
            id.current = data.length;
            console.log("eq ");
            console.log(tempEq);
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
                            charEquipment[activeName?.name].forEach(function(eq) {
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
                            if (!exists) {
                                eqString += '{"Name":"' + currentEqName + '","Description":"' + currentEqDesc + '"}';
                                temp.push(currentEqName);
                                charEquipment[activeName?.name] = temp;
                                charItemsDescription[currentEqName] = currentEqDesc;
                            } else {
                                eqString =  eqString.slice(0, -1);
                            }
                        }

                        var abString = "";

                        if (charAbilities[activeName?.name]) {
                            charAbilities[activeName?.name].forEach(function(ab) {
                                abString += '{"Name":"' + ab + '","Description":"' + charItemsDescription[ab] + '"},';
                            });
                            abString = abString.slice(0, -1);
                        }

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
                            charAbilities[activeName?.name].forEach(function(ab) {
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
                            if (!exists) {
                                abString += '{"Name":"' + currentAbName + '","Description":"' + currentAbDesc + '"}';
                                temp.push(currentAbName);
                                charAbilities[activeName?.name] = temp;
                                charItemsDescription[currentAbName] = currentAbDesc;
                            } else {
                                abString = abString.slice(0, -1);
                            }
                        }

                        var eqString = "";
                        if (charEquipment[activeName?.name]) {
                            charEquipment[activeName?.name].forEach(function(eq) {
                                eqString += '{"Name":"' + eq + '","Description":"' + charItemsDescription[eq] + '"},';
                            });
                            eqString= eqString.slice(0, -1);   
                        }

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
            <div className="tabTitle">Created characters</div>
            {charNames.map((i) => { 
                return(
                    <tr className="f" onClick={() => {setActiveName(i);setActiveItem("");console.log(i);console.log(charEquipment[i.name]);}} classId={i}>
                    {i.name} 
                    </tr>
                );
            })}
            </tr>
            <tr className="currEq"> 
            <div className="tabTitle" values={activeName}>Character {activeName?.name} equipment</div>
            {charEquipment[activeName?.name]?.map((i) => { 
                return(
                    <tr className="f" onClick={() => setActiveItem(i)} classId={i}>
                    {i} 
                    </tr>
                );
            })}
            </tr>
            <tr className="currAb"> 
            <div className="tabTitle" values={activeName}>Character {activeName?.name} abilities</div>
            {charAbilities[activeName?.name]?.map((i) => { 
                return(
                    <tr className="f" onClick={() => setActiveItem(i)} classId={i}>
                    {i} 
                    </tr>
                );
            })}
            </tr>
            <tr className="currDesc"> 
            <div  className="tabTitle" values={activeItem}>Description {activeItem}</div>
                    <tr className="f" classId={activeItem}>
                    {charItemsDescription[activeItem]} 
                    </tr>
            </tr>
        </table>
    </div>


);



}
export default CharacterCreator;