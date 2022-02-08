import { Link } from "react-router-dom";
import React from "react";
function characterCreator(){

return (
    <div>
        <header>Character creator</header>
        <table className="creatorTable" >
            <tr className="currChars"> 
                <label className="jTitle">Character name</label><br></br>
                <input className="charNameInput" type="text" id="charNameInput" name = "charNameInput"></input><br></br>
                <button>New character</button><br></br>
                <label className="jTitle">Item name</label><br></br>
                <input className="itemNameInput" type="text" id="itemNameInput" name = "itemNameInput"></input><br></br>
                <label className="jTitle">Item description</label><br></br>
                <input className="itemDInput" type="text" id="itemDInput" name = "itemDInput"></input><br></br>
                <button>Add item</button><br></br>
                <label className="jTitle">Ability name</label><br></br>
                <input className="abilityNameInput" type="text" id="abilityNameInput" name = "abilityNameInput"></input><br></br>
                <label className="jTitle">Ability description</label><br></br>
                <input className="abilityDInput" type="text" id="abilityDInput" name = "abilityDInput"></input><br></br>
                <button>Add ability</button><br></br>
                <button>Back</button><br></br>
            </tr>
            <tr className="currEq"> 
            <tr>
                
                

            </tr>
            </tr>
            <tr className="currChars"> 

            </tr>
        </table>
    </div>


);



}
export default characterCreator;