'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');

const projectCategoryModel = mongoose.model('projectCategory')

module.exports = {

    getByData: async function(data){
        try {
            return  await projectCategoryModel.find(data).lean();
            // return  await projectCategoryModel.find(data).lean();
        } catch (e) {
            console.log("Error in ProjectCategoryServices in getByData",e);
        }
    },
    // getByDataFalse: async function(query, data){
    //     try {
    //         return  await projectCategoryModel.find(query, data);
    //         // return  await projectCategoryModel.find(data).lean();
    //     } catch (e) {
    //         console.log("Error in ProjectCategoryServices in getByDataFalse",e);
    //     }
    // },

    getProjectCategoryDatatable: async function(query, length, start){
        try {
            return  await projectCategoryModel.find(query).skip(start).limit(length);
        } catch (e) {
            console.log("Error in ProjectCategoryServices in getProjectCategoryDatatable",e);
        }
    },

    getProjectCategoryData: async function(data){
        try {
            return  await projectCategoryModel.findOne(data);
            // return  await projectCategoryModel.findOne(data).lean();
        } catch (e) {
            console.log("Error in ProjectCategoryServices in getProjectCategoryData",e);
        }
    },

    getProjectCategoryCount: async function(data){
        try {
            return  await projectCategoryModel.countDocuments(data);
        } catch (e) {
            console.log("Error in ProjectCategoryServices in getProjectCategoryCount",e);
        }
    },



    updateProjectCategoryData: async function(condition, data){
        try {
            await projectCategoryModel.updateOne(condition, data);
        } catch (e) {
            console.log("Error in ProjectCategoryServices in updateProjectCategoryData",e);
        }
    },

    insertProjectCategoryData: async function(data){
        try {
            return await projectCategoryModel.create(data)
            // await projectCategoryModel.create(data);
        } catch (e) {
            console.log("Error in ProjectCategoryServices in insertProjectCategoryData",e);
        }
    },

    deleteProjectCategory: async function(data){
        try {
            await projectCategoryModel.deleteOne({_id: data});
        } catch (e) {
            console.log("Error in ProjectCategoryServices in deleteProjectCategory",e);
        }
    },


}