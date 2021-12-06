
import * as PIXI from 'pixi.js'
import { EventSystem } from '@pixi/events';
import {useRef} from 'react'
delete PIXI.Renderer.__plugins.interaction;
const app = new PIXI.Application({width: 1000, height: 900, backgroundColor: 0x000000 });
console.log("ENTERED BATTLE MAP");
 class MyObject extends PIXI.Sprite{
    id;
}

//import { Viewport } from 'pixi-viewport'

window.onload = main


 function main(){
   if(document.getElementById("battleMap")!=null)
   {
    document.getElementById("battleMap").appendChild(app.view);
    /*
    const viewport = new Viewport({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        worldWidth: 1000,
        worldHeight: 900,
    
        interaction: app.renderer.plugins.interaction
    })
    app.stage.addChild(viewport)
    viewport
    .drag()
    .pinch()
    .wheel()
    .decelerate()
    */
    app.renderer.addSystem(EventSystem, 'events');
    
    app.stage.interactive = true
    app.stage.hitArea = app.renderer.screen;

    //test values
    //addToken(1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Trp-Sword-14226124129-v06.png/800px-Trp-Sword-14226124129-v06.png', 400, 500, 0, 0, 0, 1, 1, 0)
    //addToken(2, 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Trp-Sword-14226124129-v06.png/800px-Trp-Sword-14226124129-v06.png', 500, 500, 0, 0, 0, 0.3, 0.3, 0)
    addToken(3, 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Trp-Sword-14226124129-v06.png/800px-Trp-Sword-14226124129-v06.png', 100, 100, 0, 0, 0, 0.1, 0.1, 0);
   
    //console.log(app.stage.children)
    // removeObject(2)
    //console.log(app.stage.children)
    //setNewPosition(3, 100, 0, 0)
    //setNewTexture(3, 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Trp-Sword-14226124129-v06.png/800px-Trp-Sword-14226124129-v06.png')
   }

    }
    



function addObject(id, texture, x, y, z, level, layer, scale_x, scale_y, rotate){
    var sprite
    sprite = MyObject.from(texture)
    sprite.anchor.set(0.5)
    sprite.x = x
    sprite.y = y
    sprite.z = z
    sprite.scale.x = scale_x
    sprite.scale.y = scale_y
    sprite.rotate = rotate
    sprite.id = id
    app.stage.addChild(sprite)
}
function removeObject(id){
    app.stage.children.forEach(function (arrayItem) {
        if(arrayItem.id === id)
        arrayItem.parent.removeChild(arrayItem);
    });
}
function addToken(id, texture, x, y, z, level, layer, scale_x, scale_y, rotate){
    var sprite
    sprite = MyObject.from(texture)
    sprite.anchor.set(0.5)
    sprite.x = x
    sprite.y = y
    sprite.z = z
    sprite.scale.x = scale_x
    sprite.scale.y = scale_y
    sprite.rotate = rotate
    sprite.id = id

    sprite.interactive = true;
    sprite.buttonMode = true
    sprite.addEventListener('pointerdown', onDragStart);
    sprite.addEventListener('pointerup', onDragEnd);
    sprite.addEventListener('pointerupoutside', onDragEnd);

    app.stage.addChild(sprite)
}
function setNewPosition(id, x, y, z){
    app.stage.children.forEach(function (arrayItem) {
        if(arrayItem.id === id){
            arrayItem.x = x
            arrayItem.y = y
            arrayItem.z = z
        }        
    });
}
function setNewScale(id, scale_x, scale_y){
    app.stage.children.forEach(function (arrayItem) {
        if(arrayItem.id === id){
            arrayItem.scale_x = scale_x
            arrayItem.scale_y = scale_y
        }        
    });
}
function setNewRotation(id, rotate){
    app.stage.children.forEach(function (arrayItem) {
        if(arrayItem.id === id){
            arrayItem.rotate = rotate
        }        
    });
}
function setNewTexture(id, texture){
    app.stage.children.forEach(function (arrayItem) {
        if(arrayItem.id === id){
            arrayItem.texture = PIXI.Texture.from(texture)
        }        
    });
}
function setNewObjectProperties(id, texture, x, y, z, level, layer, scale_x, scale_y, rotate){
    app.stage.children.forEach(function (arrayItem) {
        if(arrayItem.id === id){
            arrayItem.texture = PIXI.Texture.from(texture)
            arrayItem.x = x
            arrayItem.y = y
            arrayItem.z = z
            arrayItem.scale.x = scale_x
            arrayItem.scale.y = scale_y
            arrayItem.rotate = rotate
        }        
    });
}
function setTokenInteractive(id, value){
    app.stage.children.forEach(function (arrayItem) {
        if(arrayItem.id === id){
            arrayItem.interactive = value
           
        }        
    });

}
// movement
let selectedTarget
function onDragStart(e) {
    e.target.alpha = 0.5;
    selectedTarget = e.target;
    app.stage.addEventListener('pointermove', onDragMove);
}
function onDragEnd() {
    selectedTarget.alpha = 1;
    app.stage.removeEventListener('pointermove', onDragMove);
}
function onDragMove(e) {
    selectedTarget.parent.toLocal(e.global, null, selectedTarget.position);
}
export default main;