//댓글 정보
const Sequelize=require('sequelize');

class Comment extends Sequelize.Model
{
    static initiate(sequelize)
    {
        Comment.init(
            {
                info: {//댓글 내용
                    type:Sequelize.STRING(100),
                    allowNull: false,
                },
            },
            {
                sequelize,
                timestamps: true, //생성, 수정 시각
                underscored: false, //각 열(속성)의 이름을 언더바를 쓸 지 여부
                modelName: 'Comment', //모델 이름
                tableName: 'comments', //테이블 이름
                paranoid: true, // 삭제 시각
                charset: 'utf8mb4',
                collate: 'utf8mb4_general_ci'// 인코딩 방식
            }
        );
    }
    static associate(db) {
        db.Comment.belongsTo(db.Solution);
    }
};

module.exports=Comment;