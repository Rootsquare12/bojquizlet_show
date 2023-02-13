const Sequelize=require('sequelize');
const User=require('./user');
const Problem=require('./problem');
const Solution=require('./solution');
const Comment=require('./comment');
const env=process.env.NODE_ENV || 'development';
const config=require('../config/config')[env];

const db={};
const sequelize=new Sequelize(config.database,config.username,config.password,config);//내 MySQL DB와 연결하기

db.sequelize=sequelize;
db.User=User;
db.Problem=Problem;
db.Solution=Solution;
db.Comment=Comment;

User.initiate(sequelize);
Problem.initiate(sequelize);
Solution.initiate(sequelize);
Comment.initiate(sequelize);

User.associate(db);
Problem.associate(db);
Solution.associate(db);
Comment.associate(db);

module.exports=db;