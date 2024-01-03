var Sys = require('../../Boot/Sys');
var bcrypt = require('bcryptjs');
var fs = require("fs"); //Load the filesystem module
var jwt = require('jsonwebtoken');
var jwtcofig = {
    'secret': 'KiraJwtAuth'
};
const date = require('date-and-time');

const Razorpay = require('razorpay')
var instance = new Razorpay({
    // key_id: 'rzp_test_U3FPfrQYtumZc4',
    // key_secret: 'ohCUnvgcMwQJ41BkYrk23kY8'

    key_id: 'rzp_live_N9edmzFq0ljDrz',
    key_secret: 'tHsVxh6vmTzXIeXCJdyUJwzh'
})

// nodemialer to send email
const nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: Sys.Config.App.mailer.auth.user,
        pass: Sys.Config.App.mailer.auth.pass
    }
});
// var smtpTransport = nodemailer.createTransport({
//     service: "gmail",
//     host: "smtp.gmail.com",
//     auth: {
//         user: "amazonpricetracker0@gmail.com",
//         pass: "Kfbe75yXwUgfb"
//     }
// });
const moment = require('moment');
module.exports = {

    home: async function (req, res) {
        try {
            let homeData = await Sys.App.Services.HomeServices.getByData({is_deleted:"0"});
            let newsData = await Sys.App.Services.NewsServices.getByData({is_deleted :"0"});
            let productData = await Sys.App.Services.ProductServices.getByData({is_deleted:"0"});
            // let prjectCategoryData = await Sys.App.Services.ProjectCategoryServices.getByData({});
            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({is_deleted: "0"});
            let projectCategoryData = await Sys.App.Services.ProjectCategoryServices.getByData({is_deleted: "0"});
            for (let index = 0; index < projectCategoryData.length; index++) {
                let projectData = await Sys.App.Services.ProjectServices.getByData({ project_id: projectCategoryData[index]._id });
                projectCategoryData[index].project = projectData;
            }
            let singleProductData = await Sys.App.Services.ProductServices.getProductData({ id: req.params.id,is_deleted: "0" });
            let OurTestimonialsData = await Sys.App.Services.OurTestimonialsServices.getByData({is_deleted: "0"});
            let projectData = await Sys.App.Services.ProjectServices.getByData({is_deleted: "0"});
            let caseStudiesData = await Sys.App.Services.CaseStudiesServices.getByData({is_deleted: "0"});
            var product_img;
            if(productData){
                if(productData[0]){
                    if(productData[0].product_image){
                        if(productData[0].product_image[0]){
                            product_img = productData[0].product_image[0].path;
                        }
                    }
                }
            }
            var single_img;
            if(singleProductData){
                if(singleProductData[0]){
                    if(singleProductData[0].product_image){
                        if(singleProductData[0].product_image[0]){
                            single_img = singleProductData[0].product_image[0].path;
                        }
                    }
                }
            }
            // console.log(productData,"product Data");
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                home: 'active',
                productCategoryData: productCategoryData,
                homeData: homeData,
                projectData: projectData,
                projectCategoryData: projectCategoryData,
                productData: productData,
                OurTestimonialsData: OurTestimonialsData,
                newsData: newsData,
                caseStudiesData:caseStudiesData,
                singleProductData:singleProductData,
                product_img:product_img,
                single_img:single_img
            };
            console.log("hhhhhhhhhdhdhdhdhdhdhdhdh================>>>>>>>>>>>>>>>>>>>>>>",data);
            // console.log(productData[0].product_image[0].path, "productDatahome");
            return res.render('frontEnd/index', data);
        } catch (e) {
            console.log("Error home", e);
        }
    },

    aboutus: async function (req, res) {
        try {
            let aboutData = await Sys.App.Services.UserServices.getByDataAbout({is_deleted: "0"});
            let ourTeamData = await Sys.App.Services.OurTeamServices.getByData({is_deleted: "0"});
            let productData = await Sys.App.Services.ProductServices.getByData({is_deleted: "0"});
            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({is_deleted: "0"});
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                about: 'active',
                aboutData: aboutData,
                ourTeamData: ourTeamData,
                productData: productData,
                productCategoryData: productCategoryData
            };
            return res.render('frontEnd/about', data);
        } catch (e) {
            console.log("Error in aboutus", e);
        }
    },

    ourTeam: async function (req, res) {
        try {
            let caseStudiesData = await Sys.App.Services.CaseStudiesServices.getByData({is_deleted: "0"});
            for (let index = 0; index < caseStudiesData.length; index++) {
                var dateData =caseStudiesData[index].createdAt ;
              }
            let dateResult = date.format(dateData,'ddd, MMM DD YYYY');
            let ourTeamData = await Sys.App.Services.OurTeamServices.getByData({ is_deleted: "0"});
            let applicationData = await Sys.App.Services.ApplicationServices.getByData({ is_deleted: "0"});
            let newsData = await Sys.App.Services.NewsServices.getByData({ is_deleted: "0"});
            for (let index = 0; index < newsData.length; index++) {
                var newsdate =newsData[index].createdAt ;
              }
            let date_news = date.format(newsdate,'ddd, MMM DD YYYY');
            let categoryData = await Sys.App.Services.CategoryServices.getByData({ is_deleted: "0"});
            let ourTestimonialsData = await Sys.App.Services.OurTestimonialsServices.getByData({ is_deleted: "0"});
            let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0"});
            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0"});
            let singleCategoryData = await Sys.App.Services.CategoryServices.getCategoryData({ singledata:req.body._id,is_deleted: "0" });
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                ourTeamActive: 'active',
                ourTeamData: ourTeamData,
                applicationData: applicationData,
                newsData: newsData,
                categoryData: categoryData,
                ourTestimonialsData: ourTestimonialsData,
                productData: productData,
                productCategoryData: productCategoryData,
                singleCategoryData:singleCategoryData,
                caseStudiesData:caseStudiesData,
                dateResult:dateResult,
                date_news: date_news,

            };
            // console.log("categoryData is here", categoryData[0]._id);
            // console.log(singleOurTeamData,"singleOurTeamData");
            return res.render('frontEnd/our-team', data);
        } catch (e) {
            console.log("Error in about", e);
        }
    },

    researchDevelopment: async function (req, res) {
        try {
            let researchAndDevelopmentData = await Sys.App.Services.UserServices.getByDataResearchAndDevelopment({is_deleted: "0"});
            let productData = await Sys.App.Services.ProductServices.getByData({is_deleted: "0"});
            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({is_deleted: "0"});
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                researchDevelopment: 'active',
                researchAndDevelopmentData: researchAndDevelopmentData,
                productData: productData,
                productCategoryData: productCategoryData
            };
            console.log("researchAndDevelopmentDatahomeee>>>>",researchAndDevelopmentData);
            return res.render('frontEnd/research-development', data);
        } catch (e) {
            console.log("Error in about", e);
        }
    },

    factorytour: async function (req, res) {
        try {
            let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0" });
            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0" });
            let FactoryTourData = await Sys.App.Services.FactoryTourServices.getByData({is_deleted: "0"});
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                factorytour: 'active',
                FactoryTourData: FactoryTourData,
                productData :productData,
                productCategoryData :productCategoryData
            };
            console.log(data, "factory>>>>>>>>>>>");
            return res.render('frontEnd/factory-tour', data);
        }
        catch (e) {
            console.log("Error in about", e);
        }
    },

    ourTestimonials: async function (req, res) {
        try {
            let ourTestimonialsData = await Sys.App.Services.OurTestimonialsServices.getByData({is_deleted: "0" });
            let applicationData = await Sys.App.Services.ApplicationServices.getByData({is_deleted: "0" });
            let newsData = await Sys.App.Services.NewsServices.getByData({is_deleted: "0" });
            let categoryData = await Sys.App.Services.CategoryServices.getByData({is_deleted: "0" });
            let productData = await Sys.App.Services.ProductServices.getByData({is_deleted: "0" });
            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({is_deleted: "0" });
            let caseStudiesData = await Sys.App.Services.CaseStudiesServices.getByData({is_deleted: "0"});
            for (let index = 0; index < caseStudiesData.length; index++) {
                var dateData =caseStudiesData[index].createdAt ;
              }
            let dateResult = date.format(dateData,'ddd, MMM DD YYYY');
            for (let index = 0; index < newsData.length; index++) {
                var newsdate =newsData[index].createdAt ;
              }
            let date_news = date.format(newsdate,'ddd, MMM DD YYYY');
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                ourTestimonials: 'active',
                ourTestimonialsData: ourTestimonialsData,
                applicationData: applicationData,
                newsData: newsData,
                categoryData: categoryData,
                productData: productData,
                productCategoryData: productCategoryData,
                caseStudiesData:caseStudiesData,
                dateResult:dateResult,
                date_news:date_news,
            };
            console.log("dateResult",dateResult);
            return res.render('frontEnd/our-testimonials', data);
        } catch (e) {
            console.log("Error in about", e);
        }
    },

    products: async function (req, res) {
        try {
            let ourTestimonialsData = await Sys.App.Services.OurTestimonialsServices.getByData({is_deleted: "0" });
            let productData = await Sys.App.Services.ProductServices.getByData({ is_deleted: "0" });
            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0" });
            let singleProductData = await Sys.App.Services.ProductServices.getProductData({_id: req.params.id,is_deleted: "0"})

            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                products: 'active',
                productData: productData,
                productCategoryData: productCategoryData,
                ourTestimonialsData:ourTestimonialsData,
                singleProductData: singleProductData
            };

            console.log("productData", productData);
            console.log("productCategoryData", productCategoryData);

            return res.render('frontEnd/product', data);
        } catch (e) {
            console.log("Error in about", e);
        }
    },

    productDetails: async function (req, res) {
        try {
            let ourTestimonialsData = await Sys.App.Services.OurTestimonialsServices.getByData({is_deleted: "0" });
            let singleProductData = await Sys.App.Services.ProductServices.getProductData({ _id: req.params.id,is_deleted: "0" });
             console.log("SINGLE PRODUCT DATA =========", singleProductData);
            let productData = await Sys.App.Services.ProductServices.getByData({is_deleted: "0"});
            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({ is_deleted: "0" });
            let singleProductCategoryData = await Sys.App.Services.ProductCategoryServices.getProductCategoryData({  _id: singleProductData.product_id,is_deleted: "0" });
            //  console.log("SINGLE PRODUCTCATEGORY DATA?????ourTestimonialsData", singleProductCategoryData);
            var heading;
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                productdetails: 'active',
                singleProductData: singleProductData,
                productCategoryData: productCategoryData,
                productData: productData,
                singleProductCategoryData: singleProductCategoryData.productCategoryName,
                ourTestimonialsData:ourTestimonialsData,
                categoryData :'active',
                heading:singleProductData.workProcess[0].heading,
            };
            console.log(productData,"productData>>>>>");

            return res.render('frontEnd/product', data);
        } catch (error) {
            console.log("error in productDetails", error);
        }
    },

    productCategoryDetails: async function (req, res) {
        try {
            let singleProductData = await Sys.App.Services.ProductServices.getProductData({_id: req.params.id ,is_deleted: "0"});
            // console.log("SINGLE PRODUCT DATA =========", singleProductData);
            let productData = await Sys.App.Services.ProductServices.getByData({is_deleted: "0"});
            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({is_deleted: "0"});
            let singleProductCategoryData = await Sys.App.Services.ProductCategoryServices.getProductCategoryData({singleProductCategoryData: req.body.productCategoryName,is_deleted: "0"});
            console.log("SINGLE PRODUCTCATEGORY DATA?????", singleProductCategoryData);
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                productCategoryDetails: 'active',
                singleProductData: singleProductData,
                productCategoryData: productCategoryData,
                productData: productData,
                singleProductCategoryData: singleProductCategoryData,
            };
            // console.log(is_separateCategory,"is_separateCategory>>>>>");
            return res.render('frontEnd/product-category', data);
        } catch (error) {
            console.log("error in productDetails", error);
        }
    },

    separateproductcategory :async function (req ,res ){
        try {
            let ourTestimonialsData = await Sys.App.Services.OurTestimonialsServices.getByData({is_deleted: "0" });
            let productData = await Sys.App.Services.ProductServices.getByData({is_deleted: "0"});
            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({is_deleted: "0"});
            let singleProductCategoryDetails = await Sys.App.Services.ProductCategoryServices.getProductCategoryData({_id: req.params.id,is_deleted: "0"});
            // console.log("SINGLE PRODUCTCATEGORY DATA separate?????", singleProductCategoryDetails.productCategoryName);
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                productData :productData,
                productCategoryDetails: 'active',
                productCategoryData: productCategoryData,
                singleProductCategoryDetails: singleProductCategoryDetails,
                ourTestimonialsData:ourTestimonialsData
            };
            console.log(singleProductCategoryDetails,"singleProductCategoryDetails>>>>>");
            return res.render('frontEnd/separateproductcategory', data);
        } catch (error) {
            console.log("error in separateproductcategory", error);
        }
    },

    application: async function (req, res) {
        try {
            let categoryData = await Sys.App.Services.CategoryServices.getByData({is_deleted: "0"});
            for (let index = 0; index < categoryData.length; index++) {
                let applicationData = await Sys.App.Services.ApplicationServices.getByData({ category_id: categoryData[index]._id });
                categoryData[index].application = applicationData;
                // console.log("category=======>>",applicationData);
            }
            let applicationData = await Sys.App.Services.ApplicationServices.getByData({is_deleted: "0"});
            for (let index = 0; index < applicationData.length; index++) {
                let application_Data;
                let application_Data1;
                application_Data = await Sys.App.Services.ApplicationServices.getByData({ app_id: applicationData[index]._id });

                application_Data[index].name = application_Data1;
                console.log("applicationDataapplicationData=======>>",application_Data1);
            }
            let singleCategoryData = await Sys.App.Services.CategoryServices.getCategoryData({ singledata:req.params.id });
            console.log("--------------", singleCategoryData);
            let productData = await Sys.App.Services.ProductServices.getByData({is_deleted:"0"});
            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({is_deleted: "0"});
            let ourTestimonialsData = await Sys.App.Services.OurTestimonialsServices.getByData({is_deleted: "0"});
            var app_img;
            if(applicationData){
                if(applicationData[0]){
                    if(applicationData[0].image){
                        if(applicationData[0].image[0]){
                            app_img = applicationData[0].image[0].path;
                        }
                    }
                }
            }
            // console.log("app_img",app_img);
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                application: 'active',
                categoryData: categoryData,
                applicationData: applicationData,
                // singleCategoryData: singleCategoryData,
                // singleApplicationData: singleApplicationData,
                ourTestimonialsData: ourTestimonialsData,
                productCategoryData: productCategoryData,
                productData: productData,
                app_img:app_img

            };
                console.log("===>", applicationData);
            return res.render('frontEnd/application', data);
        } catch (e) {
            console.log("Error in application", e);
        }
    },

    applicationDetails:  async function (req, res) {
        try {
            let singleCategoryData = await Sys.App.Services.CategoryServices.getCategoryData({ _id:req.params.id });
            let categoryData = await Sys.App.Services.CategoryServices.getByData({is_deleted: "0"});
            for (let index = 0; index < categoryData.length; index++) {
                let applicationData = await Sys.App.Services.ApplicationServices.getByData({ category_id: categoryData[index]._id ,is_deleted: "0"});
                categoryData[index].application = applicationData;
            }
            let applicationData = await Sys.App.Services.ApplicationServices.getByData({is_deleted: "0"});
            let singleCasestudyData = await Sys.App.Services.CaseStudiesServices.getCaseStudiesData({ id: req.params.id });
            let getdate = singleCasestudyData.createdAt;
            let dateResult = date.format(getdate,'ddd, MMM DD YYYY');
            console.log("--------------", categoryData);
            let productData = await Sys.App.Services.ProductServices.getByData({});
            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({is_deleted: "0"});
            let ourTestimonialsData = await Sys.App.Services.OurTestimonialsServices.getByData({is_deleted: "0"});
            let caseStudiesData = await Sys.App.Services.CaseStudiesServices.getByData({is_deleted: "0"});
            let singleApplicationData = await Sys.App.Services.ApplicationServices.getApplicationData({ _id: req.params.id ,is_deleted: "0"});
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                application: 'active',
                categoryData: categoryData,
                applicationData: applicationData,
                // singleCategoryData: singleCategoryData,
                singleApplicationData: singleApplicationData,
                ourTestimonialsData: ourTestimonialsData,
                productCategoryData: productCategoryData,
                productData: productData,
                singleCategoryData: singleCategoryData,
                singleCasestudyData:singleCasestudyData,
                dateResult:dateResult,
                caseStudiesData:caseStudiesData
            };

            console.log("applicationdetails===>", singleApplicationData);
            return res.render('frontEnd/application-details', data);
        } catch (e) {
            console.log("Error in application", e);
        }
    },

    newsDetails:  async function (req, res) {
        try {
            console.log("start======");
            let newsData = await Sys.App.Services.NewsServices.getByData({is_deleted :"0"});
            let singleNewsData = await Sys.App.Services.NewsServices.getNewsData({ _id: req.params.id });
            let singleCategoryData = await Sys.App.Services.CategoryServices.getCategoryData({ _id:req.params.id });
            let categoryData = await Sys.App.Services.CategoryServices.getByData({is_deleted: "0"});
            for (let index = 0; index < categoryData.length; index++) {
                let applicationData = await Sys.App.Services.ApplicationServices.getByData({ category_id: categoryData[index]._id ,is_deleted: "0"});
                categoryData[index].application = applicationData;
            }
            let applicationData = await Sys.App.Services.ApplicationServices.getByData({is_deleted: "0"});
            let singleCasestudyData = await Sys.App.Services.CaseStudiesServices.getCaseStudiesData({ id: req.params.id ,is_deleted: "0"});
            let getdate = singleNewsData.createdAt;
            let dateResult = date.format(getdate,'ddd, MMM DD YYYY');
            console.log("--------------", categoryData);
            let productData = await Sys.App.Services.ProductServices.getByData({});
            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({is_deleted: "0"});
            let ourTestimonialsData = await Sys.App.Services.OurTestimonialsServices.getByData({is_deleted: "0"});
            let caseStudiesData = await Sys.App.Services.CaseStudiesServices.getByData({is_deleted: "0"});
            let singleApplicationData = await Sys.App.Services.ApplicationServices.getApplicationData({ _id: req.params.id,is_deleted: "0" });
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                // application: 'active',
                categoryData: categoryData,
                applicationData: applicationData,
                // singleCategoryData: singleCategoryData,
                singleApplicationData: singleApplicationData,
                ourTestimonialsData: ourTestimonialsData,
                productCategoryData: productCategoryData,
                productData: productData,
                singleCategoryData: singleCategoryData,
                singleCasestudyData:singleCasestudyData,
                dateResult:dateResult,
                singleNewsData:singleNewsData,
                caseStudiesData:caseStudiesData,
                newsData:newsData
            };

            console.log("newsdetails===>", singleNewsData);
            return res.render('frontEnd/new-details', data);
        } catch (e) {
            console.log("Error in application", e);
        }
    },

    ourteamDetails:  async function (req, res) {
        try {
            let singleCategoryData = await Sys.App.Services.CategoryServices.getCategoryData({_id: req.params.id,is_deleted: "0"});
            let categoryData = await Sys.App.Services.CategoryServices.getByData({is_deleted: "0"});
            for (let index = 0; index < categoryData.length; index++) {
                let applicationData = await Sys.App.Services.ApplicationServices.getByData({ category_id: categoryData[index]._id ,is_deleted: "0" });
                categoryData[index].application = applicationData;
            }
            let ourTeamData = await Sys.App.Services.OurTeamServices.getByData({ is_deleted: "0"});
            let applicationData = await Sys.App.Services.ApplicationServices.getByData({is_deleted: "0"});
            let singleCasestudyData = await Sys.App.Services.CaseStudiesServices.getCaseStudiesData({ id: req.params.id ,is_deleted: "0"});
            let getdate = singleCasestudyData.createdAt;
            let dateResult = date.format(getdate,'ddd, MMM DD YYYY');
            console.log("--------------", categoryData);
            let productData = await Sys.App.Services.ProductServices.getByData({is_deleted: "0"});
            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({is_deleted: "0"});
            let ourTestimonialsData = await Sys.App.Services.OurTestimonialsServices.getByData({is_deleted: "0"});
            let caseStudiesData = await Sys.App.Services.CaseStudiesServices.getByData({is_deleted: "0"});
            let singleOurTeamData = await Sys.App.Services.OurTeamServices.getOurTeamData({_id: req.params.id, is_deleted: "0"});
            let singleApplicationData = await Sys.App.Services.ApplicationServices.getApplicationData({ _id: req.params.id ,is_deleted: "0"});
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                ourteam: 'active',
                categoryData: categoryData,
                applicationData: applicationData,
                // singleCategoryData: singleCategoryData,
                singleApplicationData: singleApplicationData,
                ourTestimonialsData: ourTestimonialsData,
                productCategoryData: productCategoryData,
                productData: productData,
                singleCategoryData: singleCategoryData,
                singleCasestudyData:singleCasestudyData,
                dateResult:dateResult,
                caseStudiesData:caseStudiesData,
                singleOurTeamData:singleOurTeamData,
                ourTeamData:ourTeamData
            };

            console.log("singleOurTeamData==>", ourTeamData);
            return res.render('frontEnd/ourteamdetails', data);
        } catch (e) {
            console.log("Error in application", e);
        }
    },

    ourTestimonialsDetails:  async function (req, res) {
        try {
            let singleCategoryData = await Sys.App.Services.CategoryServices.getCategoryData({_id: req.params.id,is_deleted: "0"});
            let categoryData = await Sys.App.Services.CategoryServices.getByData({is_deleted: "0"});
            for (let index = 0; index < categoryData.length; index++) {
                let applicationData = await Sys.App.Services.ApplicationServices.getByData({ category_id: categoryData[index]._id ,is_deleted: "0"});
                categoryData[index].application = applicationData;
            }
            let ourTeamData = await Sys.App.Services.OurTeamServices.getByData({ is_deleted: "0"});
            let applicationData = await Sys.App.Services.ApplicationServices.getByData({is_deleted: "0"});
            let singleCasestudyData = await Sys.App.Services.CaseStudiesServices.getCaseStudiesData({ id: req.params.id ,is_deleted: "0"});
            let getdate = singleCasestudyData.createdAt;
            let dateResult = date.format(getdate,'ddd, MMM DD YYYY');
            console.log("--------------", categoryData);
            let productData = await Sys.App.Services.ProductServices.getByData({is_deleted: "0"});
            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({is_deleted: "0"});
            let ourTestimonialsData = await Sys.App.Services.OurTestimonialsServices.getByData({is_deleted: "0"});
            let caseStudiesData = await Sys.App.Services.CaseStudiesServices.getByData({is_deleted: "0"});
            let singleOurTeamData = await Sys.App.Services.OurTeamServices.getOurTeamData({_id: req.params.id,is_deleted: "0"});
            let singleOurTestimonialsData = await Sys.App.Services.OurTestimonialsServices.getOurTestimonialsData({_id: req.params.id,is_deleted: "0"});
            let singleApplicationData = await Sys.App.Services.ApplicationServices.getApplicationData({ _id: req.params.id ,is_deleted: "0"});
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                ourTestimonials: 'active',
                categoryData: categoryData,
                applicationData: applicationData,
                // singleCategoryData: singleCategoryData,
                singleApplicationData: singleApplicationData,
                ourTestimonialsData: ourTestimonialsData,
                productCategoryData: productCategoryData,
                productData: productData,
                singleCategoryData: singleCategoryData,
                singleCasestudyData:singleCasestudyData,
                dateResult:dateResult,
                caseStudiesData:caseStudiesData,
                singleOurTeamData:singleOurTeamData,
                ourTeamData:ourTeamData,
                singleOurTestimonialsData:singleOurTestimonialsData
            };
            console.log("singleOurTeamData==>", singleOurTestimonialsData);
            return res.render('frontEnd/ourtestimonialsdetails', data);
        } catch (e) {
            console.log("Error in application", e);
        }
    },

    caseStudies: async function (req, res) {
        try {
            let applicationData = await Sys.App.Services.ApplicationServices.getByData({is_deleted: "0"});
            let categoryData = await Sys.App.Services.CategoryServices.getByData({is_deleted: "0"});
            let ourTestimonialsData = await Sys.App.Services.OurTestimonialsServices.getByData({is_deleted: "0"});
            let productData = await Sys.App.Services.ProductServices.getByData({is_deleted: "0"});
            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({is_deleted: "0"});
            let caseStudiesData = await Sys.App.Services.CaseStudiesServices.getByData({is_deleted: "0"});
            for (let index = 0; index < caseStudiesData.length; index++) {
               var dateData =caseStudiesData[index].createdAt ;

            }
            // let getdate = caseStudiesData[0].createdAt;
            // let dateResult = date.format(dateData,'ddd, MMM DD YYYY');

            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                caseStudies: 'active',
                applicationData: applicationData,
                categoryData: categoryData,
                ourTestimonialsData: ourTestimonialsData,
                productData: productData,
                productCategoryData: productCategoryData,
                caseStudiesData:caseStudiesData,
                // dateResult:dateResult,
            };
            // console.log("caseStudiesData",dateResult);
            return res.render('frontEnd/case-studies', data);
        } catch (e) {
            console.log("Error in about", e);
        }
    },

    caseStudiesDetails: async function (req, res) {
        try {
            let singleCasestudyData = await Sys.App.Services.CaseStudiesServices.getCaseStudiesData({ _id: req.params.id ,is_deleted: "0"});
            let singleApplicationData = await Sys.App.Services.ApplicationServices.getApplicationData({_id: req.params.id,is_deleted: "0" });
            let applicationData = await Sys.App.Services.ApplicationServices.getByData({is_deleted: "0"});
            let categoryData = await Sys.App.Services.CategoryServices.getByData({is_deleted: "0"});
            let productData = await Sys.App.Services.ProductServices.getByData({is_deleted: "0"});
            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({is_deleted: "0"});
            let ourTestimonialsData = await Sys.App.Services.OurTestimonialsServices.getByData({is_deleted: "0"});
            let caseStudiesData = await Sys.App.Services.CaseStudiesServices.getByData({is_deleted: "0"});
            let getdate = singleCasestudyData.createdAt;
            let dateResult = date.format(getdate,'ddd, MMM DD YYYY');

            console.log("SIngle APplication Data ?????", singleApplicationData);
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                caseStudies: 'active',
                singleApplicationData: singleApplicationData,
                categoryData: categoryData,
                applicationData: applicationData,
                productData: productData,
                productCategoryData: productCategoryData,
                ourTestimonialsData: ourTestimonialsData,
                caseStudiesData :caseStudiesData,
                singleCasestudyData:singleCasestudyData,
                dateResult:dateResult,

            };
            console.log(caseStudiesData,"caseStudiesData================>>>>>>>>>>>>");
            return res.render('frontEnd/case-studies-details', data);
        } catch (error) {
            console.log("error in caseStudiesDetails", error);
        }
    },

    project: async function (req, res) {
        try {
            let projectCategoryData = await Sys.App.Services.ProjectCategoryServices.getByData({is_deleted: "0"});
            for (let index = 0; index < projectCategoryData.length; index++) {
                let projectData = await Sys.App.Services.ProjectServices.getByData({ project_id: projectCategoryData[index]._id ,is_deleted: "0"});
                projectCategoryData[index].project = projectData;

            }
            let projectData = await Sys.App.Services.ProjectServices.getByData({is_deleted: "0" });
            let productData = await Sys.App.Services.ProductServices.getByData({is_deleted: "0" });
            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({is_deleted: "0"});
            // let singleProjectData = await Sys.App.Services.ProjectServices.getProjectData({_id: req.params.id});
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                projectdetails: 'active',
                projectCategoryData: projectCategoryData,
                projectData: projectData,
                productCategoryData: productCategoryData,
                productData: productData,
                // singleProjectData   : singleProjectData
            };
            console.log("===>", data);

            return res.render('frontEnd/projects', data);
        } catch (e) {
            console.log("Error in about", e);
        }
    },

    details: async function (req, res) {
        try {
            let singleProjectData = await Sys.App.Services.ProjectServices.getProjectData({ _id: req.params.id });
            console.log("SIINNNNNNNNNNNNGLE", singleProjectData);
            let projectData = await Sys.App.Services.ProjectServices.getByData({is_deleted: "0"});
            let projectCategoryData = await Sys.App.Services.ProjectCategoryServices.getByData({is_deleted: "0"});
            let singleProjectCategoryData = await Sys.App.Services.ProjectCategoryServices.getProjectCategoryData({ single:req.body._id,is_deleted: "0"});
            let productData = await Sys.App.Services.ProductServices.getByData({is_deleted: "0"});
            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({is_deleted: "0"});
            let getdate = singleProjectData.createdAt;
            let dateResult = date.format(getdate,'ddd, MMM DD YYYY');
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                product: 'active',
                singleProjectData: singleProjectData,
                projectData: projectData,
                projectCategoryData: projectCategoryData,
                singleProjectCategoryData: singleProjectCategoryData,
                productCategoryData: productCategoryData,
                productData: productData,
                dateResult:dateResult,

            };
            // console.log("singleProjectCategoryData>>>>>>>",singleProjectCategoryData);
            return res.render('frontEnd/details', data);
        } catch (error) {
            console.log("error in HomeController in details", error);
        }
    },

    contact: async function (req, res) {
        try {
            let profileTypeData = await Sys.App.Services.ProfileTypeServices.getByData({is_deleted: "0"});
            let regionData = await Sys.App.Services.RegionServices.getByData({is_deleted: "0"});
            let regionsingleData = await Sys.App.Services.RegionServices.getRegionData({is_deleted: "0"});
            let productData = await Sys.App.Services.ProductServices.getByData({is_deleted: "0"});
            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({is_deleted: "0"});
            // let singleRegionData = await Sys.App.Services.RegionServices.getRegionData({ });
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                contact: 'active',
                regionData: regionData,
                regionsingleData: regionsingleData,
                productCategoryData: productCategoryData,
                productData: productData,
                profileTypeData: profileTypeData,
                // singleRegionData: singleRegionData

            };
            console.log("profileTypeData is here>>>>>>>>>>>>>>>>>>>>>>>>>>", profileTypeData);
            return res.render('frontEnd/contact', data);
        } catch (e) {
            console.log("Error in about", e);
        }
    },

    formData: async function (req, res) {
        try {
            // res.sendfile(__dirname)
            res.sendfile('C:/Users/admin/Desktop/Alfa Pumps/Alfa Pumps/App/Views/frontEnd/contact.html')
        } catch (error) {
            console.log("Error in HomeController in fromData", error);
        }
    },

    postFormData: async function (req, res) {
        try {
            console.log(req.body);
            const mailOptions = {
                from: req.body.customerEmail,
                to: 'amazonpricetracker0@gmail.com',
                subject: req.body.customerSubject,
                text: `You've got new Enquiry for ${req.body.customerSubject} \nFrom: ${req.body.customerName} \nCustomer's Email: ${req.body.customerEmail} \nCustomer's Phone: ${req.body.customerPhone} \nDescription: ${req.body.customerMessage}`
            }

            defaultTransport.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("Error in Homecontroller in postFormData", error);
                } else {
                    console.log("EMail sent: " + info.response);
                    if (info.response) {
                        return res.redirect('frontEnd/contact')
                    }
                }
            })


        } catch (error) {
            console.log("Error in HomeController in getForm Data", error);
        }
    },

    shop: async function (req, res) {
        try {
            let homeData = await Sys.App.Services.HomeServices.getByData({is_deleted:"0"});
            let newsData = await Sys.App.Services.NewsServices.getByData({is_deleted :"0"});
            let productData = await Sys.App.Services.ProductServices.getByData({is_deleted:"0"});
            // let prjectCategoryData = await Sys.App.Services.ProjectCategoryServices.getByData({});
            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({is_deleted: "0"});
            let projectCategoryData = await Sys.App.Services.ProjectCategoryServices.getByData({is_deleted: "0"});
            for (let index = 0; index < projectCategoryData.length; index++) {
                let projectData = await Sys.App.Services.ProjectServices.getByData({ project_id: projectCategoryData[index]._id });
                projectCategoryData[index].project = projectData;
            }
            let OurTestimonialsData = await Sys.App.Services.OurTestimonialsServices.getByData({is_deleted: "0"});
            let projectData = await Sys.App.Services.ProjectServices.getByData({is_deleted: "0"});
            let caseStudiesData = await Sys.App.Services.CaseStudiesServices.getByData({is_deleted: "0"});
            let aboutData = await Sys.App.Services.UserServices.getByDataAbout({is_deleted: "0"});
            let ourTeamData = await Sys.App.Services.OurTeamServices.getByData({is_deleted: "0"});
            var data = {
                App: Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                shop: 'active',
                aboutData: aboutData,
                ourTeamData: ourTeamData,
                productData: productData,
                productCategoryData:productCategoryData,
                OurTestimonialsData:OurTestimonialsData,
                projectData:projectData,
                projectCategoryData:projectCategoryData,
                caseStudiesData:caseStudiesData,
                homeData:homeData,
                newsData:newsData,

            };
            return res.render('frontEnd/shop', data);
        } catch (e) {
            console.log("Error in shop", e);
        }
    },

}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function create_Id() {
    var dt = new Date().getTime();
    var uuid = 'xxyxyxxyxyxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}
