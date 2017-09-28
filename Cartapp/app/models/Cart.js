
// defining a mongoose schema 
// including the module
var mongoose = require('mongoose');
// declare schema object.
var Schema = mongoose.Schema;

var cartSchema = new Schema({

	productName 		: {type:String,default:'',required:true},
	price  		    	: {type:Number,default:''},
	offers  			: {type:String,default:''},
	category	  		: {type:String,default:''},
	specification 		: [],
	rating  			: {type:Number,default:''}

	

});


mongoose.model('Cart',cartSchema);