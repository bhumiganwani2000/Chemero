var Sys = require('../../Boot/Sys');
const moment = require('moment');
var fs = require("fs");


module.exports = {


    list: async function (req, res) {
        try {

            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                projectActive: 'active',

            };
            // console.log("Datat", data);
            return res.render('project/listProject', data);
        } catch (e) {
            console.log("Error in ProjectController in list", e);
        }
    },

    getProject: async function (req, res) {

        try {
            let start = parseInt(req.query.start);
            let length = parseInt(req.query.length);
            let search = req.query.search.value;

            let query = {};
            if (search != '') {
                let capital = search;
                query = { project_name: { $regex: '.*' + search + '.*' }, is_deleted: "0" };
            } else {
                query = { is_deleted: "0" };
            }

            let projectCount = await Sys.App.Services.ProjectServices.getProjectCount(query);
            let data = await Sys.App.Services.ProjectServices.getProjectDatatable(query, length, start);
            let projectCategoryname = await Sys.App.Services.ProjectCategoryServices.getProjectCategoryDatatable();
            var obj = {
                'draw': req.query.draw,
                'recordsTotal': projectCount,
                'recordsFiltered': projectCount,
                'data': data,
                'projectCategoryname': projectCategoryname
            };
            // console.log('data', data);
            // console.log("categrrrrrrrydata", categoryname);
            res.send(obj);
        } catch (e) {
            console.log("Error in ProjectController in getProject", e);
        }
    },

    addProject: async function (req, res) {
        try {
            console.log("projectprojectCategoryData>>>>>>");

            let projectCategoryData = await Sys.App.Services.ProjectCategoryServices.getByData({});
            var data = {
                App: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                projectActive: 'active',
                projectCategoryData: projectCategoryData
            };
            return res.render('project/addProject', data);
        } catch (e) {
            console.log("Error in ProjectController in addProject", e);
        }
    },

    postProject: async function (req, res) {

        try {
            //start of new code
            let project_image = req.files.projectImage;
            console.log("Image", project_image);
            var re = /(?:\.([^.]+))?$/;
            var ext3 = re.exec(project_image.name)[1];
            let projectImage = Date.now() + '_' + Math.floor(Math.random() * 1000) + '.' + ext3;
            let projectImg = '/projectImage/' + projectImage;
            // Use the mv() method to place the file somewhere on your server
            await project_image.mv('./public/projectImage/' + projectImage, async function (err) {
                if (err) {
                    req.flash('Error in ProjectController in postProject', err);
                    return res.redirect('project/addProject');
                }
            });
            //end of newcode         
            let projectCategory = await Sys.App.Services.ProjectCategoryServices.getProjectCategoryData({ _id: req.body.projectCategoryName });
            //   console.log("Projectcategory",req.body);
            let projectid = "";
            if (projectCategory) {
                projectid = projectCategory.id
            }
            console.log(projectCategory, "projectCategoryid");
            let project = await Sys.App.Services.ProjectServices.insertProjectData({
                project_name: req.body.project_name,
                project_image: projectImg,
                project_description: req.body.project_description,
                project_id: projectid
            });
            req.flash('success')
            return res.redirect('/backend/project');
        } catch (error) {
            console.log("Error in ProjectController in postApplication", error);
        }
    },

    projectDelete: async function (req, res) {
        try {
            let project = await Sys.App.Services.ProjectServices.getProjectData({ _id: req.body.id });
            if (project || project.length > 0) {
                await Sys.App.Services.ProjectServices.updateProjectData(
                    { _id: req.body.id },
                    {
                        is_deleted: "1"
                    }
                )
                return res.send("success");
            } else {
                return res.send("error in ProjectController in projectDelete");
            }
        } catch (e) {
            console.log("Erro in ProjectController in projectDelete", e);
        }
    },

    editProject: async function (req, res) {
        try {
            console.log("projectprojectCategoryDataE>>>>>>");

            let projectCategoryData = await Sys.App.Services.ProjectCategoryServices.getByData({});
            let project = await Sys.App.Services.ProjectServices.getProjectData({
                _id: req.params.id
            });
            return res.render('project/addProject', { project: project, projectActive: 'active', projectCategoryData: projectCategoryData });
        } catch (e) {
            console.log("Error in ProjectController in editProject", e);
        }

    },

    editProjectPostData: async function (req, res) {
        try {
            let projectCategory = await Sys.App.Services.ProjectCategoryServices.getProjectCategoryData({ _id: req.body.projectCategoryName })
            let project = await Sys.App.Services.ProjectServices.getProjectData({ _id: req.params.id });
            if (project) {
                let updateData = {
                    project_name: req.body.project_name,
                    project_description: req.body.project_description,
                    project_id: projectCategory._id,
                }
                if (req.files) {
                    var re = /(?:\.([^.]+))?$/;
                    if (req.files.projectImage) {
                        let image1 = req.files.projectImage;
                        var ext1 = re.exec(image1.name)[1];
                        let name = Date.now() + '_' + Math.floor(Math.random() * 1000) + '.' + ext1;
                        updateData.project_image = '/projectImage/' + name;
                        if (fs.existsSync('./public/' + project.project_image) && project.project_image != '' && req.files && req.files.projectImage) {
                            fs.unlink('./public/' + project.project_image, function (err) {
                                if (err) {
                                    console.log('Error in ProjectController in editProjectPostData', err);
                                }
                            });
                        }
                        await image1.mv('./public/projectImage/' + name, async function (err) {
                            if (err) {
                                req.flash('Error Uploading Profile Avatar', err);
                                return res.redirect('/backend/addProject');
                            }
                        });
                    }
                }

                await Sys.App.Services.ProjectServices.updateProjectData({ _id: req.params.id }, updateData)
                req.flash('success', 'project updated successfully');
                return res.redirect('/backend/project');

            } else {
                req.flash('error', 'project not update successfully');
                return res.redirect('/backend/project');
            }
        } catch (e) {
            console.log("Error", e);
        }
    },


}





















































