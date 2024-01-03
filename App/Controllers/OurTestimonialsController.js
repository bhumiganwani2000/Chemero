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
                ourTestimonialsActive 	        : 'active'
			};
			return res.render('ourTestimonials/listOurTestimonials',data);
		} catch (e) {
			console.log("Error in OurTestimonialsController in list",e);
		}
	},

    getOurTestimonials: async function(req,res){

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

            let ourTestimonialsCount = await Sys.App.Services.OurTestimonialsServices.getOurTestimonialsCount(query);
            let data = await Sys.App.Services.OurTestimonialsServices.getOurTestimonialsDatatable(query, length, start);
            var obj = {
            	'draw': req.query.draw,
            	'recordsTotal': ourTestimonialsCount,
            	'recordsFiltered': ourTestimonialsCount,
            	'data': data
            };
            res.send(obj);
        } catch (e) {
        	console.log("Error in OurTestimonialsController in getOurTestimonials",e);
        }
    },

    addOurTestimonials: async function(req,res){
        try {
            var data = {
                App 					: req.session.details,
                error 				    : req.flash("error"),
                success				    : req.flash("success"),
                ourTestimonialsActive 	        : 'active'
            };
            return res.render('ourTestimonials/addOurTestimonials',data);
      } catch (e) {
        console.log("Error in OurTestimonialsController in addOurTestimonials",e);
      }
    },

    postOurTestimonials: async function(req, res){

        try {
          //start of new code
          let image = req.files.ourTestimonialsImage;
          console.log("Image", image);
          var re = /(?:\.([^.]+))?$/;
          var ext3 = re.exec(image.name)[1];
          let ourTestimonialsImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
          let ourTestimonialsImg = '/ourTestimonialsImage/'+ourTestimonialsImage;
          // Use the mv() method to place the file somewhere on your server
          await image.mv('./public/ourTestimonialsImage/' + ourTestimonialsImage, async function(err) {
              if (err) {
                  req.flash('Error in OurTestimonialsController in postOurTestimonials', err);
                  return res.redirect('ourTestimonials/addOurTestimonials');
                }
          });
          //end of newcode
          let ourTestimonials = await Sys.App.Services.OurTestimonialsServices.insertOurTestimonialsData({
            name:              req.body.name,
            image:             ourTestimonialsImg,
            company_name:              req.body.company_name,
            designation:       req.body.designation,
            testimonial:           req.body.testimonial,

  
          });
          req.flash('success')
          return res.redirect('/backend/ourTestimonials');
        } catch (error) {
            console.log("Error in OurTestimonialsController in ourTeamAddPost",error);
        }
    },

    ourTestimonialsDelete: async function(req,res){
        try {
            let ourTestimonials = await Sys.App.Services.OurTestimonialsServices.getOurTestimonialsData({_id: req.body.id});
            if (ourTestimonials || ourTestimonials.length >0) {
                await Sys.App.Services.OurTestimonialsServices.updateOurTestimonialsData(
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

    editOurTestimonials: async function(req,res){
        try {
            let ourTestimonials = await Sys.App.Services.OurTestimonialsServices.getOurTestimonialsData({_id: req.params.id});
            return res.render('ourTestimonials/addOurTestimonials',{ourTestimonials: ourTestimonials , ourTestimonialsActive : 'active'});
        } catch (e) {
            console.log("Error in OurTeamController in editOurTeam",e);
        }
 
    },

    editOurTestimonialsPostData: async function(req,res){
        try {
          let ourTestimonials = await Sys.App.Services.OurTestimonialsServices.getOurTestimonialsData({_id: req.params.id});
          if (ourTestimonials) {
						let updateData = {
							name						:	req.body.name,
                            company_name:              req.body.company_name,
                            designation:       req.body.designation,
                            testimonial:           req.body.testimonial,
				    	}
						if (req.files) {
							var re = /(?:\.([^.]+))?$/;
							if (req.files.ourTestimonialsImage) {
								let image1 = req.files.ourTestimonialsImage;
								var ext1 = re.exec(image1.name)[1];
								let name = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext1;
								updateData.image = '/ourTestimonialsImage/'+name;
								if (fs.existsSync('./public/'+ourTestimonials.image) && ourTestimonials.image !='' && req.files && req.files.ourTestimonialsImage) {
									fs.unlink('./public/'+ourTestimonials.image, function (err) {
										if (err) {
											console.log('Error in OurTeamController in editOurTeamPostData',err);
										}
									});
								}
								await image1.mv('./public/ourTestimonialsImage/' + name, async function(err) {
									if (err) {
										req.flash('Error Uploading Profile Avatar', err);
										return res.redirect('/backend/addOurTestimonials');
									}
								});
							}
						}

              await Sys.App.Services.OurTestimonialsServices.updateOurTestimonialsData({ _id: req.params.id },updateData)
              req.flash('success','Our Team updated successfully');
              return res.redirect('/backend/ourTestimonials');

          }else {
            req.flash('error', 'Our Team not update successfully');
            return res.redirect('/backend/ourTestimonials');
          }
        } catch (e) {
            console.log("Error",e);
        }
    },


}
// var Sys = require('../../Boot/Sys');
// const moment = require('moment');
// var fs = require('fs');


// module.exports = {
//     list: async function(req, res) {
//         try {
//             var data = {
//                 App                         :   req.session.details,
//                 error                       :   req.flash('error'),
//                 success                     :   req.flash('success'),
//                 ourTestimonialsActive       :   'active'
//             };
//             return res.render('ourTestimonials/listOurTestimonials', data);
//         } catch (error) {
//             console.log("Error in OurTestimonialsController in list");
//         }
//     },

//     getOurTestimonials: async function(req, res){
//         try {
//             let start = parseInt(req.query.start);
//             let length = parseInt(req.query.length);
//             let search = req.query.search.value;

//             let query = {};
//             if(search != '') {
//                 let capital = search;
//                 query = { name: { $regex: '.*' + search + '.*' }, is_deleted: "0"};
//             } else {
//                 query = { is_deleted: "0"};
//             }

//             let ourTestimonialsCount = await Sys.App.Services.OurTestimonialsServices.getOurTestimonialsCount(query);

//             let data = await Sys.App.Services.OurTestimonialsServices.getOurTestimonialsDatatable(query, length, start);

//             var obj = {
//                 'draw' : req.query.draw,
//                 'recordsTotal'  : ourTestimonialsCount,
//                 'recordsFiltered'   : ourTestimonialsCount,
//                 'data'  : data
//             };
//             res.send(obj);
//         } catch (error) {
//             console.log("Error in OurTestimonialsController in getOurTestimonials");
//         }
//     },

//     addOurTestimonials: async function (req, res) {
//         try {
//             var data = {
//                 App                         :   req.session.details,
//                 error                       :   req.flash('error'),
//                 success                     :   req.flash('success'),
//                 ourTestimonialsActive       :   'active'
//             };
//             return res.render('ourTestimonials/addOurTestimonials', data)
//         } catch (error) {
//             console.log("Error in OurTestimonialsController in addOurTestimonials");
            
//         }
//     },

//     postOurTestimonials: async function(req, res){
//         try {
//             let image = req.files.ourTestimonialsImage;
//             console.log("Image", image);

//             var re = /(?:\.([^.]+))?$/;
//             var ext3 = re.exec(image.name)[1];
//             let ourTestimonialsImage = Date.now() + '_' + Math.floor(Math.random() * 1000) + '.' + ext3;

//             let ourTestimonialsImg = '/ourTestimonialsImage/'+ ourTestimonialsImage;

//             await image.mv('./public/ourTestimonialsImage/' + ourTestimonialsImage, async function(err) {
//                 if (err) {
//                     req.flash("Error in OurTestimonialsController in postOurTestimonials", err);
//                     return res.redirect('ourTestimonials/addOurTestimonials')
//                 }
//             });

//             let ourTestimonials = await Sys.App.Services.OurTestimonialsServices.insertOurTestimonialsData({
//                 client_name     : req.body.client_name,
//                 company_name    : req.body.company_name,
//                 designation     : req.body.designation,
//                 image      : ourTestimonialsImg,
//                 testimonial     : req.body.testimonial,

//             });
//             req.flash('success');
//             return res.redirect('/backend/ourTestimonials');
//         } catch (error) {
//             console.log("Error in OurTestimonialsController in postOurTestimonials", error); 
//         }
//     },

//     ourTestimonialsDelete: async function(req, res) {
//         try {
//             let ourTestimonials = await Sys.App.Services.OurTestimonialsServices.getOurTestimonialsData({_id: req.body.id});
//             if(ourTestimonials || ourTestimonials.length > 0) {
//                 await Sys.App.Services.OurTestimonialsServices.deleteOurTestimonials(
//                     {_id: req.body.id},
//                     {
//                         is_deleted : "1"
//                     })
//                 return res.send("success");
//             } else {
//                 return res.send("Error in OurTestimonialsController in ourTestimonialsDelete");
//             }
//         } catch (error) {
//             console.log("Error in OurTestimonialsController in ourTestimonialsDelete", error); 
//         }
//     },

//     editOurTestimonials: async function(req, res){
//         try {
//             let ourTestimonials = await Sys.App.Services.OurTestimonialsServices.getOurTestimonialsData({_id: req.params.id});
//             return res.render('ourTestimonials/addOurTestimonials',{ ourTestimonials: ourTestimonials, ourTestimonialsActive: 'active'});
//         } catch (error) {
//             console.log("Error in OurTestimonialsController in editOurTestimonials", error); 
            
//         }
//     },

//     editOurTestimonialsPostData: async function(req, res) {
//         try {
//             let ourTestimonials = await Sys.App.Services.OurTestimonialsServices.getOurTestimonialsData({_id: req.params.id});
//             if(ourTestimonials) {
//                 let updataData = {
//                     client_name     : req.body.client_name,
//                     company_name    : req.body.company_name,
//                     designation     : req.body.designation,
//                     testimonial     : req.body.testimonial,
//                 }
//                 if (req.files) {
// 					var re = /(?:\.([^.]+))?$/;
//                     if(req.files.ourTestimonialsImage){
//                         let image1 = req.files.ourTestimonialsImage;
//                         var ext1 = re.exec(image1.name)[1];
//                         let name = Date.now() + '_' + Math.floor(Math.random() * 1000) + '.' + ext1;
//                         updataData.image = '/ourTestimonialsImage/'+name;

//                         if(fs.existsSync('./public/'+ourTestimonials.image) && ourTestimonials.image != '' && req.files && req.fles.ourTestimonialsImage) {
//                             fs.unlink('./public/'+ourTestimonials.image, function(err) {
//                                 if(err) {
//                                     console.log("Error in OurTestimonialsController in editOurTestimonialsPostData", err);
//                                 }
//                             });
//                         }
//                         await image1.mv('./public/ourTestimonialsImage/' +name, async function(err) {
//                             if(err) {
//                                 req.flash('Error uploading Profile Picture', err)
//                                 return res.redirect('/backend/addOurTestimonials');
//                             }
//                         });
//                     } 
//                 } 

//                 await Sys.App.Services.OurTestimonialsServices.updateOurTestimonialsData({_id: req.params.id},
//                 updataData);
//                 req.flash("Success", "Our Testimonials updated successfully");
//                 return res.redirect("/backend/ourTestimonials")
//             } else {
//                 req.flash("Error", 'Our Testimonials not updated successfully');
//                 return res.redirect('/backend/ourTestimonials');
//             }
//         } catch (error) {
//             console.log("Error in OurTestimonialsController in editOurTestimonialsPostData", error); 

//         }
//     }

// }