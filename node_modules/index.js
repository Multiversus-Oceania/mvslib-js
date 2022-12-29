const generatemvstoken = require("./generatemvstoken");
const {Client} = require("multiversus.js");
const Search = require("./search");
const Characters = require("./characters");
require('dotenv').config();
(async () => {
    // Get access token and create a new client
    const mvstoken = await generatemvstoken.getAccessToken();
    mvs_client = new Client({ accessToken: mvstoken });

    /*
    const user_id = await Search.getidfromusername("keryan666");
    const ranked1s = await Search.getRanked1sData(user_id);
    const ranked2s = await Search.getRanked2sData(user_id);
    console.log("ranked1s:", ranked1s);
    console.log("ranked2s:", ranked2s);
})().catch((error) => {
    */
});
