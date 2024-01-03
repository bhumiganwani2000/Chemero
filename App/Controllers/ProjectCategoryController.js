var Sys = require('../../Boot/Sys');
const moment = require('moment');
var fs = require("fs");
// const flash = require('flash');
const { mongo } = require('mongoose');
const { url } = require('inspector');


module.exports = {
    list: async function(req,res){
		try {
			var data = {
				App 					: req.session.details,
				error 				    : req.flash("error"),
				success				    : req.flash("success"),
                projectCategoryActive 	        : 'active'
			};
			return res.render('projectCategory/listProjectCategory',data);
		} catch (e) {
			console.log("Error in ProjectCategoryController in list",e);
		}
	},

    getProjectCategory: async function(req,res){

		try {
			let start = parseInt(req.query.start);
			let length = parseInt(req.query.length);
			let search = req.query.search.value;

			let query = {};
			if (search != '') {
				let capital = search;
                query = { projectCategoryName: { $regex: '.*' + search + '.*' }, is_deleted: "0" };
            } else {
            	query = { is_deleted: "0" };
            }

            let projectCategoryCount = await Sys.App.Services.ProjectCategoryServices.getProjectCategoryCount(query);
            let data = await Sys.App.Services.ProjectCategoryServices.getProjectCategoryDatatable(query, length, start);
            var obj = {
            	'draw': req.query.draw,
            	'recordsTotal': projectCategoryCount,
            	'recordsFiltered': projectCategoryCount,
            	'data': data
            };
            res.send(obj);
        } catch (e) {
        	console.log("Error in ProjectCategoryController in getProjectCategory",e);
        }
    },

    addProjectCategory: async function(req,res){
        try {
            var data = {
                App 					: req.session.details,
                error 				    : req.flash("error"),
                success				    : req.flash("success"),
                projectCategoryActive 	        : 'active'
            };
            return res.render('projectCategory/addProjectCategory',data);
      } catch (e) {
        console.log("Error in ProjectCategoryController in addProjectCategory",e);
      }
    },

    postProjectCategory: async function(req, res){

        try {
            let projectCategoryData = await Sys.App.Services.ProjectCategoryServices.getProjectCategoryData({
                projectCategoryName: req.body.projectCategoryName,
            });

                if (projectCategoryData) {
                    req.flash('error', "Project Category already Exists!");
                    return res.redirect('/backend/projectCategory');
                } else {
                    await Sys.App.Services.ProjectCategoryServices.insertProjectCategoryData({
                        projectCategoryName: req.body.projectCategoryName,
                    })
                    req.flash('success', "Project Category inserted Successfully!")
                    return res.redirect('/backend/projectCategory');
                }

            } catch (error) {
                console.log("Error in ProjectCategoryController in postProjectCategory",error);
            }
    },

    projectCategoryDelete: async function(req,res){
        try {
            let projectCategory = await Sys.App.Services.ProjectCategoryServices.getProjectCategoryData({_id: req.body.id});
            if (projectCategory || projectCategory.length >0) {
                await Sys.App.Services.ProjectCategoryServices.updateProjectCategoryData(
                                { _id: req.body.id},
                                {
                                    is_deleted : "1"
                                }
                            )
                return res.send("success");
            }else {
                return res.send("error in ProjectCategoryController in projectCategoryDelete");
            }
        } catch (e) {
            console.log("Error in ProjectCategoryController in projectCategoryDelete",e);
        }
    },

    editProjectCategory: async function(req,res){
        try {
            let projectCategory = await Sys.App.Services.ProjectCategoryServices.getProjectCategoryData({_id: req.params.id});
            var data = {
                App 					: req.session.details,
                error 				    : req.flash("error"),
                success				    : req.flash("success"),
                projectCategory                : projectCategory,
                projectCategoryActive 	        : 'active'

            };
            return res.render('projectCategory/addProjectCategory',data);
        } catch (e) {
            console.log("Error in ProjectCategoryController in editProjectCategory",e);
        }
 
    },


    editProjectCategoryPostData: async function(req,res){
        try {
          let projectCategory = await Sys.App.Services.ProjectCategoryServices.getProjectCategoryData({_id: req.params.id});
          if (projectCategory.projectCategoryName && projectCategory.projectCategoryName.length > 0) {
                await Sys.App.Services.ProjectCategoryServices.updateProjectCategoryData(
                    {
                        _id: req.params.id
                    }, {
                        projectCategoryName: req.body.projectCategoryName,
                    }
                )
                req.flash('success', "User update successfully")
                res.redirect('/backend/projectCategory')
            } else {
                req.flash('error', 'No User found')
                return res.redirect('/backend/projectCategory');
            }
        } catch (e) {
            console.log("Error",e);
        }
    },




}





















































