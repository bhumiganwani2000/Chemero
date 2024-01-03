const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CourseFeesSchema = new Schema({
    userId: { type: 'string', required: true },
    userName: { type: 'string', required: true },
    email: { type: 'string', required: true },
    mobile: { type: 'string', required: true },
    courseId: {
        type: 'string',
        required: true
    },
    courseName: {
        type: 'string',
        required: true
    },
    collegeName: {
        type: 'string',
        required: true
    },
    amount: {
        type: 'string',
        required: true
    },
    applicationId: {
        type: 'string',
        required: true
    },
    demandDraftImage: {
        type: 'string',
        // required: true
    },
    chequeNumber: {
        type: 'string',
        // required: true
    },
    type: { // paymentGateway, cheque, demandDraft
        type: 'string',
        required: true
    },
    status: { // paid, pending, unpaid
        type: 'string',
        required: true
    },
    order_id: {
        type: 'string',
        required: true
    },
    createdAt: { type: Date, default: Date.now() },
}, { collection: 'courseFees' });

mongoose.model('courseFees', CourseFeesSchema);
