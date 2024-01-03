const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productSchema = new Schema({

	product_name: {
		type: 'string',
		required: true
	},

	product_image: {
		type: 'array',
		default: [],
	},

    product_description: {
        type: 'string',
    },

	product_id: {
		type: 'string',
		required: true
	},
	pdf_heading: {
		type: 'string',
	},
	if_not_subproduct: {
		type: 'string',
		default: false
	},
	product_pdf: {
		type: 'array',
		default: [],

	},
	description_copy:{
		type:'string'
	},
	application:{
		type:'string'
	},
	duties:{
		type: 'array',
		default: [],
	},

	workProcess: {
		type: 'array',
		default: [],
	 },

    is_deleted:{
		type: String,
		enum:['1','0'],
		default: '0'
	},



    createdAt : { type: Date, default: Date.now() },
	updatedAt : { type: Date, default: Date.now() },

},{ collection: 'product',versionKey: false });
mongoose.model('product', productSchema);
