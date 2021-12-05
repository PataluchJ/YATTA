import { Link } from "react-router-dom";
function tryToConnect(){
    var StringIP = document.getElementById("gmip").value;
    var username= document.getElementById("uName").value;
    console.log(username);
    if(username!=null && StringIP!=null) {


    }
    return;
}
function giveMeHTML(){
    return(

        <div class = "joinBody">
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
            <Link to={`/battleMap`}>
            <button class="joinButton" onClick={tryToConnect}>Enter</button> 
            </Link>
            <Link to={`/`}>
             <button class="joinButton">Back</button>
             </Link>
            </div>
        </div>
  

  
    );
    }
    export default giveMeHTML;