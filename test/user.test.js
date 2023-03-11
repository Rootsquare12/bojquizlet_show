//jest.mock('../models');
const User=require('../models/user');
const {findProfile}=require('../controllers/user');

describe('follow',() => {
    const res={
        status:jest.fn(()=>res),
        send:jest.fn(),
    };
    const next=jest.fn();
    test('존재하는 유저의 정보를 반환한다.',async () => {
        const req1={
            params:{id:'rootsquare'},
        };
        await findProfile(req1,res,next);
        expect(res.status).toBeCalledWith(200);
    });
    test('존재하지 않는 유저의 정보는 404 오류를 반환한다.',async () => {
        const req2={
            params:{id:'sfjjfkjfklsj'},
        };
        await findProfile(req2,res,next);
        expect(res.status).toBeCalledWith(404);
    });
});