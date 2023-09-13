/*문제 정보 모으기*/

const {Problem,Solution}=require('./models');
let axios = require("axios").default;
async function add_item(id,dif,name)
{
  try {
    let exist=await Problem.findOne({where: {problem_id: id,},});
    if(exist===null)
    {
        const info=await Problem.create({
          problem_id:id,
          problem_difficulty:dif,
          problem_name:name,
          posts:0,
        })
        .then(()=>{console.log(id+"번 문제 업로드 완료.")})
        .catch(err => {console.log(err)});
    }
    else
    {
      const info=await Problem.update({
        problem_difficulty:dif,
        problem_name:name,
      },{
        where:{problem_id:id},
      })
      .then(()=>{console.log(id+"번 문제 업데이트 완료.")})
      .catch(err => {console.log(err)});
    }
  }
  catch(error) {
    console.error(error);
  }
}

function update_problems()
{
  for(let d=1000; d<=30000; d+=100)
  {
    let string="";
    let start=d;
    let limit=start+99;
    for(let x=start; x<=limit; x++)
    {
      string=string+x;
      if(x<limit)
      {
        string=string+",";
      }
    }
    let options = {
      method: 'GET',
      url: 'https://solved.ac/api/v3/problem/lookup',
      params: {problemIds: string},
      headers: {'Content-Type': 'application/json'}
    };
    axios.request(options).then(function (response) {
      const data=response.data;
      length=data.length;
      for(let i=0; i<length; i++)
      {
        const input=data[i];
        const info=JSON.parse(JSON.stringify(input));
        const id=info.problemId;
        const name=info.titleKo;
        const dif=info.level;
        //console.log(id+" "+name);
        //console.log(typeof(name));
        //if(typeof(id)==Number && typeof(name)==String)
        {
          add_item(id,dif,name);
        }
      }
    }).catch(function (error) {
      console.error(error);
    });
  }
}
module.exports=update_problems;