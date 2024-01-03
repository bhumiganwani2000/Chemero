var Sys = require('../../Boot/Sys');
const moment = require('moment');
var fs = require("fs");
var mongoose = require('mongoose');


module.exports = {
    list: async function(req,res){
		try {
            console.log("nnjnjnjn");
			var data = {
				App 					: req.session.details,
				error 				    : req.flash("error"),
				success				    : req.flash("success"),
                newsActive 	        : 'active',
                
			};
            // console.log("Datat", data);
            return res.render('casestudies/listcasestudies',data);
		} catch (e) {
			console.log("Error in CaseStudiesController in list",e);
		}
	},
    //For Frontend
    getSingleCaseStudiesData: async function(req,res){

		try {
            let data = await Sys.App.Services.CaseStudiesServices.getByData({ });
            var sobj = {
            	'data': data
            };
           console.log("obj??????",sobj);
           return res.send(sobj);
        } catch (e) {
        	console.log("Error in CaseStudiesController in getSingleNewsData",e);
        }
    },
    //End of Frontend

    getCaseStudies: async function(req,res){

		try {
			let start = parseInt(req.query.start);
			let length = parseInt(req.query.length);
			let search = req.query.search.value;

			let query = {};
			if (search != '') {
				let capital = search;
                query = { casestudy_name: { $regex: '.*' + search + '.*' }, is_deleted: "0" };
            } else {
            	query = { is_deleted: "0" };
            }

            let casestudiesCount = await Sys.App.Services.CaseStudiesServices.getCaseStudiesCount(query);
            let data = await Sys.App.Services.CaseStudiesServices.getCaseStudiesDatatable(query, length, start);
            // let categoryname = await Sys.App.Services.CategoryServices.getCategoryDatatable();
            var obj = {
            	// 'draw': req.query.draw,
            	'recordsTotal': casestudiesCount,
            	'recordsFiltered': casestudiesCount,
            	'data': data,
                
            };
            // console.log('data', data);
            // console.log("categrrrrrrrydata", categoryname);
            res.send(obj);
        } catch (e) {
        	console.log("Error in CaseStudiesController in getcasestudies",e);
        }
    },

    addCaseStudies: async function(req,res){
        try {
            let CaseStudiesData = await Sys.App.Services.CaseStudiesServices.getByData({  }); 

            var data = {
                App 					: req.session.details,
                error 				    : req.flash("error"),
                success				    : req.flash("success"),
                casestudiesActive 	        : 'active',
                // CaseStudiesData         : CaseStudiesData,
            };
            return res.render('casestudies/addcasestudies',data);
      } catch (e) {
        console.log("Error in CaseStudiesController in addcasestudies",e);
      }
    },

    postCaseStudies: async function(req, res){

        try {
          console.log("categoy",req.body);
          console.log("filesss>>>>>>>>>>>>", req.files);
          console.log("productImage>>>>>>>>>>>",req.files.casestudiesImage);

          //start of new code
          let image = req.files.casestudiesImage;
          var casestudiesfile = [];          
          if (Array.isArray(req.files.casestudiesImage) != false) {
            for (let i = 0; i < image.length; i++) {
              var re = /(?:\.([^.]+))?$/;
              var extimg = re.exec(image[i].name)[1];
              let casestudiesImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + extimg;
              // Use the mv() method to place the file somewhere on your server
              await image[i].mv('./public/casestudies_image/' + casestudiesImage, async function(err) {
                  if (err) {
                      req.flash('Error in CaseStudiesController in postCaseStudies', err);
                      return res.redirect('casestudies/addcasestudies');
                    }
              });
              casestudiesfile.push({ path: '/casestudies_image/' + casestudiesImage, fileName: req.files.casestudiesImage[i].name, _id: new mongoose.Types.ObjectId(), is_deleted: "0" })
               }
            }
            else{
                let singleimage_c = req.files.casestudiesImage;
                  console.log("Image", singleimage_c);
                  var re = /(?:\.([^.]+))?$/;
                  var ext6 = re.exec(singleimage_c.name)[1];
                  let singleimage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext6;
                  let singleImg = '/productImage/'+singleimage;
                  // Use the mv() method to place the file somewhere on your server
                  await singleimage_c.mv('./public/casestudies_image/' + singleimage, async function(err) {
                      if (err) {
                          req.flash('Error in CaseStudiesController in postCaseStudies', err);
                          return res.redirect('casestudies/addcasestudies');
                        }
                  });
                  casestudiesfile.push({ path: '/casestudies_image/' + singleimage, fileName: req.files.casestudiesImage.name, _id: new mongoose.Types.ObjectId(), is_deleted: "0" })
    
            }        
          let casestudies = await Sys.App.Services.CaseStudiesServices.insertCaseStudiesData({
            casestudy_name:              req.body.title,
            casestudy_image:             casestudiesfile,
            casestudy_description:       req.body.description,
          });
          console.log(casestudies,"casestudies data is here>>>>>>>");
          req.flash('success')
          return res.redirect('/backend/casestudies');
        } catch (error) {
            console.log("Error in CaseStudiesController in postCaseStudies",error);
        }
    },

    caseStudiesImageDelete: async function(req, res){
        try {
            console.log("{{{{{case ID}}}}", req.params);
        //    let product =  await Sys.App.Services.ProductServices.getProductData({id:req.params.id})
           let casestudies = await Sys.App.Services.CaseStudiesServices.getCaseStudiesData({_id: req.params.id});
            console.log("================",req.params.id);
            console.log("deleteid",req.params.deleteid);
            console.log("[[[[[[[[[[[casestudiesDELETE]]]]]]", casestudies);

                if (casestudies) {
                    for (let index = 0; index < casestudies.casestudy_image.length; index++) {
                        var element = casestudies.casestudy_image[index];
                        console.log("casestudies DATA", element);
                        

                        if(element._id == req.params.deleteid){
                            console.log("CLICKED ID FOUND");
                           let result = await Sys.App.Services.CaseStudiesServices.updateCaseStudiesData(
                                {_id: req.params.id,"casestudy_image.is_deleted":"0"},
                                {
                                    $set:{"casestudy_image.$.is_deleted":"1"}},
                                // {
                                //     $pull:{'product_image':{_id: req.params.deleteid}},
                                //     is_deleted : "1"
                                // }
                            )
                            console.log("result",result);
                            return res.send("success");
                            // return res.redirect('casestudies/addcasestudies');
                        }
                    }

                }else {
                    return res.send("error in CaseStudiesController in caseStudiesImageDelete");
                }

        } catch (error) {
            console.log("Error in CaseStudiesController in caseStudiesImageDelete",error);
        }
    },

    CaseStudiesDelete: async function(req,res){
        try {
            let CaseStudies = await Sys.App.Services.CaseStudiesServices.getCaseStudiesData({_id: req.body.id});
            if (CaseStudies || CaseStudies.length >0) {
                await Sys.App.Services.CaseStudiesServices.updateCaseStudiesData(
                                { _id: req.body.id},
                                {
                                    is_deleted : "1"
                                }
                            )
                return res.send("success");
            }else {
                return res.send("error in CaseStudiesController in CaseStudiesDelete");
            }
        } catch (e) {
            console.log("Erro in CaseStudiesController in CaseStudiesDelete",e);
        }
    },

    editCaseStudies: async function(req,res){
        try {
            console.log("casestudiesEDit");
            // let categoryData = await Sys.App.Services.CategoryServices.getByData({  }); 
            let casestudies = await Sys.App.Services.CaseStudiesServices.getCaseStudiesData({
                _id: req.params.id
            });
            return res.render('casestudies/addcasestudies',{casestudies: casestudies , casestudiesActive : 'active' });
        } catch (e) {
            console.log("Error in CaseStudiesController in editCaseStudies",e);
        }
 
    },

    editCaseStudiesPostData: async function(req,res){
        try {
            console.log("editCaseStudiesPostData");
          let casestudies = await Sys.App.Services.CaseStudiesServices.getCaseStudiesData({_id: req.params.id});
          var updated_img = casestudies.casestudy_image;
          if (casestudies) {
            if (req.files) {
                let image1 = req.files.casestudiesImage;
                var casestudiesImg=[];
                let updateData ;
                        if (Array.isArray(req.files.casestudiesImage) != false) {
                            for (let i = 0; i < image1.length; i++) {
                              var re = /(?:\.([^.]+))?$/;
                              var ext1 = re.exec(image1[i].name)[1];
                              let name = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext1;
                              // Use the mv() method to place the file somewhere on your server
                              await image1[i].mv('./public/casestudies_image/' + name, async function(err) {
                                  if (err) {
                                      req.flash('Error in CaseStudiesController in postProduct', err);
                                      return res.redirect('casestudies/addcasestudies');
                                    }
                              });
                              updated_img.push({ path: '/casestudies_image/' + name, fileName: req.files.casestudiesImage[i].name, _id: new mongoose.Types.ObjectId(), is_deleted: "0" })
                               }
                            }
                            else{
                                let singleimage_p = req.files.casestudiesImage;
                                  console.log("Image", singleimage_p);
                                  var re = /(?:\.([^.]+))?$/;
                                  var ext6 = re.exec(singleimage_p.name)[1];
                                  let singleImage_P = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext6;
                                  let singleImg = '/casestudies_image/'+singleImage_P;
                                  // Use the mv() method to place the file somewhere on your server
                                  await singleimage_p.mv('./public/casestudies_image/' + singleImage_P, async function(err) {
                                      if (err) {
                                          req.flash('Error in CaseStudiesController in postOurTeam', err);
                                          return res.redirect('ourTeam/addOurTeam');
                                        }
                                  });
                                  updated_img.push({ path: '/casestudies_image/' + singleImage_P, fileName: req.files.casestudiesImage.name, _id: new mongoose.Types.ObjectId(), is_deleted: "0" })
                    
                            }
                     }		
                    //  console.log(updated_img,"updated_img");				
                         updateData = {
                            casestudy_name:              req.body.title,
                            casestudy_image:             updated_img,
                            casestudy_description:       req.body.description,
				    	}
              await Sys.App.Services.CaseStudiesServices.updateCaseStudiesData({ _id: req.params.id },updateData)
            //   await Sys.App.Services.ProductServices.insertProductData({ _id: req.params.id },addPdf)

              req.flash('success','casestudies updated successfully');
              return res.redirect('/backend/casestudies');

          }else {
            req.flash('error', 'casestudies not update successfully');
            return res.redirect('/backend/casestudies');
          }          
        } catch (e) {
            console.log("Error",e);
        }
    },


}





















































