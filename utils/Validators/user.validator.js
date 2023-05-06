const Joi =require('joi')


const user=Joi.object({
    fullName: Joi.string().alphanum().min(3).max(25).trim(true).required(),
    password:Joi.string().alphanum().min(8).max(20).trim(true).required(),
    role: Joi.string().valid('admin','pharmacy','repository'),
    phone:Joi.string().alphanum().min(8).max(10).trim(true).required(), 
    gender:  Joi.string().valid('male','female')
})

module.exports=user