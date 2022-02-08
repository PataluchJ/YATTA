import React from 'react';
import '../../css/uploadPopup.css'
class PopUp extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      image: null,
      imageURL: null,
      imageChoosed: false
    };

    this.onImageChange = this.onImageChange.bind(this);
  }

  onImageChange = event => {
    if (event.target.files && event.target.files[0]){
      let img = event.target.files[0];
      console.log(img);
      this.setState({
        imageURL : URL.createObjectURL(img),
        image : img,
        imageChoosed: true
      });
    }
  };
  render() {
    return (
      <div className='popup'>
        <div className='popup_inner'>
        {this.state.imageChoosed ? <img width='200' height='200' src={this.state.imageURL}/> : null}
        
        <h1>Select Image</h1>
        <input type="file" name="myImage" onChange={this.onImageChange} />
        <br></br>
        <button onClick={() => {this.props.sendImage(this.state.image, this.state.image.name);} }>Send</button>
        <button onClick={() => {this.props.closePopup();}}>Go Back</button>
        </div>
      </div>
    );
  }
}

export default PopUp;