require('dotenv').config();
const Characters = {
    Shaggy : {
        name : "Shaggy",
        slug : "character_shaggy",
        emote : "<:ShaggyLogo:1017563955016781915>"
    },
    Reindog : {
        name : "Reindog",
        slug : "character_creature",
        emote : "<:ReindogLogo:980375104703852605>"
    },
    StevenUniverse : {
        name : "Steven Universe",
        slug : "character_steven",
        emote : "<:StevenLogo:1001121366386417705>"
    },
    Garnet : {
        name : "Garnet",
        slug : "character_garnet",
        emote : "<:GarnetLogo:980374527806697482>"
    },
    HarleyQuinn : {
        name : "Harley Quinn",
        slug : "character_harleyquinn",
        emote : "<:HarleyLogo:980374594336727070>"
    },
    AryaStark : {
        name : "Arya Stark",
        slug : "character_arya",
        emote : "<:AryaLogo:980374195798171710>"
    },
    Finn : {
        name : "Finn",
        slug : "character_finn",
        emote : "<:FinnLogo:1017563948456890368>"
    },
    Taz : {
        name : "Taz",
        slug : "character_taz",
        emote : "<:TazLogo:1001121434636144752>"
    },
    WonderWoman : {
        name : "Wonder Woman",
        slug : "character_wonder_woman",
        emote : "<:WonderWomanLogo:1001121636164063246>"
    },
    Jake : {
        name : "Jake",
        slug : "character_jake",
        emote : "<:JakeLogo:980375030947004416>"
    },
    Superman : {
        name : "Superman",
        slug : "character_superman",
        emote : "<:SupermanLogo:1001121284085788683>"
    },
    Batman : {
        name : "Batman",
        slug : "character_batman",
        emote : "<:BatmanLogo:980374315717500928>"
    },
    BugsBunny : {
        name : "BugsBunny",
        slug : "character_bugs_bunny",
        emote : "<:BugsLogo:980374385347145798>"
    },
    TomAndJerry : {
        name : "Tom & Jerry",
        slug : "character_tom_and_jerry",
        emote : "<:TomJerryLogo:1001121508850159636>"
    },
    Velma : {
        name : "Velma",
        slug : "character_velma",
        emote : "<:VelmaLogo:1017563961350176808>"
    },
    IronGiant : {
        name : "Iron Giant",
        slug : "character_C017",
        emote : "<:IronGiantLogo:1001745826353254410>"
    },
    LebronJames : {
        name : "Lebron James",
        slug : "character_c16",
        emote : "<:LeBronLogo:1001746012131569664>"
    },
    RickSanchez : {
        name : "Rick Sanchez",
        slug : "character_C020",
        emote : "<:RickLogo:1024529297765060608>"
    },
    Stripe : {
        name : "Stripe",
        slug : "character_C023B",
        emote : "<:StripeLogo:1029907875042177094>"
    },
    Marvin : {
        name : "Marvin",
        slug : "character_C018",
        emote : "<:MarvinLogo:1045501012737269770>"
    },
    BlackAdam : {
        name : "Black Adam",
        slug : "character_C021",
        emote : "<:BlackAdamLogo:1036903155545411634>"
    },
    Morty : {
        name : "Morty",
        slug : "character_c019",
        emote : "<:MortyLogo:1011836360866398269>"
    },
    Gizmo : {
        name : "Gizmo",
        slug : "character_C023A",
        emote : "<:GizmoLogo:1017631697631719434>"
    },
};

function getCharacterFromSlug(slug) {
    for (const char in Characters) {
        if (Characters[char].slug === slug) {
            return char;
        }
    }
}

function slugToDisplay(slug) {
    for (const char in Characters) {
        if (Characters[char].slug === slug) {
            return Characters[char].name;
        }
    }
}

function displayToSlug(name) {
    for (const char in Characters) {
        if (Characters[char].name === name) {
            return Characters[char].slug;
        }
    }
}

function getImagePath(character) {
    slug = displayToSlug(character);
    for (const char in Characters) {
        if (Characters[char].slug === slug) {
            return Characters[char].imagepath;
        }
    }
}

function getEmote(character) {
    slug = displayToSlug(character);
    for (const char in Characters) {
        if (Characters[char].slug === slug) {
            return Characters[char].emote;
        }
    }
}

module.exports.getCharacterFromSlug = getCharacterFromSlug;
module.exports.slugToDisplay = slugToDisplay;
module.exports.displayToSlug = displayToSlug;
module.exports.getImagePath = getImagePath;
module.exports.getEmote = getEmote;