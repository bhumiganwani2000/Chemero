'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');

const ourTestimonialsModel = mongoose.model('ourTestimonials')

module.exports = {
    getByData: async function(data) {
        try {
            return await ourTestimonialsModel.find(data).lean();
        } catch(error) {
            console.log("Error in OurTestimonialsServices in getByData", error);
        }
    },

    getOurTestimonialsDatatable: async function(query, length, start) {
        try {
            return await ourTestimonialsModel.find(query).skip(start).limit(length);
        } catch (error) {
            console.log("Error in OurTestimonialsService in getOurTestimonialsDatatable", error);
        }
    },

    getOurTestimonialsData: async function(data) {
        try {
            return await ourTestimonialsModel.findOne(data).lean();
        } catch (error) {
            console.log("Error in OurTestimonialsService in getOurTestimonialsData", error);
        }
    },

    getOurTestimonialsCount: async function(data){
        try {
            return await ourTestimonialsModel.countDocuments(data);
        } catch (error) {
            console.log("Error in OurTestimonialsService in getOurTestimonialsCount", error);
        }
    },

    updateOurTestimonialsData: async function(condition, data){
        try {
            await ourTestimonialsModel.updateOne(condition, data);
        } catch (error) {
            console.log("Error in OurTestimonialsService in updateOurTestimonials", error);
        }
    },

    insertOurTestimonialsData: async function(data){
        try {
            await ourTestimonialsModel.create(data);
        } catch (error) {
            console.log("Error in OurTestimonialsService in insertOurTestimonials", error);
        }
    },

    deleteOurTestimonials: async function(data){
        try {
            await ourTestimonialsModel.deleteOne({_id: data});
        } catch (error) {
            console.log("Error in OurTestimonialsService in deleteOurTestimonials", error);
        }
    },
}