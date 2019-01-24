var fs=require('fs');
var rawdata=fs.readFileSync('../models/user.json');
var externaldata=fs.readFileSync('../models/item.json');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/NinerSkateboardSwap');
var item=require('../models/Items.js')
var Schema=mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);



var UserSchema = new Schema({
    userId : String,
    firstName : String,
    lastName : String,
    emailAddress : String,
    address1Field : String,
    address2Field : String,
    city : String,
    state : String,
    zipCode : String,
    country : String,
    password: String

});

var User=mongoose.model('users',UserSchema);

var UserProfileSchema=new Schema(
  {
    userId: String,
    userItem:{type:[String]}
  }
);

var UserProfile=mongoose.model('userprofiles',UserProfileSchema);



var UserItemsSchema= new Schema(
  {
    userId: String,
    item: String,
    itemcategory: String,
    rating: String,
    status: String,
    swapitem: String,
    swapitemrating: String,
    swapperrating: String
  }
);

var UserItems =mongoose.model('useritems',UserItemsSchema);

var offerFeedbackSchema = new Schema({

  itemfeedbackrating: String,
  userfeedback: String


});
offerFeedbackSchema.plugin(autoIncrement.plugin, {model: 'offerFeedback', startAt: 1});
var offerFeedback =mongoose.model('offerfeedbacks',offerFeedbackSchema);




module.exports.addFeedback=function(obj){
  offerFeedback({
    itemfeedbackrating:obj.itemfeedbackrating ,
    userfeedback:obj.userfeedback
  }).save(function(err){
    if(err) throw err;
    console.log('offerFeedback saved');
  })
}

module.exports.addUser=function(obj){
  User({
  userId:obj.userId,
  firstName : obj.firstName,
  lastName : obj.lastName,
  emailAddress :  obj.emailAddress,
  password: obj.password
  }).save(function(err){
    if(err) throw err;
    console.log('offerFeedback saved');
  })
};



module.exports.addUserItems=function(obj){
  UserItems({
    userId:obj.userId,
    item:obj.item,
    itemcategory:obj.itemcategory,
    rating: obj.rating,
    status: obj.status,
    swapitem: obj.swapitem,
    swapitemrating:"",
    swapperrating:""

  }).save(function(err){
    if(err) throw err;
    console.log('useritem saved');
  })
}


module.exports.getUserprofile=function(id){
  var query = UserProfile.find({userId:id});
  return query;
}

module.exports.getUsers=function(){
  var query=User.find();
  return query;
}

module.exports.getUser=function(id){
  var query=User.find({userId:id});
  return query;
}

module.exports.getUserItems=function(id){
  var query= UserItems.find({userId:id});
  return query;
}

module.exports.findStatus=function(name){
  var query=UserItems.find({item:name})
  return query;
}

module.exports.removeanItem=function(name,id){
  var query=UserItems.remove({item:name,userId:id});
  return query;
}

module.exports.updatetheStatusforaccept = function(name,id){
  var query=UserItems.update({userId:id,item:name},{$set :{status:"swapped"}});
  return query;
}

module.exports.updatetheStatusforconfirm = function(name,id){
  var query=UserItems.update({userId:id,item:name},{$set :{status:"swapped"}});
  return query;
}

module.exports.updatetheStatusforReject = function(name,id){
  var query=UserItems.update({userId:id,item:name},{$set :{status:"available"}});
  return query;
}

module.exports.getUserbymail = function(emailid) {
  var query=User.find({emailAddress:emailid});
  return query;
}

module.exports.getUserbyid = function(emailid,id) {
  var query=User.find({emailAddress:emailid,userId:id});
  return query;
}
