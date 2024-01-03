const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const contactUsSchema = new Schema({
	profiletype: {
		type: 'string',
		// required: true
	},	
	
	name: {
		type: 'string',
		required: true
	},
	
	email:{
		type:'string',
		required: true,
	},

    phone: {
        type: 'string',
        required: true
    },

	company_name: {
		type: 'string',
		required: true
	},
	item_name:{
		type: 'string',
		// required: true
	},     
	type_of_industry :{
		type: 'string',
		// required: true
	},
	institute: {
		type: 'string',
		// required: true
	},
	degree:{
		type: 'string',
		// required: true
	},   
	semester:{
		type: 'string',
		// required: true
	},   
	time_period:{
		type: 'string',
		// required: true
	},   
	notes:{
		type: 'string',
		// required: true
	},   
	upload_cv_option:{
		type: 'array',
		default: [],
	},   
	type_of_contract:{
		type: 'string',
		// required: true
	},   
	about_institute:{
		type: 'string',
		// required: true
	},   
	attach_pdf:{
		type: 'array',
		default: [],
	},   
	name_of_product_and_area:{
		type: 'string',
		// required: true
	},   
	select_position:{
		type: 'string',
		// required: true
	},   
	upload_cv :{
		type: 'array',
		default: [],
	},
	// message: {
	// 	type: 'string',
	// 	required: true
	// },
    is_deleted:{
		type: String,
		enum:['1','0'],
		default: '0'
	},



    createdAt : { type: Date, default: Date.now() },
	updatedAt : { type: Date, default: Date.now() },

},{ collection: 'contactus',versionKey: false });
mongoose.model('contactus', contactUsSchema);
