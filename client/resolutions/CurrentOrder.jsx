import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import CurrentOrderSingle from './CurrentOrderSingle.jsx';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import * as localforage from "localforage";
import OrderResolutionSingle from './OrderResolutionSingle.jsx';


export default class CurrentOrder extends TrackerReact(React.Component) {
	constructor(){
		super();
		this.state = {
			subscription:{
				mycollections: Meteor.subscribe("userResolutions"),
				showPopup: false
			}
		}	
		this.updateNow = this.updateNow.bind(this);	
  	}
  	togglePopup() {
   		this.setState({
      		showPopup: !this.state.showPopup
   		});
	}
	updateNow(){
		//this.setState({'update_now':'yes'});
		this.props.callback();
	}

	render() {
		var currOrder;
		var currOrderItem;
		var listItems;
		var stringListOfItems=[];
		var test = LocalOrder.find().fetch()[0];
		if(!Session.get('table_number')){
			currOrder=<h2>Choose table first :</h2>
			listItems= <h2> </h2>
		}else{
			currOrder=<button className="snip1339" onClick={this.togglePopup.bind(this)}>Table Number {Session.get('table_number')} Total {Session.get('total')}e</button>
			listItems= <h2>No items yet </h2>		
		if(test && test.items){
				var array=test.items;
				var flags = [], output = [], l = array.length, i;
				for( i=0; i<l; i++) {
  				 	if( flags[array[i].name]) continue;
   					flags[array[i].name] = true;
    				output.push(array[i].name);
				}				
				output=output.sort();
				listItems=output.map((resolution)=>{
					var res=LocalOrder.findOne({ "items.name" : resolution }).items;
					var res2=res.filter(obj=>{
						return obj.name===resolution
					});
					return <OrderResolutionSingle key={resolution} 
					resolution={res2[0]}
					name={resolution}
					callback={this.updateNow} />
				
				})
				
			}else{
				listItems= <h2>No items yet </h2>
			}
		}

		return(
			<div>	
				{currOrder}
				{this.state.showPopup ? 
					<div>
          			{listItems}
          			</div>          			
          			: null
       				}
       		</div>
       	)	
	}
}

