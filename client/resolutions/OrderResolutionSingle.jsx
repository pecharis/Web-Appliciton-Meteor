import React, {Component} from 'react';

export default class OrderResolutionSingle extends React.Component {

	constructor(){
		super();
		this.state = {
				showPopup: false
			}
		}	

	plus() {
		// this.props.resolution._id : name of item of which plus button was pressed so create
		// new field if not existed or  + 1 of current field value.
		var table_number=Session.get('table_number');  //table number
		var current_field=this.props.name;  // item name
		var obj=Meteor.users.find({"_id" : Meteor.userId()}).fetch();
		var shop=obj[0].profile.shop;
		var value_of_item = LocalOrder.findOne({},{fields : { [current_field] : 1, "_id": 0}});// if exists or is {}
		Session.set('total', Session.get('total') +this.props.resolution.price);
		var comment=" ";
		if(this.props.comments){comment=this.props.comments;}
		if(this.refs.comment){if(this.refs.comment.value.trim() ===""){}else{comment=this.refs.comment.value.trim();}}
		if(!value_of_item){			
			LocalOrder.update({ table_number : Session.get('table_number')},
			{$set : { table_number : Session.get('table_number'),
					status : false,
					paid : false,
					completed : false,
					ready : false,
					last_modified : new Date(),
					user: Meteor.userId(),
					shop:shop,
					item : 1,
					lastitem : 1,
			 		items : [{ 
			 			name : current_field,
			 			itemid : 1,
			 			comments : comment,
			 			ready : false,			 			
			  			price : this.props.resolution.price,
			  			ready : 0,
			  			readyby : false,
			  			statusby:false,
			  			paidby : false,
			  			status : 0,
			  			paid : 0}],
			  			total : Session.get('total')}},
			{ upsert : true });			
		}		
		else{
			//var plusone = Number(value_of_item[current_field].quantity)+1; // plus 1 of current value
			var itemValue = LocalOrder.find().fetch()[0].item;
			var lastitemValue = LocalOrder.find().fetch()[0].lastitem;
			LocalOrder.update({ table_number : Session.get('table_number')},
			{$set : { table_number : Session.get('table_number'),
					status :  LocalOrder.find().fetch()[0].status,
					paid :  false,
					ready :  false,
					completed :  false,
					last_modified : new Date(),
					user: Meteor.userId(),
					item : itemValue + 1,
					lastitem :lastitemValue + 1,
					total : Session.get('total')}});
			LocalOrder.update({ table_number : Session.get('table_number')},
			{$push : {
			 		items : {  
			 			name : current_field,
			 			itemid : lastitemValue+1,
			 			comments : comment,
			 			ready : false,
			  			price : this.props.resolution.price,
			  			ready : 0,
			  			readyby : false,
			  			statusby:false,
			  			paidby : false,
			  			status : 0,
			  			paid : 0}
			  		}});
		}
		this.props.callback();	
	}

	minus() {
		var table_number=Session.get('table_number');  //table number
		var current_field=this.props.name;  // item name		
		if(LocalOrder.find().fetch()[0]){
			var comment= " ";
			if(this.props.comments){
				comment=this.props.comments;
			}
			if(LocalOrder.findOne({ "items.name" : current_field })){
				var value_of_item=LocalOrder.findOne({ "items.name" : current_field,"items.comments" : comment }).items;
				var itemValue = LocalOrder.find().fetch()[0].item;
				if(value_of_item){
					var itemid_removing=value_of_item.filter(obj=>{
						return obj.name===current_field && obj.comments===comment
					});
					Session.set('total', Session.get('total') - this.props.resolution.price);
					LocalOrder.update({ table_number : Session.get('table_number')},
						{$set : {
						last_modified : new Date(),
						user: Meteor.userId(),
						item : itemValue - 1}});
					LocalOrder.update({ table_number : Session.get('table_number')},
						{$pull : {
					 		items : {  
			 					name : current_field, itemid : itemid_removing[0].itemid, comments : comment
			 					}
		  			}},{ multi: false });
				}
				this.props.callback();
			}
		}
	}
	addComment(){
		this.setState({
      		showPopup: !this.state.showPopup
   		});
	}

	render () {
		var testing;
		var current_field=this.props.name;
		var comm;	
		if(this.props.comments){comm=this.props.comments;}else{comm=" ";}			
		if(!LocalOrder.find().fetch()[0]){
			testing=<h2 className="whitediv">0</h2>
		}else{
			if(!LocalOrder.findOne({ "items.name" : current_field })){
				testing=<h2 className="whitediv">0</h2>
			}else{
				var value_of_item=LocalOrder.findOne({ "items.name" : current_field}).items;
				if(this.props.comments){
				var itemid_removing=value_of_item.filter(obj=>{
						return obj.name===current_field && obj.comments===comm
					});
				}else{
					var itemid_removing=value_of_item.filter(obj=>{
						return obj.name===current_field
					});
				}
				testing=<h2 className="whitediv">{itemid_removing.length}</h2>
			}
		}
		var line;
		if(this.props.resolution.complete){
			line=<div><a>{this.props.name} out </a></div>
		}else{
			var inde;
			if(this.props.resolution.ingredients){inde=this.props.resolution.ingredients;}else{inde="no ingredients   ";}
			var comments;
			if(this.props.comments){comments="  Comments : " + this.props.comments;
			}else{comments=<button className="snip1086 yellow" onClick={this.addComment.bind(this)}>add comment</button>}

			line=<div className="menu-item">
         			<div className="menu-item-name">
           				{this.props.name}
           				
         			</div>          			      	 		       	
         			<div className="menu-item-description">
           				{inde}
         			</div>         			
         			<div className="menu-buttons">
         				<button className="snip1086 green" onClick={this.plus.bind(this)}>  +  </button>
						{testing}				
						<button className="snip1086 red2" onClick={this.minus.bind(this)}>  -  </button>
         			</div>
         			<div className="menu-item-price">
           		 		{this.props.resolution.price}€
           		 	</div> 
           		 	<div className="menu-buttons2">
         			{comments}
           				{this.state.showPopup ? 
							<input 
									type="text"
									ref="comment"
									placeholder="comment" />          				
          					: null
          				}
          			</div> 
      			</div>
			
				

		}
		const resolutionClass = this.props.resolution.complete ? "checked" : "";
		return (
			<div>
				{line}				
			</div>
		)
	}
}