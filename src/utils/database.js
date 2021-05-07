require('dotenv').config();
const Sequelize=require('sequelize') //orm
const sequelize=new Sequelize(process.env.DB_DATABASE,process.env.DB_USER,process.env.DB_PASSWORD,{dialect:'postgres',host:process.env.DB_HOST,port:process.env.DB_PORT,logging:false});
// const sequelize=new Sequelize('test','postgres','postgressql',{dialect:'postgres',host:'localhost',port:5432});
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports=sequelize;
