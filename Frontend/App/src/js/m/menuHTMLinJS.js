import { Link } from "react-router-dom";
function giveMeHTML(){
return(

<html class="menuH">
<head>

        <title>YATTA</title>
        </head>
  
    <body class= "menuBody">
    <div class="title">
    <header class="menuTitle"> Yet Another Table Top API </header>
</div>
    <div class="buttons">
        <button class="menuButton" onclick="location.href = '../html/hostGame.html';">Host Game</button> <br></br>
        <Link to={`/join`}>
        <button class="menuButton">Join</button>
        </Link>
    </div>
  

    </body>
    <script src ="menu.js"></script>
</html>
);
}
export default giveMeHTML;