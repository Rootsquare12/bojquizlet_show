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
                    unique: true,
                },
                password: {
                    type: Sequelize.STRING(100),
                    allowNull: false,
                },
                nickname: {
                    type: Sequelize.STRING(20),
                    allowNull: false,
                },
                solved: {//푼 문제 수
                    type: Sequelize.INTEGER.UNSIGNED,
                    allowNull: false,
                },
                wrote: {//풀이를 작성한 문제 수
                    type: Sequelize.INTEGER.UNSIGNED,
                    allowNull: false,
                },
                like: {//받은 좋아요 수
                    type: Sequelize.INTEGER.UNSIGNED,
                    allowNull: false,
                },
            },
            {
                sequelize,
                timestamps: true, //생성, 수정 시각
                underscored: false, //각 열(속성)의 이름을 언더바를 쓸 지 여부
                modelName: 'User', //모델 이름
                tableName: 'users', //테이블 이름
                paranoid: true, // 삭제 시각
                charset: 'utf8',
                collate: 'utf8_general_ci'// 인코딩 방식
            }
        );
    }
    static associate(db) {
        db.User.hasMany(db.Solution,{foreignKey:'user',targetKey:'nickname'});
    }
};

module.exports=User;