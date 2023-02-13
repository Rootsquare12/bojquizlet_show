//풀이 정보(TODO)
const Sequelize=require('sequelize');

class Solution extends Sequelize.Model
{
    static initiate(sequelize)
    {
        Solution.init(
            {//각 해법들의 데이터
                code: {//풀이 일련번호
                    type:Sequelize.INTEGER.UNSIGNED,
                    allowNull: false,
                },
                content: {//글
                    type:Sequelize.STRING(5000),
                    allowNull: false,
                },
                file: {//첨부파일
                    type: Sequelize.STRING(200),
                    allowNull: true,
                },
            },
            {
                sequelize,
                timestamps: true, //생성, 수정 시각
                underscored: false, //각 열(속성)의 이름을 언더바를 쓸 지 여부
                modelName: 'Solution', //모델 이름
                tableName: 'solutions', //테이블 이름
                paranoid: true, // 삭제 시각
                charset: 'utf8',
                collate: 'utf8_general_ci'// 인코딩 방식
            }
        );
    }
    static associate(db) {
        db.Solution.belongsTo(db.User,{foreignKey:'user',targetKey:'nickname'});
        db.Solution.belongsTo(db.Problem,{foreignKey:'problem_id',targetKey:'problem_id'});//테이블간 관계 다시 설정하기
        db.Solution.hasMany(db.Comment);
    }
};

module.exports=Solution;