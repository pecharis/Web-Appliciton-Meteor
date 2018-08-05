import React, {Component} from 'react';

export default class ResolutionForms extends Component {

	
	addResolution(event) {
		event.preventDefault();
    	var text = this.refs.resolution1.value.trim();
    	var cat = this.refs.resolution.value.trim();
    	var price = this.refs.resolution2.value;
    	price=parseFloat(price);
    	console.log(cat);
    	console.log(text);
    	console.log(price);
    	if(text && price){
    		console.log("text && price != NULL");
			Meteor.call('addResolution',cat, text, price, (error, data)=>{
				if(error) {
					Bert.alert('Please login before submitting','danger', 'fixed-top','fa-frown-o');
				}else {
					this.refs.resolution.value = "";
					this.refs.resolution1.value= "";
					this.refs.resolution2.value= "";
				}
			});
		}		
	}
	render() {
		return(
			<form className="new-resolution" onSubmit={this.addResolution.bind(this)}>
					<h2>Category : </h2>
					<input 
						type="text"
						ref="resolution"
						placeholder="category" />	
        			<h2>Name : </h2>
						<input 
							type="text"
							ref="resolution1"
							placeholder="meatballs" />
					<h2>Price : </h2>
						<input 
							type="number"
							step="0.01"
							ref="resolution2"
							placeholder="Price" />
						<input type="submit" value="Submit"/>
			</form>
			)
	}
}