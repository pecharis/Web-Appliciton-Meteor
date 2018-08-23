import React, {Component} from 'react';
import DeliverOrderSingleItem from './DeliverOrderSingleItem.jsx';

export default class DeliverOrderSingle extends Component {
	constructor(){
		super();
		this.state = {
			subscription:{
				currOrderId: Meteor.subscribe("allUnOrders"),
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

		var obj=Meteor.users.find({"_id" : Meteor.userId()}).fetch();
		let orders=<h2>Loading...</h2>;
		if(obj[0]){
			var pos=obj[0].profile.position;
			if(pos==="manager" || pos==="waiter" || pos==="assistant"){
				Meteor.call('toggleDeliverOrder', this.props.resolution);
				if(this.props.resolution.paid===true){
					Meteor.call('toggleCompleteOrder',this.props.resolution);
				}
				if(!this.props.resolution.status){
					var test=this.currOrderId(this.props.resolution._id);

					for(var i=0; i<test[0].items.length; i++){
						if(!test[0].items[i].status){
							var by=Meteor.users.find({_id : Meteor.userId() }).fetch()[0].username;
							Meteor.call('toggleDeliverOrderItem',
								test[0],test[0].items[i].status,by,test[0].items[i].name,
								test[0].items[i].itemid,true, function (err, res) {
								if(err){
		      						console.log(err);
		   						}else{
		     				 	}     		
							});
						}
					}
				}else{
					var test=this.currOrderId(this.props.resolution._id);

					for(var i=0; i<test[0].items.length; i++){	
					var by=Meteor.users.find({_id : Meteor.userId() }).fetch()[0].emails[0].address;			
						Meteor.call('toggleDeliverOrderItem',
							test[0],test[0].items[i].status,by,test[0].items[i].name,
							test[0].items[i].itemid,true, function (err, res) {
							if(err){
		      					console.log(err);
		   					}else{}     		
							});				
					}

				}
			}
		}
	}
	togglePopup() {
   		this.setState({
      		showPopup: !this.state.showPopup
   		});
   	}	

	render () {
		const status= this.props.resolution.status ? <span className="completed_checked">D</span> : '';
		const status2= this.props.resolution.paid ? <span className="completed_paid">P</span> : '';
		const status3= this.props.resolution.ready ? <span className="completed_ready">R</span> : '';

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
					return <DeliverOrderSingleItem key={resolution.itemid} 
					resolution={resolution}
					collection={test}
					number={index}
					callback={this.updateNow} />				
			})
		}

		var collection=this.currOrderId(this.props.resolution._id);
		var count_delivered=0;
		var count_paid=0;
		for(var i=0; i<collection[0].items.length; i++){				
			if(collection[0].items[i].status){
				count_delivered=count_delivered+1;
			}	
			if(collection[0].items[i].paid){
				count_paid=count_paid+1;
			}		
		}
		var orders=<div className="cdivp"
					readOnly={true}
					id={this.props.resolution._id}
					onClick={this.toggleChecked.bind(this)}>
					<a className="ctext"><br /><br /><br /><br /><br /></a>				
				</div>
		if(!this.props.resolution.status && this.props.status==="pending" && this.props.resolution.completed===false){
			single=<div className="wrapper">
				{orders}
				<label className="testlabel" onClick={this.togglePopup.bind(this)}><h3> table : {this.props.resolution.table_number}</h3>
				{"  "} delivered items : {count_delivered}/{collection[0].items.length} 
				{status3}{status}{status2}</label> 
				
				{this.state.showPopup ? 
          			<div className="centerdiv2">
          			order taken at <h3>{moment(this.props.resolution.last_modified).format("HH:mm:ss")} {" "}</h3>				
						paid items <h3>{count_paid}/{collection[0].items.length}
					</h3>
          			{listItems}
          			</div>
          			: null
       			}
			</div>
		}
		if(this.props.resolution.status && this.props.status==="delivered" && this.props.resolution.completed===false){
			single=<div className="wrapper" >
				{orders}
				<label className="testlabel" onClick={this.togglePopup.bind(this)}><h3> table : {this.props.resolution.table_number}</h3>
				{" "} delivered items : {count_delivered}/{collection[0].items.length}
				{status3}{status}{status2}</label> 
				{this.state.showPopup ? 
          			<div className="centerdiv2">
          			order taken at <h3>{moment(this.props.resolution.last_modified).format("HH:mm:ss")} {" "}</h3>				
						paid items <h3>{count_paid}/{collection[0].items.length}
					</h3>				
          			{listItems}
          			</div>
          			: null
       			}
       			</div>
				
		}
		return (<div className="divback">{single}</div>)
	}
}