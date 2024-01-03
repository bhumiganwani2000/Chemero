const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const researchAndDevelopmentSchema = new Schema({
    r_dContent: {
        type: 'string',
        required: true
    },
    image :{
        type: 'array',
		default: [],
    },

    createdAt: {type: Date, default: Date.now() },
    updatedAt: {type: Date, default: Date.now() },

}, {collection: 'researchAndDevelopment'});
mongoose.model('researchAndDevelopment', researchAndDevelopmentSchema)