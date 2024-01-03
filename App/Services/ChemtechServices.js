'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');

const ChemTechAlfa = mongoose.model('chemTechAlfa')

module.exports = {

  insertData: async function(data){
    try {
     return await ChemTechAlfa.create(data);
    } catch (e) {
        console.log("Error in ChemTechAlfa in insertData ",e);
    }
  }
  
  /*
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

    deleteNews: async function(data){
        try {
            return await NewsModel.deleteOne({_id: data});
        } catch (e) {
            console.log("Error in NewsServices in deleteNews",e);
        }
    },
    */
}
