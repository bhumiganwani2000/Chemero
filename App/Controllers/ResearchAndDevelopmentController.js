var Sys = require('../../Boot/Sys');
const moment = require('moment');
var fs = require("fs");
var mongoose = require('mongoose');


module.exports = {

  researchAndDevelopment: async function (req, res) {
    try {
      console.log("==");

      let researchAndDevelopmentCount = await Sys.App.Services.UserServices.getResearchAndDevelopmentCount({}); //gets the no of docs
      console.log("count", researchAndDevelopmentCount);

      let updateButtonShow = 'false';
      if (researchAndDevelopmentCount > 0) {
        // addButtonShow = 'false';
        updateButtonShow = 'true';
      }
      var data = {
        App: req.session.details,
        error: req.flash("error"),
        success: req.flash("success"),
        researchAndDevelopmentActive: 'active',
        updateButtonShow: updateButtonShow,
        // showData   : showData
      };

    } catch (error) {
      console.log("Error in ResearchAndDevelopmentController in  researchAndDevelopment", error);
    }
  },

  getResearchAndDevelopment: async function (req, res) {
    // res.send(req.query.start); return false;
    try {
      let start = parseInt(req.query.start);
      let length = parseInt(req.query.length);
      let search = req.query.search.value;

      let query = {};
      if (search != '') {
        query = { heading: { $regex: '.*' + search + '.*' } };
      } else {
        query = {};
      }

      let researchAndDevelopmentCount = await Sys.App.Services.UserServices.getResearchAndDevelopmentCount(query);


      let data = await Sys.App.Services.UserServices.getResearchAndDevelopmentDatatable(query, length, start);
      // console.log("data", data);
      var obj = {
        'draw': req.query.draw,
        'recordsTotal': researchAndDevelopmentCount,
        'recordsFiltered': researchAndDevelopmentCount,
        'data': data
      };
      res.send(obj);
    } catch (e) {
      console.log("Error in ResearchAndDevelopmentController in getResearchAndDevelopment", e);
    }
  },

  researchAndDevelopmentAdd: async function (req, res) {
    try {
      let researchAndDevelopment = await Sys.App.Services.UserServices.getByDataResearchAndDevelopment({});
      // console.log('researchAndDevelopment', researchAndDevelopment);
      var data = {
        App: req.session.details,
        error: req.flash("error"),
        success: req.flash("success"),
        researchAndDevelopmentActive: 'active',
        researchAndDevelopment: researchAndDevelopment,
      };
      return res.render('researchAndDevelopment/addResearchAndDevelopment', data);
    } catch (error) {
      console.log("Error in ResearchAndDevelopmentController in researchAndDevelopmentAdd", error);
    }
  },

  researchAndDevelopmentAddPost: async function (req, res) {
    try {
      //start of new code
      let image = req.files.rd_file;
      let r_Dfile = [];
      if (Array.isArray(req.files.rd_file) != false) {
        for (let i = 0; i < image.length; i++) {
          var re = /(?:\.([^.]+))?$/;
          var ext3 = re.exec(image[i].name)[1];
          let RandDimage = Date.now() + '_' + Math.floor(Math.random() * 1000) + '.' + ext3;
          let R_and_DImage = '/RandDimage/' + RandDimage;
          // Use the mv() method to place the file somewhere on your server
          await image[i].mv('./public/RandDimage/' + RandDimage, async function (err) {
            if (err) {
              req.flash('Error in FactoryTourController in postNews', err);
              return res.redirect('/backend/addResearchAndDevelopmentData');
            }
          });
          r_Dfile.push({ path: '/RandDimage/' + RandDimage, fileName: req.files.rd_file[i].name, _id: new mongoose.Types.ObjectId(), is_deleted: "0" })
          // console.log(R_Dfile,"arrayy>>>>>");
          //end of newcode

          // console.log("researchAndDevelopment>>>>>>>", researchAndDevelopment);
        }
        console.log(r_Dfile, "arrayy>>>>>");

        let researchAndDevelopment = await Sys.App.Services.UserServices.insertResearchAndDevelopmentData({
          r_dContent: req.body.r_dContent,
          image: r_Dfile,
        });
        return res.redirect('/backend/addResearchAndDevelopmentData');
      }
    } catch (error) {
      console.log("Error in ResearchAndDevelopmentController in researchAndDevelopmentAddPost", error);
    }
  },

  researchAndDevelopmentUpdate: async function (req, res) {
    try {
      let researchAndDevelopment = await Sys.App.Services.UserServices.getByDataResearchAndDevelopment({ _id: req.params.id });
      let showData = await Sys.App.Services.UserServices.getByDataResearchAndDevelopment({});
      console.log("data", showData);
      var data = {
        App: req.session.details,
        error: req.flash("error"),
        success: req.flash("success"),
        researchAndDevelopment: researchAndDevelopment,
        researchAndDevelopmentActive: 'active',
        // showData   : showData
      };
      // console.log("show data", showData);
      return res.render('researchAndDevelopment/addResearchAndDevelopment', data);
    } catch (error) {
      console.log("Error in ResearchAndDevelopmentController in researchAndDevelopmentUpdate", error);
    }
  },

  researchAndDevelopmentUpdatePost: async function (req, res) {
    try {
      console.log("updatecall r&d");
      console.log(req.body);
      console.log(req.files);
      let researchAndDevelopment = await Sys.App.Services.UserServices.getByDataResearchAndDevelopment({ _id: req.params.id }, req.body);
      var updated_img = researchAndDevelopment.image;
     
      let updateData = {
        r_dContent: req.body.r_dContent,
    }
      
      let image1 = req.files.rd_file;
      updateData.image =updated_img;

      // let r_Dfile1 = [];
      console.log("mages1",image1);
      if (researchAndDevelopment) {
        console.log("helllloooo");
      if (Array.isArray(req.files.rd_file) != false) {
        console.log("dfsdfsd");
        for (let i = 0; i < image1.length; i++) {
          var re = /(?:\.([^.]+))?$/;
        console.log("dfsdf22222sd");

          var ext4 = re.exec(image1[i].name)[1];
          let RandDimage1 = Date.now() + '_' + Math.floor(Math.random() * 1000) + '.' + ext4;
          let R_and_DImage = '/RandDimage/' + RandDimage1;
          // Use the mv() method to place the file somewhere on your server
          await image1[i].mv('./public/RandDimage/' + RandDimage1, async function (err) {
            if (err) {
              req.flash('Error in FactoryTourController in postNews', err);
              return res.redirect('/backend/addResearchAndDevelopmentData');
            }
          });
          updated_img.push({ path: '/RandDimage/' + RandDimage1, fileName: req.files.rd_file[i].name, _id: new mongoose.Types.ObjectId(), is_deleted: "0" })
        }        
      }
      
    }

    await Sys.App.Services.UserServices.updateResearchAndDevelopmentData({ _id: req.params.id }, updateData)

      // if (researchAndDevelopment) {
      //   console.log(req.files, "R&DUpdate   filesssss>>>>>");
      //   var updateData;
      //   let R_and_DImage1 = [];
      //   if (req.files) {
      //     var re = /(?:\.([^.]+))?$/;
      //     if (req.files.rd_file) {
      //       let image1 = req.files.rd_file;
      //       var ext1 = re.exec(image1.name)[1];
      //       let name = Date.now() + '_' + Math.floor(Math.random() * 1000) + '.' + ext1;
      //       R_and_DImage1 = '/RandDimage/' + name;
      //       if (fs.existsSync('./public/' + researchAndDevelopment.image) && researchAndDevelopment.image != '' && req.files && req.files.rd_file) {
      //         fs.unlink('./public/' + researchAndDevelopment.image, function (err) {
      //           if (err) {
      //             console.log('Error in ResearchAndDevelopmentController in researchAndDevelopmentUpdatePost', err);
      //           }
      //         });
      //       }
      //       await image1.mv('./public/RandDimage/' + name, async function (err) {
      //         if (err) {
      //           req.flash('Error Uploading Profile Avatar', err);
      //           return res.redirect('/backend/addfactorytour');
      //         }
      //       });
      //     }
      //     updateData = {
      //       r_dContent: req.body.r_dContent,
      //       image: R_and_DImage1,
      //       // category_id                 :   category._id,
      //     }
      //   }
      // }
      // console.log(updateData, "updateData");
      req.flash('success', 'ResearchandDevelopment updated successfully');
      return res.redirect('/backend/addResearchAndDevelopmentData');
      // res.redirect('/backend/addResearchAndDevelopmentData')
    } catch (error) {
      console.log("Error in ResearchAndDevelopmentController in researchAndDevelopmentUpdatePost", error);
    }
  },
  r_d_ImageDelete: async function(req, res){
    try {
        console.log("{{{{ ID}}}}", req.params);
        let researchAndDevelopment = await Sys.App.Services.UserServices.getByDataResearchAndDevelopment({ _id: req.params.id });

        console.log("================",req.params.id);
        console.log("deleteid",req.params.deleteid);
        console.log("[[[[[[[[[[[r_d_ImageDelete]]]]]]", researchAndDevelopment);

            if (researchAndDevelopment) {
                for (let index = 0; index < researchAndDevelopment.image.length; index++) {
                    var element = researchAndDevelopment.image[index];
                    console.log("PDF DATA", element);
                    

                    if(element._id == req.params.deleteid){
                        console.log("CLICKED ID FOUND");
                       let result = await Sys.App.Services.UserServices.updateResearchAndDevelopmentData(
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
                return res.send("error in ResearchAndDevelopmentController in r_d_Delete");
            }

    } catch (error) {
        console.log("Error in ResearchAndDevelopmentController in r_d_Delete",error);
    }
},

  getResearchAndDevelopmentDelete: async function (req, res) {
    try {
      let researchAndDevelopment = await Sys.App.Services.UserServices.getByDataResearchAndDevelopment({ _id: req.body.id });
      if (researchAndDevelopment != null) {
        await Sys.App.Services.UserServices.deleteResearchAndDevelopment(req.body.id)
        return res.send("success");
      } else {
        return res.send("error");
      }
    } catch (e) {
      console.log("Error in ResearchAndDevelopmentController in getResearchAndDevelopmentDelete", e);
    }
  },


}
