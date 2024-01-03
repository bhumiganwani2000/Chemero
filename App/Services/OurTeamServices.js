'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');

const ourTeamModel = mongoose.model('ourTeam')

module.exports = {

    getByData: async function(data){
        try {
            // return  await ourTeamModel.findOne(data).lean();
            return  await ourTeamModel.find(data).lean();
        } catch (e) {
            console.log("Error",e);
        }
    },

    getOurTeamDatatable: async function(query, length, start){
        try {
            return  await ourTeamModel.find(query).skip(start).limit(length);
        } catch (e) {
            console.log("Error",e);
        }
    },

    getOurTeamData: async function(data){
        try {
            return  await ourTeamModel.findOne(data).lean();
        } catch (e) {
            console.log("Error",e);
        }
    },

    getOurTeamCount: async function(data){
        try {
            return  await ourTeamModel.countDocuments(data);
        } catch (e) {
            console.log("Error",e);
        }
    },



    updateOurTeamData: async function(condition, data){
        try {
            await ourTeamModel.updateOne(condition, data);
        } catch (e) {
            console.log("Error",e);
        }
    },

    insertOurTeamData: async function(data){
        try {
            await ourTeamModel.create(data);
        } catch (e) {
            console.log("Error",e);
        }
    },

    deleteOurTeam: async function(data){
        try {
            await ourTeamModel.deleteOne({_id: data});
        } catch (e) {
            console.log("Error",e);
        }
    },

}