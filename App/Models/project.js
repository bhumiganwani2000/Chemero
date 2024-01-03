const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const projectSchema = new Schema({

	project_name: {
		type: 'string',
		required: true
	},

	project_image: {
		type: 'string',
		required: true
	},

    project_description: {
        type: 'string',
        required: true
    },

	project_id: {
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

},{ collection: 'project',versionKey: false });
mongoose.model('project', projectSchema);
