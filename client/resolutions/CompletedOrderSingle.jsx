import React, {Component} from 'react';
import COrderSingleItem from './COrderSingleItem.jsx';

export default class CompletedOrderSingle extends Component {
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

	togglePopup() {
   		this.setState({
      		showPopup: !this.state.showPopup
   		});
   	}	

	

	render () {
		const status= this.props.resolution.status ? <span className="completed_checked">Delivered</span> : '';	
		const status2= this.props.resolution.paid ? <span className="completed_paid">Paid</span> : '';
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
					return <COrderSingleItem key={index} 
					resolution={resolution}
					number={index}
					collection={test}
					callback={this.updateNow} />				
			})				
		}

		if(this.props.resolution.completed===true){
			single=<div>
				<label className="testlabel" onClick={this.togglePopup.bind(this)}> table number : {this.props.resolution.table_number} {" "}
				order taken at {moment(this.props.resolution.last_modified).format("DD/MM/YYYY HH:mm")} {" "}
				{status}{status2}</label>
				{this.state.showPopup ? 
          			<div className="testul">
          			{listItems}
          			</div>
          			: null
       			}
			</div>
		}
		return (
			<div>
			{single}
			</div>
			)
	}
}