var Sys = require('../../Boot/Sys');
var bcrypt = require('bcryptjs');

module.exports = {
    users: async function(req,res){
        try {
            var data = {
                    App : req.session.details,
                    error: req.flash("error"),
                    success: req.flash("success"),
                    userActive : 'active'
                };
                return res.render('user/user',data);
        } catch (e) {
            console.log("Error",e);
        }
    },

    getUser: async function(req,res){
      // res.send(req.query.start); return false;
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
            query = { email: { $regex: '.*' + search + '.*' } };
          } else {
            query = { };
          }
          let columns = [
            'id',
            'username',
            'firstname',
            'lastname',
            'email',
            'chips',
            'status',
            'isBot',
          ]

          let playersCount = await Sys.App.Services.UserServices.getUserCount(query);
          //let playersCount = playersC.length;
          let data = await Sys.App.Services.UserServices.getUserDatatable(query, length, start);

          var obj = {
            'draw': req.query.draw,
            'recordsTotal': playersCount,
            'recordsFiltered': playersCount,
            'data': data
          };
                res.send(obj);
        } catch (e) {
            console.log("Error",e);
        }
    },

    addUser: async function(req,res){
        try {
            var data = {
                    App : Sys.Config.App.details,Agent : req.session.details,
                    error: req.flash("error"),
                    success: req.flash("success"),
                    userActive : 'active'
                };
                return res.render('user/add',data);
        } catch (e) {
            console.log("Error",e);
        }
    },

    addUserPostData: async function(req,res){
        try {
          // res.send(req.files.image.name); return;
          let player = await Sys.App.Services.UserServices.getUserData({email: req.body.email});
          if (player && player.length >0) {
            req.flash('error', 'User Already Present');
            res.redirect('/');
            return;
          }else {
            // if (req.files) {
            //   let image = req.files.image;
            //
            //   // Use the mv() method to place the file somewhere on your server
            //   image.mv('/profile/'+req.files.image.name, function(err) {
            //     if (err){
            //       req.flash('error', 'User Already Present');
            //       return res.redirect('/');
            //     }
            //
            //     // res.send('File uploaded!');
            //   });
            // }
            await Sys.App.Services.UserServices.insertUserData(
              {
                name: req.body.username,
                email: req.body.email,
                role: req.body.role,
                status: req.body.status,
                password : bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null)
                // image: req.files.image.name
              }
            )
            req.flash('success','User create successfully');
            res.redirect('/user');
          }
          // req.flash('success', 'Player Registered successfully');
          // res.redirect('/');
        } catch (e) {
            console.log("Error",e);
        }
    },

    getUserDelete: async function(req,res){
        try {
          let player = await Sys.App.Services.UserServices.getUserData({_id: req.body.id});
          if (player || player.length >0) {
            if (player[0].role == 'custom') {
              await Sys.App.Services.UserServices.deleteAccessByUser(req.body.id);
            }
            await Sys.App.Services.UserServices.deleteUser(req.body.id);
            return res.send("success");
          }else {
            return res.send("error");
          }
        } catch (e) {
            console.log("Error",e);
        }
    },

    setAffiliate: async function(req,res){
        try {
          let player = await Sys.App.Services.UserServices.getUserData({_id: req.body.id});
          if (player || player.length >0) {
          }else {
            return res.send("error");
          }
          if ( req.body.action == 'reject' ) {
            // delete affiliate
            await Sys.App.Services.UserServices.deleteUser(req.body.id)
            return res.send("success");
          }else if ( req.body.action == 'accept' ) {
            // make affilaite active
            let adminData = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.session.details.id });
            await Sys.App.Services.UserServices.updateUserData({ _id: req.body.id }, { status: 'active', affiliateCode: adminData.affiliateCode });
            await Sys.App.Services.UserServices.updateUserData({ _id: req.session.details.id }, { affiliateCode: parseInt(parseInt(adminData.affiliateCode) + 1) });
            return res.send("success");
          }else {

          }

        } catch (e) {
            console.log("Error",e);
        }
    },

    editUser: async function(req,res){
      try {
        let user = await Sys.App.Services.UserServices.getSingleUserData({_id: req.params.id});
        var data = {
                    App : Sys.Config.App.details,Agent : req.session.details,
                    error: req.flash("error"),
                    success: req.flash("success"),
                    user: user,
                    userActive : 'active'
                };
        return res.render('user/add',data);
        // res.send(player);
      } catch (e) {
        console.log("Error",e);
      }
    },

    editUserPostData: async function(req,res){
        try {
          let player = await Sys.App.Services.UserServices.getUserData({_id: req.params.id});
          if (player && player.length >0) {

              if (req.files) {
                let image = req.files.image;

                // Use the mv() method to place the file somewhere on your server
                image.mv('/profile/'+req.files.image.name, function(err) {
                  if (err){
                    req.flash('error', 'User Already Present');
                    return res.redirect('/');
                  }

                  // res.send('File uploaded!');
                });
              }
              await Sys.App.Services.UserServices.updateUserData(
                {
                  _id: req.params.id
                  // image: req.files.image.name
                },{
                  name: req.body.username,
                  // email: req.body.email,
                  role: req.body.role,
                  status: req.body.status,
                  // password : bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null)
                  // image: req.files.image.name
                }
              )
              req.flash('success','User update successfully');
              res.redirect('/user');

          }else {
            req.flash('error', 'No User found');
            res.redirect('/');
            return;
          }
          // req.flash('success', 'Player Registered successfully');
          // res.redirect('/');
        } catch (e) {
            console.log("Error",e);
        }
    },

    pendingInstructorsList: async function(req,res){
        try {
          if ( getAccess(req.session.details, 'instructorRequest') == 'false') {
            req.flash('error', 'You do not have access for this this Page');
            return res.redirect('/dashboard');
          }
            var data = {
                    App                 : req.session.details,
                    error               : req.flash("error"),
                    success             : req.flash("success"),
                    pendingInstructors  : 'active'
                };
                return res.render('user/pending-affiliates',data);
        } catch (e) {
            console.log("Error",e);
        }
    },

    getPendingAffiliates: async function(req,res){
      // res.send(req.query.start); return false;
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
            query = { email: { $regex: '.*' + search + '.*' }, role: 'affiliate', status: 'inactive' };
          } else {
            query = { role: 'affiliate', status: 'inactive' };
          }

          let userCount = await Sys.App.Services.UserServices.getUserCount(query);
          let data = await Sys.App.Services.UserServices.getUserDatatable(query, length, start);

          var obj = {
            'draw': req.query.draw,
            'recordsTotal': userCount,
            'recordsFiltered': userCount,
            'data': data
          };
                res.send(obj);
        } catch (e) {
            console.log("Error",e);
        }
    },

    student: async function(req,res){
        try {
          if ( getAccess(req.session.details, 'studentList') == 'false') {
            req.flash('error', 'You do not have access for this this Page');
            return res.redirect('/dashboard');
          }
          getAccess(req.session.details, 'studentList');
            var data = {
                    App :  req.session.details,
                    error: req.flash("error"),
                    success: req.flash("success"),
                    studentListing : 'active'
                };
                return res.render('user/student',data);
        } catch (e) {
            console.log("Error",e);
        }
    },

    getStudent: async function(req,res){
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
            query = { email: { $regex: '.*' + search + '.*' }, role: 'user' };
          } else {
            query = { role: 'user' };
          }


          let playersCount = await Sys.App.Services.UserServices.getUserCount(query);
          //let playersCount = playersC.length;
          let data = await Sys.App.Services.UserServices.getUserDatatable(query, length, start);

          var obj = {
            'draw': req.query.draw,
            'recordsTotal': playersCount,
            'recordsFiltered': playersCount,
            'data': data
          };
                res.send(obj);
        } catch (e) {
            console.log("Error",e);
        }
    },

    affiliate: async function(req,res){
        try {
          if ( getAccess(req.session.details, 'affiliateList') == 'false') {
            req.flash('error', 'You do not have access for this this Page');
            return res.redirect('/dashboard');
          }
            var data = {
                    App : req.session.details,
                    error: req.flash("error"),
                    success: req.flash("success"),
                    affiliateListing : 'active'
                };
                return res.render('user/affiliate',data);
        } catch (e) {
            console.log("Error",e);
        }
    },

    getAffiliate: async function(req,res){
      // res.send(req.query.start); return false;
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
            query = { email: { $regex: '.*' + search + '.*' }, role: 'affiliate', status: 'active' };
          } else {
            query = { role: 'affiliate', status: 'active' };
          }

          let playersCount = await Sys.App.Services.UserServices.getUserCount(query);
          //let playersCount = playersC.length;
          let data = await Sys.App.Services.UserServices.getUserDatatable(query, length, start);

          var obj = {
            'draw': req.query.draw,
            'recordsTotal': playersCount,
            'recordsFiltered': playersCount,
            'data': data
          };
                res.send(obj);
        } catch (e) {
            console.log("Error",e);
        }
    },

    applicationRequest: async function(req,res){
        try {
          if ( getAccess(req.session.details, 'studentApplicationRequest') == 'false') {
            req.flash('error', 'You do not have access for this this Page');
            return res.redirect('/dashboard');
          }
            var data = {
                    App : req.session.details,
                    error: req.flash("error"),
                    success: req.flash("success"),
                    studentApplicationListing : 'active'
                };
                return res.render('application/application',data);
        } catch (e) {
            console.log("Error",e);
        }
    },

    getApplicationRequest: async function(req,res){
      // res.send(req.query.start); return false;
        try {
          let start = parseInt(req.query.start);
          let length = parseInt(req.query.length);
          let search = req.query.search.value;

          let query = {};
          if (search != '') {
            // let capital = search;
            // query = {
              // or: [
                // {'username': { 'like': '%'+search+'%' }},
                // {'username': { 'like': '%'+capital+'%' }}
              //  ]
                // };
            query = { email: { $regex: '.*' + search + '.*' }, firstProcessDone: 'true', secondProcessDone: 'true', fullProcessDone: 'true', adminStatus: 'pending', studentStatus: 'applied', paymentStatus: 'paid' };
          } else {
            query = { firstProcessDone: 'true', secondProcessDone: 'true', fullProcessDone: 'true', adminStatus: 'pending', studentStatus: 'applied', paymentStatus: 'paid' };
          }

          let playersCount = await Sys.App.Services.CourseServices.getPendingApplicationCount(query);
          //let playersCount = playersC.length;
          let data = await Sys.App.Services.CourseServices.getPendingApplicationDatatable(query, length, start);
          console.log("data", data);
          var obj = {
            'draw': req.query.draw,
            'recordsTotal': playersCount,
            'recordsFiltered': playersCount,
            'data': data
          };
                res.send(obj);
        } catch (e) {
            console.log("Error",e);
        }
    },

    courseFeesRequest: async function(req,res){
        try {
          if ( getAccess(req.session.details, 'coursePaymentRequest') == 'false') {
            req.flash('error', 'You do not have access for this this Page');
            return res.redirect('/dashboard');
          }
            var data = {
                    App : req.session.details,
                    error: req.flash("error"),
                    success: req.flash("success"),
                    studentApplicationListing : 'active'
                };
                return res.render('courseFees/courseFees',data);
        } catch (e) {
            console.log("Error",e);
        }
    },

    getCourseFeesRequest: async function(req,res){
      // res.send(req.query.start); return false;
        try {
          let start = parseInt(req.query.start);
          let length = parseInt(req.query.length);
          let search = req.query.search.value;

          let query = {};
          if (search != '') {
            query = { email: { $regex: '.*' + search + '.*' }, status: 'pending' };
          } else {
            query = { status: 'pending' };
          }

          let playersCount = await Sys.App.Services.CourseServices.getPendingCourseApplicationCount(query);
          //let playersCount = playersC.length;
          let data = await Sys.App.Services.CourseServices.getPendingCourseApplicationDatatable(query, length, start);
          // console.log("data", data);
          var obj = {
            'draw': req.query.draw,
            'recordsTotal': playersCount,
            'recordsFiltered': playersCount,
            'data': data
          };
                res.send(obj);
        } catch (e) {
            console.log("Error",e);
        }
    },

    studentDetails: async function(req,res) {
      try {
        // get student incomplete appliction count
        let completedFirstForm  = await Sys.App.Services.CourseServices.getPendingApplicationCount({ userId: req.params.id, firstProcessDone: 'true', fullProcessDone:'false' });
        let completedSecondForm = await Sys.App.Services.CourseServices.getPendingApplicationCount({ userId: req.params.id, secondProcessDone: 'true', fullProcessDone:'false' });
        let completedFullForm   = await Sys.App.Services.CourseServices.getPendingApplicationCount({ userId: req.params.id, fullProcessDone: 'true' });

        // get student associated course
        let studentCourse =  await Sys.App.Services.CourseServices.getApplicationData({ userId: req.params.id, fullProcessDone: "true", adminStatus: "confirmed", studentStatus: "completed" });
        console.log({ userId: req.params.id, fullProcessDone: "true", adminStatus: "confirmed", studentStatus: "completed" });
        let totalAmount = 0;

        let courseFeesData = await Sys.App.Services.CourseServices.getMultipleCourseFeesData({ userId: req.params.id, status: 'paid' });
        for (var i = 0; i < courseFeesData.length; i++) {
          courseFeesData.srno = i+1;
          totalAmount += parseInt(courseFeesData[i].amount)
        }
        let pendingFees = 0;
        if ( studentCourse != null) {
          let courseData = await Sys.App.Services.CourseServices.getCourseData({ _id: studentCourse.courseId });
          pendingFees     = parseInt(courseData.fees) - parseInt(totalAmount);
        }

        var data = {
                App                 : req.session.details,
                error               : req.flash("error"),
                success             : req.flash("success"),
                completedFirstForm  : completedFirstForm,
                completedSecondForm : completedSecondForm,
                completedFullForm   : completedFullForm,
                studentCourse       : (studentCourse != null) ? studentCourse : '',
                totalAmount         : totalAmount,
                courseFeesData      : courseFeesData,
                pendingFees         : pendingFees
            };
            console.log("==========================studentDetails");
            console.log("data", data);
            console.log("==========================studentDetails");
            return res.render('user/studentDetails',data);

      } catch (e) {
          console.log("error in studentDetails", e);
      }
    },

    affiliateStudents: async function (req,res) {
      try {
        var data = {
                App : req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                studentApplicationListing : 'active'
            };
            return res.render('user/affiliateUser',data);
      } catch (e) {
          console.log("Error in affiliateStudents", e);
      }
    },

    getAffiliateUser: async function(req, res) {
    try {
      console.log("=====");
        let start = parseInt(req.query.start);
        let length = parseInt(req.query.length);
        let search = req.query.search.value;

        let query = {};
        if (search != '') {
          let capital = search;
          query = { email: { $regex: '.*' + search + '.*' }, role: 'user', parentAffiliateId: req.params.id };
        } else {
          query = { role: 'user', parentAffiliateId: req.params.id };
        }


        let playersCount = await Sys.App.Services.UserServices.getUserCount(query);
        let data = await Sys.App.Services.UserServices.getUserDatatable(query, length, start);

        var obj = {
          'draw': req.query.draw,
          'recordsTotal': playersCount,
          'recordsFiltered': playersCount,
          'data': data
        };
        console.log("data", data);
        res.send(obj);
    } catch (e) {
        console.log("Error in getAffiliateUser", e);
    }
  },

    blog: async function(req, res){
        try {
          if ( getAccess(req.session.details, 'blog') == 'false') {
            req.flash('error', 'You do not have access for this this Page');
            return res.redirect('/dashboard');
          }
          var data = {
                  App : req.session.details,
                  error: req.flash("error"),
                  success: req.flash("success"),
                  blogActive : 'active'
              };
          return res.render('blog/blog',data);

        } catch (e) {
            console.log("Error in CmsController blog",e);
        }
    },

    getBlog: async function(req,res){
      // res.send(req.query.start); return false;
        try {
          let start = parseInt(req.query.start);
          let length = parseInt(req.query.length);
          let search = req.query.search.value;

          let query = {};
          if (search != '') {
            query = { heading: { $regex: '.*' + search + '.*' } };
          } else {
            query = { };
          }

          let blogCount = await Sys.App.Services.UserServices.getBlogCount(query);
          let data = await Sys.App.Services.UserServices.getBlogDatatable(query, length, start);
          // console.log("data", data);
          var obj = {
            'draw': req.query.draw,
            'recordsTotal': blogCount,
            'recordsFiltered': blogCount,
            'data': data
          };
                res.send(obj);
        } catch (e) {
            console.log("Error",e);
        }
    },

    blogAdd: async function(req, res){
        try {
          // let blog = await Sys.App.Services.UserServices.getByDataBlog({ });

          var data = {
                  App        : req.session.details,
                  error      : req.flash("error"),
                  success    : req.flash("success"),
                  // blog       :  blog,
                  blogActive : 'active'
              };
          return res.render('blog/addBlog',data);
        } catch (error) {
            console.log("Error in CmsController investorsAdd",e);
        }
    },

    blogAddPost: async function(req, res){
        try {
            let blog = await Sys.App.Services.UserServices.insertBlogData(req.body);
            res.redirect('/backend/blog')
        } catch (error) {
            console.log("Error in CmsController investorsAdd",e);
        }
    },

    blogUpdate: async function(req, res){
        try {
            let blog = await Sys.App.Services.UserServices.getByDataBlog({ _id: req.params.id});
            var data = {
                    App        : req.session.details,
                    error      : req.flash("error"),
                    success    : req.flash("success"),
                    blog       :  blog,
                    blogActive : 'active'
                };
            return res.render('blog/addBlog',data);
        } catch (error) {
            console.log("Error in CmsController investorsAdd",e);
        }
    },

    blogUpdatePost: async function(req, res){
        try {
            let blog = await Sys.App.Services.UserServices.updateBlogData({ _id: req.params.id },req.body);
            res.redirect('/backend/blog')
        } catch (error) {
            console.log("Error in CmsController investorsAdd",e);
        }
    },

    getBlogDelete: async function(req,res){
        try {
          let blog = await Sys.App.Services.UserServices.getByDataBlog({ _id: req.body.id });
          if ( blog != null ) {
            await Sys.App.Services.UserServices.deleteBlog(req.body.id)
            return res.send("success");
          }else {
            return res.send("error");
          }
        } catch (e) {
            console.log("Error in getBlogDelete",e);
        }
    },

    roleManagement: async function(req,res){
        try {
          if (req.session.details.role == 'custom') {
            req.flash('error', 'You do not have access for this this Page');
            return res.redirect('/dashboard');
          }
            var data = {
                    App : req.session.details,
                    error: req.flash("error"),
                    success: req.flash("success"),
                    roleManagement : 'active'
                };
                return res.render('user/customUser',data);
        } catch (e) {
            console.log("Error",e);
        }
    },

    getCustomUsers: async function(req,res){
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
            query = { email: { $regex: '.*' + search + '.*' }, role: 'custom' };
          } else {
            query = { role: 'custom' };
          }


          let playersCount = await Sys.App.Services.UserServices.getUserCount(query);
          //let playersCount = playersC.length;
          let data = await Sys.App.Services.UserServices.getUserDatatable(query, length, start);

          var obj = {
            'draw': req.query.draw,
            'recordsTotal': playersCount,
            'recordsFiltered': playersCount,
            'data': data
          };
                res.send(obj);
        } catch (e) {
            console.log("Error",e);
        }
    },

    addCustomUser: async function(req,res){
        try {
            var data = {
                    App : req.session.details,
                    error: req.flash("error"),
                    success: req.flash("success"),
                    userActive : 'active'
                };
                return res.render('user/add',data);
        } catch (e) {
            console.log("Error",e);
        }
    },

    addCustomUserPost: async function(req,res){
        try {
          // res.send(req.files.image.name); return;
          console.log("qqqq", req.body);
          let player = await Sys.App.Services.UserServices.getUserData({mobile: req.body.mobile});
          if (player && player.length >0) {
            console.log("User with Mobile Already Present");
            req.flash('error', 'User with Mobile Already Present');
            return res.redirect('/backend/addCustomUser');
          }else {

            let playerEmail = await Sys.App.Services.UserServices.getUserData({email: req.body.email});
            if (playerEmail && playerEmail.length >0) {
              console.log("User with Email Already Present");
              req.flash('error', 'User with Email Already Present');
              return res.redirect('/backend/addCustomUser');
            }else {
              let customUser = await Sys.App.Services.UserServices.insertUserData(
                {
                  firstName : req.body.firstName,
                  lastName  : req.body.lastName,
                  email     : req.body.email,
                  mobile    : req.body.mobile,
                  role      : 'custom',
                  status    : 'active',
                  password  : bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null)
                }
              )
              await Sys.App.Services.UserServices.createAccess({ userId: customUser._id })
              req.flash('success','User create successfully');
              return res.redirect('/backend/roleManagement');
            }
          }
          // req.flash('success', 'Player Registered successfully');
          // res.redirect('/');
        } catch (e) {
            console.log("Error",e);
        }
    },

    setUserAccess: async function(req,res) {
      try {
        let user = await Sys.App.Services.UserServices.getAccess({ userId: req.params.id });
        var data = {
                App             : req.session.details,
                error           : req.flash("error"),
                success         : req.flash("success"),
                roleManagement  : 'active',
                user            : user
            };
        return res.render('user/customAccess',data);
      } catch (e) {
        console.log("error in setUserAccess", e);
      }
    },

    setUserAccessPost: async function(req,res) {
      try {
        console.log("req.body", req.body);
        await Sys.App.Services.UserServices.updateAccess(
          { userId: req.params.id },
          {
            studentList                 : (req.body.studentList) ? req.body.studentList : 'false',
            affiliateList               : (req.body.affiliateList) ? req.body.affiliateList : 'false',
            courseManagement            : (req.body.courseManagement) ? req.body.courseManagement : 'false',
            instructorRequest           : (req.body.instructorRequest) ? req.body.instructorRequest : 'false',
            studentApplicationRequest   : (req.body.studentApplicationRequest) ? req.body.studentApplicationRequest : 'false',
            coursePaymentRequest        : (req.body.coursePaymentRequest) ? req.body.coursePaymentRequest : 'false',
            blog                        : (req.body.blog) ? req.body.blog : 'false'
          });

        return res.redirect('/backend/setUserAccess/'+req.params.id);
      } catch (e) {
        console.log("Error in setUserAccessPost", e);
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
