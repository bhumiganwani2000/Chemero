'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');

const FactoryTourModel = mongoose.model('FactoryTour')

module.exports = {

    getByData: async function(data){
        try {
            return  await FactoryTourModel.find(data).lean();
        } catch (e) {
            console.log("Error in FactoryTourServices in getByData",e);
        }
    },

    getFactoryTourDatatable: async function(query, length, start){
        try {
            return  await FactoryTourModel.find(query).skip(start).limit(length);
        } catch (e) {
            console.log("Error in FactoryTourServices in getFactoryTourDatatable",e);
        }
    },

    getFactoryTourData: async function(data){
        try {
            return  await FactoryTourModel.findOne(data).lean();
        } catch (e) {
            console.log("Error in NewsModelServices in getFactoryTourData",e);
        }
    },
    // getApplicationsData: async function(data){
    //     try {
    //         return  await applicationModel.find(data).lean();
    //     } catch (e) {
    //         console.log("Error in ApplicationServices in getApplicationData",e);
    //     }
    // },

    getFactoryTourCount: async function(data){
        try {
            return  await FactoryTourModel.countDocuments(data);
        } catch (e) {
            console.log("Error in FactoryTourServices in getFactoryTourCount",e);
        }
    },



    updateFactoryTourData: async function(condition, data){
        try {
          return await FactoryTourModel.updateOne(condition, data);
        } catch (e) {
            console.log("Error in FactoryTourServices in updateFactoryTourData",e);
        }
    },

    insertFactoryTourData: async function(data){
        try {
         return await FactoryTourModel.create(data);
        } catch (e) {
            console.log("Error in FactoryTourServices in insertFactoryTourData",e);
        }
    },

    deleteFactoryTour: async function(data){
        try {
            return await FactoryTourModel.deleteOne({_id: data});
        } catch (e) {
            console.log("Error in FactoryTourServices in deleteFactoryTour",e);
        }
    },

}