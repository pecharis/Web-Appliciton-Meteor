import React, {Component} from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class ShopStuffRequests extends Component  {
	acceptPosition(){
		Meteor.call('inShop',this.props.name,this.props.position,this.props.shop, (error, data)=>{
				if(error) {
					Bert.alert('Error.Please try again','danger', 'fixed-top','fa-frown-o');
				}else {
					Meteor.call('register',this.props.name,this.props.shop,this.props.position);
				}
			});	
		
	}
	deleteStuff(){
		Meteor.call('declineShop',this.props.name,this.props.position,this.props.shop, (error, data)=>{
				if(error) {
					Bert.alert('Error.Please try again','danger', 'fixed-top','fa-frown-o');
				}else {
					Meteor.call('unregister',this.props.name,this.props.shop,this.props.position);
				}
			});	
	}

	render() {
		return(
			<div className="stuffsinglediv">
				<h3 className="leftdiv">{this.props.number+1} {": "}{this.props.name} wants to work at your shop as {this.props.position}</h3>
				<button type="button" className="btn-text"
					onClick={this.acceptPosition.bind(this)}>accept</button>
				<button  className="btn-cancel"
					onClick={this.deleteStuff.bind(this)}>
					&times;
				</button>
			</div>
			)
		}
	}