
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React from "react";
import MenuView from "./menuHTMLinJS"
import BattleMap from "./battleMapJS"
import Join from "./joinJS"
import Chat from "../ch/chat"
import "../../css/menu.css"
import "../../css/joinGame.css"

export default  function menu() {
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
        <div className="menuView">
          <MenuView />
        </div>

        </React.Fragment>
    );

}
function battleMap(props){
    return(
        <React.Fragment>
        <div className="battleMap" id="battleMap">
          <BattleMap />
        <Chat
          username={props.match.params.username}
        />
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
