var mongoose = require('mongoose');
var userModel = mongoose.model('User')

exports.checkLogin = function(req,res,next){

	if(!req.user && !req.session.user){
		//if the user doen't exist redirect him to the login page
		res.redirect('/users/login/screen');
	}
	else{
		//if it exists then move forward

		next();
	}

}// end checkLogin