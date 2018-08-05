import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

Eventlog = new Mongo.Collection("eventlogs");

export default class AnalyticsEvents extends TrackerReact(React.Component) {
	constructor(){
		super();
		this.state = {
			subscription:{
				alleventlogs: Meteor.subscribe("alleventlogs")
			}
		}	
	}
	alleventlogs() {
		return Eventlog.find({},{sort: {date: -1}}).fetch();
	}

	render(){
		var test=this.alleventlogs();
		var items=<a></a>
		items=test.map((str,index)=>{
				return <ul key={index}><h3> {str.log}</h3></ul>
				//console.log(obj.label);
			})
		return(
				<div>{items}</div>
		)
	}	
}