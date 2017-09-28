var mongoose = require('mongoose');
var express = require('express');

// express router // used to define router
var userRouter  = express.Router();
var userModel = mongoose.model('User')
var responseGenerator = require('./../../libs/responseGenerator');
var auth = require("./../../middlewares/auth");


module.exports.controllerFunction = function(app) {


//Route to get login screen

    userRouter.get('/login/screen',function(req,res){
            
        res.render('login');

    });//end get login screen


//Route to get signup screen

     userRouter.get('/signup/screen',function(req,res){
            
        res.render('signup');

    });//end get signup screen

//Route to get dashboard

     userRouter.get('/dashboard1',auth.checkLogin,function(req,res){
        
            res.render('dashboard1',{user:req.session.user});
       

    });//end get dashboard


// Route to update cart items of a user

      userRouter.put('/:id/cart/update',function(req,res){
          var update=req.body;
          var cartItems = req.body.cartItems.split(',');
            update.cart = cartItems;
            update.totalProducts=update.cart.length; 

       userModel.findOneAndUpdate({'_id':req.params.id},update,function(err,result){

        if(err){
           var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
           res.send(myResponse);
        }
        else{
           var myResponse = responseGenerator.generate(false,"Cart Successfully updated",200,update);
           res.send(myResponse);
        }


  }); 
       }); //end to update cart items

//Route to logout

    userRouter.get('/logout',function(req,res){
      
      req.session.destroy(function(err) {

        res.redirect('/users/login/screen');

      })  

    });//end logout
    
//Route to get all users

    userRouter.get('/all',function(req,res){
        userModel.find({},function(err,allUsers){
            if(err){                
                res.send(err);
            }
            else{

                res.send(allUsers);

            }

        });//end user model find 

    });//end get all users


//Route to find a user by its userName

    userRouter.get('/:userName/info',function(req,res){

        userModel.findOne({'userName':req.params.userName},function(err,foundUser){
            if(err){
                var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
                res.send(myResponse);
            }
            else if(foundUser==null || foundUser==undefined || foundUser.userName==undefined){

                //var myResponse = responseGenerator.generate(true,"user not found",404,null);
                //res.send(myResponse);
                res.render('error', {
                  message: myResponse.message,
                  error: myResponse.data
                });

            }
            else{

                  res.render('dashboard1', { user:foundUser  });

            }

        });// end find
        });//end to find a user by its userName


//Route to create user and its information

    userRouter.post('/signup',function(req,res){

        if(req.body.firstName!=undefined && req.body.lastName!=undefined && req.body.email!=undefined && req.body.password!=undefined){

            var newUser = new userModel({
                userName            : req.body.firstName+''+req.body.lastName,
                firstName           : req.body.firstName,
                lastName            : req.body.lastName,
                email               : req.body.email,
                mobileNumber        : req.body.mobileNumber,
                password            : req.body.password


            });// end new user 
            var cartItems = (req.body.cartItems!=undefined && req.body.cartItems!=null)?req.body.cartItems.split(','):''
            newUser.cart = cartItems;
            newUser.totalProducts=newUser.cart.length;

            newUser.save(function(err){
                if(err){

                    
                   res.render('error', {
                     message: myResponse.message,
                     error: myResponse.data

                   });

                }
                else{

                   req.session.user = newUser; 
                   // delete the password from the session information for authenticity
                   delete req.session.user.password;
                    
                   res.redirect('/users/dashboard1')
                }

            });//end new user save


        }
        else{

            var myResponse = {
                error: true,
                message: "Some body parameter is missing",
                status: 403,
                data: null
            };

            
              res.render('error', {
              message: myResponse.message,
              error: myResponse.data

              });

        }
        

    });//end get all users

//Route for login
    userRouter.post('/login',function(req,res){

        userModel.findOne({$and:[{'email':req.body.email},{'password':req.body.password}]},function(err,foundUser){
            if(err){
                var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
                res.send(myResponse);
            }
            else if(foundUser==null || foundUser==undefined || foundUser.userName==undefined){

                var myResponse = responseGenerator.generate(true,"user not found. Check your email and password",404,null);
                //res.send(myResponse);
                res.render('error', {
                  message: myResponse.message,
                  error: myResponse.data
                });

            }
            else{

                  req.session.user = foundUser;
                   delete req.session.user.password;
                  res.redirect('/users/dashboard1')

            }

        });// end find


    });//end of login


    app.use('/users', userRouter);



 
} //end contoller code
