
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React, { useState } from "react";
import socketIOClient from "socket.io-client";
import MenuView from "./menuHTMLinJS"
import BattleMap from "../bm/battlemapReact";
import Join from "./joinJS"
import Chat from "../ch/chat"
import Host from "../m/hostJS"
import Second from "../bm/secondMenu"
import Sheets from "../bm/charSheets"
import Creator from "../bm/characterCreator"
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
    const [roomID, setRoomID] = useState("");

    return (
        <SocketContext.Provider value={socket}>
        <Router>
        <div className="menu">
            <Switch>
                <Route path="/" exact component={MenuView}/>
                <Route path="/battlemap" render={(props) => <Map  username={username} roomID={roomID} {...props} /> } />
                <Route path="/join" render={(props) => <Join setUsername={setUsername} setRoomID={setRoomID} {...props} /> } />
                <Route path="/host" render={(props) => <Host setUsername={setUsername} setRoomID={setRoomID} {...props} /> } />
                <Route path="/creator" render={(props) => <Creator setUsername={setUsername} setRoomID={setRoomID} {...props} /> } />
            </Switch>
        </div>
        </Router>
        </SocketContext.Provider>
    );
}

class Map extends React.Component {
    render() {
        return(
            <React.Fragment>
            <div className="battleMap" id="battleMap">
                <div className="battleMapAssets" id ="battleMapAssets">
                    <BattleMap />
                    <Second />
                </div>
                <Chat username={this.props.username} roomID={this.props.roomID} />
            </div>
            </React.Fragment>

        );
    }
}

export default Menu;
