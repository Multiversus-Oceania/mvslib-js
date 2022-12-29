const {Client} = require("multiversus.js");
const Search = require("./lib/search.js");
const Characters = require("./lib/characters.js");
const generatemvstoken = require("./lib/generatemvstoken.js");
const requestdata = require("./lib/requestdata.js");
const Users = require("./lib/users.js");
// Create a new Discord client
(async () => {
    // Get access token and create a new client
    const mvstoken = await generatemvstoken.getAccessToken;
    mvs_client = new Client({ accessToken: mvstoken });

})().catch((error) => {
    console.error(error);
});

module.exports.Search = Search;
module.exports.Characters = Characters;
module.exports.Users = Users;
module.exports.requestdata = requestdata;
module.exports.generatemvstoken = generatemvstoken;
