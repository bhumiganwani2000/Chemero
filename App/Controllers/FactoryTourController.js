var Sys = require('../../Boot/Sys');
const moment = require('moment');
var fs = require("fs");


module.exports = {


    list: async function(req,res){
		try {
            console.log("FactoryTourController");
			var data = {
				App 					: req.session.details,
				error 				    : req.flash("error"),
				success				    : req.flash("success"),
                FactoryTourActive 	        : 'active',
                
			};
            // console.log("Datat", data);
			return res.render('factorytour/listfactorytour',data);
		} catch (e) {
			console.log("Error in FactoryTourController in list",e);
		}
	},
    //For Frontend
    getSingleFactoryTourData: async function(req,res){

		try {
            let data = await Sys.App.Services.FactoryTourServices.getByData({ });
            var sobj = {
            	'data': data
            };
           console.log("obj??????",sobj);
           return res.send(sobj);
        } catch (e) {
        	console.log("Error in FactoryTourController in getSingleNewsData",e);
        }
    },



    //End of Frontend

    getFactoryTour: async function(req,res){

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

            // let factorytourCount = await Sys.App.Services.FactoryTourServices.getfactorytourCount(query);
            let data = await Sys.App.Services.FactoryTourServices.getFactoryTourDatatable(query, length, start);
            // let categoryname = await Sys.App.Services.CategoryServices.getCategoryDatatable();
            var obj = {
            	// 'draw': req.query.draw,
            	// 'recordsTotal': factorytourCount,
            	// 'recordsFiltered': factorytourCount,
            	'data': data,
                
            };
            // console.log('data', data);
            // console.log("categrrrrrrrydata", categoryname);
            res.send(obj);
        } catch (e) {
        	console.log("Error in FactoryTourController in getfactorytour",e);
        }
    },

    addFactoryTour: async function(req,res){
        try {
            let FactoryTourData = await Sys.App.Services.FactoryTourServices.getByData({  }); 

            var data = {
                App 					: req.session.details,
                error 				    : req.flash("error"),
                success				    : req.flash("success"),
                FactoryTourActive 	        : 'active',
                // categoryData            : categoryData
            };
            return res.render('factorytour/addfactorytour',data);
      } catch (e) {
        console.log("Error in FactoryTourController in addfactorytour",e);
      }
    },

    postFactoryTour: async function(req, res){

        try {
        //   console.log("categoy",req.body);

          //start of new code
          let image = req.files.FactoryTourImage;
        //   console.log("Image", image);
          var re = /(?:\.([^.]+))?$/;
          var ext3 = re.exec(image.name)[1];
          let FactoryTourImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
          let FactoryTourImg = '/FactoryTourImage/'+FactoryTourImage;
          // Use the mv() method to place the file somewhere on your server
          await image.mv('./public/FactoryTourImage/' + FactoryTourImage, async function(err) {
              if (err) {
                  req.flash('Error in FactoryTourController in postNews', err);
                  return res.redirect('/backend/addfactorytour');

                }
          });
          let type='video'
          if (ext3 != 'mp4'){
              type= 'image'
          }
          //end of newcode
        //   let category = await Sys.App.Services.CategoryServices.getCategoryData({_id: req.body.categoryName});
        //   console.log("categoy",req.body);
          let FactoryTourData = await Sys.App.Services.FactoryTourServices.insertFactoryTourData({
            title:             req.body.title,
            image:             FactoryTourImg,
            description:       req.body.description,
            type :             type
            // category_id:       category._id
          });
          console.log(FactoryTourData,"FactoryTour data is here>>>>>>>");
          req.flash('success')
          return res.redirect('/backend/factorytour');
        } catch (error) {
            console.log("Error in FactoryTourController in postfactorytour",error);
        }
    },

    FactoryTourDelete: async function(req,res){
        try {
            let FactoryTourData = await Sys.App.Services.FactoryTourServices.getFactoryTourData({_id: req.body.id});
            if (FactoryTourData || FactoryTourData.length >0) {
                await Sys.App.Services.FactoryTourServices.updateFactoryTourData(
                                { _id: req.body.id},
                                {
                                    is_deleted : "1"
                                }
                            )
                return res.send("success");
            }else {
                return res.send("error in FactoryTourController in factorytourDelete");
            }
        } catch (e) {
            console.log("Erro in FactoryTourController in factorytourDelete",e);
        }
    },

    editFactoryTour: async function(req,res){
        try {
            // let categoryData = await Sys.App.Services.CategoryServices.getByData({  }); 
            let FactoryTourData = await Sys.App.Services.FactoryTourServices.getFactoryTourData({
                _id: req.params.id
            });
            return res.render('factorytour/addfactorytour',{FactoryTourData: FactoryTourData , newsActive : 'active' });
        } catch (e) {
            console.log("Error in FactoryTourController in editfactorytour",e);
        }
 
    },

    editFactoryTourPostData: async function(req,res){
        try {
        //   let category = await Sys.App.Services.CategoryServices.getCategoryData({_id: req.body.categoryName})
          let FactoryTourData = await Sys.App.Services.FactoryTourServices.getFactoryTourData({_id: req.params.id});
          if (FactoryTourData) {
              console.log(req.files,"factoryfilesssss");
                        let updateData; 
                        let FactoryTourImage='';						
						if (req.files) {
							var re = /(?:\.([^.]+))?$/;
							if (req.files.FactoryTourImage) {
								let image1 = req.files.FactoryTourImage;
								var ext1 = re.exec(image1.name)[1];
								let name = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext1;
								FactoryTourImage = '/FactoryTourImage/'+name;
								if (fs.existsSync('./public/'+FactoryTourData.image) && FactoryTourData.image !='' && req.files && req.files.FactoryTourImage) {
									fs.unlink('./public/'+FactoryTourData.image, function (err) {
										if (err) {
											console.log('Error in FactoryTourController in editFactoryTourData',err);
										}
									});
								}
								await image1.mv('./public/FactoryTourImage/' + name, async function(err) {
									if (err) {
										req.flash('Error Uploading Profile Avatar', err);
										return res.redirect('/backend/addfactorytour');
									}
								});
							}
                            let type='video';
                            if (ext1 != 'mp4'){
                                type ='image'
                            }
                             updateData = {
                                title						:	req.body.title,
                                description                 :   req.body.description,
                                image                       :   FactoryTourImage,
                                type                        :   type,

                                // category_id                 :   category._id,
                            }
						}

              await Sys.App.Services.FactoryTourServices.updateFactoryTourData({ _id: req.params.id },updateData)
              req.flash('success','FactoryTour Data updated successfully');
              return res.redirect('/backend/factorytour');

          }else {
            req.flash('error', 'News not update successfully');
            return res.redirect('/backend/factorytour');
          }
        } catch (e) {
            console.log("Error",e);
        }
    },


}





















































