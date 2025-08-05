const joi=require('joi');
module.exports.campgroundschema= joi.object({
        campground: joi.object({
            name: joi.string().required(),
            price: joi.number().required().min(0),
            location: joi.string().required(),
            description: joi.string().required()
        }).required()
    })

module.exports.reviewSchema=joi.object({
    review:joi.object({
        body:joi.string().required(),
        rating:joi.number().required().min(0).max(5)
    }).required()
    })