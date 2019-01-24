var fs=require('fs');
var rawdata=fs.readFileSync('../models/item.json');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/NinerSkateboardSwap');
var Schema=mongoose.Schema;

module.exports.getItems=function() {
  var output=JSON.parse(rawdata);
  var i=output.items;
  return i;
};
module.exports.getCatalog=function() {
  var output=JSON.parse(rawdata);
  var i=output.categories;
  return i;
};

module.exports.seeItemcategory=function (id) {
  var output=JSON.parse(rawdata);
  for(i=0;i<output.categories.length;i++){
    if(id==output.categories[i].categoryCode){
      var res=i;
    }
};
  if(res>=0){
    return(output.categories[res].categoryName);
  }
  else {
    return false;
  }
}

module.exports.seeItemname=function (id) {
  var output=JSON.parse(rawdata);
  for(i=0;i<output.items.length;i++){
    if(id==output.items[i].itemcode){
      var res=i;
    }
};
  if(res>=0){
    return(output.items[res].itemname);
  }
  else {
    return false;
  }

};

module.exports.getItem=function (id) {
  var output=JSON.parse(rawdata);
  for(i=0;i<output.items.length;i++){
    if(id==output.items[i].itemcode){
      var res=i;
    }
};
  if(res>=0){
    return(output.items[res]);
  }
  else {
    return false;
  }

};

var ItemSchema=new Schema({
  itemcode : String,
  itemname : String,
  catalogCategory : String,
  Description : String,
  rating : String,
  imageurl : String

});

var Item=mongoose.model('items',ItemSchema);

var CategorySchema= new Schema({
  categoryCode: String,
  categoryName: String
});

var Category=mongoose.model('categories',CategorySchema);

module.exports.getallItems=function(){
  var query = Item.find();
  return query;
}

module.exports.getItem=function(id){
  var query=Item.find({itemcode:id});
  return query;
}

module.exports.getCategory=function(){
  var query=Category.find();
  return query;
}

module.exports.getitembyname=function(name){
  var query = Item.find({itemname:name});
  return query;
}
