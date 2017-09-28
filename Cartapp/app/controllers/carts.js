var mongoose = require('mongoose');
var express = require('express');

// express router // used to define routes 
var cartRouter  = express.Router();
var cartModel = mongoose.model('Cart')
var responseGenerator = require('./../../libs/responseGenerator');
var auth = require("./../../middlewares/auth");


module.exports.controllerFunction = function(app) {


  //route to get all products

   cartRouter.get('/all',function(req,res) {

     cartModel.find({},function(err,result){
      if(err){
       var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
       res.send(myResponse);
      }
      else{
       var myResponse = responseGenerator.generate(false,"All the products with their details",200,result);
       res.send(myResponse);
      }
  });
  
});

//route to check if the product is available or not

    cartRouter.get('/:productName/info',function(req, res) {

       cartModel.findOne({'_productName':req.params.productName},function(err,result){
      if(err){
        var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
        res.send(myResponse);
               }
      else{
       var myResponse = responseGenerator.generate(false,"Product Available See details in all products",200,result);
       res.send(myResponse);
    }


  });//end of find
     });//end of product availability check




   // route to create a cart

    cartRouter.post('/create',function(req,res){

        if(req.body.productName!=undefined && req.body.price!=undefined){

            var newPost = new cartModel({
                productName          : req.body.productName,
                price                : req.body.price,
                offers               : req.body.offers,
                category             : req.body.category,
                rating               : req.body.rating,

            });// end new cart

            var specification = (req.body.specification!=undefined && req.body.specification!=null)?req.body.specification.split(','):''
				    newPost.specification = specification;
				
	            newPost.save(function(err){
                if(err){

                    var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
                   res.send(myResponse);
                  
                }
                else{

                    var myResponse = responseGenerator.generate(false,"Cart items successfully added",200,newPost);
                   res.send(myResponse);
                   
                }

            });//end new cart items save
        }

             else{

            var myResponse = {
                error: true,
                message: "Some body parameter is missing",
                status: 403,
                data: null
            };

            res.send(myResponse);

        }
        

    });// end of create route


 // route to edit a product

    cartRouter.put('/:id/edit',function(req, res) {

	     var update = req.body; 

	     cartModel.findOneAndUpdate({'_id':req.params.id},update,function(err,result){

		    if(err){
			     var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
           res.send(myResponse);
		    }
		    else{
			     var myResponse = responseGenerator.generate(false,"Successfully updated",200,update);
           res.send(myResponse);
		    }


	});//end of find and update 

       });//end of edition in a product



 // route to get a product by _id

   cartRouter.get('/:id',function(req, res) {

	   cartModel.findOne({'_id':req.params.id},function(err,result){
		  if(err){
			 var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
       res.send(myResponse);
		  }
		  else{
			 var myResponse = responseGenerator.generate(false,"product by id found",200,result);
       res.send(myResponse);
		  }


	});//end of find

     });//end of getting product by id

     

	// Route to delete a Product

  cartRouter.post('/:id/delete',function(req, res) {

	   cartModel.remove({'_id':req.params.id},function(err,result){

		    if(err){
			   var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
         res.send(myResponse);
		    }
		    else{
			   var myResponse = responseGenerator.generate(false,"Successfully deleted",200,result);
         res.send(myResponse);
		    }


	});
  
});//end of deletion


      app.use('/cart', cartRouter);

}
//end contoller code
