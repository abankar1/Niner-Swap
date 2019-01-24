var express=require('express');
var app=express();
var path=require('path');
var http=require('http');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/NinerSkateboardSwap');
var items=require('../models/Items.js');
var profile=require('../controls/ProfileController');
var session = require('express-session');

app.use(session({secret: "Secret Token"}));
var bodyParser = require('body-parser');
var urlencoded=bodyParser.urlencoded({ extended: true });
var validator=require('express-validator');
app.use(validator());
var users=require('../models/User.js');

app.use('/resources',express.static(path.join(__dirname,'../resources/')));
app.post('/myItems',urlencoded,profile);
app.get('/myItems',profile);
app.post('/swap*',urlencoded,profile)

app.set('view engine','ejs');
app.get('/home',function(req,res) {
  if(req.session.theUser){
    res.render(path.resolve('../views/index'),{test:'1',name:req.session.theUser[0].firstName});
  }
  else{
    res.render(path.resolve('../views/index'),{test: undefined});
  }
});
app.get('/',function(req,res) {
  if(req.session.theUser){
    res.render(path.resolve('../views/index'),{test:'1',name:req.session.theUser[0].firstName});
  }
  else{
    res.render(path.resolve('../views/index'),{test: undefined});
  }
});

app.get('/categories',function(req,res){
  items.getallItems().exec(function(err,result){
    if(err) throw err;
    items.getCategory().exec(function(err,category){
      if(err) throw err;
      if(req.session.theUser){
        users.getUserItems(req.session.theUser[0].userId).exec(function(err,userItems){
          var filteredItems = result.filter(function(item) {
            return !userItems.find(function(userItem) { return userItem.item.trim() == item.itemname.trim() });
          })
          res.render(path.resolve('../views/categories'),{result:filteredItems,category:category,user: req.query.catalogCategory,test : '1',name:req.session.theUser[0].firstName})
        });
      } else {
        res.render(path.resolve('../views/categories'),{result:result,category:category,user: req.query.catalogCategory,test : undefined})
      }
    })
  })
});

app.get('/about',function(req,res) {
  if(req.session.theUser){
    res.render(path.resolve('../views/about'),{test:'1',name:req.session.theUser[0].firstName});
  }
  else{
    res.render(path.resolve('../views/about'),{test: undefined});
  }
});
app.get('/contact',function(req,res) {
  if(req.session.theUser){
    res.render(path.resolve('../views/contact'),{test:'1',name:req.session.theUser[0].firstName});
  }
  else{
    res.render(path.resolve('../views/contact'),{test: undefined});
  }
});


app.get('/swap',function(req,res) {
  if(req.session.theUser){
    res.render(path.resolve('../views/swap'),{name:req.session.theUser[0].firstName})
  }
  else{
    res.render(path.resolve('../views/signin'),{message:'1'});
  }
});


app.get('/mySwaps',function(req,res) {
  if(req.session.theUser){
    res.render(path.resolve('../views/mySwaps'),{usercurrentitem:'1',name:req.session.theUser[0].firstName})
  }
  else{
    res.render(path.resolve('../views/signin'),{message:'1'});
  }



});

app.get('/signout',function(req,res,next){
  req.session.destroy();
  items.getallItems().exec(function(err,result){
    if(err) throw err;
    items.getCategory().exec(function(err,category){
      if(err) throw err;
      res.render(path.resolve('../views/categories'),{result:result,category:category,user: req.query.catalogCategory,test : undefined})
    })
  })
})

app.get('/item',function(req,res) {
  if(Object.keys(req.query).length===0){
  items.getallItems().exec(function(err,result){
    if(err) throw err;

    items.getCategory().exec(function(err,category){
      if(err) throw err;
      res.render(path.resolve('../views/categories'),{result:result,category:category,user: req.query.catalogCategory})
    })
  })
}
else{
  if(req.session.theUser){

 items.getItem(req.query.itemCode).exec(function(err,result){
   if(err) throw err;
   else if (result.length===0) {
      res.render(path.resolve('../views/item'),{result:result,ans:'0',a:'1',test:'1',name:req.session.theUser[0].firstName});
   }
   else{
     console.log(req.session.theUser);
     res.render(path.resolve('../views/item'),{result:result,ans:'1',a:'1',test:'1',name:req.session.theUser[0].firstName});
   }

 })
}
else{
  items.getItem(req.query.itemCode).exec(function(err,result){
    if(err) throw err;
    else if (result.length===0) {
       res.render(path.resolve('../views/item'),{result:result,ans:'0',a:'1',test:undefined});
    }
    else{
      console.log(req.session.theUser);
      res.render(path.resolve('../views/item'),{result:result,ans:'1',a:'1',test:undefined});
    }

  })

}

}


});

app.get('/signin',function(req,res) {
  res.render(path.resolve('../views/signin'),{message:'1'})
});

app.post('/signin',urlencoded,function(req,res){
  req.assert('emailid','Invalid Email').trim().isEmail();
  req.assert('password','Invalid Password').trim().matches(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/);
  var errors=req.validationErrors();
  if(errors){
    res.render(path.resolve('../views/signin'),{message:'2'});
  }
  else{
    users.getUserbymail(req.body.emailid,req.body.password).exec(function(err,result){
      if(result.length!==0){
        result.forEach(function (i) {
          users.getUser(i.userId).exec(function(err,result){
             if(err) throw err;
             users.getUserItems(i.userId).exec(function(err,ans){
               if(err) throw err;
               req.session.theUser= result;
               //req.session.users=ans;
               res.render(path.resolve('../views/myItems'),{
                 user:req.session.theUser,
                 result:ans,
                 users:users,
               name:req.session.theUser[0].firstName})

             })

          })

        })
      }
      else{
        res.render(path.resolve('../views/signin'),{message:'2'});
      }
    })
  }
});

app.get('/register',function(req,res){
  res.render(path.resolve('../views/registration'));
})
app.get('/notpossible',function(req,res){
  res.render(path.resolve('../views/notpossible'));
})

app.post('/register',urlencoded,function(req,res){
req.assert('firstname','Only Alphabhet is allowed in First Name').trim().matches(/^[a-zA-Z\s]+$/);
req.assert('lastname','Only Alphabhet is allowed in Last Name').trim().matches(/^[a-zA-Z\s]+$/);
req.assert('password','Invalid Password').trim().matches(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/);
req.assert('emailid','Invalid Email').trim().isEmail();
req.assert('userid','Only Alphabhet is allowed in First Name').trim().matches(/^[a-zA-Z0-9\s]+$/);
var errors=req.validationErrors();
if (errors){
      res.render(path.resolve('../views/registration'));
    }
else{
  users.getUser(req.body.userid).exec(function(err,result){
    if(result.length===0){
      users.getUserbymail(req.body.emailid).exec(function(err,ans){
        if(ans.length===0){

      var Userobj={
        userId: req.body.userid,
        firstName:req.body.firstname,
        lastName:req.body.lastname,
        emailAddress:req.body.emailid,
        password:req.body.password
      }
      users.addUser(Userobj);
      res.render(path.resolve('../views/signin'),{message:'1'});
    }
    else{
      res.render(path.resolve('../views/notpossible'));
    }
      })

    }
    else{
      res.render(path.resolve('../views/notpossible'));
    }

  })

}
});

app.post('/feedback',urlencoded,function(req,res){
  items.getitembyname(req.body.book).exec(function(err,ans){
    ans.forEach(function (user) {
      var obj={
  userId:req.session.theUser[0].userId,
  item: user.itemname,
  itemcategory: user.catalogCategory,
  rating:"4/5" ,
  status: "swapped",
  swapitem: "2 States",
  swapitemrating:"",
  swapperrating:""
}
users.addUserItems(obj);
    })
  })
  res.render(path.resolve('../views/feedback'),{name:req.session.theUser[0].firstName});
})

console.log("Server created. Listening to port 8080....");
app.listen(8080,'127.0.0.1');
