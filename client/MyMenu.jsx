import React, {Component} from 'react';
import ResolutionForms from './resolutions/ResolutionForms.jsx';
import ResolutionSingle from './resolutions/ResolutionSingle.jsx';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import NewEntry from './resolutions/NewEntry.jsx';
import MenuResolution from './resolutions/MenuResolution.jsx';

export default class MyMenu extends TrackerReact(React.Component) {
	constructor(){
		super();

		this.state = {
			subscription:{
				mycollections: Meteor.subscribe("allResolutions"),
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
		this.state.subscription.mycollections.stop();
	}	

	mycollections() {
		return Mcollections.find().sort( { $natural: 1 } ).fetch();
	}

	render() {
		var obj=Meteor.users.find({"_id" : Meteor.userId()}).fetch();
		let orders=<h2>Loading...</h2>;
		if(obj[0]){
			var pos=obj[0].profile.position;
			if(pos==="manager" || pos==="cook"){
				orders=<div>
					<button className="snip1086 yellow" onClick={this.togglePopup.bind(this)}><span>new entry</span><i className="ion-compose"></i></button>
				{this.state.showPopup ? 
          			<NewEntry
          				closePopup={this.togglePopup.bind(this)}
           			/>
          			: null
       			}
       			<MenuResolution/>
				</div>
			}else{
  				orders=<h2> Sorry you have no rights to configure the Menu</h2>

			}
		}

		return (
			<div className="resolutions">
				<nav className="snip1491">
				<li className="current"><a href="/mymenu">Menu</a></li>
				<li><a href="/prepareorders">Prepare</a></li>				
				</nav>
				{orders}				   
			</div>
		)
	}
}