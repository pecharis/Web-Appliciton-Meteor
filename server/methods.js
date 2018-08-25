Meteor.methods({
	addResolution(category,resolution,priceres,inde){
		check(resolution, String);
		check(category, String);
		check(priceres,Number);
		check(inde,String);
		var obj=Meteor.users.find({"_id" : Meteor.userId()}).fetch();
		var shop=obj[0].profile.shop;
		if(!Meteor.userId()){
			throw new Meteor.Error('not-authorized');
		}
		Mcollections.insert({
			category: category,
			name: resolution,
			price: priceres,
			ingredients : inde,
			complete: false,
			createdAt: new Date(),
			user: Meteor.userId(),
			shop : shop
		});
		
		var test="" + obj[0].username + 
		" added a new entry to the menu at category : " + category + 
		" with name " + resolution + " and price : " + priceres;
		Meteor.call('updateEvent', test);
	},
	addShop(name,shop,tables){
		check(name, String);
		check(shop, String);
		check(tables,Number);
		if(!Meteor.userId()){
			throw new Meteor.Error('not-authorized');
		}
		Shop.insert({
			shop: shop,
			tables: tables,
			owner: name,
			owner_id : Meteor.userId(),
			manager : [{ 
				name : name,
				name_id : Meteor.userId()
			}]
		});
		Meteor.users.update(Meteor.userId(),
			{$set : {"username": name,"profile.shop":shop,"profile.position":"manager","profile.status":"accepted"}},{upsert:true});
	},
	askShop(name,position,shop){
		check(name, String);
		check(shop, String);
		check(position,String);
		if(!Meteor.userId()){
			throw new Meteor.Error('not-authorized');
		}
		Shop.update({"shop" : shop},
			{$push : { "requests" : {
					name:name,
					position: position,
					name_id : Meteor.userId()}
		}},{upsert:true});
	},
	inShop(name,position,shop){
		check(name, String);
		check(shop, String);
		check(position,String);
		var obj=Meteor.users.find({"username" : name}).fetch();
		var user_id=obj[0]._id;
		if(!Meteor.userId()){
			throw new Meteor.Error('not-authorized');
		}
		Shop.update({"shop" : shop},
			{$push : { [position] : {
					name:name,
					name_id : user_id}
		}},{upsert:true});
		Shop.update({"shop" : shop},
			{$pull : { requests : {name:name}} } );
	},
	declineShop(name,position,shop){
		check(name, String);
		check(shop, String);
		check(position,String);
		if(!Meteor.userId()){
			throw new Meteor.Error('not-authorized');
		}
		Shop.update({"shop" : shop},
			{$pull : { requests : {name:name}} } );
	},
	deletefromShop(name,position,shop){
		check(name, String);
		check(shop, String);
		check(position,String);
		if(!Meteor.userId()){
			throw new Meteor.Error('not-authorized');
		}
		Shop.update({"shop" : shop},
			{$pull : { [position] : {name:name} } }
			);
	},
	askregister(name,shop,position){
		Meteor.users.update(Meteor.userId(),
			{$set : {"username": name,"profile.shop":shop,"profile.position":position,"profile.status":"pending"}},{upsert:true});
	},
	register(name,shop,position){
		var obj=Meteor.users.find({"username" : name}).fetch();
		Meteor.users.update(obj[0]._id,
			{$set : {"username": name,"profile.shop":shop,"profile.position":position,"profile.status":"accepted"}},{upsert:true});
	},
	unregister(name,shop,position){
		var obj=Meteor.users.find({"username" : name}).fetch();
		Meteor.users.update(obj[0]._id,
			{$set : {"username": name,"profile.shop":"none","profile.position":position,"profile.status":"deleted"}});
	},
	toggleResolution(resolution) {
		check(resolution, Object);
		if(!Meteor.userId()){
			throw new Meteor.Error('not-authorized');
		}
		Mcollections.update(resolution._id, {
			$set: {complete: !resolution.complete}
		});
		var obj=Meteor.users.find({"_id" : Meteor.userId()}).fetch();
		if(resolution.complete==false){
			var test="" + obj[0].username + 
			" set " + resolution.name + " temporary out of menu ";
		}else{
			var test="" + obj[0].username + 
			" set " + resolution.name + " back to the menu ";
		}
		Meteor.call('updateEvent', test);
	},
	updateEvent(log) {
		if(!Meteor.userId()){
			throw new Meteor.Error('not-authorized');
		}
		var obj=Meteor.users.find({"_id" : Meteor.userId()}).fetch();
		var shop=obj[0].profile.shop;
		Eventlog.insert({
			date : new Date(),
			log : log,
			shop: shop,
			user: obj[0].username
		});
	},
	toggleDeliverOrder(resolution) {
		check(resolution, Object);
		if(!Meteor.userId()){
			throw new Meteor.Error('not-authorized');
		}
		currOrder.update(resolution._id, {
			$set: {status: !resolution.status, statusAt:new Date() }
		});
		var obj=Meteor.users.find({"_id" : Meteor.userId()}).fetch();
		if(resolution.status==false){
			var test="" + obj[0].username + 
			" completed delivering all items of table : " + resolution.table_number;
		}else{
			var test="" + obj[0].username + 
			"unchecked all delivered items of table : " + resolution.table_number;
		}
		Meteor.call('updateEvent', test);
	},
	toggleDeliverOrderItem(resolution,status,by,name,itemid,mass) {
		check(resolution, Object);
		if(!Meteor.userId()){
			throw new Meteor.Error('not-authorized');
		}
		currOrder.update({ _id : resolution._id, "items.itemid":itemid },
			{ $set: { "items.$.status" : !status , "items.$.statusby" : by, "items.$.statusAt" : new Date()}
		});
		var obj=Meteor.users.find({"_id" : Meteor.userId()}).fetch();
		if(status==false){
			var test="" + obj[0].username + 
			" delivered " + name + " of table : " + resolution.table_number;
		}else{
			var test=""+ obj[0].username + 
			" un-delivered " + name + " of table : " + resolution.table_number;
		}
		if(mass==false){
		Meteor.call('updateEvent', test);
		}
	},
	togglePayOrderItem(resolution,paid,by,name,itemid,mass) {
		check(resolution, Object);
		if(!Meteor.userId()){
			throw new Meteor.Error('not-authorized');
		}
		currOrder.update({ _id : resolution._id, "items.itemid":itemid },
			{ $set: { "items.$.paid" : !paid , "items.$.paidby" : by, "items.$.paidAt" : new Date()}
		});
		var obj=Meteor.users.find({"_id" : Meteor.userId()}).fetch();
		if(paid==false){
			var test=""+ obj[0].username + 
			" was paid " + name + " of table : " + resolution.table_number;
		}else{
			var test="" + obj[0].username + 
			" unchecked paid status of " + name + " of table : " + resolution.table_number;
		}
		if(mass==false){
			Meteor.call('updateEvent', test);
		}
	},
	toggleReadyOrderItem(resolution,ready,by,name,itemid,mass) {
		check(resolution, Object);
		if(!Meteor.userId()){
			throw new Meteor.Error('not-authorized');
		}
		currOrder.update({ _id : resolution._id, "items.itemid": itemid},
			{ $set: { "items.$.ready" : !ready , "items.$.readyby" : by, "items.$.readyAt" : new Date()}
		});
		var obj=Meteor.users.find({"_id" : Meteor.userId()}).fetch();
		if(ready==false){
			var test="" + obj[0].username + 
			" set ready " + name + " of table : " + resolution.table_number;
		}else{
			var test="" + obj[0].username + 
			" set un-ready " + name + " of table : " + resolution.table_number;
		}
		if(mass==false){
			Meteor.call('updateEvent', test);
		}
	},
	toggleCompleteOrder(resolution) {
		check(resolution, Object);
		if(!Meteor.userId()){
			throw new Meteor.Error('not-authorized');
		}
		currOrder.update(resolution._id, {
			$set: {completed: !resolution.completed, completedAt: new Date()}
		});
		var test="" + "order of table : " + resolution.table_number + " completed ";
		Meteor.call('updateEvent', test);
	},
	togglePayOrder(resolution) {
		check(resolution, Object);
		if(!Meteor.userId()){
			throw new Meteor.Error('not-authorized');
		}
		currOrder.update(resolution._id, {
			$set: {paid: !resolution.paid, paidAt: new Date()}
		});
		var obj=Meteor.users.find({"_id" : Meteor.userId()}).fetch();
		if(resolution.paid==false){
			var test="" + obj[0].username + 
			" was paid the last item of table : " + resolution.table_number;
		}else{
			var test="" + moment().format("HH:mm:ss")+ ": " + obj[0].username + 
			" unchecked the paid status of all items at table : " + resolution.table_number;
		}
		Meteor.call('updateEvent', test);
	},
	toggleReadyOrder(resolution) {
		check(resolution, Object);
		if(!Meteor.userId()){
			throw new Meteor.Error('not-authorized');
		}
		currOrder.update(resolution._id, {
			$set: {ready: !resolution.ready, readyAt: new Date()}
		});
		var obj=Meteor.users.find({"_id" : Meteor.userId()}).fetch();
		if(resolution.ready==false){
			var test="" + obj[0].username + 
			" prepared items of table : " + resolution.table_number;
		}else{
			var test="" + obj[0].username + 
			" unchecked the ready status of all items at table : " + resolution.table_number;
		}
		Meteor.call('updateEvent', test);
	},
	deleteResolution(resolution) {
		if(!Meteor.userId()){
			throw new Meteor.Error('not-authorized');
		}
		Mcollections.remove(resolution._id);
		var obj=Meteor.users.find({"_id" : Meteor.userId()}).fetch();
		var test="" + obj[0].username + 
		" deleted from menu the : " + resolution._id;
		Meteor.call('updateEvent', test);
	},
	deleteOrder(resolution) {
		if(!Meteor.userId()){
			throw new Meteor.Error('not-authorized');
		}
		currOrder.remove(resolution._id);
		var obj=Meteor.users.find({"_id" : Meteor.userId()}).fetch();
		var test="" + obj[0].username + 
		" deleted order of table :  " + resolution.table_number;
		Meteor.call('updateEvent', test);
	},
	updateResolution(resolution, txt) {
		check(resolution, Object);
		if(!Meteor.userId()){
			throw new Meteor.Error('not-authorized');
		}
		doc = Mcollections.findOne(resolution._id);
		doc.name = txt;
		Mcollections.remove(resolution._id);
		Mcollections.insert(doc);		
		var obj=Meteor.users.find({"_id" : Meteor.userId()}).fetch();
		var test="" + obj[0].username + 
		" changed the item name from :  " + resolution.name + " to " + txt ;
		Meteor.call('updateEvent', test);		
	},
	addOrder(localOne){
		check(localOne,Object);
		if(!Meteor.userId()){
			throw new Meteor.Error('not-authorized');
		}
		currOrder.update({ _id : localOne._id},localOne,{ upsert : true });
		var obj=Meteor.users.find({"_id" : Meteor.userId()}).fetch();
		var test="" + obj[0].username + 
		" added a new order at table :  " + localOne.table_number ;
		Meteor.call('updateEvent', test);	
	},
	deleteAllBeforeToday(shop){
		if(!Meteor.userId()){
			throw new Meteor.Error('not-authorized');
		}
		//console.log("mpiiiiika");
		var date = new Date()
		var today = moment(date).format("MM.DD.YYYY");
		Eventlog.remove({shop: shop,'date':{$lte: new Date(today)}});
		
	}
});
