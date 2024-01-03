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
            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({});

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
            // console.log("des>>>>>>>>>>>>", req.body.product_description);
          let product_image = req.files.productImage;
          let productfile = [];          
          let productData = [];
        //   console.log("Image", product_image);
          var re = /(?:\.([^.]+))?$/;
          var ext3 = re.exec(product_image.name)[1];
          let productImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
          let productImg = '/productImage/'+productImage;
          // Use the mv() method to place the file somewhere on your server
          await product_image.mv('./public/productImage/' + productImage, async function(err) {
              if (err) {
                  req.flash('Error in ProductController in postProduct', err);
                  return res.redirect('product/addProduct');
                }
          });

            let product_pdf = req.files.productPdf;
            var pdfs = [];
            console.log("product_pdf", product_pdf);

            if(Array.isArray(req.files.productPdf) != false){
                for(let i=0; i<product_pdf.length; i++){
                    var re = /(?:\.([^.]+))?$/;
                    var ext3 = re.exec(product_pdf[i].name)[1];
    
                    var productPdf = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
                    console.log("productPdf[[]]", productPdf);
    
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
            productData.push({heading: req.body.heading, description: req.body.description})
          }
          else
          {
             for(let i=0; i< req.body.heading.length ; i++)
             {
                productData.push({heading:req.body.heading[i],description:req.body.description[i]});

             } 
           
          }    

        //  console.log("product data{{{{{{{{{}}}}}}}}}}",productData);
          let productCategory = await Sys.App.Services.ProductCategoryServices.getProductCategoryData({_id: req.body.productCategoryName});
          let product = await Sys.App.Services.ProductServices.insertProductData({
            product_name:              req.body.product_name,
            product_image:             productImg,
            product_description:       req.body.product_description,
            product_id:            productCategory._id,
            workProcess:  productData,
            pdf_heading: req.body.pdf_heading,
            product_pdf:                pdfs,  
            description_copy: req.body.copy,
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

    productDelete: async function(req,res){
        try {
            let product = await Sys.App.Services.ProductServices.getProductData({_id: req.body.id});
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
            let productCategoryData = await Sys.App.Services.ProductCategoryServices.getByData({  }); 
            let product = await Sys.App.Services.ProductServices.getProductData({
                _id: req.params.id
            });
            console.log(")))))))(((((((UPDATE CALL", product);

            return res.render('product/addProduct',{product: product , productActive : 'active', productCategoryData: productCategoryData });
        } catch (e) {
            console.log("Error in ProductController in editProduct",e);
        }
 
    },

    editProductPostData: async function(req,res){
        try {

          let productCategory = await Sys.App.Services.ProductCategoryServices.getProductCategoryData({_id: req.body.productCategoryName})
          let product = await Sys.App.Services.ProductServices.getProductData({_id: req.params.id});
          console.log(")))))))(((((((UPDATE CALL", product);
          let productData = [];   

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
              console.log("productData",productData);    

              /////////////////
              let product_pdf = req.files.productPdf;
              var pdfs = [];
              console.log("product_pdf", product_pdf);

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


          if (product) {
						let updateData = {
							product_name						:	req.body.product_name,
                            product_description                 :   req.body.product_description,
                            workProcess:                            productData,
                            product_id                 :   productCategory._id,
                            pdf_heading                 : req.body.pdf_heading,
                            // product_pdf                 :                pdfs  


				    	}

						if (req.files) {
							var re = /(?:\.([^.]+))?$/;
							if (req.files.productImage) {
								let image1 = req.files.productImage;
								var ext1 = re.exec(image1.name)[1];
								let name = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext1;
								updateData.product_image = '/productImage/'+name;
								if (fs.existsSync('./public/'+product.product_image) && product.product_image !='' && req.files && req.files.productImage) {
									fs.unlink('./public/'+product.product_image, function (err) {
										if (err) {
											console.log('Error in ProductController in editProductPostData',err);
										}
									});
								}
								await image1.mv('./public/productImage/' + name, async function(err) {
									if (err) {
										req.flash('Error Uploading Profile Avatar', err);
										return res.redirect('/backend/addProduct');
									}
								});
							}
						}

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





















































