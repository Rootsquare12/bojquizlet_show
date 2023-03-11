//jest.mock('../models');
const {renderSolutions,writeSolution}=require('../controllers/solutions');

describe('follow',() => {
    const res={
        status:jest.fn(()=>res),
        send:jest.fn(),
    };
    const next=jest.fn();
    test('특정 문제에 속한 해설들을 가져온다.',async () => {
        const req1={
            params:{id:1000},
        };
        await renderSolutions(req1,res,next);
        expect(res.status).toBeCalledWith(200);
    });
});