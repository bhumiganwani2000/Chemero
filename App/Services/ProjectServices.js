'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');

const projectModel = mongoose.model('project')

module.exports = {

    getByData: async function(data){
        try {
            return  await projectModel.find(data).lean();
        } catch (e) {
            console.log("Error in ProjectServices in getByData",e);
        }
    },

    getProjectDatatable: async function(query, length, start){
        try {
            return  await projectModel.find(query).skip(start).limit(length);
        } catch (e) {
            console.log("Error in ProjectServices in getProjectDatatable",e);
        }
    },

    getProjectData: async function(data){
        try {
            return  await projectModel.findOne(data).lean();
        } catch (e) {
            console.log("Error in ProjectServices in getProjectData",e);
        }
    },

    getProjectCount: async function(data){
        try {
            return  await projectModel.countDocuments(data);
        } catch (e) {
            console.log("Error in ProjectServices in getProjectCount",e);
        }
    },



    updateProjectData: async function(condition, data){
        try {
            await projectModel.updateOne(condition, data);
        } catch (e) {
            console.log("Error in ProjectServices in updateProjectData",e);
        }
    },

    insertProjectData: async function(data){
        try {
            await projectModel.create(data);
        } catch (e) {
            console.log("Error in ProjectServices in insertProjectData",e);
        }
    },

    deleteProject: async function(data){
        try {
            await projectModel.deleteOne({_id: data});
        } catch (e) {
            console.log("Error in ProjectServices in deleteProject",e);
        }
    },

}