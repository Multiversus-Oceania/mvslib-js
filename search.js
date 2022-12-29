const requestdata = require('./requestdata.js');
require('dotenv').config();
const fs = require("fs");
const Characters = require("./characters");
const Maps = require("./maps");
const Emotes = Maps.Emotes;
async function getAccountData(user_id) {
    return new Promise(async (resolve, reject) => {
        const account_data = await requestdata.requestData("/accounts/" + user_id, mvs_client.accessToken);
        resolve(account_data);
    });
}
async function getRanked1sData(user_id) {
    return new Promise (async (resolve, reject) => {
        const last_match_id = (await getLastRankedMatch(user_id, "1v1")).id;
        console.log(last_match_id);
        const my_last_match = await getLastMatch("62873f49d78c32e26df3a47c");
        const my_last_match_id = my_last_match.id;
        let request;
        request="/seasons/1v1-ranked-season/instances/" + my_last_match_id + "/participants/" + user_id;
        console.log("request: " + request);
        const ranked1sdata = await requestdata.requestData(request, mvs_client.accessToken);
        console.log(request);
        resolve(ranked1sdata);
    });
}
async function getRanked2sData(user_id) {
    return new Promise (async (resolve, reject) => {
        const last_match_id = (await getLastRankedMatch(user_id, "2v2")).id;
        console.log(last_match_id);
        let request;
        request="/seasons/2v2-ranked-season/instances/" + last_match_id + "/participants/" + user_id;
        console.log(request);
        const ranked2sdata = await requestdata.requestData(request, mvs_client.accessToken);
        resolve(ranked2sdata);
    });
}

async function getProfileData(user_id) {
    return new Promise(async (resolve, reject) => {
        const profile_data = await requestdata.requestData("/profiles/" + user_id, mvs_client.accessToken);
        resolve(profile_data);
    });
}
async function getidfromusername(user) {
    return new Promise(async (resolve, reject) => {
        const search = await mvs_client.profiles.search(user, limit = 99);
        const searchLength = search.results.length;
        if (searchLength === 1) {
            const user_id = search.results[0].result.account_id;
            resolve(user_id);
        }
        else {
            for (i = 0; i < searchLength; i++) {
                const user_id = search.results[i].result.account_id
                const account_data = await getAccountData(user_id);
                const username = account_data.identity.alternate.wb_network[0].username;
                if (username && username.toLowerCase() === user.toLowerCase()) {
                    resolve(user_id);
                }
            }
        }
        reject("Couldn't find user");
    });
}

async function getusernamefromid(user_id, platform = 'wb_network') {
    return new Promise(async (resolve, reject) => {
        const account_data = await getAccountData(user_id);
        if (platform === 'wb_network') {
            const username = account_data.identity.alternate.wb_network[0].username;
            resolve(username);
        }
        else {
            console.log("account_data: " + account_data);
            console.log("platform: " + platform);
            console.log("account_data.identity.alternate[platform] " + account_data.identity.alternate[platform]);
            const username = account_data.identity.alternate[platform][0].username;
            console.log("username: " + username);
            resolve(username);
        }

    });
}

async function getUserLeaderboard(id, gamemode="both") {
  return new Promise(async (resolve, reject) => {
    if (gamemode === "both") {
      const profile1v1 = await mvs_client.leaderboards.fetchProfile(id, "1v1");
      const profile2v2 = await mvs_client.leaderboards.fetchProfile(id, "2v2");
      resolve({ OneVsOne : {rank: profile1v1.rank, score: profile1v1.score}, TwoVsTwo: {rank: profile2v2.rank, score: profile2v2.score} });
    }
    else {
      const profile = await mvs_client.leaderboards.fetchProfile(id, gamemode);
      if (gamemode === "1v1") {
        resolve({ OneVsOne: {rank: profile.rank, score: profile.score} });
      }
      else if (gamemode === "2v2") {
        resolve({ TwoVsTwo: {rank: profile.rank, score: profile.score}});
    }
  }
  reject("Something went wrong");
});
}

async function getHighestRatedCharacter(user_id, gamemode) {
    const profile = await getProfileData(user_id);
    if (gamemode === "1v1") {
        console.log(profile['server_data']['1v1shuffle'][0].topRating.character);
        return Characters.slugToDisplay(profile['server_data']['1v1shuffle'][0].topRating.character);
    }
    else if (gamemode === "2v2") {
        console.log(profile['server_data']['2v2shuffle'][0].topRating.character);
        return Characters.slugToDisplay(profile['server_data']['2v2shuffle'][0].topRating.character);
    }
}

async function formatProfile(profile, wbname, user_id, interaction) {
    return new Promise(async (resolve, reject) => {
        console.log("Executing search for " + wbname);
        const top_1s = await getHighestRatedCharacter(user_id, "1v1");
        const top_2s = await getHighestRatedCharacter(user_id, "2v2");
        const emote1s = Characters.getEmote(top_1s);
        const emote2s = Characters.getEmote(top_2s);
        const user_profile = await getProfileData(user_id);
        const ranked_rating1 = user_profile.server_data["1v1_ranked"][1].rank.current_points;
        const ranked_rating2 = user_profile.server_data["2v2_ranked"][1].rank.current_points;
        // Create an embed object
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`Player stats for ${wbname}`)
            .setAuthor({name: "taetae"})
            .addFields(
                { name: `**1v1** ${emote1s}`, value: `Ranked Rating: ${ranked_rating1}\nTop character: ${top_1s}\nOverall rank (Unranked): ${profile.OneVsOne.rank}\nElo (Unranked): ${parseInt(profile.OneVsOne.score)}`, inline: true },
                { name: `**2v2** ${emote2s}`, value: `Ranked Rating: ${ranked_rating2}\nTop character: ${top_2s}\nOverall rank (Unranked): ${profile.TwoVsTwo.rank}\nElo (Unranked): ${parseInt(profile.TwoVsTwo.score)}`, inline: true }
            )
        await interaction.editReply({ embeds: [embed]});
        resolve(embed);
    });
}

async function getLastMatch(user_id, gamemode="any") {
    return new Promise(async (resolve, reject) => {
        const matches = (await mvs_client.matches.fetchAll(user_id, limit = 1)).matches;
        try {
            const last_match = await getLastCompletedMatch(matches, gamemode);
            resolve(last_match);
        } catch (error) {
            console.log(error);
            reject("No unrated matches found, try playing a casual match");
        }
    });
}

async function getLastRankedMatch(user_id, gamemode="any") {
    return new Promise(async (resolve, reject) => {
        console.log(user_id);
        const matches = (await mvs_client.matches.fetchAll(user_id, limit = 1)).matches;
        try {
           const last_match = await getLastCompletedRankedMatch(matches, gamemode);
            resolve(last_match);
        } catch (error) {
            console.log(error);
            reject("No ranked matches found, try playing a ranked match");
        }

    });
}
async function getLastCompletedMatch(matches, gamemode = "any") {
    return new Promise(async (resolve, reject) => {
        if (gamemode === "any") {
            for (i = 0; i < matches.length; i++) {
                if (matches[i].state === "complete") {
                    const match = await mvs_client.matches.fetch(matches[i].id);
                    if (match.server_data.IsCustomMatch === false && !match.server_data.match_config.MutatorData && match.server_data.match_config.QueueType !== "Ranked" ) {
                        resolve(match);
                    }
                }
            }
        } else {
            for (i = 0; i < matches.length; i++) {
                if (matches[i].state === "complete" && matches[i].template.name === gamemode) {
                    const match = await mvs_client.matches.fetch(matches[i].id);
                    if (match.server_data.IsCustomMatch === false && !match.server_data.match_config.MutatorData && match.server_data.match_config.QueueType !== "Ranked") {
                        resolve(match);
                    }
                }

            }
        }
        reject("No ranked matches found");
    });
}

async function getLastCompletedRankedMatch(matches, gamemode = "any") {
    return new Promise(async (resolve, reject) => {
        if (gamemode === "any") {
            for (i = 0; i < matches.length; i++) {
                if (matches[i].state === "complete") {
                    const match = await mvs_client.matches.fetch(matches[i].id);
                    if (match.server_data.IsCustomMatch === false && !match.server_data.match_config.MutatorData && match.server_data.match_config.QueueType === "Ranked") {
                        resolve(match);
                    }
                }
            }
        } else {
            for (i = 0; i < matches.length; i++) {
                if (matches[i].state === "complete" && matches[i].template.name === gamemode) {
                    const match = await mvs_client.matches.fetch(matches[i].id);
                    if (match.server_data.IsCustomMatch === false && !match.server_data.match_config.MutatorData && match.server_data.match_config.QueueType === "Ranked") {
                        resolve(match);
                    }
                }

            }
        }
    reject("No ranked matches found");
    });
}

module.exports.getAccountData = getAccountData;
module.exports.getidfromusername = getidfromusername;
module.exports.getusernamefromid = getusernamefromid;
module.exports.getUserLeaderboard = getUserLeaderboard;
module.exports.getProfileData = getProfileData;
module.exports.getHighestRatedCharacter = getHighestRatedCharacter;
module.exports.formatProfile = formatProfile;
module.exports.getLastMatch = getLastMatch;
module.exports.getLastRankedMatch = getLastRankedMatch;
module.exports.getRanked2sData = getRanked2sData;
module.exports.getRanked1sData = getRanked1sData;