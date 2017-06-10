var action = process.argv[2];
var value = process.argv[3];
var Twitter = require("twitter");
var keys = require("keys");
var client = new Twitter(keys.twitterKeys);
var params = {
    screen_name: process.argv[3],
    count: 20
    }
var request = require("request");
var fs = require("fs");

switch (action) {
    case "my-tweets":
        tweets();
        break;
    case "spotify-this-song":
        spotifyThis(value);
        break;
    case "movie-this":
        movieThis(value);
        break;
    case "do-what-it-says":
        random();
        break;
}

function tweets() {
    client.get("statuses/user_timeline", params, function(error, tweets, response) {
        if (!error && response.statusCode === 200) {
            fs.appendFile("terminal.log", ("=========== LOG BEGIN ===========\r\n" + Date() + "\r\n \r\nTERMINAL COMMANDS:\r\n$: " + process.argv + "\r\n \r\nDATA OUTPUT:\r\n"), function(err) {
                if (err) throw err;
            });
            console.log(" ");
            console.log("Last 20 Tweets:")
            for (var i = 0; i < tweets.length; i++) {
                console.log([i + 1] + ". " + tweets[i].text);
                console.log("Created on: " + tweets[i].created_at);
                console.log(" ");
                fs.appendFile("terminal.log", (i + 1 + ". Tweet: " + tweets[i].text
                 + "\r\nCreated at: " + tweets[i].created_at + " \r\n"), function(err) {
                    if (err) throw err;
                });
            }
            fs.appendFile("terminal.log", ("=========== LOG END ===========\r\n \r\n")
                , function(err) {
                if (err) throw err;
            });
        }
    });
}

function spotifyThis(value) {
    if (value == null) {
        value = "blackout";
    }
    request("https://api.spotify.com/v1/search?q=" + value + "&type=track", function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var jsonBody = JSON.parse(body);
            var items = jsonBody.tracks.items[0];
            console.log("Artist: " + items.artists[0].name);
            console.log("Song: " + items.name);
            console.log("Preview Link: " + items.preview_url);
            console.log("Album: " + items.album.name);
            console.log(" ");
            fs.appendFile("terminal.log", ("=========== LOG ENTRY BEGIN ===========\r\n" + 
                Date() +
                "\r\n \r\nTERMINAL COMMANDS:\r\n$: " + process.argv + 
                "\r\n \r\nDATA OUTPUT:\r\n" + 
                "Artist: " + items.artists[0].name + 
                "\r\nSong: " + items.name + 
                "\r\nPreview Link: " + items.preview_url + 
                "\r\nAlbum: " + items.album.name + 
                "\r\n=============== LOG ENTRY END ===============\r\n \r\n"), function(err) {
                if (err) throw err;
            });
        }
    });
}

function movieThis(value) {
    if (value === null) {
        value = "kittens";
    }
    request("http://www.omdbapi.com/?t=" + value + "&tomatoes=true&r=json", function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var jsonBody = JSON.parse(body);
            console.log(" ");
            console.log("Title: " + jsonBody.Title);
            console.log("Year: " + jsonBody.Year);
            console.log("IMDb Rating: " + jsonBody.imdbRating);
            console.log("Country: " + jsonBody.Country);
            console.log("Language: " + jsonBody.Language);
            console.log("Plot: " + jsonBody.Plot);
            console.log("Actors: " + jsonBody.Actors);
            console.log("Rotten Tomatoes Rating: " + jsonBody.tomatoRating);
            console.log("Rotten Tomatoes URL: " + jsonBody.tomatoURL);
            console.log(" ");
            fs.appendFile("log.txt", ("=========== LOG ENTRY BEGIN ===========\r\n" + 
                Date() + "\r\n \r\nTERMINAL COMMANDS: " + process.argv + 
                "\r\nDATA OUTPUT:\r\n" + "Title: " + jsonBody.Title + 
                "\r\nYear: " + jsonBody.Year + 
                "\r\nIMDb Rating: " + jsonBody.imdbRating + 
                "\r\nCountry: " + jsonBody.Country + 
                "\r\nLanguage: " + jsonBody.Language + 
                "\r\nPlot: " + jsonBody.Plot + 
                "\r\nActors: " + jsonBody.Actors + 
                "\r\nRotten Tomatoes Rating: " + jsonBody.tomatoRating + 
                "\r\nRotten Tomatoes URL: " + jsonBody.tomatoURL + 
                "\r\n =============== LOG ENTRY END ===============\r\n \r\n"), function(err) {
                if (err) throw err;
            });
        }
    });
} 

function random() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            console.log(error);
        } else {
            var dataArr = data.split(",");
            if (dataArr[0] === "spotify") {
                spotifyThis(dataArr[1]);
            }
            if (dataArr[0] === "omdb") {
                omdbThis(dataArr[1]);
            }
        }
    });
}