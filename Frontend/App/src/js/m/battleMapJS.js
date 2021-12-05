import {main} from "../bm/battlemap.js"


function giveMeHTML(){
    return(

    <div className="map">  
            <script src="https://pixijs.download/release/pixi.js"></script>
         <script src="https://pixijs.download/dev/packages/events.js"></script>
    <script type="text/javascript" src={main}></script>
    <script type="text/javascript" src="../bm/MyObject.js"></script>
    </div>
);
}
export default giveMeHTML;