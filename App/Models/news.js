const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Newschema = new Schema({


	image: {
		type: 'string',
		required: true
	},
	title: {
		type: 'string',
		required: true
	},

	description: {
		type: 'string',
		required: true
	},

	date: {
		type: 'string',
		required: true
	},
    is_deleted:{
		type: String,
		enum:['1','0'],
		default: '0'
	},

    createdAt : { type: Date, default: Date.now() },
	updatedAt : { type: Date, default: Date.now() },

},{ collection: 'News',versionKey: false });
mongoose.model('News', Newschema);
