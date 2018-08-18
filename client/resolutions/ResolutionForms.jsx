import React, {Component} from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';


export default class ResolutionForms extends Component  {

	constructor(){
		super();		
		this.state = {
			subscription:{
				findshops: Meteor.subscribe("allshops"),
				selectedOption: 'option1',
				selectedOption2: ''
			}			
		}
		this.handleChange = (selectedOption) => {
			var value=selectedOption.target.value
			console.log(value);
			this.setState({ selectedOption:value });
		}
		this.handleChange2 = (selectedOption2) => {
			this.setState({ selectedOption2 });
		}
	}
	componentWillUnmount() {
		Session.set('shops',"");
	}
	
	findshops(){
		return Shop.find().fetch();
	}

	addResolution(event) {
	
		const { selectedOption } = this.state;
		const { selectedOption2 } = this.state;

    	var name = this.refs.resolution1.value.trim();
    	var position = selectedOption;
    	var shop = selectedOption2.label;
    	if(name && position && shop){
    		Session.set('user',Meteor.users.find({_id : Meteor.userId() }).fetch()[0]);
    		if(Session.get('user')){
    			if(Session.get('user').profile){
    			if(Session.get('user').profile.status==="accepted"){
    				console.log("mpiiiiiika");
    				Meteor.call('deletefromShop',Session.get('user').username,Session.get('user').profile.position,Session.get('user').profile.shop);
    			}
    		}
    		}
			Meteor.call('askShop',name,position,shop, (error, data)=>{
				if(error) {
					Bert.alert('Error.Please try again','danger', 'fixed-top','fa-frown-o');
				}else {}
			});	
		Meteor.call('askregister',name,shop,position);
	}
}


	render() {
		const { selectedOption } = this.state;
		const { selectedOption2 } = this.state;
		var options=[];
		Session.set('shops',this.findshops());
		if(!Session.get('shops')){return (<div>Loading...</div>);}
		let shops=Session.get('shops');
		console.log(shops);
		shops.map( (resolution,index)=>{
			options[index]={label:resolution.shop, value:index};
		});
		

		return(
			<form className="new-resolution" onSubmit={this.addResolution.bind(this)}>
					<h2>Name : </h2>
						<input 
							type="text"
							ref="resolution1"
							placeholder="name" />
					<h2>Position : </h2>
   							<div className="radio">
  							    <label>
   								    <input type="radio" value="manager" 
  			         		           	checked={this.state.selectedOption === 'manager'} 
  			         		           	onChange={this.handleChange.bind(this)}/>
 							    	    Manager
  						  	    </label>
  						    </div>
   							<div className="radio">
					      		<label>
						        <input type="radio" value="waiter" 
						                checked={this.state.selectedOption === 'waiter'} 
						                onChange={this.handleChange.bind(this)}/>
						       Waiter / Waitress
						      	</label>
						    </div>
						    <div className="radio">
						     	<label>
						        	<input type="radio" value="assistant" 
						                checked={this.state.selectedOption === 'assistant'} 
						                onChange={this.handleChange.bind(this)}/>
						        Assistant Waiter / Waitress
						        </label>
						    </div>
						    <div className="radio">
						     	<label>
						        	<input type="radio" value="cook" 
						                checked={this.state.selectedOption === 'cook'} 
						                onChange={this.handleChange.bind(this)}/>
						        cook
						        </label>
						    </div>
						
							
					<h2>Select one of the available shops</h2>
						<Select
							id="table_select"
							options={options}
				  			name="form-field-name"
				  			value={selectedOption2}
				  			onChange={this.handleChange2.bind(this)}				        
						/>
						<input type="submit" value="Submit"/>
			</form>
			)
	}
}