import { Link } from "react-router-dom";
import {SocketContext} from '../m/menu';
import React, { useState, useEffect, useContext } from "react";

function CharacterCreator({ username, roomID }){
    const socket = useContext(SocketContext);

    const [user, setUser] = useState(username);
    const [room, setRoom] = useState(roomID);

    const [charNames, setCharNames] = useState([]);
    const [charEquipment, setCharEquipment] = useState({});
    const [charAbilities, setCharAbilities] = useState({});

    const [currentCharName, setCurrentCharName] = useState("");

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
            let tempAb = {};

            data.forEach(function(item) {
                tempNames.push(item.Name);

                item.Equipment.forEach(function(item2) {
                    tempEq[item.Name].push({
                        name: item2.Name,
                        description: item2.Description
                    });
                });

                item.Abilities.forEach(function(item2) {
                    tempAb[item.Name].push({
                        name: item2.Name,
                        description: item2.Description
                    });
                });
            });

            setCharNames([...tempNames]);
            // setCharEquipment([...tempEq]);
            // setCharAbilities([...tempAb]);
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
                    if (!charNames.includes(currentCharName)) {
                        var msg = '{"Room":"' + room + '", "Name":"' + currentCharName + '","Equipment":[], "Abilities":[]}';
                        console.log(msg);
                        var jsonF = JSON.parse(msg);
                        socket.emit('sheet_new', jsonF);

                        setCharNames(prev => prev.concat(currentCharName));
                    }
                }}>New character</button><br></br>
                <div className="tabTitle">Equipment</div>
                <label className="tTitle">Item name</label><br></br>
                <input className="tabInput" type="text" id="itemNameInput" name = "itemNameInput"></input><br></br>
                <label className="tTitle">Item description</label><br></br>
                <textarea  className="descInput" type="text" id="itemDInput" name = "itemDInput"></textarea ><br></br>
                <button className="tabBut">Add item</button>
                <div className="tabTitle">Abilities</div>
                <label className="tTitle">Ability name</label><br></br>
                <input className="tabInput" type="text" id="abilityNameInput" name = "abilityNameInput"></input><br></br>
                <label className="tTitle">Ability description</label><br></br>
                <textarea className="descInput" type="text" id="abilityDInput" name = "abilityDInput"></textarea ><br></br>
                <button className="tabBut">Add ability</button>
                <button className="backBut">Back</button><br></br>
            </tr>
            <tr className="currChars">
            {charNames.map((i) => {
            
            return(
                <tr className="e">
                   {i} 
                </tr>
            );


            })}

            </tr>
            <tr className="currEq"> 
                <tr>
                dadsadsasd
                    

                </tr>
            </tr>
            <tr className="currAb"> 

            </tr>
            <tr className="currDesc"> 

            </tr>
        </table>
    </div>


);



}
export default CharacterCreator;