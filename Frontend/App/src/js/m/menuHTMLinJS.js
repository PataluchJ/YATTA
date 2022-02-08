import { Link } from "react-router-dom";
import React from "react";

function giveMeHTML(){
    return(
        <div>
            <div className="title">
                <header className="menuTitle"> Yet Another Table Top API </header>
            </div>
            <div className="buttons">
                <Link to={`/host`}>
                    <button className="menuButton">Host Game</button> <br></br>
                </Link>
                <Link to={`/join`}>
                    <button className="menuButton">Join</button>
                </Link>
            </div>
        </div>
    );
}

export default giveMeHTML;