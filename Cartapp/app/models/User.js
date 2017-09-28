
// defining a mongoose schema 
// including the module
var mongoose = require('mongoose');
// declare schema object.
var Schema = mongoose.Schema;

var userSchema = new Schema({

	userName 			: {type:String,default:'',required:true},
	firstName  			: {type:String,default:''},
	lastName  			: {type:String,default:''},
	email	  			: {type:String,default:''},
	mobileNumber  		: {type:Number},
	password			: {type:String,default:''},
	totalProducts		: {type:Number},
	cart				: []
	

});


mongoose.model('User',userSchema);