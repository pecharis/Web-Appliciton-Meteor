import React, {Component} from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import ShopStuffSingle from './ShopStuffSingle.jsx';
import ShopStuffRequests from './ShopStuffRequests.jsx';

export default class ShopStuff extends Component  {
	
	render() {
		var test=this.props.shop;
		var man,wait,cook,assistant;
		var shopname="";
		if(test[0]){	
			shopname=this.props.shop[0].shop;
			var man = test[0].manager.map( (resolution,index)=>{
				return <ShopStuffSingle 
				key={index} name={resolution.name} 
				position="manager"	shop={this.props.shop[0].shop}/>
			});
		if(test[0].waiter){
			var wait = test[0].waiter.map( (resolution,index)=>{
				return <ShopStuffSingle 
				key={index} name={resolution.name} 
				position="waiter" shop={this.props.shop[0].shop}/>
		});
		}
		if(test[0].assistant){
			var assistant = test[0].assistant.map( (resolution,index)=>{
				return <ShopStuffSingle
				key={index} name={resolution.name} 
				position="assistant" shop={this.props.shop[0].shop}/>			
			});
		}
		if(test[0].cook){
			var cook = test[0].cook.map( (resolution,index)=>{
				return <ShopStuffSingle 
				key={index} name={resolution.name} 
				position="cook" shop={this.props.shop[0].shop}/>			
			});
		}
			if(test[0].requests){
				var req = test[0].requests.map( (resolution,index)=>{				
					return <ShopStuffRequests
					key={index} number={index} name={resolution.name} position={resolution.position}
					shop={this.props.shop[0].shop}/>
				});
			}
		}
		return(<div className="stuffdiv">
			<div className="stuffctitlediv"><h3>{shopname}</h3></div>
			<div className="stufftitlediv"><h3>Manager</h3>{man}</div>
			<div className="stufftitlediv"><h3>Waiters</h3>{wait}</div>
			<div className="stufftitlediv"><h3>assistants</h3>{assistant}</div>
			<div className="stufftitlediv"><h3>Cook</h3>{cook}</div>
			<div className="stufftitlediv"><h3>Requests</h3>{req}</div>
			</div>
			)
	}
}