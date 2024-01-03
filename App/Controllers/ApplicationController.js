var Sys = require('../../Boot/Sys');
const moment = require('moment');
var fs = require("fs");
var mongoose = require('mongoose');


module.exports = {
    list: async function(req,res){
		try {

			var data = {
				App 					: req.session.details,
				error 				    : req.flash("error"),
				success				    : req.flash("success"),
                applicationActive 	        : 'active',
                
			};
            // console.log("Datat", data);
			return res.render('application/listApplication',data);
		} catch (e) {
			console.log("Error in ApplicationController in list",e);
		}
	},
    //For Frontend
    getSingleApplicationData: async function(req,res){

		try {
            let data = await Sys.App.Services.ApplicationServices.getByData({ });
            var sobj = {
            	'data': data
            };
           console.log("obj??????",sobj);
           return res.send(sobj);
        } catch (e) {
        	console.log("Error in ApplicationController in getSingleApplicationData",e);
        }
    },
    //End of Frontend

    getApplication: async function(req,res){

		try {
			let start = parseInt(req.query.start);
			let length = parseInt(req.query.length);
			let search = req.query.search.value;

			let query = {};
			if (search != '') {
				let capital = search;
                query = { name: { $regex: '.*' + search + '.*' }, is_deleted: "0" };
            } else {
            	query = { is_deleted: "0" };
            }

            let applicationCount = await Sys.App.Services.ApplicationServices.getApplicationCount(query);
            let data = await Sys.App.Services.ApplicationServices.getApplicationDatatable(query, length, start);
            let categoryname = await Sys.App.Services.CategoryServices.getCategoryDatatable();
            var obj = {
            	'draw': req.query.draw,
            	'recordsTotal': applicationCount,
            	'recordsFiltered': applicationCount,
            	'data': data,
                'categoryname': categoryname
            };
            // console.log('data', data);
            // console.log("categrrrrrrrydata", categoryname);
            res.send(obj);
        } catch (e) {
        	console.log("Error in ApplicationController in getApplication",e);
        }
    },
    addApplication: async function(req,res){
        try {
            let categoryData = await Sys.App.Services.CategoryServices.getByData({  }); 

            var data = {
                App 					: req.session.details,
                error 				    : req.flash("error"),
                success				    : req.flash("success"),
                applicationActive 	        : 'active',
                categoryData            : categoryData
            };
            return res.render('application/addApplication',data);
      } catch (e) {
        console.log("Error in ApplicationController in addApplication",e);
      }
    },

    postApplication: async function(req, res){

        try {
            // Multiple images upload
            let image = req.files.applicationImage;
          var applicationfile = [];          
          if (Array.isArray(req.files.applicationImage) != false) {
            for (let i = 0; i < image.length; i++) {
              var re = /(?:\.([^.]+))?$/;
              var extimg = re.exec(image[i].name)[1];
              let appImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + extimg;
              // Use the mv() method to place the file somewhere on your server
              await image[i].mv('./public/applicationImage/' + appImage, async function(err) {
                  if (err) {
                      req.flash('Error in ApplicationController in postApplication', err);
                      return res.redirect('application/addApplication');
                    }
              });
              applicationfile.push({ path: '/applicationImage/' + appImage, fileName: req.files.applicationImage[i].name, _id: new mongoose.Types.ObjectId(), is_deleted: "0" })
               }
            }
            else{
                let singleimage_c = req.files.applicationImage;
                  console.log("Image", singleimage_c);
                  var re = /(?:\.([^.]+))?$/;
                  var ext6 = re.exec(singleimage_c.name)[1];
                  let singleimage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext6;
                  let singleImg = '/applicationImage/'+singleimage;
                  // Use the mv() method to place the file somewhere on your server
                  await singleimage_c.mv('./public/applicationImage/' + singleimage, async function(err) {
                      if (err) {
                          req.flash('Error in ApplicationController in postApplication', err);
                          return res.redirect('application/addApplication');
                        }
                  });
                  applicationfile.push({ path: '/applicationImage/' + singleimage, fileName: req.files.applicationImage.name, _id: new mongoose.Types.ObjectId(), is_deleted: "0" })
                }        
          //start of old code
        //   let image = req.files.applicationImage;
        //   console.log("Image", image);
        //   var re = /(?:\.([^.]+))?$/;
        //   var ext3 = re.exec(image.name)[1];
        //   let applicationImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
        //   let applicationImg = '/applicationImage/'+applicationImage;
        //   // Use the mv() method to place the file somewhere on your server
        //   await image.mv('./public/applicationImage/' + applicationImage, async function(err) {
        //       if (err) {
        //           req.flash('Error in ApplicationController in postApplication', err);
        //           return res.redirect('application/addApplication');
        //         }
        //   });
          //end of oldcode
          let category = await Sys.App.Services.CategoryServices.getCategoryData({_id: req.body.categoryName});
          console.log("categoy",req.body);
          let application = await Sys.App.Services.ApplicationServices.insertApplicationData({
            name:              req.body.name,
            image:             applicationfile,
            description:       req.body.description,
            category_id:       category._id
          });
          req.flash('success')
          return res.redirect('/backend/application');
        } catch (error) {
            console.log("Error in ApplicationController in postApplication",error);
        }
    },

    applicationDelete: async function(req,res){
        try {
            let application = await Sys.App.Services.ApplicationServices.getApplicationData({_id: req.body.id});
            if (application || application.length >0) {
                await Sys.App.Services.ApplicationServices.updateApplicationData(
                                { _id: req.body.id},
                                {
                                    is_deleted : "1"
                                }
                            )
                return res.send("success");
            }else {
                return res.send("error in ApplicationController in applicationDelete");
            }
        } catch (e) {
            console.log("Erro in ApplicationController in applicationDelete",e);
        }
    },
    applicationImageDelete: async function(req, res){
        try {
            console.log("{{{{ ID}}}}", req.params);
            let application = await Sys.App.Services.ApplicationServices.getApplicationData({ _id: req.params.id });
    
            console.log("================",req.params.id);
            console.log("deleteid",req.params.deleteid);
            console.log("[[[[[[[[[[[r_d_ImageDelete]]]]]]", application);
    
                if (application) {
                    for (let index = 0; index < application.image.length; index++) {
                        var element = application.image[index];
                        console.log("PDF DATA", element);
                        
    
                        if(element._id == req.params.deleteid){
                            console.log("CLICKED ID FOUND");
                           let result = await Sys.App.Services.ApplicationServices.updateApplicationData(
                                {_id: req.params.id,"image.is_deleted":"0"},
                                {
                                    $set:{"image.$.is_deleted":"1"}},
                                // {
                                //     $pull:{'product_image':{_id: req.params.deleteid}},
                                //     is_deleted : "1"
                                // }
                            )
                            console.log("result",result);
                            return res.send("success");        
                        }
                    }
    
                }else {
                    return res.send("error in ApplicationController in applicationImageDelete");
                }
    
        } catch (error) {
            console.log("Error in ApplicationController in applicationImageDelete",error);
        }
    },
    editApplication: async function(req,res){
        try {
            let categoryData = await Sys.App.Services.CategoryServices.getByData({  }); 
            let application = await Sys.App.Services.ApplicationServices.getApplicationData({
                _id: req.params.id
            });
            return res.render('application/addApplication',{application: application , applicationActive : 'active', categoryData: categoryData });
        } catch (e) {
            console.log("Error in ApplicationController in editApplication",e);
        }
 
    },

    editApplicationPostData: async function(req,res){
        try {
          let category = await Sys.App.Services.CategoryServices.getCategoryData({_id: req.body.categoryName})
          let application = await Sys.App.Services.ApplicationServices.getApplicationData({_id: req.params.id});
          var updated_img = application.image;
          
          if (application) {
                        let updateData ;						
                        if (req.files) {
                            let image1 = req.files.applicationImage;
                            var appImg=[];
                                    if (Array.isArray(req.files.applicationImage) != false) {
                                        for (let i = 0; i < image1.length; i++) {
                                          var re = /(?:\.([^.]+))?$/;
                                          var ext1 = re.exec(image1[i].name)[1];
                                          let name = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext1;
                                          // Use the mv() method to place the file somewhere on your server
                                          await image1[i].mv('./public/applicationImage/' + name, async function(err) {
                                              if (err) {
                                                  req.flash('Error in ApplicationController in postProduct', err);
                                                  return res.redirect('application/addApplication');
                                                }
                                          });
                                          appImg.push({ path: '/applicationImage/' + name, fileName: req.files.applicationImage[i].name, _id: new mongoose.Types.ObjectId(), is_deleted: "0" })
                                           }
                                        }
                                        else{
                                            let singleimage_p = req.files.applicationImage;
                                              console.log("Image", singleimage_p);
                                              var re = /(?:\.([^.]+))?$/;
                                              var ext6 = re.exec(singleimage_p.name)[1];
                                              let singleImage_P = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext6;
                                              let singleImg = '/casestudies_image/'+singleImage_P;
                                              // Use the mv() method to place the file somewhere on your server
                                              await singleimage_p.mv('./public/applicationImage/' + singleImage_P, async function(err) {
                                                  if (err) {
                                                      req.flash('Error in ApplicationController in postOurTeam', err);
                                                      return res.redirect('application/addApplication');
                                                    }
                                              });
                                              updated_img.push({ path: '/applicationImage/' + singleImage_P, fileName: req.files.applicationImage.name, _id: new mongoose.Types.ObjectId(), is_deleted: "0" })
                                        }
                                 }		
                                  updateData = {
                                    name						:	req.body.name,
                                    description                 :   req.body.description,
                                    image                       :   updated_img,
                                    category_id                 :   category._id,
                                }						

              await Sys.App.Services.ApplicationServices.updateApplicationData({ _id: req.params.id },updateData)
              req.flash('success','Application updated successfully');
              return res.redirect('/backend/application');

          }else {
            req.flash('error', 'Application not update successfully');
            return res.redirect('/backend/application');
          }
        } catch (e) {
            console.log("Error",e);
        }
    },


}





















































