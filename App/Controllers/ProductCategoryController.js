var Sys = require('../../Boot/Sys');
const moment = require('moment');
var fs = require("fs");
// const flash = require('flash');
const { mongo } = require('mongoose');
var mongoose = require('mongoose');
const { url } = require('inspector');


module.exports = {
    list: async function(req,res){
		try {
			var data = {
				App 					: req.session.details,
				error 				    : req.flash("error"),
				success				    : req.flash("success"),
                productCategoryActive 	        : 'active'
			};
			return res.render('productCategory/listProductCategory',data);
		} catch (e) {
			console.log("Error in ProductCategoryController in list",e);
		}
	},

    getProductCategory: async function(req,res){

		try {
			let start = parseInt(req.query.start);
			let length = parseInt(req.query.length);
			let search = req.query.search.value;

			let query = {};
			if (search != '') {
				let capital = search;
                query = { productCategoryName: { $regex: '.*' + search + '.*' }, is_deleted: "0" };
            } else {
            	query = { is_deleted: "0" };
            }

            let productCategoryCount = await Sys.App.Services.ProductCategoryServices.getProductCategoryCount(query);
            let data = await Sys.App.Services.ProductCategoryServices.getProductCategoryDatatable(query, length, start);
            var obj = {
            	'draw': req.query.draw,
            	'recordsTotal': productCategoryCount,
            	'recordsFiltered': productCategoryCount,
            	'data': data
            };
            res.send(obj);
        } catch (e) {
        	console.log("Error in ProductCategoryController in getProductCategory",e);
        }
    },

    addProductCategory: async function(req,res){
        try {
            var data = {
                App 					: req.session.details,
                error 				    : req.flash("error"),
                success				    : req.flash("success"),
                productCategoryActive 	        : 'active'
            };
            return res.render('productCategory/addProductCategory',data);
      } catch (e) {
        console.log("Error in ProductCategoryController in addProductCategory",e);
      }
    },

    postProductCategory: async function(req, res){

        try {
            //start of new code
       
        // console.log("========>>>>>>",req.files);
        if(req.files != null){
            if(req.files.productPdf != undefined){
            let product_pdf = req.files.productPdf;
            var pdfs = [];

            if(Array.isArray(req.files.productPdf) != false){
                for(let i=0; i<product_pdf.length; i++){
                    var re = /(?:\.([^.]+))?$/;
                    var ext3 = re.exec(product_pdf[i].name)[1];
    
                    var productPdf = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                    console.log("productPdf[[]]", productPdf);
    
                    var productFile = '/productCategoryPdf/'+productPdf;
                    console.log("PRODUCT FILE inside for loop ", productFile);
    
      
                        await product_pdf[i].mv('./public/productCategoryPdf/' + productPdf, async function(err) {
    
                            if (err) {
                                req.flash('Error in ProductController in postProduct', err);
                                return res.redirect('product/addProductCategry');
                                }
                        });
                        
                        pdfs.push({path: '/productCategoryPdf/'+productPdf,  fileName: req.files.productPdf[i].name, _id: create_Id(), is_deleted:"0" })
                        console.log("Mutiple file");
                }
            } else {
                var re = /(?:\.([^.]+))?$/;
                var ext3 = re.exec(product_pdf.name)[1];

                var productPdf = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                console.log("productPdf[[]]", productPdf);

                var productFile = '/productCategoryPdf/'+productPdf;
                console.log("PRODUCT FILE inside for loop ", productFile);

  
                    await product_pdf.mv('./public/productCategoryPdf/' + productPdf, async function(err) {

                        if (err) {
                            req.flash('Error in ProductController in postProduct', err);
                            return res.redirect('product/addProductCategry');
                            }
                    });
                  pdfs.push({path: '/productCategoryPdf/'+productPdf, fileName: req.files.productPdf.name, _id: create_Id(), is_deleted:"0"})
                    console.log("Single file");
            }
        }
    }
            // if(req.files.productPdf != undefined){
                                    
            //     console.log("product_pdf", product_pdf);
            //     for(let i=0; i<product_pdf.length; i++){
            //         var re = /(?:\.([^.]+))?$/;
            //         var ext3 = re.exec(product_pdf[i].name)[1];
    
            //         var productPdf = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
            //         // console.log("productPdf[[]]", productPdf);
    
            //         var productFile = '/productCategoryPdf/'+productPdf;
            //         console.log("PRODUCT FILE inside for loop ", productFile);
    
      
            //             await product_pdf[i].mv('./public/productCategoryPdf/' + productPdf, async function(err) {
    
            //                 if (err) {
            //                     req.flash('Error in ProductController in postProduct', err);
            //                     return res.redirect('product/addProductCategry');
            //                     }
            //             });
                    
            //     }
            // }


            // if(Array.isArray(req.files.productPdf)  == false )
            // {
            //   pdfs.push(req.files.productPdf)
            // console.log("Single file");
            // }
            // else
            // {
            //    for(let i=0; i< req.files.productPdf.length ; i++)
            //    {
            //     pdfs.push(req.files.productPdf[i]);
            //     console.log("Array");
  
            //    } 
             
            // }
            let productData = [];
            
            console.log("HEADING", req.body.heading);
            console.log("Description", req.body.description);
  
            let heading = req.body.heading
            let description = req.body.description

            if(Array.isArray(req.body.heading) == false)
            {
                productData.push({heading:req.body.heading,description:req.body.description})
            //   console.log("Error in ProductController in postProduct");
            }
            else
            {
               for(let i=0; i< req.body.heading.length ; i++)
               {
                  productData.push({heading:req.body.heading[i],description:req.body.description[i]});
  
               } 
             
            }
            let duty = [];
          let duties = req.body.duties
            console.log(" Duty{{{{{{{{{}}}}}}}}}}",duty);

          if(Array.isArray(req.body.duties)  == false )
          {
            duty.push({duties: req.body.duties,_id: new mongoose.Types.ObjectId()})
          }
          else
          {
             for(let i=0; i< req.body.duties.length ; i++)
             {
                duty.push({duties:req.body.duties[i],_id: new mongoose.Types.ObjectId()});

             } 
           
          }    
            //end of new code
            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getProductCategoryData({
                productCategoryName: req.body.productCategoryName,
            });

                if (productCategoryData) {
                    req.flash('error', "Product Category already Exists!");
                    return res.redirect('/backend/productCategory');
                } else {
                    if(req.files != null){
                    if(req.files.productImage == undefined || req.files.productPdf == undefined){
                        let product_image = req.files.productImage;
                        var productfile = [];          
                        let productData = [];
                      //   console.log("Image", product_image);
                    if (Array.isArray(req.files.productImage) != false) {
                      for (let i = 0; i < product_image.length; i++) {
                        var re = /(?:\.([^.]+))?$/;
                        var extimg = re.exec(product_image[i].name)[1];
                        let productImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + extimg;
                        let productImg = '/productCategoryImage/'+productImage;
                        // Use the mv() method to place the file somewhere on your server
                        await product_image[i].mv('./public/productCategoryImage/' + productImage, async function(err) {
                            if (err) {
                                req.flash('Error in ProductController in postProduct', err);
                                return res.redirect('productCategory/addProductCategory');
                              }
                        });
                        productfile.push({ path: '/productCategoryImage/' + productImage, fileName: req.files.productImage[i].name, _id: new mongoose.Types.ObjectId(), is_deleted: "0" })
                         }
                      }
                      else{
                          let singleimage_p = req.files.productImage;
                            console.log("Image", singleimage_p);
                            var re = /(?:\.([^.]+))?$/;
                            var ext6 = re.exec(singleimage_p.name)[1];
                            let singleImage_P = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext6;
                            let singleImg = '/productCategoryImage/'+singleImage_P;
                            // Use the mv() method to place the file somewhere on your server
                            await singleimage_p.mv('./public/productCategoryImage/' + singleImage_P, async function(err) {
                                if (err) {
                                    req.flash('Error in OurTeamController in postOurTeam', err);
                                    return res.redirect('productCategory/addProductCategory');
                                  }
                            });
                        productfile.push({ path: '/productCategoryImage/' + singleImage_P, fileName: req.files.productImage.name, _id: new mongoose.Types.ObjectId(), is_deleted: "0" })
              
                      }
                        await Sys.App.Services.ProductCategoryServices.insertProductCategoryData({
                            productCategoryName: req.body.productCategoryName,
                            is_separateCategory: req.body.is_separateCategory ? req.body.is_separateCategory: 'false',
                            // is_separateCategory: req.body.is_separateCategory ,
                            // product_id:            productCategory._id,
                            product_name: req.body.product_name,
                            product_image:             productfile,
                            product_description: req.body.product_description,
                            workProcess:  productData,
                            pdf_heading: req.body.pdf_heading,   
	                        duties: duty,
                            application:req.body.application_description,
                            if_not_subproduct:false
                        })   
                        req.flash('success', "Product Category inserted Successfully!")
                        return res.redirect('/backend/productCategory');                                      
                    }
                } else {
                        // let productCategory = await Sys.App.Services.ProductCategoryServices.getProductCategoryData({_id: req.body.productCategoryName});

                      let categoryData_product =  await Sys.App.Services.ProductCategoryServices.insertProductCategoryData({
                            productCategoryName: req.body.productCategoryName,
                            is_separateCategory: req.body.is_separateCategory ? req.body.is_separateCategory: 'false',
                            product_name: req.body.product_name,
                            product_image: '',
                            product_description: req.body.product_description,
                            // product_id:            productCategory._id,
                            workProcess:  productData,
                            pdf_heading: req.body.pdf_heading,
                            product_pdf:                pdfs   ,
                            duties: duty  ,
                            application:req.body.application_description,
                            if_not_subproduct:false
                            // is_separateCategory: req.body.is_separateCategory 
                        })
                        req.flash('success', "Product Category inserted Successfully!")
                        return res.redirect('/backend/productCategory');
                    }              
                }
                
            } catch (error) {
                console.log("Error in ProductCategoryController in postProductCategory",error);
            }
    },

    productCategoryDelete: async function(req,res){
        try {
            let productCategory = await Sys.App.Services.ProductCategoryServices.getProductCategoryData({_id: req.body.id});
            if (productCategory || productCategory.length >0) {
                await Sys.App.Services.ProductCategoryServices.updateProductCategoryData(
                                { _id: req.body.id},
                                {
                                    is_deleted : "1"
                                }
                            )
                return res.send("success");
            }else {
                return res.send("error in ProductCategoryController in productCategoryDelete");
            }
        } catch (e) {
            console.log("Error in ProductCategoryController in productCategoryDelete",e);
        }
    },
    productCategoryImageDelete: async function(req, res){
        try {
            console.log("{{{{{productCategoryImageDelete}}}}", req.params);
        //    let product =  await Sys.App.Services.ProductServices.getProductData({id:req.params.id})
           let productCategory = await Sys.App.Services.ProductCategoryServices.getProductCategoryData({_id: req.params.id});
            console.log("================",req.params.id);
            console.log("deleteid",req.params.deleteid);
            console.log("[[[[[[[[[[[PRODUCTDELETE]]]]]]", productCategory);

                if (productCategory) {
                    for (let index = 0; index < productCategory.product_image.length; index++) {
                        var element = productCategory.product_image[index];
                        console.log("PDF DATA", element);
                        

                        if(element._id == req.params.deleteid){
                            console.log("CLICKED ID FOUND");
                           let result = await Sys.App.Services.ProductCategoryServices.updateProductCategoryData(
                                {_id: req.params.id,"product_image.is_deleted":"0"},
                                {
                                    $set:{"product_image.$.is_deleted":"1"}},
                                // {
                                //     $pull:{'product_image':{_id: req.params.deleteid}},
                                //     is_deleted : "1"
                                // }
                            )
                            console.log("result",result);
                            return res.send("success");        
                        }
                    }

                }else {
                    return res.send("error in productCategoryController in productImageDelete");
                }

        } catch (error) {
            console.log("Error in productCategoryController in productImageDelete",error);
        }
    },
    pdfDelete: async function(req, res){
        try {
       
           let product =  await Sys.App.Services.ProductCategoryServices.getProductCategoryData({_id: req.body.id})
            console.log("{{{{{PDF ID}}}}",req.body._id,);
            console.log("================");
            // console.log("[[[[[[[[[[[PRODUCT]]]]]]", product);

                if (product) {
                    for (let index = 0; index < product.product_pdf.length; index++) {
                        var element = product.product_pdf[index];
                        console.log("PDF DATA", element);
                        

                        if(element._id == req.body._id){
                            console.log("CLICKED ID FOUND");
                            await Sys.App.Services.ProductCategoryServices.deletePdf(
                                {_id: req.body.id},
                                {
                                    $pull:{'product_pdf':{_id: req.body._id}}
                                }
                            )
                            return res.send("success");
        
                        }
                    }

                }else {
                    return res.send("error in ProductCategoryController in productDelete");
                }

        } catch (error) {
            console.log("Error in productCategoryController in pdfDelete",error);
        }
    },
    editProductCategory: async function(req,res){
        try {
            let productCategory = await Sys.App.Services.ProductCategoryServices.getProductCategoryData({_id: req.params.id});
            var data = {
                App 					: req.session.details,
                error 				    : req.flash("error"),
                success				    : req.flash("success"),
                productCategory                : productCategory,
                productCategoryActive 	        : 'active'

            };
            // console.log("updateproductcategorypage",productCategory);

            return res.render('productCategory/addProductCategory',data);
        } catch (e) {
            console.log("Error in ProductCategoryController in editProductCategory",e);
        }
 
    },
    editProductCategoryPostData: async function(req,res){
        try {

          let productCategory = await Sys.App.Services.ProductCategoryServices.getProductCategoryData({_id: req.params.id});
          var updated_img = productCategory.product_image;
          
          let productData = [];
          let productfile = [];
          //   productData.push({heading:req.body.heading,description:req.body.description});
              if(Array.isArray(req.body.heading) == false)
              {
                productData.push({heading: req.body.heading, description: req.body.description})
  
              }
              else
              {
                  for(let i=0; i< req.body.heading.length ; i++)
                  {
                  productData.push({heading:req.body.heading[i],description:req.body.description[i]});
  
                  }               
              }  
              let duty = [];
                let duties = req.body.duties
                    console.log(" Duty{{{{{{{{{}}}}}}}}}}",duty);

                if(Array.isArray(req.body.duties)  == false )
                {
                    duty.push({duties: req.body.duties,_id: new mongoose.Types.ObjectId()})
                }
                else
                {
                    for(let i=0; i< req.body.duties.length ; i++)
                    {
                        duty.push({duties:req.body.duties[i],_id: new mongoose.Types.ObjectId()});

                    } 
                
                }    
              if (productCategory) {   
              if (req.files) {
                  image1 = req.files.productImage;
                if (Array.isArray(req.files.productImage) != false) {
                    for (let i = 0; i < image1.length; i++) {
                      var re = /(?:\.([^.]+))?$/;
                      var ext1 = re.exec(image1[i].name)[1];
                      let name = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext1;
                      let productImg = '/productCategoryImage/'+name;
                      // Use the mv() method to place the file somewhere on your server
                      await image1[i].mv('./public/productCategoryImage/' + name, async function(err) {
                          if (err) {
                              req.flash('Error in ProductController in postProduct', err);
                              return res.redirect('product/addProduct');
                            }
                      });
                      updated_img.push({ path: '/productCategoryImage/' + name, fileName: req.files.productImage[i].name, _id: new mongoose.Types.ObjectId(), is_deleted: "0" })
                      console.log("productfileupdate>>",productfile);
                       }
                    }
             }
             let new_productcategory = await Sys.App.Services.ProductCategoryServices.getProductCategoryData({
                productCategoryName: req.body.productCategoryName,
            });
                
                 updateData = {
                    productCategoryName: req.body.productCategoryName,
                    is_separateCategory: req.body.is_separateCategory ? req.body.is_separateCategory: 'false',
                    product_name: req.body.product_name,
                    product_description: req.body.product_description,
                    workProcess:  productData,
                    pdf_heading                 : req.body.pdf_heading,
                    product_image                : updated_img,
                    duties: duty,
                    application:req.body.application_description,
                    if_not_subproduct:false

                    // product_pdf:                pdfs 
                }
      await Sys.App.Services.ProductCategoryServices.updateProductCategoryData({ _id: req.params.id },updateData)
     
              console.log("product data{{{{{{{{{}}}}}}}}}}",productData);
        //   if (productCategory) {
                //             let updateData = {
                //                 productCategoryName: req.body.productCategoryName,
                //                 is_separateCategory: req.body.is_separateCategory ? req.body.is_separateCategory: 'false',
                //                 product_name: req.body.product_name,
                //                 product_description: req.body.product_description,
                //                 workProcess:  productData,
                //                 pdf_heading                 : req.body.pdf_heading,
                //                 // product_pdf:                pdfs  
                //             }
                //             if (req.files) {
                //                 var re = /(?:\.([^.]+))?$/;
                //                 if (req.files.productImage) {
                //                     let image1 = req.files.productImage;
                //                     var ext1 = re.exec(image1.name)[1];
                //                     let name = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext1;
                //                     updateData.product_image = '/productCategoryImage/'+name;
                //                     if (fs.existsSync('./public/'+productCategory.product_image) && productCategory.product_image !='' && req.files && req.files.productImage) {
                //                         fs.unlink('./public/'+productCategory.product_image, function (err) {
                //                             if (err) {
                //                                 console.log('Error in ProductCategoryController in editProductCategoryPostData',err);
                //                             }
                //                         });
                //                     }
                //                     await image1.mv('./public/productCategoryImage/' + name, async function(err) {
                //                         if (err) {
                //                             req.flash('Error Uploading Profile Avatar', err);
                //                             return res.redirect('/backend/addProductCategory');
                //                         }
                //                     });
                //                 }
                //             }
    
                // await Sys.App.Services.ProductCategoryServices.updateProductCategoryData({ _id: req.params.id },updateData)                            
                console.log(req.body.is_separateCategory,"is_separateCategory UPdate>>>>>>>>>");
                
                req.flash('success', "User update successfully")
                res.redirect('/backend/productCategory')


            } else {
                req.flash('error', 'Product Category not update successfully')
                return res.redirect('/backend/productCategory');
            }
        } catch (e) {
            console.log("Error",e);
        }
    },

}

function create_Id() {
    var dt = new Date().getTime();
    var uuid = 'xxyxyxxyx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }




















































