import React, {Component} from 'react';
import ResolutionForms from './resolutions/ResolutionForms.jsx';
import DeliverOrderSingle from './resolutions/DeliverOrderSingle.jsx';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import NewEntry from './resolutions/NewEntry.jsx';
import OrderResolution from './resolutions/OrderResolution.jsx';

export default class DeliverOrders extends TrackerReact(React.Component) {
	constructor(){
		super();

		this.state = {
			subscription:{
				currOrders: Meteor.subscribe("allOrders"),
				currOrderId: Meteor.subscribe("allOrders"),
				showPopup: false
			}
		}		
  	this.updateNow = this.updateNow.bind(this);	
  	}
  	updateNow(id,itemid){
  		
  		var array=this.currOrderId(id)[0].items;
		var flags = [], output = [], l = array.length, i;
		for( i=0; i<l; i++) {
			if (array[i].itemid === itemid && !array[i].status) {
      		 	array[i].status = !array[i].status;
      		 }
    		if( flags[array[i].status]) continue;
    			flags[array[i].status] = true;
    		output.push(array[i].status);
		}
		if(output[0]===true && output.length==1){
			console.log("mpiiiika");
			Meteor.call('toggleDeliverOrder', this.currOrderId(id)[0]);
			if(this.currOrderId(id)[0].paid===true){
				Meteor.call('toggleCompleteOrder',this.currOrderId(id)[0]);
			}
		}


		this.setState({'update_now':'yes'});
	}

  	togglePopup() {
   		this.setState({
      		showPopup: !this.state.showPopup
   		});
	}

	componentWillUnmount() {
		this.state.subscription.currOrders.stop();
		this.state.subscription.currOrderId.stop();
		LocalOrder.clear();
		Session.set('table_number','');
		Session.set('total',0);
	}
	currOrderId(id){
		return currOrder.find({_id:id}).fetch();
	}

	currOrders() {
		return currOrder.find().fetch();
	}

	render() {

		var distinctEntries = _.uniq(currOrder.find({status : "pending"}, {
    		sort: {table_number: 1}, fields: {table_number: true}
			}).fetch().map(function(x) {
   			 return x.table_number;
			}), true);	
		
		return (
			<div className="resolutions">
  			<nav className="snip1490">
				<li><a href="/orders">  New Order  </a></li>
				<li><a href="/update_orders">Update</a></li>
				<li className="current"><a href="/deliver_orders">Deliver</a></li>
				<li><a href="/pay_orders">Pay</a></li>
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
						return <DeliverOrderSingle
						key={resolution._id}
						resolution={resolution}
						status="pending"
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
				<h2 className="centerdiv">Delivered Orders</h2>
				{this.currOrders().map( (resolution)=>{
						return <DeliverOrderSingle 
						key={resolution._id} 
						resolution={resolution} 
						status="delivered" 
						callback={this.updateNow}/>
					})}				   
			</ReactCSSTransitionGroup>
			</div>
		)
	}
}