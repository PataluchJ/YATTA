import Chat from "../../chat/chat";
import Home from "../../home/home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"; // install react-router-dom@5.2.0
import "./App.scss";
import React from "react";

function Appmain(props) {
  return (
    <React.Fragment>
      <div className="right">
        <Chat
          username={props.match.params.username}
        />
      </div>
    </React.Fragment>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/chat/:username" component={Appmain} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;