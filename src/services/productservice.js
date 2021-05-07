const productService = require('../models/productmodel').product
const Sequelize = require("sequelize");

exports.getProduct =async (request, response,next) => {
    try {

        productService.findAll({ 
        where:{
            productid: request.params.productid
        }
 
      })
        .then((result)=>{
            response.status(200).json(result);
        })
        .catch((err)=>{
           
            response.status(500).json(err);
        })
    } catch (error) {
      response.status(403).json(error);
    }
  };
  exports.addProduct =async (request, response,next) => {
    try {

        productService.create({ 
        productname:request.body.productname,
        productdescription:request.body.productdescription,
        addedby:request.body.addedby
      })
        .then((result)=>{
            response.status(200).json(result);
        })
        .catch((err)=>{
           
            response.status(500).json(err);
        })
    } catch (error) {
      response.status(403).json(error);
    }
  };

  exports.updateProduct =async (request, response,next) => {
    try {

        productService.update({ 
        productname:request.body.productname,
        productdescription:request.body.productdescription,
        modifiedby:request.body.modifiedby,
        modifiedon:new Date().toISOString()
      },
      {
      where:{
          productid:request.params.productid
      }
    }
      )
        .then((result)=>{
            response.status(200).json({msg:result + " row(s) updated"});
        })
        .catch((err)=>{
           
            response.status(500).json(err);
        })
    } catch (error) {
      response.status(403).json(error);
    }
  };

  exports.deleteProduct =async (request, response,next) => {
    try {

        productService.destroy(
      {
      where:{
          productid:request.params.productid
      }
    }
      )
        .then((result)=>{
            response.status(200).json({msg:result + " row(s) deleted"});
        })
        .catch((err)=>{
           
            response.status(500).json(err);
        })
    } catch (error) {
      response.status(403).json(error);
    }
  };