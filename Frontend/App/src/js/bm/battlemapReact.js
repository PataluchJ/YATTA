import * as React from 'react';
import * as PIXI from 'pixi.js';
import { EventSystem } from '@pixi/events';
delete PIXI.Renderer.__plugins.interaction;


class MyObject extends PIXI.Sprite {
    id;
}
class PixiComponent extends React.Component {
   
    constructor(){
        console.log("constructor")
        super()
    }
    componentDidMount() {
        console.log("componentDidMount")
        console.log(this)
        this.gameCanvas.appendChild(this.app.view);
        this.app.start();
    }
    componentWillUnmount() {
        console.log("componentWillUnmount")
        console.log(this)
        this.app.stop();
    }
    addObject = (id, texture, x, y, z, level, layer, scale_x, scale_y, rotate) => {
        let sprite
        sprite = MyObject.from(texture)
        sprite.anchor.set(0.5)
        sprite.x = x
        sprite.y = y
        sprite.z = z
        sprite.scale.x = scale_x
        sprite.scale.y = scale_y
        sprite.rotate = rotate
        sprite.id = id
        this.app.stage.addChild(sprite)
    }
    addToken = (id, texture, x, y, z, level, layer, scale_x, scale_y, rotate) => {
        let sprite
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
        sprite.addEventListener('pointerdown', this.onDragStart.bind(this));
        sprite.addEventListener('pointerup', this.onDragEnd.bind(this));
        sprite.addEventListener('pointerupoutside', this.onDragEnd.bind(this));
    
        this.app.stage.addChild(sprite)
    }
    removeObject(id){
        this.app.stage.children.forEach(function (arrayItem) {
            if(arrayItem.id === id)
            arrayItem.parent.removeChild(arrayItem);
        });
    }
    setNewPosition(id, x, y, z){
        this.app.stage.children.forEach(function (arrayItem) {
            if(arrayItem.id === id){
                arrayItem.x = x
                arrayItem.y = y
                arrayItem.z = z
            }        
        });
    }
    setNewScale(id, scale_x, scale_y){
        this.app.stage.children.forEach(function (arrayItem) {
            if(arrayItem.id === id){
                arrayItem.scale_x = scale_x
                arrayItem.scale_y = scale_y
            }        
        });
    }
    setNewRotation(id, rotate){
        this.app.stage.children.forEach(function (arrayItem) {
            if(arrayItem.id === id){
                arrayItem.rotate = rotate
            }        
        });
    }
    setNewTexture(id, texture){
        this.app.stage.children.forEach(function (arrayItem) {
            if(arrayItem.id === id){
                arrayItem.texture = PIXI.Texture.from(texture)
            }        
        });
    }
    setNewObjectProperties(id, texture, x, y, z, level, layer, scale_x, scale_y, rotate){
        this. app.stage.children.forEach(function (arrayItem) {
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
    setTokenInteractive(id, value){
        this.app.stage.children.forEach(function (arrayItem) {
            if(arrayItem.id === id){
                arrayItem.interactive = value
               
            }        
        });
    }
    // movement
    onDragStart(e) {
        e.target.alpha = 0.5
        this.selectedTarget = e.target
        this.app.stage.addEventListener('pointermove', this.onDragMove.bind(this))
    }
    onDragEnd() {
        this.selectedTarget.alpha = 1
        this.app.stage.removeAllListeners()
    }
    onDragMove(e) {
        this.selectedTarget.parent.toLocal(e.global, null, this.selectedTarget.position)
    }

    render() {
        console.log("render")
        this.app = new PIXI.Application()
        let component = this;
        this.app.renderer.addSystem(EventSystem, 'events')
        this.app.stage.interactive = true
        this.app.stage.hitArea =  this.app.renderer.screen
        this.addToken(3, 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Trp-Sword-14226124129-v06.png/800px-Trp-Sword-14226124129-v06.png', 100, 100, 0, 0, 0, 0.1, 0.1, 0);

        return (
            <div ref={(thisDiv) => { component.gameCanvas = thisDiv }} />
        );
    }

}

export const BattleMap = () => {
    return (
            <PixiComponent></PixiComponent>
    );
}
export default BattleMap;