import React, {Component} from 'react';
import PayOrderSingleItem from './PayOrderSingleItem.jsx';

export default class PayOrderSingle extends Component {

	constructor(){
		super();
		this.state = {
			subscription:{
				currOrderId: Meteor.subscribe("allOrders"),
				showPopup: false
			}
		}
		this.updateNow = this.updateNow.bind(this);	
  	}
  	updateNow(itemid){
		this.setState({'update_now':'yes'});
		this.props.callback(this.props.resolution._id,itemid);
	}

	currOrderId(id){
		return currOrder.find({_id:id}).fetch();
	}

	toggleChecked() {
	Meteor.call('togglePayOrder', this.props.resolution);
		if(this.props.resolution.status===true){
			Meteor.call('toggleCompleteOrder',this.props.resolution);
		}
		if(!this.props.resolution.paid){
			var test=this.currOrderId(this.props.resolution._id);

			for(var i=0; i<test[0].items.length; i++){
				if(!test[0].items[i].paid){
					var by=Meteor.users.find({_id : Meteor.userId() }).fetch()[0].username;
					Meteor.call('togglePayOrderItem',
						test[0],test[0].items[i].paid,by,test[0].items[i].name,
						test[0].items[i].itemid,true, function (err, res) {
						if(err){
      						console.log(err);
   						}else{}     		
					});
				}
			}
		}else{
			var test=this.currOrderId(this.props.resolution._id);

			for(var i=0; i<test[0].items.length; i++){	
			var by=Meteor.users.find({_id : Meteor.userId() }).fetch()[0].emails[0].address;			
				Meteor.call('togglePayOrderItem',
					test[0],test[0].items[i].paid,by,test[0].items[i].name,
					test[0].items[i].itemid,true, function (err, res) {
					if(err){
      					console.log(err);
   					}else{}     		
					});				
			}

		}
	}


	togglePopup() {
   		this.setState({
      		showPopup: !this.state.showPopup
   		});
   	}	
	

	render () {
		const resolutionClass = this.props.resolution.paid ? "false" : "";
		const status= this.props.resolution.paid ? <span className="completed_paid">paid</span> : '';
		const resolutionClass2 = this.props.resolution.status ? "pending" : "";
		const status2= this.props.resolution.status ? <span className="completed_checked">delivered</span> : '';

		var single;
		var listItems;
		var stringListOfItems=[];
		var test=this.props.resolution;
		
		if(test){
			test.items=test.items.sort(function(a, b) {
				    var textA = a.name.toUpperCase();
				    var textB = b.name.toUpperCase();
				    if(textA===textB){
				    	 var textA = a.comments.toUpperCase();
				    	 var textB = b.comments.toUpperCase();
				    }
				    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
				});
			listItems=test.items.map((resolution,index)=>{
					return <PayOrderSingleItem key={index} 
					resolution={resolution}
					collection={test}
					callback={this.updateNow} />				
			})				
		}

		var total=0;
		var count_delivered=0;
		var count_paid=0;
		var collection=this.currOrderId(this.props.resolution._id);
		for(var i=0; i<collection[0].items.length; i++){				
			if(!collection[0].items[i].paid){
				total=total+collection[0].items[i].price;
			}	
			if(collection[0].items[i].status){
				count_delivered=count_delivered+1;
			}	
			if(collection[0].items[i].paid){
				count_paid=count_paid+1;
			}			
		}

		var obj=Meteor.users.find({"_id" : Meteor.userId()}).fetch();
		let orders=<h2>Loading...</h2>;
		if(obj[0]){
			var pos=obj[0].profile.position;
			if(pos==="manager" || pos==="waiter"){
				orders=<div className="cdiv">
					<input type="checkbox"
					readOnly={true}
					id={this.props.resolution._id}
					checked={this.props.resolution.paid}
					onClick={this.toggleChecked.bind(this)} />
				</div>
			}else{
  				orders=<h2></h2>

			}
		}


		if(!this.props.resolution.paid && this.props.paid==="false" && this.props.resolution.completed===false){
			single=<div className="wrapper">
				{orders}
				<label className="testlabel" onClick={this.togglePopup.bind(this)}>			
				table number : {this.props.resolution.table_number} {" "} 
				time of order : {moment(this.props.resolution.last_modified).format("HH:mm:ss")} {" "}
				delivered items {count_delivered}/{collection[0].items.length} {" "}
				paid items {count_paid}/{collection[0].items.length} {" "}
				paid total : {collection[0].total-total}€ {" "}
				remaining total : {total}€ {status}
				{status2}</label>
				{this.state.showPopup ? 
          			<div className="testul">
          			{listItems}
          			</div>
          			: null
       			}
			</div>
		}
		if(this.props.resolution.paid && this.props.paid==="true" && this.props.resolution.completed===false){
			single=<div className="wrapper">
				{orders}
				<label className="testlabel" onClick={this.togglePopup.bind(this)}>
				table number : {this.props.resolution.table_number} {" "} 
				time of order : {moment(this.props.resolution.last_modified).format("HH:mm:ss")} {" "}
				delivered items {count_delivered}/{collection[0].items.length} {" "}
				paid total : {collection[0].total-total}€ {" "}
				{status2}</label>
				{this.state.showPopup ? 
          			<div className="testul">
          			{listItems}
          			</div>
          			: null
       			}
			</div>
		}

		return (<ul>{single}</ul>)
	}
}