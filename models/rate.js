const mongoose = require('mongoose');
const mongooseStringQuery = require('mongoose-string-query');
const timestamps = require('mongoose-timestamp');

const RateSchema = new mongoose.Schema(
	{
        fromId: { type : mongoose.Schema.Types.ObjectId, ref: 'users' },
        toId: { type : mongoose.Schema.Types.ObjectId, ref: 'users' },
        date :{type:String,required:true}
	}
);

RateSchema.plugin(timestamps);
RateSchema.plugin(mongooseStringQuery);

const Rate = mongoose.model('rates', RateSchema);
module.exports = Rate; 