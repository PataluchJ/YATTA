
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import socketIOClient from "socket.io-client";
import * as io from 'socket.io-client'
import MenuView from "./menuHTMLinJS"
//import BattleMap from "./battleMapJS"
import BattleMap from "../bm/battlemapReact";
import Join from "./joinJS"
import Chat from "../ch/chat"
import Second from "../bm/secondMenu"
import Sheets from "../bm/charSheets"
import "../../css/menu.css"
import "../../css/joinGame.css"
import "../../css/charSheets.css";
import "../../css/tables.css";
const ENDPOINT = "localhost:5000";
export const socket = socketIOClient(ENDPOINT);
export const SocketContext = React.createContext();
export var currGameData;

function Menu() {
    const [username, setUsername] = useState("");

    console.log("Enter: " + username);
    return (
       
        <SocketContext.Provider value={socket}>
        <Router>
        <div className="menu">
            <Switch>
                <Route path="/" exact component={MenuView}/>
                <Route path="/battlemap" render={(props) => <Map  username={username}{...props} /> } />
                <Route path="/join" render={(props) => <Join setUsername={setUsername} {...props} /> } />

            </Switch>
        </div>
        </Router>
        </SocketContext.Provider>
    );
}

// function menuView(){
//     return(
//         <React.Fragment>
//         <div className="menuView">
//           <MenuView />
//         </div>

//         </React.Fragment>
//     );

// }
class Map extends React.Component {
    render() {
        return(
            <React.Fragment>
            <div className="battleMap" id="battleMap">
                <div className="battleMapAssets" id ="battleMapAssets">
            <BattleMap />
                <Second />
            </div>
            <Chat
            username={this.props.username}
            //{props.match.params.username}

           />

            </div>
            </React.Fragment>

        );
    }
}
// class JoinSite extends React.Component {
//     render() {
//         console.log("Join site");
//         return(
//             <React.Fragment>
           
//             <div className="join">
//               <Join setUsername={this.props.setUsername} />
//             </div>
    
//             </React.Fragment>
//         );
//     }
// }

export default Menu;
