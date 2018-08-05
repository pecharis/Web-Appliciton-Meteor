import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import OrderResolutionSingle from './OrderResolutionSingle.jsx';
import CurrentOrder from './CurrentOrder.jsx';
import Collapsible from 'react-collapsible';
import { Template } from 'meteor/templating';
import Select from 'react-select';
import 'react-select/dist/react-select.css';


currOrder = new Mongo.Collection("orders");
LocalOrder = new Ground.Collection('LocalOrder');

export default class OrderResolution extends TrackerReact(React.Component) {

	constructor(){
		super();		
		if(!Session.get('table_number')){
			this.state = {
   				selectedOption: '',
   				subscription:{
					currOrders: Meteor.subscribe("allOrders"),
					showPopup: false
				}
  			}
  		}
  		else{
  			this.state = {
   		 		selectedOption: Session.get('table_number'),
   		 		subscription:{
					currOrders: Meteor.subscribe("allOrders"),
					showPopup: false
				}
  			}
  		}
  		this.handleChange = (selectedOption) => {
    		this.setState({ selectedOption });
    		LocalOrder.clear();
    		Session.set('total',0);
    		// selectedOption can be null when the `x` (close) button is clicked
    		if (selectedOption) {
    			Session.set('table_number', selectedOption.label);
      			this.setState({'update_now':'yes'});
      			if(this.props.nav_option==="update"){
      				LocalOrder.insert(currOrder.find({"table_number" : Session.get('table_number'), "completed" : false }).fetch()[0]);
      				Session.set('total',currOrder.find({"table_number" : Session.get('table_number'),  "completed" : false}).fetch()[0].total);
      			}
    		}
    	}
    	this.handleChange2 = (selectedOption) => {
    		LocalOrder.update({"total" : Session.get('total')},{ $set : { "table_number" : selectedOption.label } },{upsert : true });
    		Session.set('table_number', selectedOption.label);
    		this.setState({ selectedOption });
    		this.setState({
      			showPopup: !this.state.showPopup
   			});
   			console.log(LocalOrder.find().fetch()[0]);
    	}
    	this.updateNow = this.updateNow.bind(this);
	}

	componentWillUnmount() {
		this.state.subscription.currOrders.stop();
		LocalOrder.clear();
		Session.set('table_number','');
		Session.set('total',0);
	}

	currOrders() {
		return currOrder.find().fetch();
	}

	updateNow(){
		this.setState({'update_now':'yes'});
	}

	mycategories() {
		var distinctEntries = _.uniq(Mcollections.find({}, {
    		sort: {"category": 1}, fields: {"category": true}
		}).fetch().map(function(x) {
   			 return x.category;
		}), true);
		return distinctEntries;
	}

	eachcategory(distinctEntry){
		return Mcollections.find({category : distinctEntry },{sort: {"category": 1}}).fetch();
	}

	addToOrder(event){
			Meteor.call('addOrder', LocalOrder.find().fetch()[0]);
			LocalOrder.clear();
			Session.set('table_number','');
			this.setState({ selectedOption: ''});
			Session.set('total',0);
	}

	cancelOrder(){
		alert("order canceled");
		LocalOrder.clear();
		Session.set('table_number','');
		this.setState({ selectedOption: ''});
	}

	togglePopup() {
   		this.setState({
      		showPopup: !this.state.showPopup
   		});
	}

	update_order_number(){
		var distinctEntries = _.uniq(currOrder.find( { 
			$or: [ {paid : false}, {status : false} ]},
			{sort: {table_number: 1}, fields: {table_number: true}
			}).fetch().map(function(x) {
   			 return x.table_number;
			}), true);	
		var tables_numbers=[];
		for (let i = 0; i <= 100; ++i) {
			if(distinctEntries.includes(i)){}else{
		    tables_numbers[i]={ value:i, label: i };	
		    }	 
		}
		tables_numbers = tables_numbers.slice()
		tables_numbers = tables_numbers.filter(function(n){ return n != undefined });
		const { selectedOption } = this.state;

		var select=<div>
		 		<h2>Table Number : {Session.get('table_number')}</h2>
				<Select
					id="table_select"
					options={tables_numbers}
				  	name="form-field-name"
				    value={selectedOption}
				    onChange={this.handleChange2.bind(this)}				        
				/>
						</div>
		return select;
	}

	select_table(flag, options){
		if(flag==1){
			const { selectedOption } = this.state;
			var select =<div>
		 		<h2>Table Number : {Session.get('table_number')}</h2>
				<Select
					id="table_select"
					options={options}
				  	name="form-field-name"
				    value={selectedOption}
				    onChange={this.handleChange.bind(this)}				        
				/>
						</div>
		}else{select=<h2></h2>}		
		return(select);	
	}

	listItems(){
		const category_names = this.mycategories();
		const listItems = category_names.map((category_name, index) =>
 			<Collapsible className="menu-section-title"
 			key={index}  		  
 			trigger={`${category_name}`}>
 			{this.eachcategory(category_name).map( (resolution)=>{
				return <OrderResolutionSingle 
					key={resolution._id} 
					resolution={resolution} 
					name={resolution._id}
					callback={this.updateNow} />
				})
			}
			</Collapsible>
		);
		return listItems;
	}

	change_order(){
		Session.set('table_number','');
		this.updateNow();
	}

	complete_cancel_change_button(flag){
		var complete_order_button = <h2></h2>			
		var cancel_button = <h2></h2>
		var change_order = <h2></h2>
		var change_table_number_button=<h2></h2>
		if (flag){	
			complete_order_button =<button	className="snip1086" 
			onClick={this.addToOrder.bind(this)}>
			<span>Submit</span><i className="ion-checkmark"></i></button>		
			cancel_button=<button  
				className="btn-cancel"
				onClick={this.cancelOrder.bind(this)}>
				&times;
				</button>
			change_table_number_button=<button 
				className="snip1339"
				onClick={this.togglePopup.bind(this)}
				>change table number</button>
			change_order=<button 
				type="button"
				className="snip1339"
				onClick={this.change_order.bind(this)}
				>change order</button>	
				
		}
		return [complete_order_button, cancel_button, change_table_number_button, change_order];
	}

			

	render() {
		const listItems=this.listItems();
		var buttons;
		var change_order;
		var complete_order_button;
		var cancel_button;
		var show_listItems;
		var change_table_number_button;
		var select_table;
		var lele=this.update_order_number();

		if(!Session.get('table_number')){
			buttons=this.complete_cancel_change_button(0);
			complete_order_button=buttons[0];
			cancel_button=buttons[1]; 
			change_table_number_button=buttons[2];
			change_order=buttons[3];
			show_listItems=<h2>waiting for table number </h2>									
			var options=[];
			var options = this.props.table_numbers.slice();
			options = options.filter(function(n){ return n != undefined });
			select_table=this.select_table(1,options);
		}
		else{	
			show_listItems=listItems
			select_table=this.select_table(0,[]);
			buttons=this.complete_cancel_change_button(1);
			change_order=buttons[3];
			cancel_button=buttons[1]; 
			change_table_number_button=buttons[2];
			if(Session.get('total')){				
				complete_order_button=buttons[0];				
			}				
		}

		return(			 	
			<div>
				<div className="leftdiv2">
					<CurrentOrder className="leftdiv" callback={this.updateNow}/>
				</div>
				<div className="leftdiv">
					{change_table_number_button}
					{change_order}
					{complete_order_button}
					{cancel_button}
				</div>
				<div className="belowdiv">	
					{this.state.showPopup ? 
       					<div>
       						{lele}
       					</div>
       					: null
   					}										
					{select_table}					
                    {show_listItems}
				</div>				   				
       		</div>       		
       	)
	}
}