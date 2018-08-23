Mcollections = new Mongo.Collection("mcollections2");
currOrder = new Mongo.Collection("orders");
Eventlog = new Mongo.Collection("eventlogs");
Shop = new Mongo.Collection("shops");

Meteor.publish("allResolutions", function(){
	if(!Meteor.userId()){throw new Meteor.Error('not-authorized');}
	var obj=Meteor.users.find({"_id" : Meteor.userId()}).fetch();
		var shop=obj[0].profile.shop;
		return Mcollections.find({"shop":shop});	
});

Meteor.publish("userResolutions", function(){
	return Mcollections.find({user: this.userId});
});

Meteor.publish("allOrders", function(){
	if(!Meteor.userId()){throw new Meteor.Error('not-authorized');}
	var obj=Meteor.users.find({"_id" : Meteor.userId()}).fetch();
	var shop=obj[0].profile.shop;
	
	return currOrder.find({shop: shop} );
	
});

Meteor.publish("allUnOrders", function(){
	if(!Meteor.userId()){throw new Meteor.Error('not-authorized');}
	var obj=Meteor.users.find({"_id" : Meteor.userId()}).fetch();
	var shop=obj[0].profile.shop;
	
	return currOrder.find({shop: shop,completed:false} );
	
});

Meteor.publish("currentUserData", function() {
    return Meteor.users.find();
       });   

Meteor.publish("alleventlogs", function() {
	var obj=Meteor.users.find({"_id" : Meteor.userId()}).fetch();
	var shop=obj[0].profile.shop;
    return Eventlog.find({"shop":shop});
 });   

Meteor.publish("allshops", function(){
	if(!Meteor.userId()){throw new Meteor.Error('not-authorized');}
		return Shop.find();	
});

Meteor.publish("userShop", function(){
	var obj=Meteor.users.find({"_id" : Meteor.userId()}).fetch();
	var shop=obj[0].profile.shop;
	return Shop.find({"shop":shop});
});
