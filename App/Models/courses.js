const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CourseSchema = new Schema({

	name: {
		type: 'string',
		required: true
	},
	image: {
		type: 'string',
		required: true
	},
	collegeName: {
		type: 'string',
		required: true
	},
	durationYears: {
		type: 'number',
		required: true
	},
	durationMonths: {
		type: 'number',
		required: true
	},
	fees: {
		type: 'number',
		required: true	
	},
	collegeNameText: {
		type: 'string',
		required: true
	},
	collegeAbout: {
		type: 'string',
		required: true
	},
	isTopCourse: {
		type: String,
		enum:[true,false],
		default: false
	},
	is_deleted:{
		type: String,
		enum:['1','0'],
		default: '0'
	}

},{ collection: 'courses',versionKey: false });
mongoose.model('courses', CourseSchema);
