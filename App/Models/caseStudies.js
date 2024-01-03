const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const casestudySchema = new Schema({

	casestudy_name: {
		type: 'string',
		required: true
	},

	casestudy_image: {
		type: 'array',
		default: [],
		required: true
	},

	casestudy_description: {
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

},{ collection: 'casestudies',versionKey: false });
mongoose.model('casestudies', casestudySchema);
