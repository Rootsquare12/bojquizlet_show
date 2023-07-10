//유저 정보
const Sequelize=require('sequelize');

class User extends Sequelize.Model
{
    static initiate(sequelize)
    {
        User.init(
            {//각 유저들의 데이터
                email: {
                    type:Sequelize.STRING(40),
                    allowNull: false,
                    unique: true
                },
                password: {
                    type: Sequelize.STRING(100),
                    allowNull: false
                },
                nickname: {
                    type: Sequelize.STRING(20),
                    allowNull: false,
                    unique: true
                },
                verify: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultValue: false
                },
                verify_code: {
                    type: Sequelize.STRING(10)
                },
                verify_time: {
                    type: Sequelize.DATE
                }
            },
            {
                sequelize,
                timestamps: true, //생성, 수정 시각
                underscored: false, //각 열(속성)의 이름을 언더바를 쓸 지 여부
                modelName: 'User', //모델 이름
                tableName: 'users', //테이블 이름
                paranoid: true, // 삭제 시각
                charset: 'utf8mb4',
                collate: 'utf8mb4_general_ci'// 인코딩 방식
            }
        );
    }
    static associate(db) {
        db.User.hasMany(db.Solution,{foreignKey:'writer',sourceKey:'id'});
        db.User.hasMany(db.Comment,{foreignKey:'writer',sourceKey:'id'});
        db.User.belongsToMany(db.Solution,{
            through:'like_table',
            foreignKey:'user'
        })
    }
};

module.exports=User;