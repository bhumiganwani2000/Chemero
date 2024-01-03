const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const blogSchema = new Schema({
	
	heading: {
		type: 'string',
		required: true
	},
	content: {
		type: 'string',
		required: true
	},
	createdAt : { type: Date, default: Date.now() },
	updatedAt : { type: Date, default: Date.now() },
	
},{ collection: 'blog' });
mongoose.model('blog', blogSchema);
