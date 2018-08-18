import React, {Component} from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';


export default class ResolutionForms extends React.Component {

	addResolution(event) {
    	var name = this.refs.resolution1.value.trim();
    	var shop = this.refs.resolution2.value.trim();
    	var tables = this.refs.resolution3.value;
    	tables=parseFloat(tables);
    	if(name && shop && tables){
    		Session.set('user',Meteor.users.find({_id : Meteor.userId() }).fetch()[0]);
    		if(Session.get('user')){
    			if(Session.get('user').profile.status==="accepted"){
    				console.log("mpiiiiiika");
    				Meteor.call('deletefromShop',Session.get('user').username,Session.get('user').profile.position,Session.get('user').profile.shop);
    			}
    		}
			Meteor.call('addShop',name,shop,tables, (error, data)=>{
				if(error) {
					Bert.alert('Error.Please try again','danger', 'fixed-top','fa-frown-o');
				}else {
					this.refs.resolution1.value= "";
					this.refs.resolution2.value= "";
				}
			});
		}	
	}


	render() {
	
			return(
			<form className="new-resolution" onSubmit={this.addResolution.bind(this)}>
					<h2>Name : </h2>
						<input 
							type="text"
							ref="resolution1"
							placeholder="name" />
					<h2>Name of shop: </h2>
						<input 
							type="text"
							ref="resolution2"
							placeholder="name of shop" />
					<h2>Number of tables : </h2>
					<input 
						type="number"
						step="1"
						ref="resolution3"
						placeholder="0" />		
						<input type="submit" value="Submit"/>
			</form>
			)
	}
}