import React, {Component} from 'react';
import ReadyOrderSingleItem from './ReadyOrderSingleItem.jsx';

export default class ReadyOrderSingle extends Component {

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
	Meteor.call('toggleReadyOrder', this.props.resolution);
	var by=Meteor.users.find({_id : Meteor.userId() }).fetch()[0].username;
	if(by){
		if(!this.props.resolution.ready){
			var test=this.currOrderId(this.props.resolution._id);
			for(var i=0; i<test[0].items.length; i++){
				if(!test[0].items[i].ready){					
					Meteor.call('toggleReadyOrderItem',
						this.props.resolution,test[0].items[i].ready,by,test[0].items[i].name,
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
			var test=this.currOrderId(this.props.resolution._id);			
				Meteor.call('toggleReadyOrderItem',
					test[0],test[0].items[i].ready,by,test[0].items[i].name,
					test[0].items[i].itemid,true, function (err, res) {
					if(err){
      					console.log(err);
   					}else{}     		
					});				
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
		const resolutionClass = this.props.resolution.ready ? "false" : "";
		const status= this.props.resolution.ready ? <span className="completed_paid">ready</span> : '';
		//const resolutionClass2 = this.props.resolution.status ? "pending" : "";
		//const status2= this.props.resolution.status ? <span className="completed_checked">delivered</span> : '';

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
					return <ReadyOrderSingleItem key={index} 
					resolution={resolution}
					collection={test}
					callback={this.updateNow} />				
			})				
		}

		var collection=this.currOrderId(this.props.resolution._id);
		var count_ready=0;
		for(var i=0; i<collection[0].items.length; i++){				
			if(collection[0].items[i].ready){
				count_ready=count_ready+1;
			}	
		}

		if(!this.props.resolution.ready && this.props.ready==="false" && this.props.resolution.completed===false){
			single=<div className="wrapper">
				<div className="cdivd"
					readOnly={true}
					id={this.props.resolution._id}
					onClick={this.toggleChecked.bind(this)}>
					<a className="ctext"><br /><br /><br /><br /><br /><br /></a>
				</div>
				<label className="testlabel" onClick={this.togglePopup.bind(this)}><h3> table : {this.props.resolution.table_number}</h3> 
				delivered items : {count_ready}/{collection[0].items.length} {status}</label>
				{this.state.showPopup ? 
          			<div className="centerdiv2">
					order taken at <h3>{moment(this.props.resolution.last_modified).format("HH:mm:ss")} {" "}</h3>	
          			{listItems}
          			</div>
          			: null
       			}
			</div>
		}
		if(this.props.resolution.ready && this.props.ready==="true" && this.props.resolution.completed===false){
			single=<div className="wrapper">
				<div className="cdivd"
					readOnly={true}
					id={this.props.resolution._id}
					onClick={this.toggleChecked.bind(this)}>
					<a className="ctext"><br /><br /><br /><br /><br /><br /></a>
				</div>
				<label className="testlabel" onClick={this.togglePopup.bind(this)}><h3> table : {this.props.resolution.table_number}</h3>
				 delivered items : {count_ready}/{collection[0].items.length} {status}</label>
				{this.state.showPopup ? 
					<div className="centerdiv2">
					order taken at <h3>{moment(this.props.resolution.last_modified).format("HH:mm:ss")} {" "}</h3>	
          			{listItems}
          			</div>
          			: null
       			}			
			</div>
		}

		return (<div className="divback">{single}</div>)
	}
}