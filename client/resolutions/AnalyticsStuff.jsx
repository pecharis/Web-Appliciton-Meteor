import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import TrackerReact from 'meteor/ultimatejs:tracker-react';


export default class AnalyticsStuff extends TrackerReact(React.Component) {
	constructor(){
		super();
		this.state = {
			subscription:{
				currOrders: Meteor.subscribe("allOrders"),
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


	currOrders() {
		return currOrder.find().fetch();
	}

	render () {
		
		var test=this.currOrders();
		var item;

		var countpaid=[];
		var itemsdel=[];
		var itemspaid=[];
		var countstatus=[];
		var flags;
		var flagp;

		if(!test){
			item=<div>Loading...</div>
		}else{
			test.map((obj,index)=>{
				var counts = 0;				
				var countp = 0;
					for(var i=0; i<obj.items.length; i++){
						if(obj.items[i].paid && obj.items[i].paidby===this.props.name){
							flagp=true;
							for(var y=0; y<itemspaid.length; y++){
								if(obj.items[i].name===itemspaid[y].label){
									itemspaid[y].value=itemspaid[y].value+1;
									flagp=false;
								}
							}
							if(flagp){
									itemspaid.push({value : 1 , label: obj.items[i].name, price : obj.items[i].price });
																
							}
							countp = countp + obj.items[i].price;
						}

						if(obj.items[i].status && obj.items[i].statusby===this.props.name){
							flags=true;
							for(var y=0; y<itemsdel.length; y++){
								if(obj.items[i].name===itemsdel[y].label){
									itemsdel[y].value=itemsdel[y].value+1;
									flags=false;
								}
							}
							if(flags){
									itemsdel.push({value : 1 , label: obj.items[i].name });
																
							}
							counts = counts + 1;
						}
						
					}
					countstatus.push(counts);
					countpaid.push(countp);

				})
		}
		var status=<a></a>
		if(itemsdel){
			status=itemsdel.map((obj,index)=>{
				return <ul key={index}><a> {obj.label} x{obj.value}</a></ul>
				//console.log(obj.label);
			})
		}
		var paid=<a></a>
		if(itemspaid){
			paid=itemspaid.map((obj,index)=>{
				return <ul key={index}><a> {obj.label} x{obj.value} price {obj.price} total : {obj.price*obj.value}</a></ul>
				//console.log(obj.label);
			})
		}
//sadasda
		const add = (a, b) =>
 			a + b
		
		return(
			<div>
				<h3>{this.props.name}</h3>
				<li>
					<a> Total items </a><button onClick={this.togglePopup.bind(this)}>delivered</button>  <a> : {countstatus.reduce(add,0)} </a>
					<a> Total </a><button onClick={this.togglePopup2.bind(this)}>paid</button> <a> : {countpaid.reduce(add,0)}e </a>
				</li>
				{this.state.showPopup ?
					<div>
						<h3>delivered</h3> 
          				{status}
          			</div>
          			: null
       			}
       			{this.state.showPopup2 ?
					<div> 
						<h3>paid</h3> 
          				{paid}
          			</div>
          			: null
       			}
			</div>		
		)
	}
}