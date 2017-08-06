var online = [];
var offline = [];
var all = [];

function retrieveAllStreams() {
    var api = "https://wind-bow.glitch.me/twitch-api/";
    var channels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "habathcx", "RobotCaleb", "noobs2ninjas", "brunofin", "comster404"]
    var channelRequests = [];
    var streamRequests = [];

    //we clear these valuse when this function is called
    online = [];
    offline = [];
    all = [];

    //construct array of fetch requests
    channels.forEach(function (element) {
        //construct a general channel request
        var channelRequest = fetch(api + "channels/" + element).then(function (response) {
            return response.json();
        });

        //construct a stream request
        var streamRequest = fetch(api + "streams/" + element).then(function (response) {
            return response.json();
        });

        channelRequests.push(channelRequest);
        streamRequests.push(streamRequest);
    });

    //Requesting all channel apis
    Promise.all([...channelRequests]).then(function (values) {
        all = values.map((e) => {
            return {
                name: e.display_name,
                image: e.logo,
                id: e._id,
                url: e.url,
                description: e.game + ": " + e.status,
                api: e._links ? e._links.self : "",
                message: e.message
            }
        })

        //Requesting all stream apis
        Promise.all([...streamRequests]).then(function (values) {

            //For each channel response, we find the matching stream request and set the stream status to true
            //or false if it currently online
            all = all.map((channel) => {
                values.map((stream) => {
                    if (stream._links.channel.toLowerCase() == channel.api.toLowerCase()) {
                        if (stream.stream) {
                            channel.online = true;
                            online.push(channel);
                        }
                        else {
                            channel.online = false;
                            offline.push(channel);
                        }
                    }
                })
                return channel;
            })
            loadTabs(all);
        });
    });
}

function loadTabs(data) {
    var allHtml = "<div class=\"ui divided items\">";
    var onlineHtml = "<div class=\"ui divided items\">";
    var offlineHtml = "<div class=\"ui divided items\">";


    $('.ui.search').search({
        source: data,
        fields: {
            title: 'name'
        },
        searchFullText: false,
        searchFields: [
            'name'
        ]
    });

    data.forEach(function (e) {
        var itemHtml = "";
        //     
        //     <div class="description">
        //         <p>Stevie Feliciano is a <a>library scientist</a> living in New York City. She likes to spend her time reading, running, and writing.</p>
        //     </div>

        itemHtml += "<div class=\"item\">";

        //Only add the item html if the channel was found
        if (e.name) {
            itemHtml += "<a class=\"ui tiny image\" target=\"_blank\" href=\"" + e.url + "\">";
            itemHtml += "<img src=\"" + e.image + "\">";
            itemHtml += "</a>";
            itemHtml += "<div class=\"content\">";
            itemHtml += "<a class=\"header\" href=\"" + e.url + "\" target=\"_blank\">" + e.name + "</a>"
            if (e.online) {
                itemHtml += "<div class=\"description\"> <p>" + e.description + "</p> </div>"
            }
            itemHtml += "</div>";
        }
        else {
            itemHtml += e.message
        }

        itemHtml += "</div>";

        allHtml += itemHtml;
        if (e.online) {
            onlineHtml += itemHtml;
        }
        else {
            offlineHtml += itemHtml;
        }
    })

    allHtml += "</div>";
    onlineHtml += "</div>";
    offlineHtml += "</div>";

    $("#all").html(allHtml);
    $("#online").html(onlineHtml);
    $("#offline").html(offlineHtml);
}

$(document).ready(function () {
    $('.ui.pointing.menu > .item').tab();

    retrieveAllStreams();

    $("#reload").click(function (e) {
        retrieveAllStreams();
    })
});