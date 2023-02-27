var axios = require("axios").default;

var options = {
  method: 'GET',
  url: 'https://www.bojquizlet-database.com/problems/level',
  headers: {'Content-Type': 'application/json'}
};

axios.request(options).then(function (response) {
  console.log(response.data);
}).catch(function (error) {
  console.error(error);
});