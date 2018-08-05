Mcollections = new Mongo.Collection("mcollections2");
currOrder = new Mongo.Collection("orders");
Eventlog = new Mongo.Collection("eventlogs");



//console.log(Meteor.settings.private.ptest);

Meteor.publish("allResolutions", function(){
	//return Mcollections.find({complete:false});
	return Mcollections.find();
});

Meteor.publish("userResolutions", function(){
	//return Mcollections.find({complete:false});
	return Mcollections.find({user: this.userId});
});

Meteor.publish("allOrders", function(){
	//return Mcollections.find({complete:false});
	return currOrder.find();
});

Meteor.publish("currentUserData", function() {
    return Meteor.users.find({}, {
      fields : {
        'emails' : 1 , '_id' : 1
      }
    });
 });   

Meteor.publish("alleventlogs", function() {
    return Eventlog.find();
 });   