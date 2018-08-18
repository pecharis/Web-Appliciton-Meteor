import React, {Component} from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class ShopStuffSingle extends Component  {
	constructor(){
		super();
		
		this.state = {
			subscription:{
				findshops: Meteor.subscribe("allshops"),
				showPopup: false,
				selectedOption2: ''
			}
		}
	this.handleChange2 = (selectedOption2) => {
			this.setState({ selectedOption2 });
			this.setState({
      			showPopup: !this.state.showPopup,
   			});
			console.log(selectedOption2.label);
			Meteor.call('deletefromShop',this.props.name,this.props.position,this.props.shop, (error, data)=>{
				if(error) {
					Bert.alert('Error.Please try again','danger', 'fixed-top','fa-frown-o');
				}else {}
			});	
			Meteor.call('unregister',this.props.name,this.props.shop,selectedOption2.label);

			Meteor.call('inShop',this.props.name,selectedOption2.label,this.props.shop, (error, data)=>{
				if(error) {
					Bert.alert('Error.Please try again','danger', 'fixed-top','fa-frown-o');
				}else {
					Meteor.call('register',this.props.name,this.props.shop,selectedOption2.label);
				}
			});	
		}	

	}
	togglePopup() {
   		this.setState({
      		showPopup: !this.state.showPopup,
   		});
	}
	updatePosition(){
		var options=[];
		options[0]={label:"manager", value:0};
		options[1]={label:"waiter", value:1};
		options[2]={label:"assistant", value:2};
		options[3]={label:"cook", value:3};
		const { selectedOption2 } = this.state;
		var upd=<div><Select
							id="table_select"
							options={options}
				  			name="form-field-name"
				  			value={selectedOption2}
				  			onChange={this.handleChange2.bind(this)}				        
						/>
						</div>
		return upd
	}
	deleteStuff(){
		Meteor.call('deletefromShop',this.props.name,this.props.position,this.props.shop, (error, data)=>{
				if(error) {
					Bert.alert('Error.Please try again','danger', 'fixed-top','fa-frown-o');
				}else {}
			});	
		Meteor.call('unregister',this.props.name,this.props.shop,this.props.position);
		//console.log(this.props.name,this.props.position,this.props.shop);
	}

	render() {
		const update_position=this.updatePosition();
		return(
			<div className="stuffsinglediv">
				<h3 className="inlinediv">{this.props.name}</h3>				
				<button type="button" className="btn-text"
					onClick={this.togglePopup.bind(this)}>update position</button>	
				<button  className="btn-text"
					onClick={this.deleteStuff.bind(this)}>remove 
				</button>
				{this.state.showPopup ?
					<div> 
          			{update_position}
          			</div>
          			: null
       			}
			</div>
			)
		}
	}