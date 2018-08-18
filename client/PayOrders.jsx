import React, {Component} from 'react';
import ResolutionForms from './resolutions/ResolutionForms.jsx';
import PayOrderSingle from './resolutions/PayOrderSingle.jsx';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import NewEntry from './resolutions/NewEntry.jsx';
import OrderResolution from './resolutions/OrderResolution.jsx';

export default class PayOrders extends TrackerReact(React.Component) {
	constructor(){
		super();

		this.state = {
			subscription:{
				currOrders: Meteor.subscribe("allOrders"),
				showPopup: false
			}
		}		
  		this.updateNow = this.updateNow.bind(this);	
  	}
  	updateNow(id,itemid){
  		
  		var array=this.currOrderId(id)[0].items;
		var flags = [], output = [], l = array.length, i;
		for( i=0; i<l; i++) {
			if (array[i].itemid === itemid && !array[i].paid) {
      		 	array[i].paid = !array[i].paid;
      		}
    		if( flags[array[i].paid]) continue;
    			flags[array[i].paid] = true;
    		output.push(array[i].paid);
		}
		if(output[0]===true && output.length==1){
			Meteor.call('togglePayOrder', this.currOrderId(id)[0]);
			if(this.currOrderId(id)[0].status===true){
				Meteor.call('toggleCompleteOrder',this.currOrderId(id)[0]);
			}
		}
		this.setState({'update_now':'yes'});
	}
	componentWillUnmount() {
		this.state.subscription.currOrders.stop();
	}

	currOrderId(id){
		return currOrder.find({_id:id}).fetch();
	}

	currOrders() {
		return currOrder.find().fetch();
	}

	render() {
		
		return (
			<div className="resolutions">
  			<nav className="snip1490">
				<li><a href="/orders">New</a></li>
				<li><a href="/update_orders">Update</a></li>
				<li><a href="/deliver_orders">Deliver</a></li>
				<li className="current"><a href="/pay_orders">Pay</a></li>
				<li><a href="/completed_orders">completed</a></li>
			</nav>			
			<ReactCSSTransitionGroup
				component="div"
				className="divback"
				transitionName="route"
				transitionEnterTimeout={600}
				transitionAppearTimeout={600}
				transitionLeaveTimeout={400}
				transitionAppear={true}>
				<h2 className="centerdiv">Pending Orders</h2>
				{this.currOrders().map( (resolution)=>{
						return <PayOrderSingle 
						key={resolution._id} 
						resolution={resolution} 
						paid="false"
						callback={this.updateNow} />
					})}				   
			</ReactCSSTransitionGroup>
			<ReactCSSTransitionGroup
				component="div"
				className="divback2"
				transitionName="route"
				transitionEnterTimeout={600}
				transitionAppearTimeout={600}
				transitionLeaveTimeout={400}
				transitionAppear={true}>
				<h2 className="centerdiv">Paid Orders</h2>
				{this.currOrders().map( (resolution)=>{
						return <PayOrderSingle 
						key={resolution._id} 
						resolution={resolution} 
						paid="true"
						callback={this.updateNow} />
					})}				   
			</ReactCSSTransitionGroup>
			</div>
		)
	}
}