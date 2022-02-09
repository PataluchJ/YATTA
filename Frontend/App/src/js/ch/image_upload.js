import React from 'react';
import '../../css/popups.css'
import { socket } from '../m/menu';

class ImageUpload extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      image: null,
      imageURL: null,
      imageChoosed: false,
      name: "",
      ext: ""
    };

    this.onImageChange = this.onImageChange.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
  }

  onNameChange = event => {
    this.setState({name: event.target.value});
  };

  onImageChange = event => {
    if (event.target.files && event.target.files[0]){
      let img = event.target.files[0];
      let fname = img.name.split('.');
      let filename = fname[0]
      let extension = fname[1]
      console.log(img);
      this.setState({
        imageURL : URL.createObjectURL(img),
        image : img,
        imageChoosed: true,
        name: filename,
        ext: extension
      });
    }
  };
  render() {
    return (
      <div className='popup'>
        <div className='popup_inner'>
        <div className='select_box'>
          <div className='select_header'>
            <h1>Select Image</h1>
            <input type="file" name="myImage" onChange={this.onImageChange} />
            <br></br>
            Nazwa pliku:<br></br> 
            <input className='text_input' type="text" name="imageName" onChange={this.onNameChange} value={this.state.name} />
          </div>
            <div className='select_image'>
            {this.state.imageChoosed ? <img width='100%' height='100%' src={this.state.imageURL}/> : null}
            </div>
          <br></br>
        </div>
        <div className='button_bar'>
        <button className='pop_button' onClick={() => {
          if(this.state.name !== '')
            this.props.sendImage(this.state.image, this.state.name+'.'+this.state.ext);
          } }>Send</button>
        <button className='pop_button' onClick={() => {this.props.closePopup();}}>Go Back</button>
        </div>
        </div>
      </div>
    );
  }
}

export default ImageUpload;