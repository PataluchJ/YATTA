import * as React from 'react'
import * as PIXI from 'pixi.js'
import { EventSystem } from '@pixi/events'
import { Viewport } from 'pixi-viewport'
import { Layer, Group, Stage } from '@pixi/layers'
import  gridImage  from '../../img/squre.png'
import  greenTexture  from '../../img/green.png'

import { socket } from '../m/menu';
delete PIXI.Renderer.__plugins.interaction


//holds MyTextures
var textureArray = {};

// keybord input
var pressedKeys = {};

var selectedTarget = null;

var copyOfthis = null

class MyObject extends PIXI.Sprite {
    id;
    textureId;
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
    addObject = (id, textureId, x, y, z, level, layer, scale_x, scale_y, angle) => {

        const sprite = MyObject.from(this.getTexture(textureId))
        sprite.anchor.set(0.5)
        sprite.x = x
        sprite.y = y
        sprite.z = z
        sprite.scale.x = scale_x
        sprite.scale.y = scale_y
        sprite.angle = angle
        sprite.id = id
        sprite.textureId = textureId
        console.log("Sprite: ", sprite)
        sprite.hitArea = new PIXI.Rectangle(0, 0, 0, 0)
        
        sprite.parentGroup = this.ObjectGroup
        this.ObjectContainer.addChild(sprite)
    }
    addToken = (id, textureId, x, y, z, level, layer, scale_x, scale_y, angle) => {
        
        //console.log(id, textureId, x, y, z, level, layer, scale_x, scale_y, rotate)
        const sprite = MyObject.from(this.getTexture(textureId))
        sprite.anchor.set(0.5)
        sprite.x = x
        sprite.y = y
        sprite.z = z
        sprite.scale.x = scale_x
        sprite.scale.y = scale_y
        sprite.angle = angle
        sprite.id = id
        sprite.textureId = textureId
    
        sprite.interactive = true;
        sprite.buttonMode = true
        sprite.addEventListener('pointerdown', this.onDragStart.bind(this));
        sprite.addEventListener('pointerup', this.onDragEnd.bind(this));
        sprite.addEventListener('pointerupoutside', this.onDragEnd.bind(this));
    
        sprite.parentGroup = this.TokenGroup
        this.TokenContainer.addChild(sprite)
    }   
    addGrid(){
        let texture = PIXI.Texture.from(gridImage, {width: 1000, height: 1000})
        let rectangle = new PIXI.Rectangle(200, 200, 600, 600)
        
        console.log(texture)
        texture.frame = rectangle
       
        const tilingSprite = new PIXI.TilingSprite(
            texture,
            100000,
            100000,
        );
        tilingSprite.x = -56000+35
        tilingSprite.y = -56000+35
        tilingSprite.hitArea = new PIXI.Rectangle(0, 0, 0, 0)
        tilingSprite.tileScale.x = 70.0/600.0
        tilingSprite.tileScale.y = 70.0/600.0

        tilingSprite.parentGroup = this.GridGroup
        this.gridContainer.addChild(tilingSprite)
        
    }
    addTexture(textureName, texture){
        textureArray[textureName] = MyTexture.from(texture)
    }
    getTexture(textureName){
        console.log("getTexture()")
        if (textureArray[textureName] != null){
            console.log("textureArray[textureName]: " + textureArray[textureName])
            return textureArray[textureName]
        }
        else{
            let room = localStorage.getItem('roomID')
            var msg = '{"Room":"' + room + '", "Name":"' + textureName + '"}'
            console.log("sending texture request msg " + msg)
            var jsonF = JSON.parse(msg);
            socket.emit('image_get', jsonF);
            return MyTexture.from(greenTexture)
        }
    }
    removeObject(id){
        this.TokenContainer.children.forEach(function (arrayItem) {
            if(arrayItem.id === id){
                arrayItem.parent.removeChild(arrayItem);
            }        
        });
        this.ObjectContainer.children.forEach(function (arrayItem) {
            if(arrayItem.id === id){
                arrayItem.parent.removeChild(arrayItem);
            }        
        });
    }
    setNewPosition(id, x, y, z){
        this.TokenContainer.children.forEach(function (arrayItem) {
            if(arrayItem.id === id){
                arrayItem.x = x
                arrayItem.y = y
                arrayItem.z = z
            }        
        });
        this.ObjectContainer.children.forEach(function (arrayItem) {
            if(arrayItem.id === id){
                arrayItem.x = x
                arrayItem.y = y
                arrayItem.z = z
            }        
        });
    }
    setNewTransformation(id, scale_x, scale_y, angle){
        this.TokenContainer.children.forEach(function (arrayItem) {
            if(arrayItem.id === id){
                arrayItem.scale.x = scale_x
                arrayItem.scale.y = scale_y
                arrayItem.angle = angle
            }        
        });
        this.ObjectContainer.children.forEach(function (arrayItem) {
            if(arrayItem.id === id){
                arrayItem.scale.x = scale_x
                arrayItem.scale.y = scale_y
                arrayItem.angle = angle
            }        
        });
    }
    setNewTexture(textureName, texture){
        
        console.log("setNewTexture(textureName:" + textureName + ", texture:" + texture + ")")

        this.TokenContainer.children.forEach(function (arrayItem) {
            if(arrayItem.textureId === textureName){
                arrayItem.texture = PIXI.Texture.from(texture)
            }        
        });
        this.ObjectContainer.children.forEach(function (arrayItem) {
            if(arrayItem.textureId === textureName){
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
        
        // only when "Shift" is not pressed
        if(!pressedKeys['16']){
            
            e.target.alpha = 0.5

            // hold x, y to check later if it was only a click
            //this.selectedTarget_X = e.target.x
            //this.selectedTarget_Y = e.target.y

            selectedTarget = e.target
            
            this.app.stage.addEventListener('pointermove', this.onDragMove.bind(this))
        }       
    }
    onDragEnd() {
        console.log("onDragEnd()")
        if(!pressedKeys['16'] && selectedTarget != null){
            selectedTarget.alpha = 1
            this.app.stage.removeAllListeners()


            // if same coords => single click
            //if(this.selectedTarget.x == this.selectedTarget_X && this.selectedTarget.y == this.selectedTarget_Y){
                //this.selectedTarget.filters = [this.outlineFilterBlue]
               
            //} 
            //else {
                let room = localStorage.getItem('roomID')
                console.log(room)
                let x = Math.round(selectedTarget.x/70.0)*70
                let y = Math.round(selectedTarget.y/70.0)*70
                var msg = '{"Room":"' + room + '", "Id":'+ selectedTarget.id + ', "Position":{"Level":1, "Layer":1, "Coords":{"x":' + x  + ', "y":' + y + ', "z_layer":' + selectedTarget.z + '}}}';
                console.log(msg)
                var jsonF = JSON.parse(msg);
                socket.emit('object_move', jsonF); 
            //}
            selectedTarget = null
        }
    }
    onDragMove(e) {
        if(selectedTarget != null){
            selectedTarget.parent.toLocal(e.global, null, selectedTarget.position)
        }
    }

    render() {
        console.log("render()")
        this.app = new PIXI.Application({width: window.screen.width * 0.175, height: window.screen.height * 0.15, backgroundColor: '0x121212', antialias: false, resolution: 4})
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

        // socket listeners
        socket.on("image_get", data => {
            console.log("socket.on(image_get)")
            console.log(data)


            let image 
            let image_extention
            for (const [key, value] of Object.entries(data)){
                
                if(key != 'Name'){
                    image = value
                    image_extention = key
                }
            }

            var arrayBufferView = new Uint8Array( image );
            var blob = new Blob( [ arrayBufferView ], { type: `image/${image_extention}`} );
            var urlCreator = window.URL || window.webkitURL;
            var imageUrl = urlCreator.createObjectURL( blob );

            this.setNewTexture(data.Name , imageUrl)
        })

        socket.on("new_position", data => {
            console.log("socket.on(new_position)")
            console.log(data)
            this.setNewPosition(data.Id, data.Position.Coords.x, data.Position.Coords.y, data.Position.Coords.z_layer)
        })
        
        socket.on("object_new", data => {
            console.log("socket.on(object_new)")
            //data = JSON.parse(data)
            console.log(data)
            if(data.Position.Coords.z_layer == -1){
                this.addObject(
                    data.Id,
                    data.Image_Name,
                    data.Position.Coords.x,
                    data.Position.Coords.y,
                    data.Position.Coords.z_layer,
                    data.Position.Level,
                    data.Position.Layer,
                    data.Transformation.scale_x,
                    data.Transformation.scale_y,
                    data.Transformation.rotation
                )
                
            }
            else{
                this.addToken(
                    data.Id,
                    data.Image_Name,
                    data.Position.Coords.x,
                    data.Position.Coords.y,
                    data.Position.Coords.z_layer,
                    data.Position.Level,
                    data.Position.Layer,
                    data.Transformation.scale_x,
                    data.Transformation.scale_y,
                    data.Transformation.rotation
                )
            }
        })

        socket.on("all_data", data => {
            console.log("socket.on(all_data)")
            console.log(data)
            let self = this
            data.Battlemap.Objects.forEach(function(item) {

                //console.log(item)
               
                if(item.Position.Coords.z_layer == -1){
                    self.addObject(
                        item.Id,
                        item.Image_Name,
                        item.Position.Coords.x,
                        item.Position.Coords.y,
                        item.Position.Coords.z_layer,
                        item.Position.Level,
                        item.Position.Layer,
                        item.Transformation.scale_x,
                        item.Transformation.scale_y,
                        item.Transformation.rotation
                    )
                }
                else{
                    self.addToken(
                        item.Id,
                        item.Image_Name,
                        item.Position.Coords.x,
                        item.Position.Coords.y,
                        item.Position.Coords.z_layer,
                        item.Position.Level,
                        item.Position.Layer,
                        item.Transformation.scale_x,
                        item.Transformation.scale_y,
                        item.Transformation.rotation
                    )
                }
            });
        });

        socket.on("object_delete", data => {
            console.log("socket.on(object_delete)")
            console.log(data)
            if(selectedTarget != null && selectedTarget.id == data.Id){
                selectedTarget = null
            }
            this.removeObject(data.Id)
        })

        socket.on("object_transform", data => {
            console.log("socket.on(object_transform)")
            console.log(data)
            this.setNewTransformation(data.Id, data.Transformation.scale_x, data.Transformation.scale_y, data.Transformation.rotation)
        })


        copyOfthis = this

        // keybord input
        window.onkeyup = function(e) { 
            pressedKeys[e.keyCode] = false; 
        }

        window.onkeydown = function(e) {
            pressedKeys[e.keyCode] = true; 
            //console.log(e.keyCode)
            // delete object
            if(e.keyCode == "46" && selectedTarget != null){
                var localId =  selectedTarget.id
                selectedTarget = null
                var msg = '{"Room":"' + localStorage.getItem('roomID') + '", "Id": ' + localId + ' }';
                console.log("delete sending msg: " + msg)
                socket.emit('object_delete', JSON.parse(msg)); 
            }
            // scale up
            else if(e.keyCode == "187" && selectedTarget != null){
               
                var localId =  selectedTarget.id
                let scaleX = selectedTarget.scale.x * 1.1
                let scaleY =  selectedTarget.scale.y * 1.1
                var msg = '{"Room":"' + localStorage.getItem('roomID') + '", "Id": ' + localId + ', "Transformation":{"scale_x":' +  scaleX + ', "scale_y":' +  scaleY + ', "rotation":' +  selectedTarget.angle + ' }}';
                console.log("object_transform sending msg: " + msg)
                socket.emit('object_transform', JSON.parse(msg)); 
            }
            // scale down
            else if(e.keyCode == "189" && selectedTarget != null){
                var localId =  selectedTarget.id
                let scaleX = selectedTarget.scale.x * 0.9
                let scaleY =  selectedTarget.scale.y * 0.9
                if(scaleX < 0)
                    scaleX = 0
                if(scaleY < 0)
                    scaleY = 0
                var msg = '{"Room":"' + localStorage.getItem('roomID') + '", "Id": ' + localId + ', "Transformation":{"scale_x":' +  scaleX + ', "scale_y":' +  scaleY + ', "rotation":' +  selectedTarget.angle + ' }}';
                console.log("object_transform sending msg: " + msg)
                socket.emit('object_transform', JSON.parse(msg)); 
            }
            // rotate right
            else if(e.keyCode == "221" && selectedTarget != null){
                var localId =  selectedTarget.id
                let angle = selectedTarget.angle + 10
                var msg = '{"Room":"' + localStorage.getItem('roomID') + '", "Id": ' + localId + ', "Transformation":{"scale_x":' +  selectedTarget.scale.x + ', "scale_y":' +  selectedTarget.scale.y + ', "rotation":' +  angle + ' }}';
                console.log("object_transform sending msg: " + msg)
                socket.emit('object_transform', JSON.parse(msg)); 
            }
            // rotate left
            else if(e.keyCode == "219" && selectedTarget != null){
                var localId =  selectedTarget.id
                let angle = selectedTarget.angle - 10
                var msg = '{"Room":"' + localStorage.getItem('roomID') + '", "Id": ' + localId + ', "Transformation":{"scale_x":' +  selectedTarget.scale.x + ', "scale_y":' +  selectedTarget.scale.y + ', "rotation":' +  angle + ' }}';
                console.log("object_transform sending msg: " + msg)
                socket.emit('object_transform', JSON.parse(msg)); 
            }
            // scale up bm
            else if(e.keyCode == "222" && pressedKeys['16']){
                copyOfthis.ObjectContainer.children.forEach(function (arrayItem) {
                    let scaleX = arrayItem.scale.x * 1.1
                    let scaleY =  arrayItem.scale.y * 1.1
                    var msg = '{"Room":"' + localStorage.getItem('roomID') + '", "Id": ' + arrayItem.id + ', "Transformation":{"scale_x":' +  scaleX + ', "scale_y":' +  scaleY + ', "rotation":' +  arrayItem.angle + ' }}';
                    console.log("object_transform sending msg: " + msg)
                    socket.emit('object_transform', JSON.parse(msg));    
                });
            }
            // scale down bm
            else if(e.keyCode == "186" && pressedKeys['16']){
                copyOfthis.ObjectContainer.children.forEach(function (arrayItem) {
                    let scaleX = arrayItem.scale.x * 0.9
                    let scaleY =  arrayItem.scale.y * 0.9
                    if(scaleX < 0)
                        scaleX = 0
                    if(scaleY < 0)
                        scaleY = 0
                    var msg = '{"Room":"' + localStorage.getItem('roomID') + '", "Id": ' + arrayItem.id + ', "Transformation":{"scale_x":' +  scaleX + ', "scale_y":' +  scaleY + ', "rotation":' +  arrayItem.angle + ' }}';
                    console.log("object_transform sending msg: " + msg)
                    socket.emit('object_transform', JSON.parse(msg)); 
                });
            }
            // objects up
            else if(e.keyCode == "87" && pressedKeys['16']){
                copyOfthis.ObjectContainer.children.forEach(function (arrayItem) {
                    let y = arrayItem.y - 10
                    var msg = '{"Room":"' + localStorage.getItem('roomID') + '", "Id": ' + arrayItem.id + ', "Position":{"Level":1, "Layer":1, "Coords":{"x":' + arrayItem.x  + ', "y":' + y + ', "z_layer":' + arrayItem.z + '}}}';
                    console.log("object_transform sending msg: " + msg)
                    socket.emit('object_move', JSON.parse(msg));    
                });
            }
            // objects down
            else if(e.keyCode == "83" && pressedKeys['16']){
                copyOfthis.ObjectContainer.children.forEach(function (arrayItem) {
                    let y = arrayItem.y + 10
                    var msg = '{"Room":"' + localStorage.getItem('roomID') + '", "Id": ' + arrayItem.id + ', "Position":{"Level":1, "Layer":1, "Coords":{"x":' + arrayItem.x  + ', "y":' + y + ', "z_layer":' + arrayItem.z + '}}}';
                    console.log("object_transform sending msg: " + msg)
                    socket.emit('object_move', JSON.parse(msg));    
                });
            }
            // objects left
            else if(e.keyCode == "65" && pressedKeys['16']){
                copyOfthis.ObjectContainer.children.forEach(function (arrayItem) {
                    let x = arrayItem.x - 10
                    var msg = '{"Room":"' + localStorage.getItem('roomID') + '", "Id": ' + arrayItem.id + ', "Position":{"Level":1, "Layer":1, "Coords":{"x":' + x + ', "y":' + arrayItem.y + ', "z_layer":' + arrayItem.z + '}}}';
                    console.log("object_transform sending msg: " + msg)
                    socket.emit('object_move', JSON.parse(msg));    
                });
            }
            // objects right
            else if(e.keyCode == "68" && pressedKeys['16']){
                copyOfthis.ObjectContainer.children.forEach(function (arrayItem) {
                    let x = arrayItem.x + 10
                    var msg = '{"Room":"' + localStorage.getItem('roomID') + '", "Id": ' + arrayItem.id + ', "Position":{"Level":1, "Layer":1, "Coords":{"x":' + x + ', "y":' + arrayItem.y + ', "z_layer":' + arrayItem.z + '}}}';
                    console.log("object_transform sending msg: " + msg)
                    socket.emit('object_move', JSON.parse(msg));    
                });
            }
        }

        var msg = '{"Room":"' + localStorage.getItem('roomID') + '"}';
        console.log("rander sending msg: " + msg)
        socket.emit('get_all_room_data', JSON.parse(msg)); 
        
        // add grid
        this.addGrid()

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
