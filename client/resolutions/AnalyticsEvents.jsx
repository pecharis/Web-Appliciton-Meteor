import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

Eventlog = new Mongo.Collection("eventlogs");

export default class AnalyticsEvents extends TrackerReact(React.Component) {
	constructor(){
		super();
		this.state = {
			subscription:{
				deletelastday: Meteor.subscribe("alleventlogs")
			}
		}	
	}
	alleventlogs() {
		return Eventlog.find({},{sort: {date: -1}}).fetch();
	}
	deletelastday(){
		Meteor.call('deleteAllBeforeToday',this.props.shop);
	}
	render(){
		var test=this.alleventlogs();
		var items=<a></a>
		items=test.map((str,index)=>{
				return <ul key={index}><h3>{ moment(str.date).format("HH:mm:ss")} {str.log}</h3></ul>
				//console.log(obj.label);
			})
		return(
				<div>
					<button	className="snip1086 blue" onClick={this.deletelastday.bind(this)}>
							<span>deletec all events apart from last day's</span><i className="ion-arrow-right-c"></i></button>
				{items}</div>
		)
	}	
}