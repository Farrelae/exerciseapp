const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
	name: { type: String, required: true },
	type: { type: String, required: true },
	isAccessible: Boolean,
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;
