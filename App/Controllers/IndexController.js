var Sys = require('../../Boot/Sys');
const moment = require('moment');
var fs = require("fs");


module.exports = {


    list: async function(req,res){
		try {

			var data = {
				App 					: Sys.Config.App.details,
				error 				: req.flash("error"),
				success				: req.flash("success"),
                applicationActive 	        : 'active',

			};
            // console.log("Datat", data);
			return res.render('home/listHome',data);
		} catch (e) {
			console.log("Error in ApplicationController in list",e);
		}
	},
    //For Frontend
    getSingleApplicationData: async function(req,res){

		try {
            let data = await Sys.App.Services.HomeServices.getByData({});
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

            let applicationCount = await Sys.App.Services.HomeServices.getHomeCount(query);
            let data = await Sys.App.Services.HomeServices.getHomeDatatable(query, length, start);
            // let categoryname = await Sys.App.Services.CategoryServices.getCategoryDatatable();
            var obj = {
            	'draw': req.query.draw,
            	'recordsTotal': applicationCount,
            	'recordsFiltered': applicationCount,
            	'data': data,
                // 'categoryname': categoryname
            };
            console.log('data', obj);
            // console.log("categrrrrrrrydata", categoryname);
            res.send(obj);
        } catch (e) {
        	console.log("Error in ApplicationController in getApplication",e);
        }
    },

    addApplication: async function(req,res){
        try {
            let categoryData = await Sys.App.Services.HomeServices.getByData({ });

            var data = {
                App 					: req.session.details,
                error 				    : req.flash("error"),
                success				    : req.flash("success"),
                applicationActive 	        : 'active',
                categoryData            : categoryData
            };
            return res.render('home/addHome',data);
      } catch (e) {
        console.log("Error in ApplicationController in addApplication",e);
      }
    },

    postApplication: async function(req, res){

        try {
          //start of new code
          let image = req.files.applicationImage;
          console.log("Image", image);
          var re = /(?:\.([^.]+))?$/;
          var ext3 = re.exec(image.name)[1];
          let applicationImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
          console.log("ext3",ext3);
          let applicationImg = '/homeImage/'+applicationImage;
          // Use the mv() method to place the file somewhere on your server
          await image.mv('./public/homeImage/' + applicationImage, async function(err) {
              if (err) {
                  req.flash('Error in ApplicationController in postApplication', err);
                  return res.redirect('home/addHome');
                }
          });
          let type='video'
          if (ext3 != 'mp4'){
              type= 'image'
          }
          //end of newcode
          // let category = await Sys.App.Services.CategoryServices.getCategoryData({_id: req.body.categoryName});
          console.log("categoy",req.body);
          let application = await Sys.App.Services.HomeServices.insertHomeData({
            title:              req.body.title,
            headtext:              req.body.name,
            file:             applicationImg,
            description:       req.body.description,
            type : type
            // category_id:       category._id
          });
          req.flash('success')
          return res.redirect('/backend/home');
        } catch (error) {
            console.log("Error in ApplicationController in postApplication",error);
        }
    },

    applicationDelete: async function(req,res){
        try {
            let application = await Sys.App.Services.HomeServices.getHomeData({_id: req.body.id});
            if (application || application.length >0) {
                await Sys.App.Services.HomeServices.updateHomeData(
                                { _id: req.body.id},
                                {
                                    is_deleted : "1"
                                }
                            )
                return res.send("success");
            }else {
                return res.send("error in HomeController in applicationDelete");
            }
        } catch (e) {
            console.log("Erro in HomeController in applicationDelete",e);
        }
    },

    editApplication: async function(req,res){
        try {
            // let categoryData = await Sys.App.Services.CategoryServices.getByData({  });
            let application = await Sys.App.Services.HomeServices.getHomeData({
                _id: req.params.id
            });
            return res.render('home/addHome',{application: application , applicationActive : 'active' });
        } catch (e) {
            console.log("Error in HomeController in editApplication",e);
        }

    },


    editApplicationPostData: async function(req,res){
        try {
        //   let category = await Sys.App.Services.CategoryServices.getCategoryData({_id: req.body.categoryName})
          let application = await Sys.App.Services.HomeServices.getHomeData({_id: req.params.id});
          if (application) {
            let updateData = {
                title        :req.body.title,
                headtext	 :req.body.name,
                description  :req.body.description,
                // type         :application.type ?application.type: "",
                // file        :application.imageName ?application.imageName: ""
                // category_id                 :   category._id,
            }

						if (req.files) {
							var re = /(?:\.([^.]+))?$/;
							if (req.files.applicationImage) {
								let image1 = req.files.applicationImage;
								var ext1 = re.exec(image1.name)[1];
								let name = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext1;

								let imageName = '/homeImage/'+name;
								if (fs.existsSync('./public/'+application.image) && application.image !='' && req.files && req.files.applicationImage) {
									fs.unlink('./public/'+application.image, function (err) {
										if (err) {
											console.log('Error in HomeController in editOurTeamPostData',err);
										}
									});
								}
								await image1.mv('./public/homeImage/' + name, async function(err) {
									if (err) {
										;req.flash('Error Uploading Profile Avatar', err);
										return res.redirect('/backend/addHome');
									}
								});
                let type = 'NA';

                if (ext1 != 'jpg' || ext1 != 'jpeg' || ext1 != 'png') {
                  type ='image'
                }else if (ext1 != 'mp4' || ext1 != 'mov' || ext1 != 'wmv' || ext1 != 'avi') {
                  type = 'video';
                }


                updateData.type = type;
                updateData.file = imageName

							}

						}
            console.log("===========================");
            console.log("===========================");
            console.log("===========================");
            console.log("req.bod",updateData);
            console.log("===========================");
            console.log("===========================");
            console.log("===========================");

                       // console.log(updateData,"updateDatahome");
              await Sys.App.Services.HomeServices.updateHomeData({ _id: req.params.id },updateData)
             console.log("kkk");

              req.flash('success','home updated successfully');
              return res.redirect('/backend/home');

          }else {
            req.flash('error', 'home not update successfully');
            return res.redirect('/backend/home');
          }
        } catch (e) {
            console.log("Error",e);
        }
    },

}
