const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const applicationSchema = new Schema({

	name: {
		type: 'string',
		required: true
	},
	image: {
		type: 'array',
		default: [],
	},
	// image: {
	// 	type: 'string',
	// 	required: true
	// },

    description: {
        type: 'string',
        required: true
    },

	category_id: {
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

},{ collection: 'application',versionKey: false });
mongoose.model('application', applicationSchema);
