import React, {Component} from 'react';

export default class OrderResolutionSingle extends React.Component {

	plus() {
		// this.props.resolution._id : name of item of which plus button was pressed so create
		// new field if not existed or  + 1 of current field value.
		var table_number=Session.get('table_number');  //table number
		var current_field=this.props.name;  // item name
		var value_of_item = LocalOrder.findOne({},{fields : { [current_field] : 1, "_id": 0}});// if exists or is {}
		Session.set('total', Session.get('total') +this.props.resolution.price);
		if(!value_of_item){			
			LocalOrder.update({ table_number : Session.get('table_number')},
			{$set : { table_number : Session.get('table_number'),
					status : false,
					paid : false,
					completed : false,
					ready : false,
					last_modified : new Date(),
					user: Meteor.userId(),
					item : 1,
					lastitem : 1,
			 		items : [{ 
			 			name : current_field,
			 			itemid : 1,
			 			comments : "nun",
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
			 			comments : "nun",
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
			if(LocalOrder.findOne({ "items.name" : current_field })){
				var value_of_item=LocalOrder.findOne({ "items.name" : current_field }).items;
				var itemValue = LocalOrder.find().fetch()[0].item;
				if(value_of_item){
					console.log("mpika sto if");
					var itemid_removing=value_of_item.filter(obj=>{
						return obj.name===current_field
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
			 					name : current_field, itemid : itemid_removing[0].itemid
			 					}
		  			}},{ multi: false });
				}
				this.props.callback();
			}
		}
	}

	render () {
		var testing;
		var current_field=this.props.name;				
		if(!LocalOrder.find().fetch()[0]){
			testing=<a>0</a>
		}else{
			if(!LocalOrder.findOne({ "items.name" : current_field })){
				testing=<a>0</a>
			}else{
				var value_of_item=LocalOrder.findOne({ "items.name" : current_field }).items;
				var itemid_removing=value_of_item.filter(obj=>{
						return obj.name===current_field
					});
				testing=<a>{itemid_removing.length}</a>
			}
		}
		var line;
		if(this.props.resolution.complete){
			line=<div><a>{this.props.name} out </a></div>
		}else{
			var inde;
			if(this.props.resolution.ingredients){inde=this.props.resolution.ingredients;}else{inde="no ingredients";}
			line=<div className="menu-item">
         			<div className="menu-item-name">
           				{this.props.name}
         			</div>        	 		       	
         			<div className="menu-item-description">
           			{inde}
         			</div>
         			<div className="menu-buttons">
         				<button className="snip1339" onClick={this.plus.bind(this)}>+</button>
						{testing}				
						<button className="snip1339" onClick={this.minus.bind(this)}>-</button>
         			</div>
         			<div className="menu-item-price">
           		 		{this.props.resolution.price}€
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