var Sys = require('../../Boot/Sys');
var jwt = require('jsonwebtoken');

const flatCache = require('flat-cache');
let cache = flatCache.load('dashboardCache');

var jwtcofig = {
  'secret': 'KiraJwtAuth'
};




module.exports = {
    frontRequestCheck: function(req, res, next){
        console.log('Time:', Date.now())
        next();
    },

    isLoggedIn: async function(req, res, next){
        if(req.session.login){
          jwt.verify(req.session.details.jwt_token, jwtcofig.secret, async function(err, decoded) {
            if (err){
              req.session.destroy(function(err) {
                  req.logout();
                  return res.redirect('/');
              })
            }else{
              res.locals.session = req.session.details;
              next();
            }
          });
        }else{
          res.redirect('/');
        }
    },

}
