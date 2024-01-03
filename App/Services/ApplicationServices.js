'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');

const applicationModel = mongoose.model('application')

module.exports = {

    getByData: async function(data){
        try {
            return  await applicationModel.find(data).lean();
        } catch (e) {
            console.log("Error in ApplicationServices in getByData",e);
        }
    },

    getApplicationDatatable: async function(query, length, start){
        try {
            return  await applicationModel.find(query).skip(start).limit(length);
        } catch (e) {
            console.log("Error in ApplicationServices in getApplicationDatatable",e);
        }
    },

    getApplicationData: async function(data){
        try {
            return  await applicationModel.findOne(data).lean();
        } catch (e) {
            console.log("Error in ApplicationServices in getApplicationData",e);
        }
    },
    // getApplicationsData: async function(data){
    //     try {
    //         return  await applicationModel.find(data).lean();
    //     } catch (e) {
    //         console.log("Error in ApplicationServices in getApplicationData",e);
    //     }
    // },

    getApplicationCount: async function(data){
        try {
            return  await applicationModel.countDocuments(data);
        } catch (e) {
            console.log("Error in ApplicationServices in getApplicationCount",e);
        }
    },



    updateApplicationData: async function(condition, data){
        try {
            await applicationModel.updateOne(condition, data);
        } catch (e) {
            console.log("Error in ApplicationServices in updateApplicationData",e);
        }
    },

    insertApplicationData: async function(data){
        try {
            await applicationModel.create(data);
        } catch (e) {
            console.log("Error in ApplicationServices in insertApplicationData",e);
        }
    },

    deleteApplication: async function(data){
        try {
            await applicationModel.deleteOne({_id: data});
        } catch (e) {
            console.log("Error in ApplicationServices in deleteApplication",e);
        }
    },

}