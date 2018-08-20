import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import MenuResolution from './resolutions/MenuResolution.jsx';
import AnalyticsStuff from './resolutions/AnalyticsStuff.jsx';
import AnalyticsMenu from './resolutions/AnalyticsMenu.jsx';
import AnalyticsEvents from './resolutions/AnalyticsEvents.jsx';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import Select from 'react-select';

const options = [
 		 { value: 'items', label: 'items' },
 		 { value: 'stuff', label: 'stuff' },
 		 { value: 'event log', label: 'event log' }
		];

export default class Analytics extends TrackerReact(React.Component) {
	constructor(){
		super();

		this.state = {
			subscription:{
				mycollections: Meteor.subscribe("allResolutions"),
				currOrders: Meteor.subscribe("allOrders"),				
				usersdata : Meteor.subscribe("currentUserData")
			},
			selectedOption: null
		}		
  	}

  	componentWillUnmount() {
		this.state.subscription.mycollections.stop();
		this.state.subscription.currOrders.stop();
	}	

	currOrders() {
		return currOrder.find().fetch();
	}
	
	handleChange = (selectedOption) => {
    	this.setState({ selectedOption });
    	console.log(`Option selected:`, selectedOption);
  	}

	render() {
		const { selectedOption } = this.state;
		var items;
		var sel;
		var obj=Meteor.users.find({"_id" : Meteor.userId()}).fetch();
		if(obj[0]){
			var pos=obj[0].profile.position;
			if(pos==="manager" && obj[0].profile.status==="accepted"){
				sel=<div><p>choosing time</p>
				<Select classNamePrefix="react-select"
					options={options}
				    value={selectedOption}
				    onChange={this.handleChange}				        
				/></div>

			}else{sel=<h2>you need to be a manager to access this page</h2>}
		}
		if(selectedOption){
			if (selectedOption.value==="items"){
				var localitems=[];
				var distinctEntries =currOrder.find({}, 
					{sort: {"items.value": 1}, fields: {"items.name" : true, "items.price" : true}
					}).fetch().map(function(x) {
						for(var i=0; i<x.items.length;i++){
							var flag=true;
							for(var y=0; y<localitems.length;y++){
								if(localitems[y] && flag==true){
									if(localitems[y].label===x.items[i].name){
										localitems[y].value=localitems[y].value+1;
										flag=false;
									}
								}
							}
							if(flag){
								localitems.push({value : 1 , label: x.items[i].name,price : x.items[i].price});
							}
						}
   					 
				});	
				items=localitems.map((curr,index)=>{
					return <AnalyticsMenu key={index}
					resolution={curr}/>
					//console.log(curr.label,curr.value);
				})
			}
			if(selectedOption.value==="stuff"){
				var obj=Meteor.users.find({"_id" : Meteor.userId()}).fetch();
				var test2=Meteor.users.find({"profile.shop" : obj[0].profile.shop}).fetch();
				items=test2.map((test,index)=>{
					return <AnalyticsStuff	key={index} 
						name={test.username}/>
						//console.log(test.emails[0].address);
				})
			}
			if (selectedOption.value==="event log"){
				var obj=Meteor.users.find({"_id" : Meteor.userId()}).fetch();
				items= <AnalyticsEvents shop={obj[0].profile.shop}/>
			}
		}
		return (
			<ReactCSSTransitionGroup
				component="div"
				transitionName="route"
				transitionEnterTimeout={600}
				transitionAppearTimeout={600}
				transitionLeaveTimeout={400}
				transitionAppear={true}>
				<h1>Analytics</h1>
				{sel}
				{items}
			</ReactCSSTransitionGroup>
		)
	}
}