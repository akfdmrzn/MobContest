const mongoose = require('mongoose');
const mongooseStringQuery = require('mongoose-string-query');
const timestamps = require('mongoose-timestamp');

const CountrySchema = new mongoose.Schema(
	{
        name: { type : String},
        code: { type : String}
	}
);

CountrySchema.plugin(timestamps);
CountrySchema.plugin(mongooseStringQuery);

const Country = mongoose.model('countries', CountrySchema);
module.exports = Country; 