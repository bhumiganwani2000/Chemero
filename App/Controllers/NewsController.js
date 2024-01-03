var Sys = require('../../Boot/Sys');
const moment = require('moment');
var fs = require("fs");


module.exports = {


    list: async function(req,res){
		try {
            console.log("nnjnjnjn");
			var data = {
				App 					: req.session.details,
				error 				    : req.flash("error"),
				success				    : req.flash("success"),
                newsActive 	        : 'active',

			};
            // console.log("Datat", data);
			return res.render('news/listnews',data);
		} catch (e) {
			console.log("Error in NewsController in list",e);
		}
	},
    //For Frontend
    getSingleNewsData: async function(req,res){

		try {
            let data = await Sys.App.Services.NewsServices.getByData({ });
            var sobj = {
            	'data': data
            };
           console.log("obj??????",sobj);
           return res.send(sobj);
        } catch (e) {
        	console.log("Error in NewsController in getSingleNewsData",e);
        }
    },



    //End of Frontend

    getNews: async function(req,res){

		try {
			let start = parseInt(req.query.start);
			let length = parseInt(req.query.length);
			let search = req.query.search.value;

			let query = {};
			if (search != '') {
				let capital = search;
                query = { name: { $regex: '.*' + search + '.*' }, is_deleted: "0" };
            } else {
            	query = { is_deleted: "0" };
            }

            let newsCount = await Sys.App.Services.NewsServices.getNewsCount(query);
            let data = await Sys.App.Services.NewsServices.getNewsDatatable(query, length, start);
            // let categoryname = await Sys.App.Services.CategoryServices.getCategoryDatatable();
            var obj = {
            	// 'draw': req.query.draw,
            	'recordsTotal': newsCount,
            	'recordsFiltered': newsCount,
            	'data': data,

            };
            // console.log('data', data);
            // console.log("categrrrrrrrydata", categoryname);
            res.send(obj);
        } catch (e) {
        	console.log("Error in NewsController in getnews",e);
        }
    },

    addNews: async function(req,res){
        try {
            let NewsData = await Sys.App.Services.NewsServices.getByData({  });

            var data = {
                App 					: req.session.details,
                error 				    : req.flash("error"),
                success				    : req.flash("success"),
                newsActive 	        : 'active',
                // categoryData            : categoryData
            };
            return res.render('news/addnews',data);
      } catch (e) {
        console.log("Error in NewsController in addnews",e);
      }
    },

    postNews: async function(req, res){

        try {
          console.log("categoy",req.body);

          //start of new code
          let image = req.files.newsImage;
          console.log("Image", image);
          var re = /(?:\.([^.]+))?$/;
          var ext3 = re.exec(image.name)[1];
          let newsImage = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext3;
          let newsImg = '/newsImage/'+newsImage;
          // Use the mv() method to place the file somewhere on your server
          await image.mv('./public/newsImage/' + newsImage, async function(err) {
              if (err) {
                  req.flash('Error in NewsController in postNews', err);
                  return res.redirect('/backend/addNews');

                }
          });
          //end of newcode
        //   let category = await Sys.App.Services.CategoryServices.getCategoryData({_id: req.body.categoryName});
        //   console.log("categoy",req.body);
          let news = await Sys.App.Services.NewsServices.insertNewsData({
            title         : req.body.title,
            image         : newsImg,
            description   : req.body.description,
            date          : req.body.newsDate,
            // category_id:       category._id
          });
          console.log(news,"news data is here>>>>>>>");
          req.flash('success')
          return res.redirect('/backend/news');
        } catch (error) {
            console.log("Error in NewsController in postNews",error);
        }
    },

    newsDelete: async function(req,res){
        try {
            let news = await Sys.App.Services.NewsServices.getNewsData({_id: req.body.id});
            if (news || news.length >0) {
                await Sys.App.Services.NewsServices.updateNewsData(
                                { _id: req.body.id},
                                {
                                    is_deleted : "1"
                                }
                            )
                return res.send("success");
            }else {
                return res.send("error in NewsController in newsDelete");
            }
        } catch (e) {
            console.log("Erro in NewsController in newsDelete",e);
        }
    },

    editNews: async function(req,res){
        try {
            console.log("NewsEDit");
            // let categoryData = await Sys.App.Services.CategoryServices.getByData({  });
            let news = await Sys.App.Services.NewsServices.getNewsData({
                _id: req.params.id
            });
            return res.render('news/addnews',{news: news , newsActive : 'active' });
        } catch (e) {
            console.log("Error in NewsController in editNews",e);
        }

    },

    editNewsPostData: async function(req,res){
        try {
        //   let category = await Sys.App.Services.CategoryServices.getCategoryData({_id: req.body.categoryName})
          let news = await Sys.App.Services.NewsServices.getNewsData({_id: req.params.id});
          if (news) {
            let updateData;
            let newsImg='';
            updateData = {
                title						            :  	req.body.title,
                description                 :   req.body.description,
                date                        :   req.body.date,
                // category_id                 :   category._id,
            }
						if (req.files) {
							var re = /(?:\.([^.]+))?$/;
							if (req.files.newsImage) {
								let image1 = req.files.newsImage;
								var ext1 = re.exec(image1.name)[1];
								let name = Date.now() +'_'+ Math.floor(Math.random() * 1000) +'.' + ext1;
								newsImg = '/newsImage/'+name;
								if (fs.existsSync('./public/'+news.image) && news.image !='' && req.files && req.files.applicationImage) {
									fs.unlink('./public/'+news.image, function (err) {
										if (err) {
											console.log('Error in NewsController in editNewsData',err);
										}
									});
								}
								await image1.mv('./public/newsImage/' + name, async function(err) {
									if (err) {
										req.flash('Error Uploading Profile Avatar', err);
										return res.redirect('/backend/addnews');
									}
								});
							}
              updateData.image  = newsImg

						}

              await Sys.App.Services.NewsServices.updateNewsData({ _id: req.params.id },updateData)
              req.flash('success','News updated successfully');
              console.log(updateData,"updateDatanews");
              return res.redirect('/backend/news');

          }else {
            req.flash('error', 'News not update successfully');
            return res.redirect('/backend/news');
          }
        } catch (e) {
            console.log("Error",e);
        }
    },


}
