var Sys = require('../../Boot/Sys');
const moment = require('moment');
var fs = require("fs");


module.exports = {
    list: async function(req,res){
		try {
			var data = {
				App 					: req.session.details,
				error 				    : req.flash("error"),
				success				    : req.flash("success"),
                ourTeamActive 	        : 'active'
			};
			return res.render('ourTeam/listOurTeam',data);
		} catch (e) {
			console.log("Error in OurTeamController in list",e);
		}
	},

    getOurTeams: async function(req,res){

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

            let ourTeamCount = await Sys.App.Services.OurTeamServices.getOurTeamCount(query);
            let data = await Sys.App.Services.OurTeamServices.getOurTeamDatatable(query, length, start);
            var obj = {
            	'draw': req.query.draw,
            	'recordsTotal': ourTeamCount,
            	'recordsFiltered': ourTeamCount,
            	'data': data
            };
            // console.log("get route ourteam>>>>>",data);
            res.send(obj);
        } catch (e) {
        	console.log("Error in OurTeamController in getOurTeams",e);
        }
    },

    addOurTeams: async function(req,res){
        try {
            var data = {
                App 					: req.session.details,
                error 				    : req.flash("error"),
                success				    : req.flash("success"),
                ourTeamActive 	        : 'active'
            };
            return res.render('ourTeam/addOurTeam',data);
      } catch (e) {
        console.log("Error in OurTeamController in addOurTeams",e);
      }
    },

    postOurTeam: async function(req, res){

        try {
          //start of new code         
          let image = req.files.ourTeamImage;
        //   console.log("Image", image);
          var re = /(?:\.([^.]+))?$/;
          var ext3 = re.exec(image.name)[1];
          let ourTeamImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
          let ourTeamImg = '/ourTeamImage/'+ourTeamImage;
          // Use the mv() method to place the file somewhere on your server
          await image.mv('./public/ourTeamImage/' + ourTeamImage, async function(err) {
              if (err) {
                  req.flash('Error in OurTeamController in postOurTeam', err);
                  return res.redirect('ourTeam/addOurTeam');
                }
          });
          //end of newcode
          let ourTeam = await Sys.App.Services.OurTeamServices.insertOurTeamData({
            name:              req.body.name,
            image:             ourTeamImg,
            role:              req.body.role,
            description:       req.body.description,
            facebook:           req.body.facebook,
            twitter:            req.body.twitter,
            instagram:          req.body.instagram,
            linkedin:           req.body.linkedin,
  
          });
          req.flash('success')
          console.log("ourteam description>>>>>>>>>>>>",ourTeam);
          return res.redirect('/backend/ourTeam');
        } catch (error) {
            console.log("Error in OurTeamController in ourTeamAddPost",error);
        }
    },

    getOurTeamDelete: async function(req,res){
        try {
            let ourTeam = await Sys.App.Services.OurTeamServices.getOurTeamData({_id: req.body.id});
            if (ourTeam || ourTeam.length >0) {
                await Sys.App.Services.OurTeamServices.updateOurTeamData(
                                { _id: req.body.id},
                                {
                                    is_deleted : "1"
                                }
                            )
                return res.send("success");
            }else {
                return res.send("error in OurTeamController in getOurTeamDelete");
            }
        } catch (e) {
            console.log("Erro in OurTeamController in getOurTeamDelete",e);
        }
    },

    editOurTeam: async function(req,res){
        try {
            let ourTeam = await Sys.App.Services.OurTeamServices.getOurTeamData({_id: req.params.id});
            return res.render('ourTeam/addOurTeam',{ourTeam: ourTeam , ourTeamActive : 'active'});
        } catch (e) {
            console.log("Error in OurTeamController in editOurTeam",e);
        }
 
    },


    downloadPresentation:  function(req,res){
        try {
            let file = `./public/pdf/Get_Started_With_Smallpdf.pdf`;
            console.log(file,"download file>>>>>>");
            return res.download(file);
        } catch (e) {
            console.log("Error in OurTeamController in editOurTeam",e);
        }
 
    },

    editOurTeamPostData: async function(req,res){
        try {
          let ourTeam = await Sys.App.Services.OurTeamServices.getOurTeamData({_id: req.params.id});
          if (ourTeam) {
						let updateData = {
							name						:	req.body.name,
                            role                        :   req.body.role,
                            description                 :   req.body.description,
                            facebook                    :   req.body.facebook,
                            twitter                     :   req.body.twitter,
                            instagram                   :   req.body.instagram,
                            linkedin                    :   req.body.linkedin,
				    	}
						if (req.files) {
							var re = /(?:\.([^.]+))?$/;
							if (req.files.ourTeamImage) {
								let image1 = req.files.ourTeamImage;
								var ext1 = re.exec(image1.name)[1];
								let name = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext1;
								updateData.image = '/ourTeamImage/'+name;
								if (fs.existsSync('./public/'+ourTeam.image) && ourTeam.image !='' && req.files && req.files.ourTeamImage) {
									fs.unlink('./public/'+ourTeam.image, function (err) {
										if (err) {
											console.log('Error in OurTeamController in editOurTeamPostData',err);
										}
									});
								}
								await image1.mv('./public/ourTeamImage/' + name, async function(err) {
									if (err) {
										req.flash('Error Uploading Profile Avatar', err);
										return res.redirect('/backend/addOurteam');
									}
								});
							}
						}

              await Sys.App.Services.OurTeamServices.updateOurTeamData({ _id: req.params.id },updateData)
              req.flash('success','Our Team updated successfully');
              return res.redirect('/backend/ourTeam');

          }else {
            req.flash('error', 'Our Team not update successfully');
            return res.redirect('/backend/ourTeam');
          }
        } catch (e) {
            console.log("Error",e);
        }
    },


}




















































//===============================================OLD CODE========================================

// module.exports = {

//     ourTeam: async function(req, res) {
//         try {
//             console.log("==");
            
//             let ourTeamCount = await Sys.App.Services.OurTeamServices.getOurTeamCount({}); //gets the no of docs
//             console.log("count", ourTeamCount);

//             let updateButtonShow = 'false';
//             if (ourTeamCount > 0) {
//               updateButtonShow = 'true';
//             }
//             var data = {
//                 App : req.session.details,
//                 error: req.flash("error"),
//                 success: req.flash("success"),
//                 ourTeamActive : 'active',
//                 updateButtonShow: updateButtonShow,
//                 // showData   : showData
//             };
          
//         } catch (error) {
//             console.log("Error in OurTeamController, ourTeam ", error);
//         }
//     },

//     getOurTeam: async function(req,res){
//           try {
//             let start = parseInt(req.query.start);
//             let length = parseInt(req.query.length);
//             let search = req.query.search.value;
    
//             let query = {};
//             if (search != '') {
//               query = { heading: { $regex: '.*' + search + '.*' } };
//             } else {
//               query = { };
//             }
    
//             let ourTeamCount = await Sys.App.Services.OurTeamServices.getOurTeamCount(query);
    
    
//             let data = await Sys.App.Services.OurTeamServices.getOurTeamDatatable(query, length, start);
//             // console.log("data", data);
//             var obj = {
//               'draw': req.query.draw,
//               'recordsTotal': ourTeamCount,
//               'recordsFiltered': ourTeamCount,
//               'data': data
//             };
//               res.send(obj);
//           } catch (e) {
//               console.log("Error in OurTeamController, getOurTeam ",e);
//           }
//     },

//     ourTeamAdd: async function(req, res){
//         try {
//           let ourTeam = await Sys.App.Services.OurTeamServices.getByDataOurTeam({ });
//           console.log('ourTeam', ourTeam);
//               var data = {
//                 App         : req.session.details,
//                 error       : req.flash("error"),
//                 success     : req.flash("success"),
//                 ourTeamActive : 'active',
//                 ourTeam       :  ourTeam,
//             };
//             return res.render('ourTeam/addOurTeam',data);
//         }catch (error) {
//           console.log("Error in OurTeamController, ourTeamAdd",error);
//         }
//       },

    // ourTeamAddPost: async function(req, res){

    //   try {
    //     //start of new code
    //     let image = req.files.ourTeamImage;
    //     console.log("Image", image);
    //     var re = /(?:\.([^.]+))?$/;
    //     var ext3 = re.exec(image.name)[1];
    //     let ourTeamImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
    //     let ourTeamImg = '/ourTeamImage/'+ourTeamImage;
    //     // Use the mv() method to place the file somewhere on your server
    //     await image.mv('./public/ourTeamImage/' + ourTeamImage, async function(err) {
    //         if (err) {
    //             req.flash('error', 'Error Uploading Image');
    //             return res.redirect('ourTeam/addOurTeam');
    //           }
    //     });
    //     //end of newcode
    //     let ourTeam = await Sys.App.Services.OurTeamServices.insertOurTeamData({
    //       name:              req.body.name,
    //       image:             ourTeamImg,
    //       role:              req.body.role,
    //       description:       req.body.description,

    //     });
    //     req.flash('success')
    //     return res.redirect('/backend/addOurTeamData');
    //   } catch (error) {
    //       console.log("Error in OurTeamController ourTeamAddPost",error);
    //   }
    // },

    // ourTeamUpdate: async function(req, res){
    //     try {
    //         let ourTeam = await Sys.App.Services.OurTeamServices.getByDataOurTeam({ _id: req.params.id});
    //         let showData = await Sys.App.Services.OurTeamServices.getByDataOurTeam({});
    //         console.log("data", showData);
    //         var data = {
    //                 App        : req.session.details,
    //                 error      : req.flash("error"),
    //                 success    : req.flash("success"),
    //                 ourTeam       :  ourTeam,
    //                 ourTeamActive : 'active',
    //                 // showData   : showData
    //             };
    //           // console.log("show data", showData);
    //         return res.render('ourTeam/addOurTeam',data);
    //     } catch (error) {
    //         console.log("Error in OurTeamController ourTeamUpdate",error);
    //     }
    //   },
  
//     ourTeamUpdatePost: async function(req, res){
//         try {
//           let ourTeam = await Sys.App.Services.OurTeamServices.getByDataOurTeam({ _id: req.params.id });
//           if(ourTeam){
//                         let updateData = {
//                             name:              req.body.name,
//                             // image:             ourTeamImg,
//                             role:              req.body.role,
//                             description:       req.body.description,
                            
//                         } 
//                         if(req.files){
//                             var re = /(?:\.([^.]+))?$/;
//                             if(req.files.image){
//                                 let image1 = req.files.image;
//                                 var ext1 = re.exec(image1.name)[1];
//                                 let name = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext1;
//                                 updateData.image = '/ourTeamImage/'+name;
//                                 if (fs.existsSync('./public/'+ourTeam.image) && ourTeam.image !='' && req.files && req.files.image) {
//                                     fs.unlink('./public/'+ourTeam.image, function (err) {
//                                         if (err) {
//                                             console.log('admin >> ourTeamImage--1---->>>File not deleted!',err);
//                                         }
//                                     });
//                                 }
//                                 await image1.mv('./public/ourTeamImage/' + name, async function(err) {
//                                     if (err) {
//                                         req.flash('error', 'Error Uploading',err);
//                                         return res.redirect('/backend/addOurTeamData');

//                                     }
//                                 });

//                             }
//                         }
//                 await Sys.App.Services.OurTeamServices.updateOurTeamData({ _id: req.params.id }, updateData)
//                 req.flash('success','Our Team Data update successfully');
//                 res.redirect('/backend/addOurTeamData');
//             } else {
//                 req.flash('error', 'Our Team Data not updated successfully');
//                 res.redirect('/backend/addOurTeamData');
//                 return; 
//                 }   
//           // await Sys.App.Services.UserServices.updateAboutData({ _id: req.params.id },req.body);
//           // res.redirect('/backend/addAboutData')
//         } catch (error) {
//             console.log("Error in OurTeamController ourTeamUpdatePost",error);
//         }
//     },

//     getOurTeamDelete: async function(req,res){
//         try {
//           let ourTeam = await Sys.App.Services.OurTeamServices.getByDataOurTeam({ _id: req.body.id });
//           if ( ourTeam != null ) {
//             await Sys.App.Services.OurTeamServices.deleteOurTeam(req.body.id)
//             return res.send("success");
//           }else {
//             return res.send("error");
//           }
//         } catch (e) {
//             console.log("Error in OurTeamController, getOurTeamDelete",e);
//         }
//       },


// }
