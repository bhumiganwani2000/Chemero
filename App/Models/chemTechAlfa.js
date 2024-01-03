const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const chemTechAlfaSchema = new Schema({
	contactPerson						: {type: 'array',  default:[] },
	userType								: {type: 'array',  default:[] },
	products								: {type: 'array',  default:[] },
	otherProduct						: {type: 'string', default: '' },
	companyName							: {type: 'string', default: '' },
	unit										: {type: 'string', default: '' },
	division								: {type: 'string', default: '' },
	state										: {type: 'string', default: '' },
	application							: {type: 'string', default: '' },
	problem									: {type: 'string', default: '' },
	projects								: {type: 'string', default: '' },
	action									: {type: 'string', default: '' },
	additionalDocs					: {type: 'array', default: [] },
	user										: {type: 'string', default: '' },
	createdAt 							: { type: Date, default: Date.now() },
	updatedAt 							: { type: Date, default: Date.now() },
},{ collection: 'chemTechAlfa' });
mongoose.model('chemTechAlfa', chemTechAlfaSchema);
