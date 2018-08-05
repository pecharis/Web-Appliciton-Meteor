Meteor.methods({
	addResolution(category,resolution,priceres,inde){
		check(resolution, String);
		check(category, String);
		check(priceres,Number);
		check(inde,String);
		if(!Meteor.userId()){
			throw new Meteor.Error('not-authorized');
		}
		Mcollections.insert({
			category: category,
			_id: resolution,
			price: priceres,
			ingredients : inde,
			complete: false,
			createdAt: new Date(),
			user: Meteor.userId()
		});
		var obj=Meteor.users.find({"_id" : Meteor.userId()}).fetch();
		var test="" + obj[0].emails[0].address + 
		" added a new entry to the menu at category : " + category + 
		" with name " + resolution + " and price : " + priceres;
		Meteor.call('updateEvent', test);
	},
	toggleResolution(resolution) {
		check(resolution, Object);
		if(Meteor.userId()!== resolution.user){
			throw new Meteor.Error('not-authorized');
		}
		Mcollections.update(resolution._id, {
			$set: {complete: !resolution.complete}
		});
		var obj=Meteor.users.find({"_id" : Meteor.userId()}).fetch();
		var test="" + obj[0].emails[0].address + 
		" set " + resolution._id + " temporary out of menu ";
		Meteor.call('updateEvent', test);
	},
	updateEvent(log) {
		if(!Meteor.userId()){
			throw new Meteor.Error('not-authorized');
		}
		Eventlog.insert({
			date : new Date(),
			log : log
		});
		//console.log(Eventlog.find().fetch());
	},
	toggleDeliverOrder(resolution) {
		check(resolution, Object);
		if(!Meteor.userId()){
			throw new Meteor.Error('not-authorized');
		}
		currOrder.update(resolution._id, {
			$set: {status: !resolution.status}
		});
		var obj=Meteor.users.find({"_id" : Meteor.userId()}).fetch();
		var test="" + obj[0].emails[0].address + 
		" completed delivering all items of table : " + resolution.table_number;
		Meteor.call('updateEvent', test);
	},
	toggleDeliverOrderItem(resolution,status,by,name,itemid) {
		check(resolution, Object);
		if(!Meteor.userId()){
			throw new Meteor.Error('not-authorized');
		}
		currOrder.update({ _id : resolution._id, "items.itemid":itemid },
			{ $set: { "items.$.status" : !status , "items.$.statusby" : by}
		});
		var obj=Meteor.users.find({"_id" : Meteor.userId()}).fetch();
		var test="" + obj[0].emails[0].address + 
		" delivered " + name + " of table : " + resolution.table_number;
		Meteor.call('updateEvent', test);
	},
	togglePayOrderItem(resolution,paid,by,name,itemid) {
		check(resolution, Object);
		if(!Meteor.userId()){
			throw new Meteor.Error('not-authorized');
		}
		currOrder.update({ _id : resolution._id, "items.itemid":itemid },
			{ $set: { "items.$.paid" : !paid , "items.$.paidby" : by}
		});
		var obj=Meteor.users.find({"_id" : Meteor.userId()}).fetch();
		var test="" + obj[0].emails[0].address + 
		" was paid " + name + " of table : " + resolution.table_number;
		Meteor.call('updateEvent', test);
	},
	toggleReadyOrderItem(resolution,ready,by,name,itemid) {
		check(resolution, Object);
		if(!Meteor.userId()){
			throw new Meteor.Error('not-authorized');
		}
		currOrder.update({ _id : resolution._id, "items.itemid": itemid},
			{ $set: { "items.$.ready" : !ready , "items.$.readyby" : by}
		});
		var obj=Meteor.users.find({"_id" : Meteor.userId()}).fetch();
		var test="" + obj[0].emails[0].address + 
		" set ready " + name + " of table : " + resolution.table_number;
		Meteor.call('updateEvent', test);
	},
	toggleCompleteOrder(resolution) {
		check(resolution, Object);
		if(!Meteor.userId()){
			throw new Meteor.Error('not-authorized');
		}
		currOrder.update(resolution._id, {
			$set: {completed: !resolution.completed}
		});
	},
	togglePayOrder(resolution) {
		check(resolution, Object);
		if(!Meteor.userId()){
			throw new Meteor.Error('not-authorized');
		}
		currOrder.update(resolution._id, {
			$set: {paid: !resolution.paid}
		});
		var obj=Meteor.users.find({"_id" : Meteor.userId()}).fetch();
		var test="" + obj[0].emails[0].address + 
		" was paid the last item of table : " + resolution.table_number;
		Meteor.call('updateEvent', test);
	},
	toggleReadyOrder(resolution) {
		check(resolution, Object);
		if(!Meteor.userId()){
			throw new Meteor.Error('not-authorized');
		}
		currOrder.update(resolution._id, {
			$set: {ready: !resolution.ready}
		});
		var obj=Meteor.users.find({"_id" : Meteor.userId()}).fetch();
		var test="" + obj[0].emails[0].address + 
		" prepared items of table : " + resolution.table_number;
		Meteor.call('updateEvent', test);
	},
	deleteResolution(resolution) {
		if(Meteor.userId()!== resolution.user){
			throw new Meteor.Error('not-authorized');
		}
		Mcollections.remove(resolution._id);
		var obj=Meteor.users.find({"_id" : Meteor.userId()}).fetch();
		var test="" + obj[0].emails[0].address + 
		" deleted from menu the : " + resolution._id;
		Meteor.call('updateEvent', test);
	},
	updateResolution(resolution, txt) {
		check(resolution, Object);
		if(Meteor.userId()!== resolution.user){
			throw new Meteor.Error('not-authorized');
		}
		doc = Mcollections.findOne(resolution._id);
		doc._id = txt;
		Mcollections.insert(doc);
		Mcollections.remove(resolution._id);
		var obj=Meteor.users.find({"_id" : Meteor.userId()}).fetch();
		var test="" + obj[0].emails[0].address + 
		" changed the item name from :  " + resolution._id + " to " + txt ;
		Meteor.call('updateEvent', test);		
	},
	addOrder(localOne){
		check(localOne,Object);
		if(!Meteor.userId()){
			throw new Meteor.Error('not-authorized');
		}
		currOrder.update({ _id : localOne._id},localOne,{ upsert : true });
		var obj=Meteor.users.find({"_id" : Meteor.userId()}).fetch();
		var test="" + obj[0].emails[0].address + 
		" added a new order at table :  " + localOne.table_number ;
		Meteor.call('updateEvent', test);	
	}
});