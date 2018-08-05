import React, {Component} from 'react';
import ResolutionForms from './resolutions/ResolutionForms.jsx';
import CompletedOrderSingle from './resolutions/CompletedOrderSingle.jsx';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import NewEntry from './resolutions/NewEntry.jsx';
import OrderResolution from './resolutions/OrderResolution.jsx';

export default class CompletedOrders extends TrackerReact(React.Component) {
	constructor(){
		super();

		this.state = {
			subscription:{
				currOrders: Meteor.subscribe("allOrders"),
				showPopup: false
			}
		}		
  	}

  	togglePopup() {
   		this.setState({
      		showPopup: !this.state.showPopup
   		});
	}

	componentWillUnmount() {
		this.state.subscription.currOrders.stop();
	}

	currOrders() {
		var date = new Date()
		var today = moment(date).format("MM.DD.YYYY");
		var now = new Date();
		var anHourAgo = new Date(now.setHours(now.getHours - 1));

		console.log(new Date().getHours());
		return currOrder.find({'last_modified':{$gte: new Date(today)}}).fetch();
	}

	render() {

		return (
			<div className="resolutions">
  			<nav className="snip1490">
				<li><a href="/orders">  New Order  </a></li>
				<li><a href="/update_orders">Update</a></li>
				<li><a href="/deliver_orders">Deliver</a></li>
				<li><a href="/pay_orders">Pay</a></li>
				<li className="current"><a href="/completed_orders">completed</a></li>
			</nav>
			<h2>Today's Completed Orders</h2>
			<ReactCSSTransitionGroup
				component="div"
				transitionName="route"
				transitionEnterTimeout={600}
				transitionAppearTimeout={600}
				transitionLeaveTimeout={400}
				transitionAppear={true}>
				{this.currOrders().map( (resolution)=>{
						return <CompletedOrderSingle key={resolution._id} resolution={resolution} status="pending" />
					})}				   
			</ReactCSSTransitionGroup>
			</div>
		)
	}
}