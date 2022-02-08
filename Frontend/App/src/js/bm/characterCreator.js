import { Link } from "react-router-dom";
import React from "react";
function characterCreator(){

return (
    <div className="creatorDiv">
        
        <table className="creatorTable" >
            <tr className="creatorMenu"> 
                <div className="tabTitle">Character</div>
                <label className="jTitle">Character name</label><br></br>
                <input className="tabInput" type="text" id="charNameInput" name = "charNameInput"></input><br></br>
                <button className="tabBut">New character</button>
                <div className="tabTitle">Equipment</div>
                <label className="jTitle">Item name</label><br></br>
                <input className="tabInput" type="text" id="itemNameInput" name = "itemNameInput"></input><br></br>
                <label className="jTitle">Item description</label><br></br>
                <textarea  className="descInput" type="text" id="itemDInput" name = "itemDInput"></textarea ><br></br>
                <button className="tabBut">Add item</button>
                <div className="tabTitle">Abilities</div>
                <label className="jTitle">Ability name</label><br></br>
                <input className="tabInput" type="text" id="abilityNameInput" name = "abilityNameInput"></input><br></br>
                <label className="jTitle">Ability description</label><br></br>
                <textarea className="descInput" type="text" id="abilityDInput" name = "abilityDInput"></textarea ><br></br>
                <button className="tabBut">Add ability</button>
                <button className="backBut">Back</button><br></br>
            </tr>
            <tr className="currChars">


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
export default characterCreator;