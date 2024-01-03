var express = require('express'),
    router = express.Router();
var Sys = require('../../Boot/Sys');

// add passport modules for social media integration
const passport = require('passport');
const passport_conf = require('../../Config/passport')(passport);

// Load Your Cutom Middlewares
// router.get('/backend', Sys.App.Middlewares.Frontend.frontRequestCheck, function(req, res) {
//     res.send('This is Backend');
// });


router.get('/testotp', function(req, res) {
    /*    let randomotp = Math.floor(100000 + Math.random() * 900000);
       console.log("Random Otp number:-", randomotp); */
});

//
/**
 * Auth Router
 */

router.get('/backend', Sys.App.Middlewares.Backend.loginCheck, Sys.App.Controllers.Auth.login);
router.post('/backend', Sys.App.Middlewares.Backend.loginCheck, Sys.App.Middlewares.Validator.loginPostValidate, Sys.App.Controllers.Auth.postLogin);

router.get('/logout', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.Auth.logout);


router.get('/register', Sys.App.Middlewares.Backend.loginCheck, Sys.App.Middlewares.Backend.HasRole('admin', 'custom'), Sys.App.Controllers.Auth.register);


router.get('/profiles', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'custom'), Sys.App.Controllers.Auth.profile);
router.post('/profiles/update', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'custom'), Sys.App.Controllers.Auth.profileUpdate);

router.post('/profiles/changePwd', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'custom'), Sys.App.Controllers.Auth.changePassword);

router.post('/profiles/changeAvatar', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'custom'), Sys.App.Controllers.Auth.changeAvatar);

/**
 * Dashboard Router
 */
router.get('/dashboard', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'custom'), Sys.App.Controllers.Dashboard.home);

// courses
router.get('/backend/courses', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CoursesController.list);

router.get('/backend/courses/getCourses', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CoursesController.getCourses);
// //
router.post('/backend/courses/getCourseDelete', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CoursesController.getCourseDelete);
// //
router.post('/backend/courses/updateCourseStatus', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CoursesController.updateCourseStatus);
// //
router.get('/backend/courses/addCourses', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CoursesController.addCourses);
// //
router.post('/backend/courses/addCourse', Sys.App.Middlewares.Backend.Authenticate, /*Sys.App.Middlewares.Validator.productValidation,*/ Sys.App.Controllers.CoursesController.postCourse);
// //
router.get('/backend/courses/courseEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CoursesController.editCourse);
// //
router.post('/backend/courses/courseEdit/:id', Sys.App.Middlewares.Backend.Authenticate, /*Sys.App.Middlewares.Validator.productValidation,*/ Sys.App.Controllers.CoursesController.editCoursePostData);


router.get('/backend/pendingInstructors', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.UserController.pendingInstructorsList);
router.get('/backend/user/getPendingAffiliates', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.UserController.getPendingAffiliates);
router.post('/backend/user/setAffiliate', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.UserController.setAffiliate);

// student/affiliate studentListing
router.get('/backend/student', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'custom'), Sys.App.Controllers.UserController.student);
router.get('/backend/student/getStudent', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'custom'), Sys.App.Controllers.UserController.getStudent);

router.get('/backend/affiliate', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'custom'), Sys.App.Controllers.UserController.affiliate);
router.get('/backend/affiliate/getAffiliate', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'custom'), Sys.App.Controllers.UserController.getAffiliate);

router.post('/backend/user/getUserDelete', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.UserController.getUserDelete);

router.get('/backend/applicationRequest', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'custom'), Sys.App.Controllers.UserController.applicationRequest);
router.get('/backend/application/getApplicationRequest', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'custom'), Sys.App.Controllers.UserController.getApplicationRequest);


router.post('/backend/application/approveApplication', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CoursesController.adminApproveApplication);

router.get('/backend/courseFeesRequest', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'custom'), Sys.App.Controllers.UserController.courseFeesRequest);
router.get('/backend/application/getCourseFeesRequest', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'custom'), Sys.App.Controllers.UserController.getCourseFeesRequest);

router.post('/backend/courseFees/adminConfirmsPayment', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CoursesController.adminConfirmsPayment);

router.get('/backend/studentDetails/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'custom'), Sys.App.Controllers.UserController.studentDetails);

router.get('/backend/affiliateStudents/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'custom'), Sys.App.Controllers.UserController.affiliateStudents);
router.get('/backend/user/getAffiliateUser/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'custom'), Sys.App.Controllers.UserController.getAffiliateUser);

// blog

router.get('/backend/blog', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'custom'), Sys.App.Controllers.UserController.blog);
router.get('/backend/getBlog', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'custom'), Sys.App.Controllers.UserController.getBlog);
router.get('/backend/addBlogData', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'custom'), Sys.App.Controllers.UserController.blogAdd);
router.post('/backend/addBlogData', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'custom'), Sys.App.Controllers.UserController.blogAddPost);
router.get('/backend/editBlogData/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'custom'), Sys.App.Controllers.UserController.blogUpdate);
router.post('/backend/editBlogData/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'custom'), Sys.App.Controllers.UserController.blogUpdatePost);
router.post('/backend/blog/getBlogDelete', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'custom'), Sys.App.Controllers.UserController.getBlogDelete);


//Start of aboutUs routes

router.get('/backend/about', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.AboutController.about);
router.get('/backend/getAbout', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.AboutController.getAbout);
router.get('/backend/addAboutData', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.AboutController.aboutAdd);
router.post('/backend/addAboutData', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.AboutController.aboutAddPost);

router.get('/backend/editAboutData/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.AboutController.aboutUpdate);
router.post('/backend/editAboutData/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.AboutController.aboutUpdatePost);
router.post('/backend/about/getAboutDelete', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.AboutController.getAboutDelete);
// End of aboutUs routes

// //Start of project routes
// router.get('/backend/categorylist',  Sys.App.Controllers.ApplicationController.category);
router.get('/backend/product', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductController.list);

router.get('/backend/getProduct', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductController.getProduct);
router.get('/backend/productImageDelete/:id/:deleteid', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductController.productImageDelete);
router.post('/backend/productDelete', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductController.productDelete);
// router.post('/backend/productUpdate', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductController.productCategoryUpdate);
router.post('/backend/pdfDelete', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductController.pdfDelete);



router.get('/backend/addProduct', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductController.addProduct);

router.post('/backend/addProduct', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductController.postProduct);

router.get('/backend/productEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductController.editProduct);

router.post('/backend/productEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductController.editProductPostData);
 //End of project Routes

//Start of projectCategory routes
router.get('/backend/productCategory', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductCategoryController.list);

router.get('/backend/getProductCategory', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductCategoryController.getProductCategory);

router.post('/backend/productCategoryDelete', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductCategoryController.productCategoryDelete);

router.get('/backend/productCategoryImageDelete/:id/:deleteid', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductCategoryController.productCategoryImageDelete);

router.post('/backend/pdfCategoryDelete', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductCategoryController.pdfDelete);

router.get('/backend/addProductCategory', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductCategoryController.addProductCategory);

router.post('/backend/addProductCategory', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductCategoryController.postProductCategory);

router.get('/backend/productCategoryEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductCategoryController.editProductCategory);

router.post('/backend/productCategoryEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProductCategoryController.editProductCategoryPostData);
//End of projectCategory Routes 

//Start of ourTeam routes


router.get('/backend/ourTeam', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.OurTeamController.list);

router.get('/backend/getOurTeams', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.OurTeamController.getOurTeams);

router.post('/backend/getOurTeamDelete', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.OurTeamController.getOurTeamDelete);


router.get('/backend/addOurTeam', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.OurTeamController.addOurTeams);

router.post('/backend/addOurTeam', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.OurTeamController.postOurTeam);

router.get('/backend/ourTeamEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.OurTeamController.editOurTeam);

router.post('/backend/ourTeamEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.OurTeamController.editOurTeamPostData);
 //End of Our Team Routes 

//Start of ourTestimonials routes
router.get('/backend/ourTestimonials', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.OurTestimonialsController.list);

router.get('/backend/getOurTestimonials', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.OurTestimonialsController.getOurTestimonials);

router.post('/backend/ourTestimonialsDelete', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.OurTestimonialsController.ourTestimonialsDelete);


router.get('/backend/addOurTestimonials', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.OurTestimonialsController.addOurTestimonials);

router.post('/backend/addOurTestimonials', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.OurTestimonialsController.postOurTestimonials);

router.get('/backend/ourTestimonialsEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.OurTestimonialsController.editOurTestimonials);

router.post('/backend/ourTestimonialsEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.OurTestimonialsController.editOurTestimonialsPostData);
 //End of Our Testimonials Routes 


// Start of researchAndDevelopment routes

router.get('/backend/researchAndDevelopment', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ResearchAndDevelopmentController.researchAndDevelopment);
router.get('/backend/getResearchAndDevelopment', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ResearchAndDevelopmentController.getResearchAndDevelopment);
router.get('/backend/addResearchAndDevelopmentData', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ResearchAndDevelopmentController.researchAndDevelopmentAdd);
router.post('/backend/addResearchAndDevelopmentData', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ResearchAndDevelopmentController.researchAndDevelopmentAddPost);

router.get('/backend/editResearchAndDevelopmentData/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ResearchAndDevelopmentController.researchAndDevelopmentUpdate);
router.post('/backend/editResearchAndDevelopmentData/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ResearchAndDevelopmentController.researchAndDevelopmentUpdatePost);

router.post('/backend/researchAndDevelopment/getResearchAndDevelopmentDelete', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ResearchAndDevelopmentController.getResearchAndDevelopmentDelete);
router.get('/backend/researchAndDevelopmentImageDelete/:id/:deleteid', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ResearchAndDevelopmentController.r_d_ImageDelete);


//End of researchAndDevelopment routes


// //Start of application routes
// router.get('/backend/categorylist',  Sys.App.Controllers.ApplicationController.category);

router.post('/backend/getSingleApplicationData', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ApplicationController.getSingleApplicationData);

router.get('/backend/applicationImageDelete/:id/:deleteid', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ApplicationController.applicationImageDelete);

router.get('/backend/application', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ApplicationController.list);

router.get('/backend/getApplication', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ApplicationController.getApplication);

router.post('/backend/applicationDelete', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ApplicationController.applicationDelete);


router.get('/backend/addApplication', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ApplicationController.addApplication);

router.post('/backend/addApplication', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ApplicationController.postApplication);

router.get('/backend/applicationEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ApplicationController.editApplication);

router.post('/backend/applicationEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ApplicationController.editApplicationPostData);
 //End of application Routes 

 /// //Start of home routes
// router.get('/backend/categorylist',  Sys.App.Controllers.ApplicationController.category);

router.post('/backend/getSingleApplicationData', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.IndexController.getSingleApplicationData);



router.get('/backend/home', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.IndexController.list);

router.get('/backend/getHome', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.IndexController.getApplication);

router.post('/backend/homeDelete', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.IndexController.applicationDelete);


router.get('/backend/addHome', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.IndexController.addApplication);

router.post('/backend/addHome', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.IndexController.postApplication);

router.get('/backend/homeEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.IndexController.editApplication);

router.post('/backend/homeEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.IndexController.editApplicationPostData);
//  //End of home Routes 

 // //Start of news routes
// router.get('/backend/categorylist',  Sys.App.Controllers.ApplicationController.category);

router.post('/backend/getSingleNewsData', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.NewsController.getSingleNewsData);



router.get('/backend/news', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.NewsController.list);

router.get('/backend/getNews', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.NewsController.getNews);

router.post('/backend/newsDelete', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.NewsController.newsDelete);


router.get('/backend/addNews', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.NewsController.addNews);

router.post('/backend/addNews', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.NewsController.postNews);

router.get('/backend/newsEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.NewsController.editNews);

router.post('/backend/newsEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.NewsController.editNewsPostData);
 //End of news Routes 

  // //Start of casestudies routes
// router.get('/backend/categorylist',  Sys.App.Controllers.ApplicationController.category);

router.post('/backend/getCaseStudiesData', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CaseStudiesController.getSingleCaseStudiesData);

router.get('/backend/casestudies', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CaseStudiesController.list);

router.get('/backend/getCaseStudies', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CaseStudiesController.getCaseStudies);

router.post('/backend/casestudiesDelete', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CaseStudiesController.CaseStudiesDelete);

router.get('/backend/caseStudiesImageDelete/:id/:deleteid', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CaseStudiesController.caseStudiesImageDelete);

router.get('/backend/addCaseStudies', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CaseStudiesController.addCaseStudies);

router.post('/backend/addCaseStudies', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CaseStudiesController.postCaseStudies);

router.get('/backend/casestudiesEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CaseStudiesController.editCaseStudies);

router.post('/backend/casestudiesEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CaseStudiesController.editCaseStudiesPostData);
 //End of casestudies Routes 


// //Start of FactoryTour routes
// router.get('/backend/categorylist',  Sys.App.Controllers.ApplicationController.category);

router.post('/backend/getSingleFactoryTourData', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.FactoryTourController.getSingleFactoryTourData);



router.get('/backend/FactoryTour', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.FactoryTourController.list);

router.get('/backend/getFactoryTour', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.FactoryTourController.getFactoryTour);

router.post('/backend/FactoryTourDelete', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.FactoryTourController.FactoryTourDelete);


router.get('/backend/addFactoryTour', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.FactoryTourController.addFactoryTour);

router.post('/backend/addFactoryTour', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.FactoryTourController.postFactoryTour);

router.get('/backend/FactoryTourEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.FactoryTourController.editFactoryTour);

router.post('/backend/FactoryTourEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.FactoryTourController.editFactoryTourPostData);
 //End of FactoryTour Routes 

/// //Start of profileType routes
// router.get('/backend/categorylist',  Sys.App.Controllers.ApplicationController.category);

router.post('/backend/getSingleApplicationData', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.IndexController.getSingleApplicationData);



router.get('/backend/profileType', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProfileTypeController.list);

router.get('/backend/getProfileType', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProfileTypeController.getApplication);

router.post('/backend/profileTypeDelete', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProfileTypeController.applicationDelete);


router.get('/backend/addProfileType', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProfileTypeController.addApplication);

router.post('/backend/addProfileType', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProfileTypeController.postApplication);

router.get('/backend/profileTypeEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProfileTypeController.editApplication);

router.post('/backend/profileTypeEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProfileTypeController.editApplicationPostData);
//  //End of profileType Routes 

//Start of category routes
router.get('/backend/category', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CategoryController.list);

router.get('/backend/getCategory', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CategoryController.getCategory);

router.post('/backend/categoryDelete', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CategoryController.categoryDelete);


router.get('/backend/addCategory', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CategoryController.addCategory);

router.post('/backend/addCategory', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CategoryController.postCategory);

router.get('/backend/categoryEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CategoryController.editCategory);

router.post('/backend/categoryEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.CategoryController.editCategoryPostData);
 //End of category Routes 

// //Start of project routes
// router.get('/backend/categorylist',  Sys.App.Controllers.ApplicationController.category);
router.get('/backend/project', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProjectController.list);

router.get('/backend/getProject', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProjectController.getProject);

router.post('/backend/projectDelete', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProjectController.projectDelete);


router.get('/backend/addProject', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProjectController.addProject);

router.post('/backend/addProject', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProjectController.postProject);

router.get('/backend/projectEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProjectController.editProject);

router.post('/backend/projectEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProjectController.editProjectPostData);
 //End of project Routes

//Start of projectCategory routes
router.get('/backend/projectCategory', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProjectCategoryController.list);

router.get('/backend/getProjectCategory', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProjectCategoryController.getProjectCategory);

router.post('/backend/projectCategoryDelete', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProjectCategoryController.projectCategoryDelete);


router.get('/backend/addProjectCategory', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProjectCategoryController.addProjectCategory);

router.post('/backend/addProjectCategory', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProjectCategoryController.postProjectCategory);

router.get('/backend/projectCategoryEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProjectCategoryController.editProjectCategory);

router.post('/backend/projectCategoryEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.ProjectCategoryController.editProjectCategoryPostData);
//End of projectCategory Routes 


//Start of region routes
router.get('/backend/region', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.RegionController.list);

router.get('/backend/getRegion', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.RegionController.getRegion);

router.post('/backend/getRegionData',  Sys.App.Controllers.RegionController.getRegionData);
router.post('/backend/getSingleRegionData',Sys.App.Controllers.RegionController.getSingleRegionData);


router.post('/backend/regionDelete', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.RegionController.regionDelete);


router.get('/backend/addRegion', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.RegionController.addRegion);

router.post('/backend/addRegion', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.RegionController.postRegion);


router.get('/backend/regionEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.RegionController.editRegion);

router.post('/backend/regionEdit/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.RegionController.editRegionPostData);
 //End of region Routes 

//Role Management
router.get('/backend/roleManagement', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'custom'), Sys.App.Controllers.UserController.roleManagement);
router.get('/backend/roleManagement/getUsers', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'custom'), Sys.App.Controllers.UserController.getCustomUsers);
router.get('/backend/addCustomUser', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'custom'), Sys.App.Controllers.UserController.addCustomUser);
router.post('/backend/addCustomUser', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'custom'), Sys.App.Controllers.UserController.addCustomUserPost);
router.get('/backend/setUserAccess/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'custom'), Sys.App.Controllers.UserController.setUserAccess);
router.post('/backend/setUserAccess/:id', Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Backend.HasRole('admin', 'custom'), Sys.App.Controllers.UserController.setUserAccessPost);

module.exports = router
