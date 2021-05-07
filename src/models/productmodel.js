const Sequelize = require('sequelize')
const sequelize = require('../utils/database');
const product=sequelize.define('tbl_product',
{
    productid:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    productdescription:Sequelize.STRING,
    productname:Sequelize.STRING,
    addedon:Sequelize.DATE,
    addedby:Sequelize.STRING,
    modifiedon:Sequelize.DATE,
    modifiedby:Sequelize.STRING

},{
    freezeTableName:true,
    timestamps:false
}
)
module.exports={product}