'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');
const coursesModel  		= mongoose.model('courses');
const applicationModel  = mongoose.model('application');
const transactionModel  = mongoose.model('transactions');
const userModel  				= mongoose.model('user');
const feesModel  				= mongoose.model('courseFees');


module.exports = {

	getByData: async function(data){
        try {
          return  await coursesModel.find(data).lean();
        } catch (e) {
          console.log("Error",e);
        }
	},

	getCourseDatatable: async function(query, length, start){
        try {
          return  await coursesModel.find(query).skip(start).limit(length);
        } catch (e) {
          console.log("Error",e);
        }
	},

	getPendingApplicationDatatable: async function(query, length, start){
        try {
          return  await applicationModel.find(query).skip(start).limit(length);
        } catch (e) {
          console.log("Error",e);
        }
	},

	getCourseData: async function(data){
		try {
			return  await coursesModel.findOne(data);
		} catch (e) {
			console.log("Error",e);
		}
	},

	getCourseCount: async function(data){
	  try {
	        return  await coursesModel.countDocuments(data);
	      } catch (e) {
	        console.log("Error",e);
	  }
	},

	getPendingApplicationCount: async function(data){
	  try {
	        return  await applicationModel.countDocuments(data);
	      } catch (e) {
	        console.log("Error",e);
	  }
	},


	updateCourseData: async function(condition, data){
		try {
			await coursesModel.updateOne(condition, data);
		} catch (e) {
			console.log("Error",e);
		}
	},

	insertCourseData: async function(data){
		try {
			await coursesModel.create(data);
		} catch (e) {
			console.log("Error",e);
		}
	},

	deleteCourse: async function(data){
        try {
          await coursesModel.deleteOne({_id: data});
        } catch (e) {
          console.log("Error",e);
        }
  },

	applyApplication: async function(data){
		try {
			return await applicationModel.create(data);
		} catch (e) {
			console.log("Error",e);
		}
	},

	updateApplication: async function(condition, data){
		try {
			return await applicationModel.updateOne(condition, data);
		} catch (e) {
			console.log("Error",e);
		}
	},

	getApplicationData: async function(data){
		try {
		return  await applicationModel.findOne(data);
		} catch (e) {
			console.log("Error",e);
		}
	},
	getMultipleApplicationData: async function(data){
		try {
		return  await applicationModel.find(data);
		} catch (e) {
			console.log("Error",e);
		}
	},

	setTransactionData: async function(data){
		try {
			return await transactionModel.create(data);
		} catch (e) {
			console.log("Error",e);
		}
	},

	getApplicantsCount: async function(data) {
		try {
			let users = await userModel.find(data, { _id: 1 });
			let userArr = [];
			for (var i = 0; i < users.length; i++) {
				userArr.push(users[i]._id);
			}
			let applicant = await applicationModel.find({ "userId": {$in: userArr}, "fullProcessDone": "true", "adminStatus": "pending", "paymentStatus": "paid", "studentStatus" : "applied" });
			return applicant.length;


		} catch (e) {
			console.log("error in getApplicantsCount", e);
		}
	},

	deleteApplication: async function(data){
        try {
          await applicationModel.deleteOne({_id: data});
        } catch (e) {
          console.log("Error",e);
        }
  },

	setFeesData: async function(data){
		try {
			return await feesModel.create(data);
		} catch (e) {
			console.log("Error",e);
		}
	},

	getCourseFeesData: async function(data){
		try {
		return  await feesModel.findOne(data);
		} catch (e) {
			console.log("Error",e);
		}
	},

	getMultipleCourseFeesData: async function(data){
		try {
		return  await feesModel.find(data).lean();
		} catch (e) {
			console.log("Error",e);
		}
	},

	updateCourseFees: async function(condition,data){
		try {
			return await feesModel.updateOne(condition, data);
		} catch (e) {
			console.log("Error",e);
		}
	},

	getPendingCourseApplicationCount: async function(data){
	  try {
	        return  await feesModel.countDocuments(data);
	      } catch (e) {
	        console.log("Error",e);
	  }
	},

	getPendingCourseApplicationDatatable: async function(query, length, start){
        try {
          return  await feesModel.find(query).skip(start).limit(length);
        } catch (e) {
          console.log("Error",e);
        }
	},

	deleteCourseFees: async function(data){
        try {
          await feesModel.deleteOne({_id: data});
        } catch (e) {
          console.log("Error",e);
        }
  },

}
