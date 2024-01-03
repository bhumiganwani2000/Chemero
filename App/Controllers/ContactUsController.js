var Sys = require('../../Boot/Sys');
const moment = require('moment');
var fs = require("fs");
var mongoose = require('mongoose');

const nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: Sys.Config.App.mailer.auth.user,
        pass: Sys.Config.App.mailer.auth.pass
    }
});


module.exports = {


    // list: async function(req,res){
    // 	try {

    // 		var data = {
    // 			App 					: req.session.details,
    // 			error 				    : req.flash("error"),
    // 			success				    : req.flash("success"),
    //             applicationActive 	        : 'active',

    // 		};
    //         // console.log("Datat", data);
    // 		return res.render('home/listHome',data);
    // 	} catch (e) {
    // 		console.log("Error in ApplicationController in list",e);
    // 	}
    // },
    //For Frontend
    // getSingleApplicationData: async function(req,res){

    // 	try {
    //         let data = await Sys.App.Services.HomeServices.getByData({ });
    //         var sobj = {
    //         	'data': data
    //         };
    //        console.log("obj??????",sobj);
    //        return res.send(sobj);
    //     } catch (e) {
    //     	console.log("Error in ApplicationController in getSingleApplicationData",e);
    //     }
    // },



    //End of Frontend

    // getApplication: async function(req,res){

    // 	try {
    // 		let start = parseInt(req.query.start);
    // 		let length = parseInt(req.query.length);
    // 		let search = req.query.search.value;

    // 		let query = {};
    // 		if (search != '') {
    // 			let capital = search;
    //             query = { name: { $regex: '.*' + search + '.*' }, is_deleted: "0" };
    //         } else {
    //         	query = { is_deleted: "0" };
    //         }

    //         let applicationCount = await Sys.App.Services.GetquoteServices.getHomeCount(query);
    //         let data = await Sys.App.Services.GetquoteServices.getHomeDatatable(query, length, start);
    //         // let categoryname = await Sys.App.Services.CategoryServices.getCategoryDatatable();
    //         var obj = {
    //         	'draw': req.query.draw,
    //         	'recordsTotal': applicationCount,
    //         	'recordsFiltered': applicationCount,
    //         	'data': data,
    //             // 'categoryname': categoryname
    //         };
    //         console.log('data', obj);
    //         // console.log("categrrrrrrrydata", categoryname);
    //         res.send(obj);
    //     } catch (e) {
    //     	console.log("Error in ApplicationController in getApplication",e);
    //     }
    // },

    // addApplication: async function(req,res){
    //     try {
    //         let categoryData = await Sys.App.Services.GetquoteServices.getByData({  }); 

    //         var data = {
    //             App 					: req.session.details,
    //             error 				    : req.flash("error"),
    //             success				    : req.flash("success"),
    //             applicationActive 	        : 'active',
    //             categoryData            : categoryData
    //         };
    //         return res.render('home/addHome',data);
    //   } catch (e) {
    //     console.log("Error in GetQuote ",e);
    //   }
    // },

    postApplication: async function (req, res) {
        console.log("contactus controller", req.body);
        try {
            console.log("try block start");
            console.log(req.files, "pdf>>>>>>>>>");
            let pdffiles = req.files;                  

            var pdfs = [];
            var institutepdfs = [];
            var interpdfs = [];

            var re = /(?:\.([^.]+))?$/;
            if(req.files){
                if (req.files != null || req.files.uploadcv || req.files.uploadcv != undefined || req.files.uploadcv != null) {
                    console.log("hiii if is here >>>");
                    let product_pdf = req.files.uploadcv;
                    var ext3 = re.exec(product_pdf.name)[1];

                    var productPdf = Date.now() + '_' + Math.floor(Math.random() * 1000) + '.' + ext3;
                    console.log("productPdf[[]]", productPdf);

                    var productFile = '/contact_pdf/' + productPdf;
                    console.log("PRODUCT FILE inside for loop ", productFile);

                    let pathpdf = './public/teamalfa_pdf/';
                    await product_pdf.mv(pathpdf + productPdf, async function (err) {
                        if (err) {
                            req.flash('Error in contactcontroller in postProduct', err);
                            return res.redirect('product/addProduct');
                        }
                    });
                    pdfs.push({ path: '/teamalfa_pdf/' + productPdf, fileName: req.files.uploadcv.name, _id: new mongoose.Types.ObjectId(), is_deleted: "0" })
                    console.log("Single file",);
                }
                else if(req.files != null || req.files.attachpdfoption || req.files.attachpdfoption != undefined || req.files.attachpdfoption != null ){
                    let institute_pdfs = req.files.attachpdfoption;    
                    var ext4 = re.exec(institute_pdfs.name)[1];

                        var institutePdf = Date.now() + '_' + Math.floor(Math.random() * 1000) + '.' + ext4;
                        console.log("institutePdf[[]]", institutePdf);

                        var instituteFile = '/institute_pdf/' + institutePdf;
                        console.log("INSTITUTE FILE inside for loop ", instituteFile);

                        await institute_pdfs.mv('./public/institute_pdf/' + institutePdf, async function (err) {

                            if (err) {
                                req.flash('Error in contactcontroller in postProduct', err);
                                return res.redirect('/contact');
                            }
                        });
                        institutepdfs.push({ path: '/institute_pdf/' + institutePdf, fileName: req.files.attachpdfoption.name, _id: new mongoose.Types.ObjectId(), is_deleted: "0" })
                        console.log("Mutiple file");
                }
                else if(req.body.files.uploadcvoption || req.body.files.uploadcvoption != undefined || req.body.files.uploadcvoption !=null ){   
                                
                let inter_pdfs = req.files.uploadcvoption;
                var ext1 = re.exec(inter_pdfs.name)[1];                

                var interPdf = Date.now() + '_' + Math.floor(Math.random() * 1000) + '.' + ext1;
                console.log("interPdf[[]]", interPdf);              

                var interFile = '/teamalfa_pdf/' + interPdf;
                console.log("INTER FILE inside for loop ", interFile);         
             
                await inter_pdfs.mv('./public/institute_pdf/' + interPdf, async function (err) {

                    if (err) {
                        req.flash('Error in contactcontroller in postProduct', err);
                        return res.redirect('/contact');
                    }
                });
                interpdfs.push({ path: '/intern_pdf/' + interPdf, fileName: req.files.uploadcvoption.name, _id: new mongoose.Types.ObjectId(), is_deleted: "0" })
                console.log("Mutiple file");
                    }
                }
            let application = await Sys.App.Services.ContactUsServies.insertHomeData({
                name: req.body.name,
                email: req.body.email,
                profiletype: req.body.profiletype,
                phone: req.body.phone,
                company_name: req.body.companyname,
                item_name: req.body.Itemname,
                type_of_industry: req.body.TypeofIndustry,
                type_of_contract: req.body.Typeofcontract,
                name_of_product_and_area: req.body.Nameofproductandarea,
                about_institute: req.body.AboutInstitute,
                attach_pdf: institutepdfs,
                select_position: req.body.Selectposition,
                upload_cv: pdfs,
                institute: req.body.Institute,
                degree: req.body.Degree,
                semester: req.body.Semester,
                time_period: req.body.Timeperiod,
                notes: req.body.Notes,
                upload_cv_option: interpdfs,
                // message:req.body.message,

            });
            var mailOptions = {
                from: 'bansipatel7395@gmail.com',
                to: 'bansipatel7395@gmail.com',
                subject: "Contact Us From AlfaPumps",
                text: ` Hello ${req.body.name},Thank You So much for reaching out! Just Confirming that we've received your Message and will be in touch within few hours with a more complete response.`,
                html: `<html>
        <head>
        <style>
        
        </style>
        </head>
        <body>
            <div>
            <p>Name:    ${req.body.name}</p><br>
            <p>Email:   ${req.body.email}</p><br>
            <p>Profiletype:    ${req.body.profiletype}</p><br>
            <p>Phone:    ${req.body.phone}</p><br>
            <p>CompanyName:    ${req.body.companyname}</p><br>
                              
            </div> 
       
        
        </body>
        </html>`


            }
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    //Handle error here
                    // res.send('Please try again!');
                } else {
                    console.log('Email sent: ' + info.response);

                }
            });
            console.log("saved data");
            //   return;
            // console.log("contactus>>>>>>>>>>>>",application,);
            //  req.flash('success',"Mail Sent Successfully");
            return res.redirect('/contact');

        } catch (error) {
            console.log("Error in ContactUsController in postApplication", error);
        }
    },


    // applicationDelete: async function(req,res){
    //     try {
    //         let application = await Sys.App.Services.GetquoteServices.getHomeData({_id: req.body.id});
    //         if (application || application.length >0) {
    //             await Sys.App.Services.HomeServices.deleteHome(
    //                             { _id: req.body.id},
    //                             {
    //                                 is_deleted : "1"
    //                             }
    //                         )
    //             return res.send("success");
    //         }else {
    //             return res.send("error in HomeController in applicationDelete");
    //         }
    //     } catch (e) {
    //         console.log("Erro in HomeController in applicationDelete",e);
    //     }
    // },

    // editApplication: async function(req,res){
    //     try {
    //         // let categoryData = await Sys.App.Services.CategoryServices.getByData({  }); 
    //         let application = await Sys.App.Services.GetquoteServices.getHomeData({
    //             _id: req.params.id
    //         });
    //         return res.render('home/addHome',{application: application , applicationActive : 'active' });
    //     } catch (e) {
    //         console.log("Error in HomeController in editApplication",e);
    //     }

    // },

    // editApplicationPostData: async function(req,res){
    //     try {

    //       // let category = await Sys.App.Services.CategoryServices.getCategoryData({_id: req.body.categoryName})
    //       let application = await Sys.App.Services.GetquoteServices.getHomeData({_id: req.params.id});
    //       if (application) {
    // 					let updateData; 
    //                     let imageName='';
    // 					if (req.files) {
    // 						var re = /(?:\.([^.]+))?$/;
    // 						if (req.files.applicationImage) {
    // 							let image1 = req.files.applicationImage;
    // 							var ext1 = re.exec(image1.name)[1];
    // 							let name = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext1;

    // 							imageName = '/homeImage/'+name;
    // 							if (fs.existsSync('./public/'+application.image) && application.image !='' && req.files && req.files.applicationImage) {
    // 								fs.unlink('./public/'+application.image, function (err) {
    // 									if (err) {
    // 										console.log('Error in HomeController in editOurTeamPostData',err);
    // 									}
    // 								});
    // 							}
    // 							await image1.mv('./public/homeImage/' + name, async function(err) {
    // 								if (err) {
    // 									req.flash('Error Uploading Profile Avatar', err);
    // 									return res.redirect('/backend/addHome');
    // 								}
    // 							});

    // 						}
    //                         let type='video';
    //                         if (ext1 != 'mp4'){
    //                             type ='image'
    //                         }
    //                         updateData = {
    //                             title        :req.body.title,
    //                             headtext	 :req.body.name,
    //                             description  :req.body.description,
    //                             type         :type,
    //                             file        :imageName
    //                             // category_id                 :   category._id,
    //                         }
    // 					}

    //           await Sys.App.Services.GetquoteServices.updateHomeData({ _id: req.params.id },updateData)
    //           req.flash('success','Home updated successfully');
    //           return res.redirect('/backend/home');

    //       }else {
    //         req.flash('error', 'Home not update successfully');
    //         return res.redirect('/backend/home');
    //       }
    //     } catch (e) {
    //         console.log("Error",e);
    //     }
    // },


}





















































