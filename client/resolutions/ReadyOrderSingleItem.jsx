import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Meteor } from 'meteor/meteor'

export default class DeliverOrderSingleItem extends Component {

	toggleChecked() {
		var by=Meteor.users.find({_id : Meteor.userId() }).fetch()[0].emails[0].address;
		const test=Meteor.call('toggleReadyOrderItem',
			this.props.collection,this.props.resolution.ready,by,this.props.resolution.name,
			this.props.resolution.itemid, function (err, res) {
			if(err){
      			console.log(err);
   			 }else{
     		 }     		
		});
		this.props.callback(this.props.resolution.itemid);	
	}

	render () {
		const resolutionClass = this.props.resolution.ready ? "false" : "";
		const status= this.props.resolution.ready ? <span className="completed_paid">ready by {this.props.resolution.readyby}</span> : '';
	//	const resolutionClass2 = this.props.resolution.status ? "false" : "";
	//	const status2= this.props.resolution.status ? <span className="completed_checked">delivered</span> : '';
		const str_id="order_id " + this.props.collection._id + "item_id" + this.props.resolution.itemid;		

		return (
			<div className={resolutionClass}>
				<input type="checkbox"
					readOnly={true}
					id={str_id}
					checked={this.props.resolution.ready}
					onClick={this.toggleChecked.bind(this)} />
				<label htmlFor={str_id}>name : {this.props.resolution.name} </label>
				{status}
				</div>
				)
	}
}