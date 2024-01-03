'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');

const NewsModel = mongoose.model('News')

module.exports = {

    getByData: async function(data){
        try {
            return  await NewsModel.find(data).lean();
        } catch (e) {
            console.log("Error in NewsServices in getByData",e);
        }
    },

    getNewsDatatable: async function(query, length, start){
        try {
            return  await NewsModel.find(query).skip(start).limit(length);
        } catch (e) {
            console.log("Error in NewsServices in getNewsDatatable",e);
        }
    },

    getNewsData: async function(data){
        try {
            return  await NewsModel.findOne(data).lean();
        } catch (e) {
            console.log("Error in NewsModelServices in getNewsData",e);
        }
    },
    // getApplicationsData: async function(data){
    //     try {
    //         return  await applicationModel.find(data).lean();
    //     } catch (e) {
    //         console.log("Error in ApplicationServices in getApplicationData",e);
    //     }
    // },

    getNewsCount: async function(data){
        try {
            return  await NewsModel.countDocuments(data);
        } catch (e) {
            console.log("Error in NewsServices in getNewsCount",e);
        }
    },



    updateNewsData: async function(condition, data){
        try {
          return await NewsModel.updateOne(condition, data);
        } catch (e) {
            console.log("Error in NewsServices in updateNewsData",e);
        }
    },

    insertNewsData: async function(data){
        try {
         return await NewsModel.create(data);
        } catch (e) {
            console.log("Error in NewsServices in insertNewsData",e);
        }
    },

    deleteNews: async function(data){
        try {
            return await NewsModel.deleteOne({_id: data});
        } catch (e) {
            console.log("Error in NewsServices in deleteNews",e);
        }
    },

}