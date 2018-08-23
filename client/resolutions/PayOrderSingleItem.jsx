import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Meteor } from 'meteor/meteor'

export default class DeliverOrderSingleItem extends Component {

	toggleChecked() {
		var obj=Meteor.users.find({"_id" : Meteor.userId()}).fetch();
		if(obj[0]){
			var pos=obj[0].profile.position;
			if(pos==="manager" || pos==="waiter"){
				var by=Meteor.users.find({_id : Meteor.userId() }).fetch()[0].username;
				const test=Meteor.call('togglePayOrderItem',
					this.props.collection,this.props.resolution.paid,by,this.props.resolution.name,
					this.props.resolution.itemid,false, function (err, res) {
					if(err){
		      			console.log(err);
		   			 }else{
		     		 }     		
				});
				this.props.callback(this.props.resolution.itemid);	
			}
		}
	}
 
	render () {
			
		const status= this.props.resolution.paid ? <span className="completed_paid">P: {this.props.resolution.paidby}</span> : '';
		const status2= this.props.resolution.status ? <span className="completed_checked">D: {this.props.resolution.statusby}</span> : '';
		const str_id="order_id " + this.props.collection._id + "item_id" + this.props.resolution.itemid;		

		return (
				<label onClick={this.toggleChecked.bind(this)} className ="inlinediv"><h3>{this.props.number+1}: {this.props.resolution.name} {this.props.resolution.price}€</h3>
				 comm : <h3>{this.props.resolution.comments}</h3> {status}{status2}</label>
				)
	}
}