import React, {Component} from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';


export default class Popup extends React.Component {
	addResolution(event) {
		event.preventDefault();
    	var text = this.refs.resolution1.value.trim();
    	var cat = this.refs.resolution.value.trim();
    	var ingredients = this.refs.resolution3.value.trim();
    	var price = this.refs.resolution2.value;
    	price=parseFloat(price);
    	console.log(cat);
    	console.log(text);
    	console.log(price);
    	if(text && price){
			Meteor.call('addResolution',cat, text, price,ingredients, (error, data)=>{
				if(error) {
					Bert.alert('Please login before submitting','danger', 'fixed-top','fa-frown-o');
				}else {
				//	this.refs.resolution.value = "";
				//	this.refs.resolution1.value= "";
				//	this.refs.resolution2.value= "";
				//	this.refs.resolution3.value= "";
				}
			});
		}		
	}

	save_button(event){
		event.preventDefault();
		this.props.closePopup();
		this.addResolution.bind(this)(event);
	}


  render() {
    return (
      <div className='popup'>
        <div className='popup_inner'>
        <form className="new-resolution" onSubmit={this.save_button.bind(this)}>
        <h3>Category : </h3>
					<input 
						type="text"
						ref="resolution"
						placeholder="category" />	
         <h3>Name : </h3>
					<input 
						type="text"
						ref="resolution1"
						placeholder="meatballs" />
		<h3>Price : </h3>
					<input 
						type="number"
						step="0.01"
						ref="resolution2"
						placeholder="Price" />
		<h3>Ingredients : </h3>
					<input 
						type="text"
						ref="resolution3"
						placeholder="ingredients" />
					<button	className="snip1086" onClick={this.save_button.bind(this)}>
				<span>Submit</span><i className="ion-checkmark"></i></button>
		
		</form>				
  
        </div>
      </div>
    );
  }
}