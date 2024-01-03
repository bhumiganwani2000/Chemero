var Sys = require('../../Boot/Sys');
const moment = require('moment');
var fs = require("fs");
var mongoose = require('mongoose');



module.exports = {


    list: async function(req,res){
		try {

			var data = {
				App 					: req.session.details,
				error 				    : req.flash("error"),
				success				    : req.flash("success"),
                productActive 	        : 'active',
                
			};
            // console.log("Datat", data);
			return res.render('product/listProduct',data);
		} catch (e) {
			console.log("Error in ProductController in list",e);
		}
	},

    getProduct: async function(req,res){

		try {
			let start = parseInt(req.query.start);
			let length = parseInt(req.query.length);
			let search = req.query.search.value;

			let query = {};
			if (search != '') {
				let capital = search;
                query = { product_name: { $regex: '.*' + search + '.*' }, is_deleted: "0" };
                // query = { productCategoryName: { $regex: '.*' + search + '.*' }, is_deleted: "0" };

            } else {
            	query = { is_deleted: "0" };
            } 

            let productCount = await Sys.App.Services.ProductServices.getProductCount(query);
            let data = await Sys.App.Services.ProductServices.getProductDatatable(query, length, start);

            var obj = {
            	'draw': req.query.draw,
            	'recordsTotal': productCount,
            	'recordsFiltered': productCount,
            	'data': data,
            };
            console.log('getProduct data', data);
            // console.log("categrrrrrrrydata", categoryname);
            res.send(obj);
        } catch (e) {
        	console.log("Error in ProductController in getProduct",e);
        }
    },

    addProduct: async function(req,res){
        try {
  
            // let query = {};
            // query = {is_separateCategory: "false" };
            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({is_deleted: "0"});

            var data = {
                App 					: req.session.details,
                error 				    : req.flash("error"),
                success				    : req.flash("success"),
                productActive 	        : 'active',
                productCategoryData            : productCategoryData
            };
            return res.render('product/addProduct',data);
      } catch (e) {
        console.log("Error in ProductController in addProduct",e);
      }
    },

    postProduct: async function(req, res){

        try {
            console.log("filesss>>>>>>>>>>>>", req.files);
            console.log("productImage>>>>>>>>>>>",req.files.productImage);
          let product_image = req.files.productImage;
          var productfile = [];          
          let productData = [];
        //   console.log("Image", product_image);
      if (Array.isArray(req.files.productImage) != false) {
        for (let i = 0; i < product_image.length; i++) {
          var re = /(?:\.([^.]+))?$/;
          var extimg = re.exec(product_image[i].name)[1];
          let productImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + extimg;
          let productImg = '/productImage/'+productImage;
          // Use the mv() method to place the file somewhere on your server
          await product_image[i].mv('./public/productImage/' + productImage, async function(err) {
              if (err) {
                  req.flash('Error in ProductController in postProduct', err);
                  return res.redirect('product/addProduct');
                }
          });
          productfile.push({ path: '/productImage/' + productImage, fileName: req.files.productImage[i].name, _id: new mongoose.Types.ObjectId(), is_deleted: "0" })
           }
        }
        else{
            let singleimage_p = req.files.productImage;
              console.log("Image", singleimage_p);
              var re = /(?:\.([^.]+))?$/;
              var ext6 = re.exec(singleimage_p.name)[1];
              let singleImage_P = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext6;
              let singleImg = '/productImage/'+singleImage_P;
              // Use the mv() method to place the file somewhere on your server
              await singleimage_p.mv('./public/productImage/' + singleImage_P, async function(err) {
                  if (err) {
                      req.flash('Error in OurTeamController in postOurTeam', err);
                      return res.redirect('ourTeam/addOurTeam');
                    }
              });
          productfile.push({ path: '/productImage/' + singleImage_P, fileName: req.files.productImage.name, _id: new mongoose.Types.ObjectId(), is_deleted: "0" })

        }
            let product_pdf = req.files.productPdf;
            var pdfs = [];
            // console.log("product_pdf", product_pdf);

            if(Array.isArray(req.files.productPdf) != false){
                for(let i=0; i<product_pdf.length; i++){
                    var re = /(?:\.([^.]+))?$/;
                    var ext3 = re.exec(product_pdf[i].name)[1];
    
                    var productPdf = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                    // console.log("productPdf[[]]", productPdf);
    
                    var productFile = '/productPdf/'+productPdf;
                    console.log("PRODUCT FILE inside for loop ", productFile);
                    console.log();
      
                        await product_pdf[i].mv('./public/productPdf/' + productPdf, async function(err) {
    
                            if (err) {
                                req.flash('Error in ProductController in postProduct', err);
                                return res.redirect('product/addProduct');
                                }
                        });
                        pdfs.push({path: '/productPdf/'+productPdf,  fileName: req.files.productPdf[i].name, _id: create_Id(), is_deleted: "0" })
                        console.log("Mutiple file");
                }
            } else {
            if(Array.isArray(req.files.productPdf) != false){
                var re = /(?:\.([^.]+))?$/;
                var ext3 = re.exec(product_pdf.name)[1];

                var productPdf = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                console.log("productPdf[[]]", productPdf);

                var productFile = '/productPdf/'+productPdf;
                console.log("PRODUCT FILE inside for loop ", productFile);
                
  
                    await product_pdf.mv('./public/productPdf/' + productPdf, async function(err) {

                        if (err) {
                            req.flash('Error in ProductController in postProduct', err);
                            return res.redirect('product/addProduct');
                            }
                    });
                  pdfs.push({path: '/productPdf/'+productPdf, fileName: req.files.productPdf.name, _id: create_Id(), is_deleted:"0"})
                    console.log("Single file>>>>",req.files.productPdf.name);
                }
            }
            // if(Array.isArray(req.files.productPdf)  == false )
            // {
            //   pdfs.push(+req.files.productPdf.name)
            //   console.log("Single file");
            // }
            // else
            // {
            //    for(let i=0; i< req.files.productPdf.length ; i++)
            //    {
            //     pdfs.push(productPdf+'/'+req.files.productPdf[i].name);
            //     console.log("Array");
  
            //    } 
             
            // }         


          // check variable is array or not
        //   console.log("HEADING", req.body.heading);
        //   console.log("Description", req.body.description);

          let heading = req.body.heading
          let description = req.body.description
          if(Array.isArray(req.body.heading)  == false )
          {
            productData.push({heading: req.body.heading, description: req.body.description,_id: new mongoose.Types.ObjectId()})
          }
          else
          {
              console.log("wrokprocess else");
             for(let i=0; i< req.body.heading.length ; i++)
             {
                productData.push({heading:req.body.heading[i],description:req.body.description[i],_id: new mongoose.Types.ObjectId()});

             } 
           
          }    
          let duty = [];
          let duties = req.body.duties          
            console.log(" Duty{{{{{{{{{}}}}}}}}}}",duty);
          if(Array.isArray(req.body.duties)  == false )
          {
              console.log("iffffff");
            duty.push({duties_des: req.body.duties,_id: new mongoose.Types.ObjectId()})
          }
          else
          {
              console.log("else is here ");
             for(let i=0; i< req.body.duties.length ; i++)
             {
                duty.push({duties_des:req.body.duties[i],_id: new mongoose.Types.ObjectId()});

             } 
           
          }    
          let productCategory = await Sys.App.Services.ProductCategoryServices.getProductCategoryData({_id: req.body.productCategoryName});
          var updateData = {
            if_not_subproduct:true
          }
      await Sys.App.Services.ProductCategoryServices.updateProductCategoryData({ _id: productCategory._id },updateData)


         
          let product = await Sys.App.Services.ProductServices.insertProductData({
            product_name:              req.body.product_name,
            product_image:             productfile,
            product_description:       req.body.product_description,
            product_id:            productCategory._id,
            workProcess:  productData,
            pdf_heading: req.body.pdf_heading,
            product_pdf:                pdfs,  
            description_copy: req.body.copy,
            application:req.body.application_description,
	        duties: duty,
            application:req.body.application_description,
            if_not_subproduct:true
            });
            
            // console.log("PRODUCT AFTER INSERT DAta", product);
          req.flash('success')
          return res.redirect('/backend/product');
        } catch (error) {
            console.log("Error in ProductController in postApplication",error);
        }
    },

    pdfDelete: async function(req, res){
        try {
       
           let product =  await Sys.App.Services.ProductServices.getProductData({_id: req.body.id})
            console.log("{{{{{PDF ID}}}}",req.body._id,);
            console.log("================");
            // console.log("[[[[[[[[[[[PRODUCT]]]]]]", product);

                if (product) {
                    for (let index = 0; index < product.product_pdf.length; index++) {
                        var element = product.product_pdf[index];
                        console.log("PDF DATA", element);
                        

                        if(element._id == req.body._id){
                            console.log("CLICKED ID FOUND");
                            await Sys.App.Services.ProductServices.deletePdf(
                                {_id: req.body.id},
                                {
                                    $pull:{'product_pdf':{_id: req.body._id}}
                                }
                            )
                            return res.send("success");
        
                        }
                    }

                }else {
                    return res.send("error in ProductController in productDelete");
                }

        } catch (error) {
            console.log("Error in productController in pdfDelete",error);
        }
    },

    productImageDelete: async function(req, res){
        try {
            console.log("{{{{{PDF ID}}}}", req.params);
        //    let product =  await Sys.App.Services.ProductServices.getProductData({id:req.params.id})
           let product = await Sys.App.Services.ProductServices.getProductData({_id: req.params.id,is_deleted: "0"});
            console.log("================",req.params.id);
            console.log("deleteid",req.params.deleteid);
            console.log("[[[[[[[[[[[PRODUCTDELETE]]]]]]", product);

                if (product) {
                    for (let index = 0; index < product.product_image.length; index++) {
                        var element = product.product_image[index];
                        console.log("PDF DATA", element);
                        

                        if(element._id == req.params.deleteid){
                            console.log("CLICKED ID FOUND");
                           let result = await Sys.App.Services.ProductServices.updateProductData(
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
                    return res.send("error in ProductController in productDelete");
                }

        } catch (error) {
            console.log("Error in productController in productImageDelete",error);
        }
    },

    productDelete: async function(req,res){
        try {
            let product = await Sys.App.Services.ProductServices.getProductData({_id: req.body.id,is_deleted: "0"});
            console.log("================");
            console.log("PRODUCTT", product);
            console.log("}}}}}}}}}}{{{{{{{{{");

            if (product || product.length >0) {
                await Sys.App.Services.ProductServices.updateProductData(
                                { _id: req.body.id},
                                {
                                    is_deleted : "1"
                                }
                            )
                return res.send("success");
            }else {
                return res.send("error in ProductController in productDelete");
            }
        } catch (e) {
            console.log("Erro in ProductController in productDelete",e);
        }
    },

    editProduct: async function(req,res){
        try {
            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({is_deleted: "0"}); 
            let product = await Sys.App.Services.ProductServices.getProductData({
                _id: req.params.id,is_deleted: "0"
            });
            console.log(")))))))(((((((UPDATE CALL", product);

            return res.render('product/addProduct',{product: product , productActive : 'active', productCategoryData: productCategoryData });
        } catch (e) {
            console.log("Error in ProductController in editProduct",e);
        }
 
    },

    editProductPostData: async function(req,res){
        try {
          let productCategory = await Sys.App.Services.ProductCategoryServices.getProductCategoryData({_id: req.body.productCategoryName,is_deleted: "0"})
          let product = await Sys.App.Services.ProductServices.getProductData({_id: req.params.id,is_deleted: "0"});
          console.log(")))))))(((((((UPDATE CALL", product);
          var updated_img = product.product_image;

          let productData = [];      

              if(Array.isArray(req.body.heading) == false)              
              {
                productData.push({heading: req.body.heading, description: req.body.description,_id: new mongoose.Types.ObjectId()})

              }
              else
              {
                  for(let i=0; i< req.body.heading.length ; i++)
                  {
                  productData.push({heading:req.body.heading[i],description:req.body.description[i],_id: new mongoose.Types.ObjectId()});
  
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
              console.log("productData",productData);    

              
            //   let product_pdf = req.files.productPdf;
            //   var pdfs = [];
            //   console.log("product_pdf", product_pdf);

            // if(product_pdf != undefined){

            //   if(Array.isArray(req.files.productPdf) != false){
            //       for(let i=0; i<product_pdf.length; i++){
            //           var re = /(?:\.([^.]+))?$/;
            //           var ext3 = re.exec(product_pdf[i].name)[1];
      
            //           var productPdf = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
            //           console.log("productPdf[[]]", productPdf);
      
            //           var productFile = '/productPdf/'+productPdf;
            //           console.log("PRODUCT FILE inside for loop ", productFile);
      
        
            //               await product_pdf[i].mv('./public/productPdf/' + productPdf, async function(err) {
      
            //                   if (err) {
            //                       req.flash('Error in ProductController in postProduct', err);
            //                       return res.redirect('product/addProduct');
            //                       }
            //               });
                          
            //               pdfs.push({path: '/productPdf/'+productPdf,  fileName: req.files.productPdf[i].name, _id: create_Id(), is_deleted: "0" })
            //               console.log("Mutiple file");
            //       }
            //   } else {
            //       var re = /(?:\.([^.]+))?$/;
            //       var ext3 = re.exec(product_pdf.name)[1];
  
            //       var productPdf = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
            //       console.log("productPdf[[]]", productPdf);
  
            //       var productFile = '/productPdf/'+productPdf;
            //       console.log("PRODUCT FILE inside for loop ", productFile);
  
    
            //           await product_pdf.mv('./public/productPdf/' + productPdf, async function(err) {
  
            //               if (err) {
            //                   req.flash('Error in ProductController in postProduct', err);
            //                   return res.redirect('product/addProduct');
            //                   }
            //           });
            //         pdfs.push({path: '/productPdf/'+productPdf, fileName: req.files.productPdf.name, _id: create_Id(), is_deleted: "0" })
            //           console.log("Single file");
            //   }
            // }
            let new_productcategory = await Sys.App.Services.ProductCategoryServices.getProductCategoryData({_id: req.body.productCategoryName});
            var updateData_new= {
              if_not_subproduct:true
            }
        await Sys.App.Services.ProductCategoryServices.updateProductCategoryData({ _id: productCategory._id },updateData_new)
            var productfile = [];   
            let updateData = {
                product_name						:	req.body.product_name,
                product_description                 :   req.body.product_description,
                workProcess                         :   productData,
                product_id                          :   productCategory._id,
                pdf_heading                         :   req.body.pdf_heading,
                // product_image                    :   productfile,
                application                         :   req.body.application_description,
                duties                              :   duty,
                application                         :   req.body.application_description,
                if_not_subproduct:true

                // product_pdf                 :                pdfs  
            }
          if (product) {
            if (req.files) {
            let image1 = req.files.productImage;
            updateData.product_image = updated_img;
                        if (Array.isArray(req.files.productImage) != false) {
                            for (let i = 0; i < image1.length; i++) {
                              var re = /(?:\.([^.]+))?$/;
                              var ext1 = re.exec(image1[i].name)[1];
                              let name = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext1;
                              let productImg = '/productImage/'+name;
                              // Use the mv() method to place the file somewhere on your server
                              await image1[i].mv('./public/productImage/' + name, async function(err) {
                                  if (err) {
                                      req.flash('Error in ProductController in postProduct', err);
                                      return res.redirect('product/addProduct');
                                    }
                              });
                              updated_img.push({ path: '/productImage/' + name, fileName: req.files.productImage[i].name, _id: new mongoose.Types.ObjectId(), is_deleted: "0" })
                            //   productfile.push({ path: '/productImage/' + name, fileName: req.files.productImage[i].name, _id: new mongoose.Types.ObjectId(), is_deleted: "0" })
                              console.log("productfileupdate>>",productfile);
                               }
                            }
                     }
						// if (req.files) {
						// 	var re = /(?:\.([^.]+))?$/;
						// 	if (req.files.productImage) {
						// 		let image1 = req.files.productImage;
						// 		var ext1 = re.exec(image1.name)[1];
						// 		let name = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext1;
						// 		updateData.product_image = '/productImage/'+name;
						// 		if (fs.existsSync('./public/'+product.product_image) && product.product_image !='' && req.files && req.files.productImage) {
						// 			fs.unlink('./public/'+product.product_image, function (err) {
						// 				if (err) {
						// 					console.log('Error in ProductController in editProductPostData',err);
						// 				}
						// 			});
						// 		}
						// 		await image1.mv('./public/productImage/' + name, async function(err) {
						// 			if (err) {
						// 				req.flash('Error Uploading Profile Avatar', err);
						// 				return res.redirect('/backend/addProduct');
						// 			}
						// 		});
						// 	}
						// }
                         
              await Sys.App.Services.ProductServices.updateProductData({ _id: req.params.id },updateData)
            //   await Sys.App.Services.ProductServices.insertProductData({ _id: req.params.id },addPdf)

              req.flash('success','product updated successfully');
              return res.redirect('/backend/product');

          }else {
            req.flash('error', 'product not update successfully');
            return res.redirect('/backend/product');
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





















































