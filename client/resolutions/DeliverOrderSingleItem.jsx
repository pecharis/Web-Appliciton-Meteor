import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Meteor } from 'meteor/meteor'

export default class DeliverOrderSingleItem extends Component {

	toggleChecked() {
		var by=Meteor.users.find({_id : Meteor.userId() }).fetch()[0].emails[0].address;
		const test=Meteor.call('toggleDeliverOrderItem',
			this.props.collection,this.props.resolution.status,by,this.props.resolution.name,
			this.props.resolution.itemid, function (err, res) {
			if(err){
      			console.log(err);
   			 }else{
     		 }     		
		});
	this.props.callback(this.props.resolution.itemid);	
	}

		render () {

		const resolutionClass = this.props.resolution.status ? "false" : "";
		const status= this.props.resolution.status ? <span className="completed_checked">delivered by {this.props.resolution.statusby}</span> : '';	
		const resolutionClass2 = this.props.resolution.paid ? "false" : "";
		const status2= this.props.resolution.paid ? <span className="completed_paid">paid to {this.props.resolution.paidby}</span> : '';
		const str_id="order_id " + this.props.collection._id + "item_id" + this.props.resolution.itemid;
		return (
			<div className="wholediv" >
				<input type="checkbox"
				className ="inlinediv"
					readOnly={true}
					id={str_id}
					checked={this.props.resolution.status}
					onClick={this.toggleChecked.bind(this)} />
				<label className ="inlinediv" htmlFor={str_id}><h3>{this.props.number}: {this.props.resolution.name} price : {this.props.resolution.price}e {status}{status2}</h3></label>
				</div>
				)
	}
}