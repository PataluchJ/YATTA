import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React from "react";
import MenuView from "./menuHTMLinJS"
import Join from "./joinJS"
import BattleMap from "./battleMap"
import "../../css/menu.css"
import "../../css/joinGame.css"
function menu() {
    console.log("Enter");
    return (
        <Router>
        <div className="menu">
            <Switch>
                <Route path="/" exact component={menuView}/>
                <Route path="/battlemap" component={battleMap} />
                <Route path="/join" component={joinSite} />

            </Switch>
        </div>
        </Router>
    );
}
function menuView(){
    return(
        <React.Fragment>
        <div className="menu">
          <MenuView />
        </div>

        </React.Fragment>
    );

}
function battleMap(){
    console.log("Battle Map");
    return(
        <React.Fragment>
        <div className="battleMap">
          <BattleMap />
        </div>
        </React.Fragment>

    );
}
function joinSite(){
    console.log("Join site");
    return(
        <React.Fragment>
       
        <div className="join">
          <Join />
        </div>

        </React.Fragment>
    );
}

export default menu;