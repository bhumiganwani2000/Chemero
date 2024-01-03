'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');

const CaseStudiesModel = mongoose.model('casestudies')

module.exports = {

    getByData: async function(data){
        try {
            return  await CaseStudiesModel.find(data).lean();
        } catch (e) {
            console.log("Error in CaseStudiesServices in getByData",e);
        }
    },

    getCaseStudiesDatatable: async function(query, length, start){
        try {
            return  await CaseStudiesModel.find(query).skip(start).limit(length);
        } catch (e) {
            console.log("Error in CaseStudiesServices in getCaseStudiesDatatable",e);
        }
    },

    getCaseStudiesData: async function(data){
        try {
            return  await CaseStudiesModel.findOne(data).lean();
        } catch (e) {
            console.log("Error in CaseStudiesServices in getCaseStudiesData",e);
        }
    },
    

    getCaseStudiesCount: async function(data){
        try {
            return  await CaseStudiesModel.countDocuments(data);
        } catch (e) {
            console.log("Error in CaseStudiesServices in getCaseStudiesCount",e);
        }
    },



    updateCaseStudiesData: async function(condition, data){
        try {
          return await CaseStudiesModel.updateOne(condition, data);
        } catch (e) {
            console.log("Error in CaseStudiesServices in updateCaseStudiesData",e);
        }
    },

    insertCaseStudiesData: async function(data){
        try {
         return await CaseStudiesModel.create(data);
        } catch (e) {
            console.log("Error in CaseStudiesServices in insertCaseStudiesData",e);
        }
    },

    deleteCaseStudies: async function(data){
        try {
            return await CaseStudiesModel.deleteOne({_id: data});
        } catch (e) {
            console.log("Error in CaseStudiesServices in deleteCaseStudies",e);
        }
    },

}