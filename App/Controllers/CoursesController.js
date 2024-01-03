var Sys = require('../../Boot/Sys');
var bcrypt = require('bcryptjs');
var fs = require("fs"); //Load the filesystem module
// nodemialer to send email
const nodemailer = require('nodemailer');
// create a defaultTransport using gmail and authentication that are
// stored in the `config.js` file.
var defaultTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: Sys.Config.App.mailer.auth.user,
        pass: Sys.Config.App.mailer.auth.pass
    }
});
module.exports = {
	list: async function(req,res){
		try {
      if ( getAccess(req.session.details, 'courseManagement') == 'false') {
        req.flash('error', 'You do not have access for this this Page');
        return res.redirect('/dashboard');
      }
			var data = {
				App 					: req.session.details,
				error 				: req.flash("error"),
				success				: req.flash("success"),
        courseActive 	: 'active'
			};
			return res.render('courses/list',data);
		} catch (e) {
			console.log("Error",e);
		}
	},

	getCourses: async function(req,res){

		try {
			let start = parseInt(req.query.start);
			let length = parseInt(req.query.length);
			let search = req.query.search.value;

			let query = {};
			if (search != '') {
				let capital = search;
            // query = {
              // or: [
                // {'username': { 'like': '%'+search+'%' }},
                // {'username': { 'like': '%'+capital+'%' }}
              //  ]
                // };
                query = { name: { $regex: '.*' + search + '.*' }, is_deleted: "0" };
            } else {
            	query = { is_deleted: "0" };
            }

            let courseCount = await Sys.App.Services.CourseServices.getCourseCount(query);
            let data = await Sys.App.Services.CourseServices.getCourseDatatable(query, length, start);
            var obj = {
            	'draw': req.query.draw,
            	'recordsTotal': courseCount,
            	'recordsFiltered': courseCount,
            	'data': data
            };
            res.send(obj);
        } catch (e) {
        	console.log("Error",e);
        }
    },

  addCourses: async function(req,res){
  	try {
      if ( getAccess(req.session.details, 'courseManagement') == 'false') {
        req.flash('error', 'You do not have access for this this Page');
        return res.redirect('/dashboard');
      }
  		var data = {
  			App 					: req.session.details,
  			error 				: req.flash("error"),
  			success				: req.flash("success"),
        courseActive 	: 'active'
  		};
  		return res.render('courses/addCourse',data);
    } catch (e) {
      console.log("Error",e);
    }
  },

  postCourse: async function(req,res){
  	try{

			let image = req.files.courseImage;
			var re = /(?:\.([^.]+))?$/;
			var ext3 = re.exec(image.name)[1];
			let courseImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
			let courseImg = '/courseImage/'+courseImage;
			// Use the mv() method to place the file somewhere on your server
			await image.mv('./public/courseImage/' + courseImage, async function(err) {
					if (err) {
							req.flash('error', 'Error Uploading Profile Avatar');
							return res.redirect('/shade');
					}
			});

			await Sys.App.Services.CourseServices.insertCourseData({
				name						:	req.body.name,
				image 					:	courseImg,
				collegeName			:	req.body.collegeName,
				durationYears		:	req.body.years,
				durationMonths	:	req.body.months,
				fees						:	req.body.fees,
				collegeNameText	:	req.body.collegeNameText,
				collegeAbout		:	req.body.collegeAbout,
	    });
	  req.flash('success','Course create successfully');
	  res.redirect("/backend/courses");

  	}catch (e){
  		console.log("Error",e);

  	}
  },

  getCourseDelete: async function(req,res){
  	try {
        let course = await Sys.App.Services.CourseServices.getCourseData({_id: req.body.id});
        if (course || course.length >0) {
          await Sys.App.Services.CourseServices.updateCourseData(
						{ _id: req.body.id},
						{
							is_deleted : "1"
						}
					)
          return res.send("success");
        }else {
          return res.send("error");
        }
      } catch (e) {
          console.log("Error",e);
      }
  },

	updateCourseStatus: async function(req,res){
		try {
			console.log("=======", req.body);
				let course = await Sys.App.Services.CourseServices.getCourseData({_id: req.body.id});
				let status = '';
				if ( req.body.status == 'top' ) {
					status = 'true';
				}else if ( req.body.status == 'normal' ) {
					status = 'false';
				}
				if (course || course.length >0) {
					console.log("status", status);
					await Sys.App.Services.CourseServices.updateCourseData(
						{ _id: req.body.id},
						{
							isTopCourse : status
						}
					)
					return res.send("success");
				}else {
					return res.send("error");
				}
			} catch (e) {
					console.log("Error",e);
			}
	},

  editCourse: async function(req,res){
  	 try {
       if ( getAccess(req.session.details, 'courseManagement') == 'false') {
         req.flash('error', 'You do not have access for this this Page');
         return res.redirect('/dashboard');
       }
       let course = await Sys.App.Services.CourseServices.getCourseData({_id: req.params.id});
       return res.render('courses/addCourse',{course: course , courseActive : 'active'});
    } catch (e) {
      console.log("Error",e);
    }

  },

  editCoursePostData: async function(req,res){
        try {
          let course = await Sys.App.Services.CourseServices.getCourseData({_id: req.params.id});
          if (course) {
						let updateData = {
							name						:	req.body.name,
							collegeName			:	req.body.collegeName,
							durationYears		:	req.body.years,
							durationMonths	:	req.body.months,
							fees						:	req.body.fees,
							collegeNameText	:	req.body.collegeNameText,
							collegeAbout		:	req.body.collegeAbout,
				    	}
						if (req.files) {
							var re = /(?:\.([^.]+))?$/;
							if (req.files.image) {
								let image1 = req.files.image;
								var ext1 = re.exec(image1.name)[1];
								let name = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext1;
								updateData.image = '/courseImage/'+name;
								if (fs.existsSync('./public/'+course.image) && course.image !='' && req.files && req.files.image) {
									fs.unlink('./public/'+course.image, function (err) {
										if (err) {
											console.log('admin >> courseImage--1---->>>File not deleted!',err);
										}
									});
								}
								await image1.mv('./public/courseImage/' + name, async function(err) {
									if (err) {
										req.flash('error', 'Error Uploading Profile Avatar');
										return res.redirect('/shade');
									}
								});
							}
						}

              await Sys.App.Services.CourseServices.updateCourseData(
                { _id: req.params.id },
								updateData
              )
              req.flash('success','Course update successfully');
              res.redirect('/backend/courses');

          }else {
            req.flash('error', 'Course not update successfully');
            res.redirect('/backend/courses');
            return;
          }
          // req.flash('success', 'Player Registered successfully');
          // res.redirect('/');
        } catch (e) {
            console.log("Error",e);
        }
    },

	adminApproveApplication: async function(req,res) {
		try {
			// console.log("======", req.body);
			let status = req.body.name;
			if ( status == 'accept' ) {
				let course = await Sys.App.Services.CourseServices.getApplicationData({_id: req.body.id});
        // console.log("=====================");
        // console.log("course", course);
        // console.log("=====================");
        // return false;
        // let courseUpdated = await Sys.App.Services.CourseServices.updateApplication(
        //   { _id : req.body.id },
        //   {
        //     adminStatus: 'approved'
        // });
        // return res.send("success");
				var mailOptions = {
						to: course.email,
						from: 'Deeksha Education Pvt Ltd',
						subject: 'Deeksha-College Application Approved',
						html		: 'Hello '+course.firstName+',&nbsp;<div>This is a system generated email to inform you that admin has approved the course('+course.courseName+') of College('+course.collegeName+').</div><div><br></div><div>Please Visit to Deeksha for complete the Admission process.</div>'
						// text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
						// 		'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
						// 		'http://' + req.headers.host + '/reset-password/' + token + '\n\n' +
						// 		'If you did not request this, please ignore this email and your password will remain unchanged.\n'
				};
				defaultTransport.sendMail(mailOptions, async function(err) {
						if (!err) {
							defaultTransport.close();
              let courseUpdated = await Sys.App.Services.CourseServices.updateApplication(
      					{ _id : req.body.id },
      					{
      						adminStatus: 'approved'
      				});
							return res.send("success");
						} else {
								console.log(err);
								return res.send("error");
						}
				});
			}else if ( status == 'delete' ) {
				let courseUpdated = await Sys.App.Services.CourseServices.deleteApplication(req.body.id)
				return res.send("success");
			}else {
				return res.send("error");
			}

		} catch (e) {
				console.log("error in adminApproveApplication ", e);
		}
	},

  adminConfirmsPayment: async function (req, res) {
    try {
      console.log("-----");
      let status = req.body.name;
      if (status == 'accept') {
        let courseFeesData = await Sys.App.Services.CourseServices.getCourseFeesData({ _id: req.body.id });

        // update course fees data
        let courseFeesUpdateData = await Sys.App.Services.CourseServices.updateCourseFees(
          { order_id: courseFeesData.order_id },
          {
            status : 'paid'
          }
        );

        let applicationData = await Sys.App.Services.CourseServices.getApplicationData({ _id: courseFeesData.applicationId });
        if ( applicationData && ( applicationData.adminStatus != 'confirmed' || applicationData.studentStatus != 'completed' ) ) {
          // update student application
          await Sys.App.Services.CourseServices.updateApplication(
            { _id: courseFeesData.applicationId },
            {
              adminStatus   : 'confirmed',
              studentStatus : 'completed'
            }
          );
        }

        // set transaction data
        let transactionData = await Sys.App.Services.CourseServices.setTransactionData({
          userId                : courseFeesData._id,
          userName              : courseFeesData.userName,
          courseId              : courseFeesData.courseId,
          courseName            : courseFeesData.courseName,
          collegeName           : courseFeesData.collegeName,
          amount                : courseFeesData.amount,
          status                : 'paid',
          type                  : 'course_fee',
          razorpay_order_id     : courseFeesData.order_id,
        });

        return res.send("success");
      }else if ( status == 'delete') {
        // delete course fees record
        await Sys.App.Services.CourseServices.deleteCourseFees(req.body.id);
        return res.send("success");
      }else {
        return res.send("error");
      }
    } catch (e) {
      console.log("Error in adminConfirmsPayment ", e);
      return res.send("error");
    }
  }

}

function getAccess(session, slug) {
  console.log("req.session.details", session);
  if ( session.access ) {
    return session.access[slug];
  }else {
    return 'true';
  }
}
