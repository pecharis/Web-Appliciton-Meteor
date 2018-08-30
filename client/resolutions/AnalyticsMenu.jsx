import React, {Component} from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class AnalyticsMenu extends TrackerReact(React.Component) {
	constructor(){
		super();
	}

	render () {
		console.log("at ",this.props.resolution.label,"count : ",this.props.resolution.Corders);
		return(
			<div className="inlinediv">
			<h3>{this.props.resolution.label}</h3>
			<a> Times ordered : {this.props.resolution.value}  Price : {this.props.resolution.price}€</a>
			<a> Total income : {(this.props.resolution.value*this.props.resolution.price).toFixed(2)}€</a>
			<br />
			<p>Estimated time of preparation : {(this.props.resolution.count/this.props.resolution.value).toFixed(2)} minutes</p>
			<p>Added to an order rate : {(this.props.resolution.value/this.props.Corders).toFixed(2)}</p>
			</div>
		)
	}
}