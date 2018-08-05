import React from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import ResolutionForms from './ResolutionForms.jsx';
import ResolutionSingle from './ResolutionSingle.jsx';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

Mcollections = new Mongo.Collection("mcollections2");

//import Mcollections from '/server/main.js';

export default class Resolutions extends TrackerReact(React.Component) {
	constructor(){
		super();
		
		this.state = {
			subscription:{
				mycollections: Meteor.subscribe("userResolutions")
			}
		}
	}

	componentWillUnmount() {
		this.state.subscription.mycollections.stop();
	}


	mycollections() {
		return Mcollections.find().fetch();
	}

	render() {
		//console.log(this.mycollections());
		return(
			<ReactCSSTransitionGroup
				component="div"
				transitionName="route"
				transitionEnterTimeout={600}
				transitionAppearTimeout={600}
				transitionLeaveTimeout={400}
				transitionAppear={true}>
				<h1>My Menu  {Session.get('test')}</h1>
				<ResolutionForms/>
				<ReactCSSTransitionGroup
					component="ul"
					className="resolutions"
					transitionName="resolutionLoad"
					transitionEnterTimeout={600}
					transitionLeaveTimeout={400}>
					{this.mycollections().map( (resolution)=>{
						return <ResolutionSingle key={resolution._id} resolution={resolution} />
					})}	
					</ReactCSSTransitionGroup>				
				
			</ReactCSSTransitionGroup>
		)
	}
}
