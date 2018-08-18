import React from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import ResolutionForms from './ResolutionForms.jsx';
import ResolutionCreate from './ResolutionCreate.jsx';
import ShopStuff from './ShopStuff.jsx';
import ResolutionSingle from './ResolutionSingle.jsx';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

Mcollections = new Mongo.Collection("mcollections2");
Shop = new Mongo.Collection("shops");

export default class Resolutions extends TrackerReact(React.Component) {
	constructor(){
		super();
		
		this.state = {
			subscription:{
				findshops: Meteor.subscribe("allshops"),
				showPopup: false,
				showPopup2: false
			}
		}
	}

	togglePopup() {
   		this.setState({
      		showPopup: !this.state.showPopup,
      		showPopup2: false
   		});
	}
	togglePopup2() {
   		this.setState({
      		showPopup2: !this.state.showPopup2,
      		showPopup: false
   		});
	}
	findshops(shop){
		return Shop.find({"shop": shop}).fetch();
	}

	componentWillUnmount() {
		this.state.subscription.findshops.stop();
	}	

	checking(){
		var curr;
		Session.set('user',"Loading");
		Session.set('user',Meteor.users.find({_id : Meteor.userId() }).fetch()[0]);
		if(Session.get('user')){
			if(!Session.get('user').username){
				curr=<div>
						<h2>Hello let's make the appropriate arrangements</h2>
						<h3>connect to existing shop or create a new one</h3>
						<button	className="snip1086 blue" onClick={this.togglePopup.bind(this)}>
							<span>Connect</span><i className="ion-arrow-right-c"></i></button>	
						<button	className="snip1086 yellow" onClick={this.togglePopup2.bind(this)}>
							<span>Create</span><i className="ion-compose"></i></button>							
					</div>
			}else{
				if(Session.get('user').profile.status==="pending"){
					curr=<div>
					<h2>welcome back {Session.get('user').username}</h2>
					<p> We are still waiting for one of the managers to accept your request as a '{Session.get('user').profile.position}' at '{Session.get('user').profile.shop}'</p>
					</div>
				}
				if(Session.get('user').profile.status==="accepted"){
				curr=<div>
						<h2>welcome back {Session.get('user').username}</h2>
						<p>Currently working at '{Session.get('user').profile.shop}' shop as '{Session.get('user').profile.position}'</p>
						<h3>but u can also exit current and connect to another existing shop or create a new one</h3>
						<button	className="snip1086 blue" onClick={this.togglePopup.bind(this)}>
							<span>Connect</span><i className="ion-arrow-right-c"></i></button>	
						<button	className="snip1086 yellow" onClick={this.togglePopup2.bind(this)}>
							<span>Create</span><i className="ion-compose"></i></button>	
					</div>
				}				
				if(Session.get('user').profile.status==="deleted"){
					curr=<div>
						<h2>welcome back {Session.get('user').username}</h2>
						<p>it seems that one of the managers of your previous working place removed you</p>
						<h3>please connect to another existing shop or create a new one</h3>
						<button	className="snip1086 blue" onClick={this.togglePopup.bind(this)}>
							<span>Connect</span><i className="ion-arrow-right-c"></i></button>	
						<button	className="snip1086 yellow" onClick={this.togglePopup2.bind(this)}>
							<span>Create</span><i className="ion-compose"></i></button>	
					</div>
				}
				if(Session.get('user').profile.position==="manager" && Session.get('user').profile.status==="accepted" ){
					Session.set('shops',this.findshops(Session.get('user').profile.shop));
					if(!Session.get('shops')){return (<div>Loading...</div>);}
					let shops=Session.get('shops');
					curr=<div>
						<div className="divprofile">
						<h2>welcome back {Session.get('user').username}</h2>
						<p>Currently working at '{Session.get('user').profile.shop}' shop as '{Session.get('user').profile.position}'</p>
						</div>
						<div className="divshop">
						<ShopStuff shop={shops} />
						</div>
						</div>
				}
			}
			
		}
		return curr;
	}

	render() {		
		var by=this.checking();		
		return(
			<div>{by}
			{this.state.showPopup ? 
          			<ResolutionForms
          				closePopup={this.togglePopup.bind(this)}
           			/>
          			: null
       			}
       		{this.state.showPopup2 ? 
          			<ResolutionCreate
          				closePopup={this.togglePopup2.bind(this)}
           			/>
          			: null
       			}
       		</div>
		)
	}
}
