var Sys = require('../../Boot/Sys');
const moment = require('moment');
var fs = require("fs");

module.exports = {

    chemtechLogin: async function(req, res) {
      try {
        var data = {
            error: req.flash("error"),
            success: req.flash("success"),
        };
        return res.render("chemTech/login", data);
      } catch (e) {
        console.log("Error in chemtechLogin ", e);
      }
    },

    chemtechPostLogin : async function(req, res) {
      try {
        console.log("====================");
        console.log("====================");
        console.log("req.body", req.body);
        console.log("====================");
        console.log("====================");
        if (req.body.password != '123456') {
          req.flash('error', 'Wrong Password');
          return res.redirect('/chemtechLogin');
        }
        req.session.chemtech = {
            name: req.body.username
        };
        // return res.send(req.session.chemtech)
        return res.redirect('/chemtechEntry');
      } catch (e) {
        console.log("Error in chemtechPostLogin ", e);
      }
    },

    chemtechEntry: async function(req, res) {
      try {
        if (req.session.chemtech && req.session.chemtech.username != '') {
          return res.render("chemTech/chemtechInvite");
        }else {
          req.flash('error', 'No Logged in User Found');
          return res.redirect('/chemtechLogin');
        }
      } catch (e) {
        console.log("Error in chemtechForm ", e);
      }
    },

    chemtechPostEntry: async function (req, res) {
      try {
        console.log("=============>chemtechPostEntry called, req.body", req.body);
        let userType = [];
        let products = [];
        if (req.body.userType) {
          userType = JSON.parse( req.body.userType );
        }
        if (req.body.products) {
          products = JSON.parse( req.body.products );
        }
        let contactPerson = JSON.parse( req.body.contactPerson );
        let mobile = JSON.parse( req.body.mobile );
        let email = JSON.parse( req.body.email );
        let contactPersonData = [];
        for (var i = 0; i < contactPerson.length; i++) {
          contactPersonData.push({
            contactPerson : contactPerson[i],
            mobile        : mobile[i],
            email         : email[i]
          })
        }
        console.log("--------------->>>>>>>>>>>>>>>>>", contactPersonData );
        console.log("--------------->>>>>>>>>>>>>>>>>req.session.chemtech", req.session.chemtech );
        let data = {
          contactPerson     : contactPersonData,
          userType          : userType,
          products          : products,
          companyName       : (req.body.companyName ? req.body.companyName : '' ),
          unit              : (req.body.unit ? req.body.unit : '' ),
          division          : (req.body.division ? req.body.division : '' ),
          state             : (req.body.state ? req.body.state : '' ),
          application       : (req.body.application ? req.body.application : '' ),
          problem           : (req.body.problem ? req.body.problem : '' ),
          projects          : (req.body.projects ? req.body.projects : '' ),
          action            : (req.body.action ? req.body.action : '' ),
          otherProduct      : (req.body.otherProduct ? req.body.otherProduct : '' ),
          user              : req.session.chemtech.name
        }

        // console.log("re.files", Array.isArray(req.files.additionalDocs) );
        if( req.files && req.files.additionalDocs ){
          data.additionalDocs = []
          if ( Array.isArray(req.files.additionalDocs) ) {
            console.log("multiple files");
            for (let j = 0; j < req.files.additionalDocs.length; j++) {
              console.log("=>>>>>>>>", req.files.additionalDocs[j].name);
              var re = /(?:\.([^.]+))?$/;
              var ext1 = re.exec(req.files.additionalDocs[j].name)[1]
  						let profile_images = req.files.additionalDocs[j];
  						var tempNum = Date.now() +'_'+ Math.floor(Math.random() * 1000);
  						image_name = 'chemtech/'+tempNum +"."+ext1;
  						profile_images.mv('./public/chemtech/'+tempNum +'.'+ext1, async function (uploadErr) {
  						});
  						// updateUserDetail.image = image_name;
              data.additionalDocs.push(image_name);
            }
          }else {
            console.log("Single file");
            var re = /(?:\.([^.]+))?$/;
            var ext1 = re.exec(req.files.additionalDocs.name)[1]
            let profile_images = req.files.additionalDocs;
            var tempNum = Date.now() +'_'+ Math.floor(Math.random() * 1000)
            image_name = 'chemtech/'+tempNum +"."+ ext1;
            profile_images.mv('./public/chemtech/'+tempNum +'.'+ext1, async function (uploadErr) {
            });
            // updateUserDetail.image = image_name;
            data.additionalDocs.push(image_name);
          }
        }
        await Sys.App.Services.ChemtechServices.insertData(data);
        return res.send('success');
      } catch (e) {
        console.log("Error in chemtechPostEntry ", e);
      }
    },

    chemtechKira: async function(req, res) {
      try {
        var data = {
            error: req.flash("error"),
            success: req.flash("success"),
        };
        return res.render("chemTech/loginKira", data);
      } catch (e) {
        console.log("Error in chemtechLogin ", e);
      }
    },

    chemtechPostKiraLogin : async function(req, res) {
      try {
        console.log("====================");
        console.log("====================");
        console.log("req.body", req.body);
        console.log("====================");
        console.log("====================");
        if (req.body.password != '123456') {
          req.flash('error', 'Wrong Password');
          return res.redirect('/chemtechLogin');
        }
        req.session.chemtech = {
            name: req.body.username
        };
        // return res.send(req.session.chemtech)
        return res.redirect('/chemtechEntryKira');
      } catch (e) {
        console.log("Error in chemtechPostLogin ", e);
      }
    },

    chemtechEntryKira: async function(req, res) {
      try {
        return res.render("chemTech/chemtechInvite");
        // if (req.session.chemtech && req.session.chemtech.username != '') {
        //   return res.render("chemTech/chemtechInvite");
        // }else {
        //   req.flash('error', 'No Logged in User Found');
        //   return res.redirect('/chemtechLogin');
        // }
      } catch (e) {
        console.log("Error in chemtechForm ", e);
      }
    },

// chemtechInviteKira

}
