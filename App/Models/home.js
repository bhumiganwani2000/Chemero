const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const homeSchema = new Schema({

	
	file: {
		type: 'string',
		required: true
	},
	title:{
		type:'string',
		required: true,
	},
	headtext:{
		type:'string',
		required: true,
	},

    description: {
        type: 'string',
        required: true
    },

	type: {
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

},{ collection: 'home',versionKey: false });
mongoose.model('home', homeSchema);
