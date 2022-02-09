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
                    list[idx]['Image'] = URL.createObjectURL(new Blob([value], { type: `image/png` }));
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
                    <div  className='image_box image_box_choosen'>
                        <img width='40' height='40' src={i['Image']} alt="XD"></img>
                        <span className='span_text'>{i['Name']}.{i['Type']}</span>
                    </div>
                )
            }
            else {
                return (
                    <div onClick={() => {this.handleDivClick(i['Name']);}} className='image_box'>
                        <img width='40' height='40' src={i['Image']} alt="XD"></img>
                        <span className='span_text'>{i['Name']}.{i['Type']}</span>
                    </div>
                )
            }
        })}
        </div>
        <button onClick={() => {
            if(this.state.choosenImage !== '')
                this.props.addToken(this.state.choosenImage);
            }}>Add token</button>
        <button onClick={() => {this.props.closePopup();}}>Go Back</button>
        </div>
      </div>
        
  
      );
    };
  }

  export default AddToken;