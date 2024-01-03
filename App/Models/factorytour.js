const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const FactoryTourchema = new Schema({

	
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
    is_deleted:{
		type: String,
		enum:['1','0'],
		default: '0'
	},
	type: {
		type: 'string',
		required: true
	},

    createdAt : { type: Date, default: Date.now() },
	updatedAt : { type: Date, default: Date.now() },

},{ collection: 'FactoryTour',versionKey: false });
mongoose.model('FactoryTour', FactoryTourchema);
