'use strict';

var express = require('express'),
    router = express.Router();
var Sys = require('../../Boot/Sys');


router.use(express.json())


// Load Controllers
//var mycont = require('../controllers/mycontroller');



router.get('/', Sys.App.Controllers.HomeController.home);
router.get('/aboutus', Sys.App.Controllers.HomeController.aboutus);
router.get('/factory-tour', Sys.App.Controllers.HomeController.factorytour);
router.get('/ourTeam', Sys.App.Controllers.HomeController.ourTeam);
router.get('/ourteamdetails/:id', Sys.App.Controllers.HomeController.ourteamDetails);
router.get('/ourTestimonialsDetails/:id', Sys.App.Controllers.HomeController.ourTestimonialsDetails);
router.get('/ourTeam/category/:id', Sys.App.Controllers.HomeController.applicationDetails);
router.get('/download', Sys.App.Controllers.OurTeamController.downloadPresentation);
router.get('/researchDevelopment', Sys.App.Controllers.HomeController.researchDevelopment);
router.get('/ourTestimonials', Sys.App.Controllers.HomeController.ourTestimonials);


router.get('/products', Sys.App.Controllers.HomeController.products);
router.get('/productDetails/:id', Sys.App.Controllers.HomeController.productDetails);
router.get('/productCategoryDetails/:id', Sys.App.Controllers.HomeController.productCategoryDetails);
router.get('/separateproductcategory/:id', Sys.App.Controllers.HomeController.separateproductcategory);



router.get('/application', Sys.App.Controllers.HomeController.application);
router.get('/caseStudies', Sys.App.Controllers.HomeController.caseStudies);
router.get('/news-details/:id', Sys.App.Controllers.HomeController.newsDetails);
router.get('/application-details/:id', Sys.App.Controllers.HomeController.applicationDetails);
router.get('/caseStudiesDetails/:id', Sys.App.Controllers.HomeController.caseStudiesDetails);
router.get('/project', Sys.App.Controllers.HomeController.project);
router.get('/details/:id', Sys.App.Controllers.HomeController.details);


router.get('/contact', Sys.App.Controllers.HomeController.contact);
router.get('/formData', Sys.App.Controllers.HomeController.formData);
router.post('/formData', Sys.App.Controllers.HomeController.postFormData);
router.post('/getGuote', Sys.App.Controllers.GetquoteController.postApplication);
router.post('/contactUs', Sys.App.Controllers.ContactUsController.postApplication);
router.get('/shop', Sys.App.Controllers.HomeController.shop);


router.get('/chemtechLogin', Sys.App.Controllers.ChemtechController.chemtechLogin);
router.post('/chemtechLogin', Sys.App.Controllers.ChemtechController.chemtechPostLogin);
router.get('/chemtechEntry', Sys.App.Controllers.ChemtechController.chemtechEntry);
router.post('/chemtechPostEntry', Sys.App.Controllers.ChemtechController.chemtechPostEntry);










module.exports = router
