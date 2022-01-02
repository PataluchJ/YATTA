import * as React from 'react'
import * as PIXI from 'pixi.js'
import { EventSystem } from '@pixi/events'
import { Viewport } from 'pixi-viewport'
import { Layer, Group, Stage } from '@pixi/layers'
import  gridImage  from '../../img/squre.png'
import  testbg  from '../../img/testbg.jpg'
delete PIXI.Renderer.__plugins.interaction

//holds MyTextures
var textureArray = {};

// keybord input
var pressedKeys = {};
window.onkeyup = function(e) { pressedKeys[e.keyCode] = false; }
window.onkeydown = function(e) { pressedKeys[e.keyCode] = true; }


class MyObject extends PIXI.Sprite {
    id;
}

class MyTexture extends PIXI.Texture{
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
    addObject = (id, textureId, x, y, z, level, layer, scale_x, scale_y, rotate) => {

        const sprite = MyObject.from(this.getTexture(textureId))
        sprite.anchor.set(0.5)
        sprite.x = x
        sprite.y = y
        sprite.z = z
        sprite.scale.x = scale_x
        sprite.scale.y = scale_y
        sprite.rotate = rotate
        sprite.id = id
        sprite.hitArea = new PIXI.Rectangle(0, 0, 0, 0)

        sprite.parentGroup = this.ObjectGroup
        this.ObjectContainer.addChild(sprite)
    }
    addToken = (id, textureId, x, y, z, level, layer, scale_x, scale_y, rotate) => {
        
        const sprite = MyObject.from(this.getTexture(textureId))
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
    
        sprite.parentGroup = this.TokenGroup
        this.TokenContainer.addChild(sprite)
    }   
    addGrid(){
        let texture = PIXI.Texture.from(gridImage)
        let rectangle = new PIXI.Rectangle(200, 200, 600, 600)
        
        console.log(texture)
        texture.frame = rectangle
       
        const tilingSprite = new PIXI.TilingSprite(
            texture,
            100000,
            100000,
        );
        tilingSprite.x = -50000
        tilingSprite.y = -50000
        tilingSprite.hitArea = new PIXI.Rectangle(0, 0, 0, 0)
        tilingSprite.tileScale.x = 0.1
        tilingSprite.tileScale.y = 0.1

        tilingSprite.parentGroup = this.GridGroup
        this.gridContainer.addChild(tilingSprite)
        
    }

    addTexture(id, texture){
        textureArray[id] = MyTexture.from(texture)
    }
    getTexture(id){
        //TODO check if texture is in array
        return textureArray[id]
    }
    removeObject(id){
        this.viewport.children.forEach(function (arrayItem) {
            if(arrayItem.id === id)
            arrayItem.parent.removeChild(arrayItem);
        });
    }
    setNewPosition(id, x, y, z){
        this.viewport.children.forEach(function (arrayItem) {
            if(arrayItem.id === id){
                arrayItem.x = x
                arrayItem.y = y
                arrayItem.z = z
            }        
        });
    }
    setNewScale(id, scale_x, scale_y){
        this.viewport.children.forEach(function (arrayItem) {
            if(arrayItem.id === id){
                arrayItem.scale_x = scale_x
                arrayItem.scale_y = scale_y
            }        
        });
    }
    setNewRotation(id, rotate){
        this.viewport.children.forEach(function (arrayItem) {
            if(arrayItem.id === id){
                arrayItem.rotate = rotate
            }        
        });
    }
    setNewTexture(id, texture){
        this.viewport.children.forEach(function (arrayItem) {
            if(arrayItem.id === id){
                arrayItem.texture = PIXI.Texture.from(texture)
            }        
        });
    }
    setNewObjectProperties(id, textureId, x, y, z, level, layer, scale_x, scale_y, rotate){
        this.viewport.children.forEach(function (arrayItem) {
            if(arrayItem.id === id){
                arrayItem.texture = this.getTexture(textureId)
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
        this.viewport.children.forEach(function (arrayItem) {
            if(arrayItem.id === id){
                arrayItem.interactive = value
               
            }        
        });
    }

  
    // movement
    onDragStart(e) {
    
        console.log("onDragStart()")
        console.log(pressedKeys)
        // only when "Shift" is not pressed
        if(!pressedKeys['16']){
            
            e.target.alpha = 0.5
            this.selectedTarget = e.target
            this.app.stage.addEventListener('pointermove', this.onDragMove.bind(this))
        }       
    }
    onDragEnd() {
        console.log("onDragEnd()")
        if(!pressedKeys['16']){
            this.selectedTarget.alpha = 1
            this.app.stage.removeAllListeners()
        }
        
       // sendNewObjectPostion(
       //     this.selectedTarget.id,
       //     this.selectedTarget.x,
       //     this.selectedTarget.y, 
       //     this.selectedTarget.z,
       //     this.selectedTarget.level,
       //     this.selectedTarget.layer
       //     )
    }
    onDragMove(e) {
        this.selectedTarget.parent.toLocal(e.global, null, this.selectedTarget.position)
    }

    render() {
        console.log("render()")
        this.app = new PIXI.Application({width: window.screen.width*0.175, height: window.screen.height*0.15, backgroundColor: '0x121212', antialias: false, resolution: 4})
        let component = this;

        // stage
        this.app.stage = new Stage();

        // events
        this.app.renderer.addSystem(EventSystem, 'events')
        this.app.stage.interactive = true
        this.app.stage.hitArea =  this.app.renderer.screen
        
        // Viewport for camera
        this.viewport = new Viewport({
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            worldWidth: 800,
            worldHeight: 600,
            //interaction: this.app.renderer.plugins.interaction
        })
        this.viewport
            .drag({keyToPress: ['ShiftLeft', 'ShiftRight']})
            .wheel({keyToPress: ['ShiftLeft', 'ShiftRight']})
        this.app.stage.addChild(this.viewport)

        this.viewport.setZoom(0.3)
        // Groups
        this.TokenGroup = new Group(3, false)
        this.GridGroup = new Group(2, false)
        this.ObjectGroup = new Group(1, false)

        // layers
        this.viewport.sortableChildren = true
        
        this.viewport.addChild(new Layer(this.TokenGroup))
        this.viewport.addChild(new Layer(this.GridGroup))
        this.viewport.addChild(new Layer(this.ObjectGroup))

        // Containers
        this.TokenContainer = new PIXI.Container()
        this.ObjectContainer = new PIXI.Container()
        this.gridContainer = new PIXI.Container()

        this.viewport.addChild(this.TokenContainer)
        this.viewport.addChild(this.ObjectContainer)
        this.viewport.addChild(this.gridContainer)

        // temp for testing
        this.addTexture(0, 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Trp-Sword-14226124129-v06.png/800px-Trp-Sword-14226124129-v06.png')
        this.addTexture(1, testbg)
        this.addToken(1, 0, 190, 130, -1, 0, -1, 0.05, 0.05, 0);
        this.addToken(3, 0, 190, 70, -1, 0, -1, 0.05, 0.05, 0);
        this.addObject(2, 1, 600, 600, 1, 0, 1, 1, 1, 0);
        //this.removeObject(2)

        // add grid
        this.addGrid()
        //console.log(this.viewport)


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