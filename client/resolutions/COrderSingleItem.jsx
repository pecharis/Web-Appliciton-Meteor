import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Meteor } from 'meteor/meteor'

export default class COrderSingleItem extends Component {

	toggleChecked() {
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
 
	render () {
			
		const status= this.props.resolution.paid ? <span className="completed_paid">P: {this.props.resolution.paidby}</span> : '';
		const status2= this.props.resolution.status ? <span className="completed_checked">D: {this.props.resolution.statusby}</span> : '';

		const str_id="order_id " + this.props.collection._id + "item_id" + this.props.resolution.itemid;		

		var obj=Meteor.users.find({"_id" : Meteor.userId()}).fetch();
		let orders=<h2>Loading...</h2>;
		if(obj[0]){
			var pos=obj[0].profile.position;
			if(pos==="manager" || pos==="waiter"){
				orders=<div className="cdiv">
					<input type="checkbox"
					readOnly={true}
					id={str_id}
					checked={this.props.resolution.paid}
					/>
				</div>
			}else{
  				orders=<h2></h2>

			}
		}

		return (
			<div className="wholediv">
				<label className ="inlinediv"><h3>{this.props.number+1}:{this.props.resolution.name} price : {this.props.resolution.price}€ comments : {this.props.resolution.comments} {status}{status2}</h3></label>
				</div>
				)
	}
}