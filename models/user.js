const mongoose = require('mongoose');
const mongooseStringQuery = require('mongoose-string-query');
const timestamps = require('mongoose-timestamp');

const UserSchema = new mongoose.Schema(
	{
		name :{type:String,required:[true,'İsim Alanı Boş Geçilemez']},
		surname :{type:String,required:true,},
		mail :{type:String,required:true},
		password :{type:String,required:true},
		country :{type:String,required:true},
		city :{type:String,required:true},
		gender :{type:String,required:true},
		image : {type:String,required:true},
		rateId: { type : mongoose.Schema.Types.ObjectId, ref: 'rates' }
	}
);

UserSchema.plugin(timestamps);
UserSchema.plugin(mongooseStringQuery);

const User = mongoose.model('users', UserSchema);
module.exports = User; 

