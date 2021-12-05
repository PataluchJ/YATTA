import { Link } from "react-router-dom";
function tryToConnect(){
    var StringIP = document.getElementById("gmip")
    var username= document.getElementById("uName")
    console.log(username);

}
function giveMeHTML(){
    return(
    <div id = "menuCSS">
    <html>
        <head>
             
            <title>YATTA Join Game</title>
        </head>
        <body class = "joinBody">
            <header class="joinTitle"> Join Game </header>
            <form class="joinForm">
                <div class="forms">
                <label for="uName">Username:</label><br></br>
                <input class="joinInput" typ="text" id="uName" name = "uName"></input><br></br>
                <label for="gmip"> Insert GM IP:</label><br></br>
                <input class="joinInput" type="text" id="gmip" name = "gmip"></input>
                </div>
            </form>
            <div class = "buttons">
            <button class="joinButton" onClick={tryToConnect}>Enter</button> 
            <Link to={`/`}>
             <button class="joinButton">Back</button>
             </Link>
            </div>

        </body>
        <script src ="menu.js"></script>
    </html>
     </div>   
    );
    }
    export default giveMeHTML;