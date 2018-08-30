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
				showPopup2: false,
				showPopup3: false
			}
		}
	}	

	togglePopup() {
   		this.setState({
      		showPopup: !this.state.showPopup,
      		showPopup2: false,
      		showPopup3: false
   		});
	}
	togglePopup2() {
   		this.setState({
      		showPopup2: !this.state.showPopup2,
      		showPopup: false,
      		showPopup3: false
   		});
	}
	togglePopup3() {
   		this.setState({
      		showPopup3: !this.state.showPopup3,
      		showPopup: false,
      		showPopup2: false
   		});
	}


	currOrders() {
		if(this.props.date==="today"){
			console.log("today");
			var date = new Date()
			var today = moment(date).format("MM.DD.YYYY");
			return currOrder.find({'last_modified':{$gte: new Date(today)}}).fetch();	
		}
		if(this.props.date==="week"){
			console.log("week");
			var today = moment().subtract(1, 'weeks').startOf('isoWeek').format("MM.DD.YYYY");
			return currOrder.find({'last_modified':{$gte: new Date(today)}}).fetch();
		}
		if(this.props.date==="all")	{
			console.log("all");
			return currOrder.find().fetch();
		}
		
	}

	render () {
		
		var test=this.currOrders();
		var item;

		var countpaid=[];
		var itemsdel=[];
		var ordersTaken=[];
		var itemspaid=[];
		var countstatus=[];
		var anadel=[];
		var flags;
		var flagp;
		var numberOfOrders=0;

		if(!test){
			item=<div>Loading...</div>
		}else{
			test.map((obj,index)=>{
				var counts = 0;				
				var countp = 0;
					for(var i=0; i<obj.items.length; i++){
						if(obj.items[i].paid && obj.items[i].paidby===this.props.name.username){
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

						if(obj.items[i].status && obj.items[i].statusby===this.props.name.username){
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
							if(obj.items[i].readyAt){
								anadel.push({item : obj.items[i].name, readyAt: moment(obj.items[i].readyAt).format("HH:mm:ss"), statusAt: moment(obj.items[i].statusAt).format("HH:mm:ss"), table_number: obj.table_number});
							}else{
								anadel.push({item : obj.items[i].name, readyAt: moment(obj.last_modified).format("HH:mm:ss"), statusAt: moment(obj.items[i].statusAt).format("HH:mm:ss"), table_number: obj.table_number});
							}
						}
						
					}					
					if(obj.user===this.props.name._id){
						numberOfOrders=numberOfOrders+1;
						if(obj.completed==true){
							if(obj.readyAt){
								ordersTaken.push({date : moment(obj.last_modified).format("HH:mm:ss"),
								day : moment(obj.last_modified).format("MM.DD"),
								table_number: obj.table_number, total: obj.total,
								readyAt: moment(obj.readyAt).format("HH:mm:ss"),
								statusAt: moment(obj.statusAt).format("HH:mm:ss"),
								paidAt : moment(obj.paidAt).format("HH:mm:ss"),
								completedAt : moment(obj.completedAt).format("HH:mm:ss")});
							}else{
								ordersTaken.push({date : moment(obj.last_modified).format("HH:mm:ss"),
								day : moment(obj.last_modified).format("MM.DD"),
								table_number: obj.table_number, total: obj.total,			
								readyAt: moment(obj.last_modified).format("HH:mm:ss"),
								statusAt: moment(obj.statusAt).format("HH:mm:ss"),
								paidAt : moment(obj.paidAt).format("HH:mm:ss"),
								completedAt : moment(obj.completedAt).format("HH:mm:ss")});
							}
						}
					}
					countstatus.push(counts);
					countpaid.push(countp);

				})
		}
		var ord=<a></a>
		if(ordersTaken){
			ord=ordersTaken.map((objf,index)=>{
				var diff=moment(objf.statusAt,"HH:mm:ss").diff(moment(objf.readyAt,"HH:mm:ss"),'m');
				if(diff>=0){
					return <ul className="inlinediv" key={index}>
					<h3>Table "{objf.table_number}"  total : {objf.total}€</h3><br />
					<a>Taken : </a><h3>{objf.day}</h3><a> at </a><h3>{objf.date}</h3><br />
					<a>completed </a><h3>{objf.completedAt}</h3><br />
					<a>ready </a><h3>{objf.readyAt}</h3><a> after </a><h3>{moment(objf.readyAt,"HH:mm:ss").diff(moment(objf.date,"HH:mm:ss"),'m')}</h3><a>min</a><br />
					<a>delivered </a><h3>{objf.statusAt}</h3><a> after </a><h3>{diff}</h3><a>min</a><br />
					<a>paid at </a><h3>{objf.paidAt}</h3>
					</ul>
				}else{
					return <ul className="inlinediv" key={index}>
					<h3>Table "{objf.table_number}"  total : {objf.total}€</h3><br />
					<a>Taken : </a><h3>{objf.day}</h3><a> at </a><h3>{objf.date}</h3><br />
					<a>completed </a><h3>{objf.completedAt}</h3><br />
					<a>ready </a><h3>{objf.readyAt}</h3><a> after </a><h3>{moment(objf.readyAt,"HH:mm:ss").diff(moment(objf.date,"HH:mm:ss"),'m')}</h3><a>min</a><br />
					<a>delivered </a><h3>{objf.statusAt}</h3><a> after </a><h3>0</h3><a>min</a><br />
					<a>paid at </a><h3>{objf.paidAt}</h3>
					</ul>
				}
			})
		}
		var status=<a></a>
		if(itemsdel){
			status=itemsdel.map((obj,index)=>{
				return <div key={index} ><a>{index}: "{obj.label} x{obj.value}"</a> <br /></div>
				//console.log(obj.label);
			})
		}
		var status2=<a></a>
		var meso=0;
		if(anadel){
			status2=anadel.map((obj,index)=>{				
				var diff2=moment(obj.statusAt,"HH:mm:ss").diff(moment(obj.readyAt,"HH:mm:ss"),'m');
				if(diff2>=0){
				meso=meso + moment(obj.statusAt,"HH:mm:ss").diff(moment(obj.readyAt,"HH:mm:ss"),'m');
				return <div key={index}><a>{obj.statusAt} : Table {obj.table_number} {obj.item}</a> <br /><p> delivered after {diff2} minutes</p></div>
				}else{
				return <div  key={index}><a>{obj.statusAt} : Table {obj.table_number} {obj.item}</a> <br /><p> delivered after 0 minutes</p></div>	
				}
			})
			meso=meso/anadel.length;
		}
		var mesod=<a></a>
		if(meso!=0){
			mesod=<p>Estimated to deliver an item after {meso.toFixed(2)}mins </p>
		}
		var paid=<a></a>
		if(itemspaid){
			paid=itemspaid.map((obj,index)=>{
				return <ul key={index}><a> {obj.label} x{obj.value} price {obj.price} total : {obj.price*obj.value}€</a></ul>
				//console.log(obj.label);
			})
		}
//sadasda
		const add = (a, b) =>
 			a + b
		
		return(		
				<div className="inlinediv"><h2>{this.props.name.username}</h2>				
						
					<ul className="resolutions">							
					<li><a>Orders taken : </a><button className="btn-text" onClick={this.togglePopup3.bind(this)}>{numberOfOrders} out of {test.length}</button></li>
					<br />					
					<li><a> Total items : </a><button className="btn-text" onClick={this.togglePopup.bind(this)}>delivered : {countstatus.reduce(add,0)}</button></li>
					<br />
					<li><a> Total : </a><button className="btn-text" onClick={this.togglePopup2.bind(this)}>paid  : {countpaid.reduce(add,0)}€ </button></li>
					</ul>
					{this.state.showPopup3 ?
						<div>  
	          				{ord}
	          			</div>
	          			: null
	       			} 
					{this.state.showPopup ?
						<div className="inlinediv">
							<h3>delivered total : </h3>							
							<div>
							{status}{mesod}
							{status2}
							</div>
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