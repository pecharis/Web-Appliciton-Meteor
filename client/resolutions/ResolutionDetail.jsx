import React, {Component} from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

export default class ResolutionDetail extends Component {
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

	mycollection() {
		return Mcollections.findOne(this.props.id);
	}

	render() {
		let res = this.mycollection();
		if(!res){return (<div>Loading...</div>);}
		return (<div><h1>{res.text}</h1><h2>{res.price}</h2></div>)
	}
}