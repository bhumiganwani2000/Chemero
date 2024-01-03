const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const OurTeamSchema = new Schema({

	name: {
		type: 'string',
		required: true
	},
	image: {
		type: 'string',
		required: true
	},
	role: {
		type: 'string',
		required: true
	},

	facebook: {
		type: 'string',
		// required: true
	},

	twitter: {
		type: 'string',
		// required: true
	},

	instagram: {
		type: 'string',
		// required: true
	},

	linkedin: {
		type: 'string',
		// required: true
	},

	description:{
		type: 'string',
		required: true,
	},

    is_deleted:{
		type: String,
		enum:['1','0'],
		default: '0'
	},

    createdAt : { type: Date, default: Date.now() },
	updatedAt : { type: Date, default: Date.now() },

},{ collection: 'ourTeam',versionKey: false });
mongoose.model('ourTeam', OurTeamSchema);
