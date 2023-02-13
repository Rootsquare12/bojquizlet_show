var axios = require("axios").default;

var options = {
  method: 'GET',
  url: 'https://solved.ac/api/v3/account/verify_credentials',
  headers: {'Content-Type': 'application/json'}
};

axios.request(options).then(function (response) {
  console.log(response.data);
}).catch(function (error) {
  console.error(error);
});