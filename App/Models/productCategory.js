
	const mongoose = require('mongoose');
	const Schema = mongoose.Schema;
	const productCategorySchema = new Schema({

		productCategoryName: {
			type: 'string',
			required: true
		},

		is_deleted:{
			type: String,
			enum:['1','0'],
			default: '0'
		},
		application:{
			type:'string'
		},
		duties:{
			type: 'array',
			default: [],
		},   
        is_separateCategory: {
            type: 'string',
            default: false
        },
		if_not_subproduct: {
            type: 'string',
            default: false
        },

		product_name: {
			type: 'string'
		},
	
		product_image: {
			type: 'array',
			default: [],
		},
	
		product_description: {
			type: 'string'
		},
		
		pdf_heading: {
			type: 'string',
		
		},
		
		product_pdf: {
			type: 'array',
			default: [],
		},

		
		workProcess: {
			type: 'array',
			default: [],
		},

	

        // is_separateCategory: {
        //     type: String,
        //     enum:['1', '0'],
        //     default: '0'
        // },

		createdAt : { type: Date, default: Date.now() },
		updatedAt : { type: Date, default: Date.now() },

	},{ collection: 'productCategory',versionKey: false });
	mongoose.model('productCategory', productCategorySchema);
