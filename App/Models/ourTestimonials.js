const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const OurTestimonialsSchema = new Schema({

    name:{
        type: 'string',
        required: true
    },
    company_name:{
        type: 'string',
        required: true
    },

    designation:{
        type: 'string',
        required: true
    },

    image:{
        type: 'string',
        required: true
    },

    testimonial:{
        type: 'string',
        required: true
    },

    is_deleted:{
		type: String,
		enum:['1','0'],
		default: '0'
	},

    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() }

}, { collection:'ourTestimonials', versionKey: false});

mongoose.model('ourTestimonials', OurTestimonialsSchema);
