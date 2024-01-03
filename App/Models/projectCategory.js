
	const mongoose = require('mongoose');
	const Schema = mongoose.Schema;
	const projectCategorySchema = new Schema({

		projectCategoryName: {
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

	},{ collection: 'projectCategory',versionKey: false });
	mongoose.model('projectCategory', projectCategorySchema);
