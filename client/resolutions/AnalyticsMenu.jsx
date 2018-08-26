import React, {Component} from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class AnalyticsMenu extends TrackerReact(React.Component) {
	constructor(){
		super();
	}

	render () {
		return(
			<div className="inlinediv">
			<h3>{this.props.resolution.label}</h3>
			<a> times ordered : {this.props.resolution.value} with price : {this.props.resolution.price}€</a>
			<a> Total income : {(this.props.resolution.value*this.props.resolution.price).toFixed(2)}€</a>
			</div>
		)
	}
}