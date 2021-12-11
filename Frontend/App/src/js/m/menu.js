
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React, { useState } from "react";
import MenuView from "./menuHTMLinJS"
import BattleMap from "./battleMapJS"
import Join from "./joinJS"
import Chat from "../ch/chat"
import Sheets from "../bm/charSheets"
import "../../css/menu.css"
import "../../css/joinGame.css"
import "../../css/charSheets.css";

function Menu() {
    const [username, setUsername] = useState("");

    console.log("Enter: " + username);
    return (
        <Router>
        <div className="menu">
            <Switch>
                <Route path="/" exact component={MenuView}/>
                <Route path="/battlemap" render={(props) => <Map username={username} {...props} /> } />
                <Route path="/join" render={(props) => <Join setUsername={setUsername} {...props} /> } />

            </Switch>
        </div>
        </Router>
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
                <Sheets />
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
