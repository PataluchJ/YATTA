import React, { useState } from "react";
import "./home.scss";
import { Link } from "react-router-dom";

function Homepage() {
  const [username, setusername] = useState("");

  const sendData = () => {
    if (username === "") {
      alert("username are must !");
      window.location.reload();
    }
  };

  return (
    <div className="homepage">
      <h1>Welcome to ChatApp</h1>
      <input
        placeholder="Input your user name"
        value={username}
        onChange={(e) => setusername(e.target.value)}
      ></input>

      <Link to={`/chat/${username}`}>
        <button onClick={sendData}>Join</button>
      </Link>
    </div>
  );
}

export default Homepage;