//문제 정보
const Sequelize=require('sequelize');

class Problem extends Sequelize.Model
{
    static initiate(sequelize)
    {
        Problem.init(
            {//각 해법들의 데이터
                problem_id: {//문제 번호
                    type:Sequelize.INTEGER,
                    allowNull: false,
                    unique: true,
                },
                problem_difficulty: {//문제 난이도
                    type:Sequelize.INTEGER,
                    allowNull: false,
                },
                problem_name: {//문제 이름
                    type:Sequelize.STRING(200),
                    allowNull: false,
                },
                posts: {//작성된 풀이의 수
                    type:Sequelize.INTEGER.UNSIGNED,
                    allowNull: false,
                },
            },
            {
                sequelize,
                timestamps: true, //생성, 수정 시각
                underscored: false, //각 열(속성)의 이름을 언더바를 쓸 지 여부
                modelName: 'Problem', //모델 이름
                tableName: 'problems', //테이블 이름
                paranoid: true, // 삭제 시각
                charset: 'utf8mb4',
                collate: 'utf8mb4_general_ci'// 인코딩 방식
            }
        );
    }
    static associate(db) {
        db.Problem.hasMany(db.Solution,{foreignKey:'problem_id',sourceKey:'problem_id'});
    }
};

module.exports=Problem;