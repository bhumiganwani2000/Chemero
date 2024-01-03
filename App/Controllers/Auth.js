var Sys = require('../../Boot/Sys');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var jwtcofig = {
    'secret': 'KiraJwtAuth'
};
// nodemialer to send email
const nodemailer = require('nodemailer');
const moment = require('moment');
// create a defaultTransport using gmail and authentication that are
// stored in the `config.js` file.
var defaultTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: Sys.Config.App.mailer.auth.user,
        pass: Sys.Config.App.mailer.auth.pass
    }
});
const numeral = require('numeral');
module.exports = {

    login: async function(req, res) {
        try {
          console.log("0909090909");
            var data = {
                App: Sys.Config.App.details,
                Agent: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
            };
            let isDefaultUser = null;
            isDefaultUser = await Sys.App.Services.UserServices.getUserData({});
            // console.log("isDefaultUser", isDefaultUser);
            if (isDefaultUser == null || isDefaultUser.length == 0) {
                let insertedUser = await Sys.App.Services.UserServices.insertUserData({
                    name          : Sys.Config.App.defaultUserLogin.name,
                    email         : Sys.Config.App.defaultUserLogin.email,
                    password      : bcrypt.hashSync(Sys.Config.App.defaultUserLogin.password, bcrypt.genSaltSync(8), null),
                    role          : Sys.Config.App.defaultUserLogin.role,
                    avatar        : Sys.Config.App.defaultUserLogin.avatar,
                    mobile        : '0000000000',
                    affiliateCode : '100'
                });
            }
            return res.render('login', data);
        } catch (e) {
            console.log("Error in login", e);
            return new Error(e);
        }
    },

    register: async function(req, res) {
        try {
            var data = {
                App: Sys.Config.App.details,
                Agent: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
            };
            return res.render('register', data);
        } catch (e) {
            console.log("Error in register :", e);
            return new Error(e);
        }
    },

    postLogin: async function(req, res) {
        try {
            // res.send(req.body); return;
            console.log("req.body.email->", req.body.email);


            let player = null;
            player = await Sys.App.Services.UserServices.getUserData({ email: req.body.email });
            if (player == null || player.length == 0) {
                req.flash('error', 'No Such User Found');
                return res.redirect('/backend');
            }
            var passwordTrue;
            if (bcrypt.compareSync(req.body.password, player[0].password)) {
                passwordTrue = true;
            } else {
                passwordTrue = false;
            }
            if (passwordTrue == true) {
                console.log("Users->", Sys.App.Services.UserServices);
                // let User = await Sys.App.Services.UserServices.getByData({email:req.body.email});

                // set jwt token
                var token = jwt.sign({ id: player[0].id }, jwtcofig.secret, {
                    expiresIn: 60 * 60 * 24 // expires in 24 hours
                });

                //console.log("Token",token);
                // User Authenticate Success
                req.session.login = true;
                req.session.details = {
                    id: player[0].id,
                    name: player[0].name,
                    jwt_token: token,
                    avatar: 'user.png',
                    is_admin: 'yes',
                    role: player[0].role,
                    // chips: player[0].chips,
                };
                if ( player[0].role == 'custom' ) {
                  req.session.details.access = await Sys.App.Services.UserServices.getAccess({ userId: player[0].id });

                }
                if (player[0].avatar) {
                    req.session.details.avatar = player[0].avatar;
                }
                req.flash('success', 'Welcome To Admin Panel');
                return res.redirect('/dashboard');
            } else {
                req.flash('error', 'Invalid Credentials');
                return res.redirect('/dashboard');
            }
            /* if(req.body.email == 'rummy@aistechnolabs.com'){
            }else{
              req.flash('error', 'Invalid Credentials ');
              res.redirect('/');
            } */

            /* var data = {
              App : Sys.Config.App.details
            };
            return res.render('login.html',data); */

        } catch (e) {
            console.log("Error in postLogin :", e);
            return new Error(e);
        }
    },

    forgotPassword: async function(req, res) {
        try {
            var data = {
                App: Sys.Config.App.details,
                Agent: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
            };

            return res.render('forgot-password', data);
        } catch (e) {
            console.log("Error in forgotPassword :", e);
            return new Error(e);
        }
    },

    logout: async function(req, res) {
        console.log("Logout");
        try {
            req.session.destroy(function(err) {
                req.logout();
                return res.redirect('/backend');
            });
        } catch (e) {
            console.log("Error in logout :", e);
            return new Error(e);
        }
    },

    profile: async function(req, res) {
        console.log("session details id----------->", req.session.details.id);
        try {
            user = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.session.details.id });
            var data = {
                App: Sys.Config.App.details,
                Agent: req.session.details,
                error: req.flash("error"),
                success: req.flash("success"),
                user: user
            };
            return res.render('profile', data);
        } catch (e) {
            console.log("Error in profile : ", e);
            return new Error(e);
        }
    },

    profileUpdate: async function(req, res) {
        try {
            let user = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.body.id });
            if (user) {
                await Sys.App.Services.UserServices.updateUserData({
                    _id: req.body.id
                }, {
                    email: req.body.email,
                    name: req.body.name
                });
                req.flash('success', 'Profile Updated Successfully');
                res.redirect('/profile');
            } else {
                req.flash('error', 'Error in Profile Update');
                return res.redirect('/profile');
            }
        } catch (e) {
            console.log("Error in profileUpdate :", e);
            return new Error(e);
        }
    },

    changePassword: async function(req, res) {
        try {
            let user = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.body.id });
            if (user) {
                await Sys.App.Services.UserServices.updateUserData({
                    _id: req.body.id
                }, {
                    password: bcrypt.hashSync(req.body.pass_confirmation, bcrypt.genSaltSync(8), null)
                });
                req.flash('success', 'Password update successfully');
                res.redirect('/profile');
            } else {
                req.flash('error', 'Password not update successfully');
                return res.redirect('/profile');
            }
        } catch (e) {
            console.log("Error in ChangePassword :", e);
            return new Error(e);
        }
    },

    changeAvatar: async function(req, res) {
        try {
            if (req.files) {
                let image = req.files.avatar;
                console.log(image);
                var re = /(?:\.([^.]+))?$/;
                var ext = re.exec(image.name)[1];
                let fileName = Date.now() + '.' + ext;
                // Use the mv() method to place the file somewhere on your server
                image.mv('./public/profile/' + fileName, async function(err) {
                    if (err) {
                        req.flash('error', 'Error Uploading Profile Avatar');
                        return res.redirect('/profile');
                    }

                    let user = await Sys.App.Services.UserServices.getSingleUserData({ _id: req.body.id });
                    if (user) {
                        await Sys.App.Services.UserServices.updateUserData({
                            _id: req.body.id
                        }, {
                            avatar: fileName
                        });
                        req.session.details.avatar = fileName;

                        req.flash('success', 'Profile Avatar Updated Successfully');
                        res.redirect('/profile');
                    } else {
                        req.flash('error', 'Error in Profile Avatar Update');
                        return res.redirect('/profile');
                    }
                });
            } else {
                req.flash('success', 'Profile Avatar Updated Successfully');
                res.redirect('/profile');
            }
        } catch (e) {
            console.log("Error in changeAvatar : ", e);
            return new Error(e);
        }
    }
}
