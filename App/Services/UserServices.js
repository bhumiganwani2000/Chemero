'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');
const userModel  			= mongoose.model('user');
const blogModel  			= mongoose.model('blog');
const aboutModel      = mongoose.model('about');
const accessModel  		= mongoose.model('access');
const researchAndDevelopmentModel = mongoose.model('researchAndDevelopment');


module.exports = {

  getUserData: async function(data){
        try {
          return  await userModel.find(data);
        } catch (e) {
          console.log("Error",e);
        }
	},

  getUserCount: async function(data){
    try {
          return  await userModel.countDocuments(data);
        } catch (e) {
          console.log("Error",e);
    }
  },

	getSingleUserData: async function(data){
        try {
          return  await userModel.findOne(data);
        } catch (e) {
          console.log("Error",e);
        }
	},

  getUserDatatable: async function(query, length, start){
        try {
          return  await userModel.find(query).skip(start).limit(length);
        } catch (e) {
          console.log("Error",e);
        }
	},

  insertUserData: async function(data){
        try {
          return await userModel.create(data);
        } catch (e) {
          console.log("Error",e);
        }
	},

  deleteUser: async function(data){
        try {
          await userModel.deleteOne({_id: data});
        } catch (e) {
          console.log("Error",e);
        }
  },

	updateUserData: async function(condition, data){
        try {
          return await userModel.update(condition, data);
        } catch (e) {
          console.log("Error",e);
          throw e;
        }
	},

	getByDataBlog: async function(data){
				try {
					return  await blogModel.findOne(data).lean();
				} catch (e) {
					console.log("Error",e);
				}
	},

	getMultipleBlog: async function(data){
				try {
					return  await blogModel.find(data).lean();
				} catch (e) {
					console.log("Error",e);
				}
	},

	getBlogCount: async function(data){
    try {
          return  await blogModel.countDocuments(data);
        } catch (e) {
          console.log("Error",e);
    }
  },

	getBlogDatatable: async function(query, length, start){
        try {
          return  await blogModel.find(query).skip(start).limit(length);
        } catch (e) {
          console.log("Error",e);
        }
	},

	updateBlogData: async function(condition, data){
		try {
			await blogModel.update(condition, data);
		} catch (e) {
			console.log("Error",e);
		}
	},

	insertBlogData: async function(data){
		try {
			await blogModel.create(data);
		} catch (e) {
			console.log("Error",e);
		}
	},

	deleteBlog: async function(data){
        try {
          await blogModel.deleteOne({_id: data});
        } catch (e) {
          console.log("Error",e);
        }
  },

// ABOUT US
	getByDataAbout: async function(data){
				try {
					return  await aboutModel.findOne(data).lean();
				} catch (e) {
					console.log("Error",e);
				}
	},

	// getMultipleAbout: async function(data){
	// 			try {
	// 				return  await aboutModel.find(data).lean();
	// 			} catch (e) {
	// 				console.log("Error",e);
	// 			}
	// },

	getAboutCount: async function(data){
    try {
          return  await aboutModel.countDocuments(data);
        } catch (e) {
          console.log("Error",e);
    }
  },

	getAboutDatatable: async function(query, length, start){
        try {
          return  await aboutModel.find(query).skip(start).limit(length);
        } catch (e) {
          console.log("Error",e);
        }
	},

	updateAboutData: async function(condition, data){
		try {
			await aboutModel.updateOne(condition, data);
		} catch (e) {
			console.log("Error",e);
		}
	},

	insertAboutData: async function(data){
		try {
			await aboutModel.create(data);
		} catch (e) {
			console.log("Error",e);
		}
	},

	deleteAbout: async function(data){
        try {
          await aboutModel.deleteOne({_id: data});
        } catch (e) {
          console.log("Error",e);
        }
  },

// End of ABOUT US

//Start of RESEARCH AND DEVELOPMENT
getByDataResearchAndDevelopment: async function(data){
  try {
    return  await researchAndDevelopmentModel.findOne(data).lean();
  } catch (e) {
    console.log("Error",e);
  }
},

// getMultipleAbout: async function(data){
// 			try {
// 				return  await aboutModel.find(data).lean();
// 			} catch (e) {
// 				console.log("Error",e);
// 			}
// },

getResearchAndDevelopmentCount: async function(data){
  try {
    return  await researchAndDevelopmentModel.countDocuments(data);
  } catch (e) {
    console.log("Error",e);
  }
},

getResearchAndDevelopmentDatatable: async function(query, length, start){
  try {
    return  await researchAndDevelopmentModel.find(query).skip(start).limit(length);
  } catch (e) {
    console.log("Error",e);
  }
},

updateResearchAndDevelopmentData: async function(condition, data){
  try {
    await researchAndDevelopmentModel.update(condition, data);
  } catch (e) {
    console.log("Error",e);
  }
},

insertResearchAndDevelopmentData: async function(data){
  try {
    await researchAndDevelopmentModel.create(data);
  } catch (e) {
    console.log("Error",e);
  }
},

deleteResearchAndDevelopment: async function(data){
  try {
    await researchAndDevelopmentModel.deleteOne({_id: data});
  } catch (e) {
    console.log("Error",e);
  }
},


	getAccess: async function(data){
    try {
      return await accessModel.findOne(data);
    } catch (e) {
      console.log("Error",e);
    }
	},

	createAccess: async function(data){
    try {
      return await accessModel.create(data);
    } catch (e) {
      console.log("Error",e);
    }
	},

	updateAccess: async function(condition, data){
    try {
      return await accessModel.update(condition, data);
    } catch (e) {
      console.log("Error",e);
      throw e;
    }
	},

	deleteAccessByUser: async function(data){
    try {
      await accessModel.deleteOne({userId: data});
    } catch (e) {
      console.log("Error",e);
    }
  },

}
