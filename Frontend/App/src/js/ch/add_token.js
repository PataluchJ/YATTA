import React from 'react';
import '../../css/popups.css'

class AddToken extends React.Component  {
    constructor(props){
      super(props);
      this.state = {
        choosenImage: ""
      };

      this.generateImageBoxes = this.generateImageBoxes.bind(this);
    }

    generateImageBoxes = () =>{
        let list = [];
        let idx = 0;
        for (const [k, rec] of Object.entries(this.props.imageList)) {
            list.push({});
            for (const [key, value] of Object.entries(rec)){
                if(key === 'Name'){
                    list[idx]['Name'] = value;
                }
                else{
                    list[idx]['Type'] = key;
                    list[idx]['Image'] = URL.createObjectURL(new Blob([value], { type: `image/${key}` }));
                }
            }
            idx += 1;
        }
        return list;
    }

    handleDivClick = (name) => {
        this.setState({
            choosenImage: name
        });
    }
  
    render() {
  
      return (
        <div className='popup'>
        <div className='popup_inner'>
        <div className='image_list'>
        {this.generateImageBoxes().map( (i) => {
            if(i['Name'] === this.state.choosenImage){
                return (
                    <div  className='image_line image_line_choosen'>
                        <div className='image_box'>
                        <img width='50' height='50' src={i['Image']} alt="No preview"></img>
                        </div>
                        <div className='image_name'>
                        <span className='image_name_span'>{i['Name']}.{i['Type']}</span>
                        </div>
                    </div>
                )
            }
            else {
                return (
                    <div onClick={() => {this.handleDivClick(i['Name']);}} className='image_line'>
                        <div className='image_box'>
                        <img width='50' height='50' src={i['Image']} alt="No preview"></img>
                        </div>
                        <div className='image_name'>
                        <span className='image_name_span'>{i['Name']}.{i['Type']}</span>
                        </div>
                    </div>
                )
            }
        })}
        </div>
        <div className='bottom_bar'>
        <button className='pop_button' onClick={() => {
            if(this.state.choosenImage !== '')
                this.props.addToken(this.state.choosenImage);
            }}>Add as Token</button>
        <button className='pop_button' onClick={() => {
            if(this.state.choosenImage !== '')
                this.props.setBackground(this.state.choosenImage);
        }}>Add as Background</button>
        <button className='pop_button' onClick={() => {
            if(this.state.choosenImage !== ''){
                this.props.deleteImage(this.state.choosenImage);
                this.setState({
                    choosenImage: ''
                });
            }
        }}>Delete image</button>
        <button className='pop_button' onClick={() => {this.props.closePopup();}}>Go Back</button>
        </div>
        </div>
      </div>
        
  
      );
    };
  }

  export default AddToken;