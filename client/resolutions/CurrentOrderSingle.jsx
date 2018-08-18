import React, {Component} from 'react';

export default class CurrentOrderSingle extends React.Component {

	plus(){
		var table_number=Session.get('table_number');  //table number
		var current_field=this.props.resolution2;  // item name
		console.log("current item looking :", current_field);//current value of field if it exists
		var value_of_item = LocalOrder.findOne({},{fields : { [current_field] : 1, "_id": 0}});// if exists or is {}
		var string=`price of ${[current_field]}`;
		var string_price_of_item = `price of ${[this.props.resolution2]}`;
		Session.set('total', Session.get('total') + this.props.resolution[string_price_of_item]);
		if(!value_of_item || Object.keys(value_of_item).length === 0){		
			LocalOrder.update({ table_number : Session.get('table_number')},
			{$set : { table_number : Session.get('table_number'),
				[current_field] : 1,
				[string] : this.props.resolution.price,
				status : false,
				total : Session.get('total') }},
			{ upsert : true });
			
		}
		else{
			var plusone = Number(Object.values(value_of_item))+1; // plus 1 of current value
			Session.set('quantity',plusone);
			LocalOrder.update({ table_number : Session.get('table_number')},
			{$set : { [current_field] : plusone,
				status : false,
				total : Session.get('total')}},
			{ upsert : true });
		}			
		//console.log(LocalOrder.find().fetch());	
		//console.log(LocalOrder.find().fetch()[0][current_field]);
		this.props.callback();
		
	}

	minus(){
		var table_number=Session.get('table_number');  //table number
		var current_field=this.props.resolution2;  // item name
		var string=`price of ${[current_field]}`;
		//console.log("current item looking :", current_field);		
		var value_of_item = LocalOrder.findOne({},{fields : { [current_field] : 1, "_id": 0}});
		var string_price_of_item = `price of ${[this.props.resolution2]}`;
		if(Number(Object.values(value_of_item))>1){
			Session.set('total', Session.get('total') - this.props.resolution[string_price_of_item]);
			var minusone = Number(Object.values(value_of_item))-1;
			LocalOrder.update({ table_number : Session.get('table_number')},
			{$set : { [current_field] : minusone,
				status : false,
				total : Session.get('total')}},
			{ upsert : true });
		}else{
			if(Number(Object.values(value_of_item))==1){
				Session.set('total', Session.get('total') - this.props.resolution[string_price_of_item]);
				LocalOrder.update({ table_number : Session.get('table_number')},
					{$unset :  { [current_field] : "" ,[string] : ""}});
				LocalOrder.update({ table_number : Session.get('table_number')},
					{$set : {total : Session.get('total'),status : false}});
			}
		}
	}

	render () {
		const string_price_of_item = `price of ${[this.props.resolution2]}`;

		return (			
			<li>
				<a>name : </a>
				<a>{this.props.resolution.name}</a>
				<a> quantity : </a>
				<a>{this.props.resolution.quantity}</a>
				<a> each : </a>
				<a>{this.props.resolution[string_price_of_item]}€</a>
					
				<button onClick={this.minus.bind(this)}>-					
				</button>
				<button onClick={this.plus.bind(this)}>+
				</button>
			</li>
			)
	}
}