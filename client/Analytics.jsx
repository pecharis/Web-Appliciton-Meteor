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
const options2 = [
 		 { value: 'today', label: 'today' },
 		 { value: 'week', label: 'week' },
 		 { value: 'all', label: 'all' }
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
			selectedOption: {value: 'items',label:'items'},
			selectedOption2: {value: 'today',label:'today'}
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
		selectedOption={value: selectedOption.target.value,label:selectedOption.target.value}
    	this.setState({ selectedOption });
    	console.log(`Option selected:`, selectedOption);
  	}

  	handleChange2 = (selectedOption2) => {
  		selectedOption2={value: selectedOption2.target.value,label:selectedOption2.target.value}
    	this.setState({ selectedOption2 });
    	console.log(`Option2 selected:`, selectedOption2);
  	}

	render() {
		const { selectedOption } = this.state;
		const { selectedOption2 } = this.state;
		var intro;
		var items;
		var sel;
		var obj=Meteor.users.find({"_id" : Meteor.userId()}).fetch();
		if(obj[0]){
			var pos=obj[0].profile.position;
			if(pos==="manager" && obj[0].profile.status==="accepted"){
				sel=<div className="leftdiv3"><p>choosing time</p>
					<div className="leftdiv">
					<div className="new-resolution">			
					      		<label>
						        <input type="radio" value="items" 
						                checked={this.state.selectedOption.value === 'items'} 
						                onChange={this.handleChange.bind(this)}/>
						      items
						      	</label>
						     	<label>
						        	<input type="radio" value="stuff" 
						                checked={this.state.selectedOption.value === 'stuff'} 
						                onChange={this.handleChange.bind(this)}/>
						        staff
						        </label>						   
						     	<label>
						        	<input type="radio" value="event log" 
						                checked={this.state.selectedOption.value === 'event log'} 
						                onChange={this.handleChange.bind(this)}/>
						        Event log
						        </label>
						        </div>	
						        </div>	
					<div className="leftdiv">
					<div className="new-resolution">
					      		<label>
						        <input type="radio" value="today" 
						                checked={this.state.selectedOption2.value === 'today'} 
						                onChange={this.handleChange2.bind(this)}/>
						      today
						      	</label>
						     	<label>
						        	<input type="radio" value="week" 
						                checked={this.state.selectedOption2.value === 'week'} 
						                onChange={this.handleChange2.bind(this)}/>
						        week
						        </label>
						     	<label>
						        	<input type="radio" value="all" 
						                checked={this.state.selectedOption2.value === 'all'} 
						                onChange={this.handleChange2.bind(this)}/>
						        all
						        </label>						   
						</div>
						</div>
				</div>

			}else{sel=<h2>you need to be a manager to access this page</h2>}
		}
		if(selectedOption && selectedOption2){
			if (selectedOption.value==="items"){
				var localitems=[];
				if(selectedOption2.value==="today"){
					//console.log("today");					
					var date = new Date()
					var today = moment(date).format("MM.DD.YYYY");					
				}
				if(selectedOption2.value==="week"){
					console.log("week");
					var today = moment().subtract(1, 'weeks').startOf('isoWeek').format("MM.DD.YYYY");
				}				
				var distinctEntries =currOrder.find({'last_modified':{$gte: new Date(today)}}, 
					{sort: {"items.value": 1}, fields: {"items.name" : true, "items.price" : true, "last_modified": true, "items.readyAt":true }
					}).fetch().map(function(x) {
						for(var i=0; i<x.items.length;i++){
							var flag=true;
							for(var y=0; y<localitems.length;y++){
								if(localitems[y] && flag==true){
									if(localitems[y].label===x.items[i].name){
										localitems[y].value=localitems[y].value+1;
										if(x.items[i].readyAt){
											if(moment(moment(x.items[i].readyAt).format("HH:mm:ss"),"HH:mm:ss").diff(moment(x.last_modified,"HH:mm:ss"),'m')>=0){
												localitems[y].count=localitems[y].count + moment(moment(x.items[i].readyAt).format("HH:mm:ss"),"HH:mm:ss").diff(moment(x.last_modified,"HH:mm:ss"),'m');
											}
										}
										flag=false;
									}
								}
							}
							if(flag){
								if(x.items[i].readyAt){
									if(moment(moment(x.items[i].readyAt).format("HH:mm:ss"),"HH:mm:ss").diff(moment(x.last_modified,"HH:mm:ss"),'m')>=0){
										localitems.push({value : 1 , label: x.items[i].name,price : x.items[i].price,
											count : moment(moment(x.items[i].readyAt).format("HH:mm:ss"),"HH:mm:ss").diff(moment(x.last_modified,"HH:mm:ss"),'m')});
									}else{
										localitems.push({value : 1 , label: x.items[i].name,price : x.items[i].price, count: 0} );
									}
								}else{
									localitems.push({value : 1 , label: x.items[i].name,price : x.items[i].price, count: 0} );
								}
							}
						}
   					 
				});	
				if(selectedOption2.value==="all"){
					//console.log("all");
					var distinctEntries =currOrder.find({}, 
					{sort: {"items.value": 1}, fields: {"items.name" : true, "items.price" : true, "last_modified": true, "items.readyAt":true}
					}).fetch().map(function(x) {
						for(var i=0; i<x.items.length;i++){
							var flag=true;
							var count=0;
							for(var y=0; y<localitems.length;y++){
								if(localitems[y] && flag==true){
									if(localitems[y].label===x.items[i].name){
										localitems[y].value=localitems[y].value+1;
										if(x.items[i].readyAt){
											if(moment(moment(x.items[i].readyAt).format("HH:mm:ss"),"HH:mm:ss").diff(moment(x.last_modified,"HH:mm:ss"),'m')>=0){
												localitems[y].count=localitems[y].count + moment(moment(x.items[i].readyAt).format("HH:mm:ss"),"HH:mm:ss").diff(moment(x.last_modified,"HH:mm:ss"),'m');
											}
										}
										flag=false;
									}
								}							
							}
							if(flag){
								if(x.items[i].readyAt){
									if(moment(moment(x.items[i].readyAt).format("HH:mm:ss"),"HH:mm:ss").diff(moment(x.last_modified,"HH:mm:ss"),'m')>=0){
										localitems.push({value : 1 , label: x.items[i].name,price : x.items[i].price,
											count : moment(moment(x.items[i].readyAt).format("HH:mm:ss"),"HH:mm:ss").diff(moment(x.last_modified,"HH:mm:ss"),'m')});
									}else{
										localitems.push({value : 1 , label: x.items[i].name,price : x.items[i].price, count: 0} );
									}
								}else{
									localitems.push({value : 1 , label: x.items[i].name,price : x.items[i].price, count: 0} );
								}
							}
						}
   					 
				});	
				}	

				//if(selectedOption2){
					if(selectedOption2.value==="today"){				
								var date = new Date()
								var today = moment(date).format("MM.DD.YYYY");
								var Corders=currOrder.find({'last_modified':{$gte: new Date(today)},completed : true}).fetch().length;
								var Porders=currOrder.find({'last_modified':{$gte: new Date(today)},completed : false}).fetch().length;
								var ctotal=0;
								obj=currOrder.find({'last_modified':{$gte: new Date(today)},completed : true}).fetch();
								for(let i=0; i<obj.length; i++){
									ctotal=ctotal+obj[i].total;
								}
								intro=<div><h2>Today's number of pending orders is {Porders}</h2>
										   <h2>Today's number of completed orders is {Corders} Total ammount of : {ctotal.toFixed(2)}€</h2>
									  </div>

					}
					if(selectedOption2.value==="week"){				
								var date = new Date()
								var today = moment().subtract(1, 'weeks').startOf('isoWeek').format("MM.DD.YYYY");
								var Corders=currOrder.find({'last_modified':{$gte: new Date(today)},completed : true}).fetch().length;
								intro=<div><h2>Number of completed orders from "{today}" are : {Corders}</h2>
									  </div>

					}
					if(selectedOption2.value==="all"){
								var Corders=currOrder.find({completed : true}).fetch().length;
								intro=<div><h2>Number of completed orders from "the beginning of time" are : {Corders}</h2>
									  </div>

					}
				//}
				items=localitems.map((curr,index)=>{
					return <AnalyticsMenu key={index}
					resolution={curr}
					Corders={Corders}
					date={selectedOption2.value}/>
					//console.log(curr.label,curr.value);
				})
			}
			if(selectedOption.value==="stuff"){
				var obj=Meteor.users.find({"_id" : Meteor.userId()}).fetch();
				var test2=Meteor.users.find({"profile.shop" : obj[0].profile.shop}).fetch();
				items=test2.map((test,index)=>{
					return <AnalyticsStuff	key={index} 
						name={test}
						date={selectedOption2.value}/>
						//console.log(test.emails[0].address);
				})
			}
			if (selectedOption.value==="event log"){
				var obj=Meteor.users.find({"_id" : Meteor.userId()}).fetch();
				items= <AnalyticsEvents shop={obj[0].profile.shop}
				date={selectedOption2.value}/>
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
				{intro}
				{sel}
				{items}
			</ReactCSSTransitionGroup>
		)
	}
}