let totalMessages = 0, messagesLimit = 0, channelName, provider, addition, removeSelector;
let hideCommands = "true";
let messageSize = 24;
let hideAfter = 60;
let ignoredUsers = [];
let animationIn = 'bounceIn';
let animationOut = 'bounceOut';
let borderMessage = '#000000';
let carimboHora = "nao";

//------------------------------ NAME COLORS -------------------------------//
const roles = new Map(); //skips first message for some god damned reason lol [OKAY FINE ONLY SOMETIMES]

roles.set("broadcaster", "#753fbf");
roles.set("moderator", "#299134");
//roles.set("artist", "#0080ff");
roles.set("vip", "#d612e0");
roles.set("subscriber", "#ab8666");
//roles.set("verified", "#000000");
roles.set("default", "#664a38");

function getColor(data) {
    for (let i = 0; i < data.badges.length; i++) {
        for (let key of roles.keys()) {
            if (checkBadge(key, data.badges[i])) {
                return roles.get(key);
            }
        }
    }
    if (checkSubscriber(data)) {
        return roles.get("subscriber");
    }
    return roles.get("default");
    //return return "#ff0037";
}

function checkBadge(want, badge) {
    return (badge.type.toLowerCase() === want) || (badge.description.toLowerCase() === want);
}

function checkSubscriber(data) {
    return !!(data.tags.subscriber = "1");
}

//---------------------------------------------------------------------------//

window.addEventListener("onEventReceived", function (obj) {
    // delete message
    if (obj.detail.listener === "delete-message") {
        const msgId = obj.detail.event.msgId;
        $(`.message-row[data-id=${msgId}]`).remove();
        return;
    } else if (obj.detail.listener === "delete-messages") {
        const userId = obj.detail.event.userId;
        $(`.message-row[data-from=${userId}]`).remove();
        return;
    }

    // Test chat
    if (obj.detail.event.listener === "widget-button") {
        if (obj.detail.event.field === "testMessage") {
            let emulated = new CustomEvent("onEventReceived", {
                detail: {
                    listener: "message",
                    event: {
                        service: "twitch",
                        data: {
                            time: Date.now(),
                            tags: {
                                "badge-info": "",
                                badges: "moderator/1,partner/1",
                                color: "#5B99FF",
                                "display-name": "StreamElements",
                                emotes: "25:46-50",
                                flags: "",
                                id: "43285909-412c-4eee-b80d-89f72ba53142",
                                mod: "1",
                                "room-id": "85827806",
                                subscriber: "1",
                                "tmi-sent-ts": "1579444549265",
                                turbo: "0",
                                "user-id": "100135110",
                                "user-type": "mod",
                            },
                            nick: channelName,
                            userId: "100135110",
                            displayName: channelName,
                            displayColor: "#5B99FF",
                            badges: [ //BADGES HERE
                                {
                                    type: "moderator",
                                    version: "1",
                                    url:
                                        "https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/3",
                                    description: "Moderator",
                                },
                                {
                                    type: "partner",
                                    version: "1",
                                    url:
                                        "https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/3",
                                    description: "Verified",
                                },
                                {
                                    type: "broadcaster",
                                    version: "1",
                                    url:
                                        "https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/3",
                                    description: "broadcaster",
                                },
                            ],
                            channel: channelName,
                            text: "Hello! This is a gay test message. Congratulations, everything is working fine Kappa",
                            isAction: !1,
                            emotes: [
                                {
                                    type: "twitch",
                                    name: "Kappa",
                                    id: "25",
                                    gif: !1,
                                    urls: {
                                        1: "https://static-cdn.jtvnw.net/emoticons/v1/25/1.0",
                                        2: "https://static-cdn.jtvnw.net/emoticons/v1/25/1.0",
                                        4: "https://static-cdn.jtvnw.net/emoticons/v1/25/3.0",
                                    },
                                    start: 46,
                                    end: 50,
                                },
                            ],
                            msgId: "43285909-412c-4eee-b80d-89f72ba53142",
                        },
                        renderedText:
                            'Hello! This is a test message. Congratulations, everything is working fine <img src="https://static-cdn.jtvnw.net/emoticons/v1/25/1.0" srcset="https://static-cdn.jtvnw.net/emoticons/v1/25/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v1/25/1.0 2x, https://static-cdn.jtvnw.net/emoticons/v1/25/3.0 4x" title="Kappa" class="emote">',
                    },
                },
            });
            window.dispatchEvent(emulated);
        }
        return;
    }

    // check if the obj is a message
    if (obj.detail.listener !== "message") return;
    let data = obj.detail.event.data;

    if (data.text.startsWith("!") && hideCommands === "true") return;

    if (ignoredUsers.indexOf(data.nick) !== -1) return;

    let message = attachEmotes(data);
    let badges = "",
        badge;
    for (let i = 0; i < data.badges.length; i++) {
        badge = data.badges[i];
        badges += `<img alt="" src="${badge.url}" class="badge"> `;
    }
    //-----------NAME COLORS---------//
    let color = getColor(data);
    //-----------NAME COLORS---------//

    addMessage(obj.detail.event.data.displayName,
        message,
        badges,
        data.userId,
        data.msgId,
        color,
        data.isAction);
});

window.addEventListener("onWidgetLoad", function (obj) {
    const fieldData = obj.detail.fieldData;
    messagesLimit = fieldData.messagesLimit;
    topDegrade = fieldData.topDegrade;
    hideCommands = fieldData.hideCommands;
    hideAfter = fieldData.hideAfter;
    animationIn = fieldData.animationIn;
    animationOut = fieldData.animationOut;
    borderMessage = fieldData.msgBorderColor;
    carimboHora = fieldData.carimboHora;
    channelName = obj.detail.channel.username;
    messageSize = fieldData.messageSize;
    borderColorUser = fieldData.msgBorderColorUser;
    ignoredUsers = fieldData.ignoredUsers
        .toLowerCase()
        .replace(" ", "")
        .split(",");
    fetch('https://api.streamelements.com/kappa/v2/channels/' + obj.detail.channel.id + '/').then(response => response.json()).then((profile) => {
        provider = profile.provider;
    });

    if (fieldData.alignMessages === "display: block") {
        addition = "prepend";
        removeSelector = ".message-row:nth-child(n+" + (messagesLimit + 1) + ")"
    } else {
        addition = "append";
        removeSelector = ".message-row:nth-last-child(n+" + (messagesLimit + 1) + ")"
    }
});

let re = new RegExp(".*promotion.*channel, viewers, followers, views,.*price")
let minecraftFunFacts = [
    "minecraft was originally named Cave Game, later it was called Minecraft: Order of the stone and then it was changed to the name we all know, minecraft.",
    "Creepers started out as a pig with the height and width swapped on accident",
];

function addMessage(username, message, badges, userId, msgId, color, isAction) {

    totalMessages += 1;
    let actionClass = "";
    if (isAction) {
        actionClass = "action";
    }

    if (borderColorUser === "sim") {
        borderMessage = color;
    }

    let hora = "";
    if (carimboHora === "sim") {
        let d = new Date();
        let messageSizeTime = messageSize - (messageSize / 4);
        hora = `
        <br>
        <div class="time" style="font-size: ${messageSizeTime}px;">
        ${('0' + d.getHours()).slice(-2)}:${('0' + d.getMinutes()).slice(-2)}:${('0' + d.getSeconds()).slice(-2)}
        </div>
  `
    }

    const textHeader = ` <div data-from="${userId}" data-id="${msgId}" class="message-row {animationIn} animated" id="msg-${totalMessages}">
    <div class="meta" style="background-color: ${color};">
      <div class="name">${username}</div>
    </div>`;

    let textHeader2 = `<div class="meta1">
      <div class="badges">${badges}</div>
      <div class="name">${username}</div>
    </div>`


    let textFooter = `<div class="message">
      <div class="container-message ${actionClass}" style="border: 2px solid ${borderMessage};">
        ${message}
        <img style="width: 5px; height: 5px;" src="https://uxwing.com/wp-content/themes/uxwing/download/food-and-drinks/egg-icon.png">
        ${hora}
      </div>
    </div>
  </div>`;

    if (message.includes("gay")) {
        textFooter = `<div class="message">
      <div class="container-message gay ${actionClass}" style="border: 2px solid ${borderMessage};">
        ${message}
        <img style="width: 5px; height: 5px;" src="https://uxwing.com/wp-content/themes/uxwing/download/food-and-drinks/egg-icon.png">
        ${hora}
      </div>
    </div>
  </div>`;
    }

    if (re.test(message)) {
        let fact = minecraftFunFacts.sort(() => 0.5 - Math.random())[0];
        // let fact = "pizza"
        textFooter = `<div class="message">
      <div class="container-message ${actionClass}" style="border: 2px solid ${borderMessage};">
        ${fact}
        ${hora}
      </div>
    </div>
  </div>`;
    }


    const whole = textHeader + textHeader2 + textFooter;

    const element = $.parseHTML(`${whole}`);
    console.log(whole);
    if (addition === "append") {
        if (hideAfter !== 0) {
            $(element)
                .appendTo('#log')
                .delay(hideAfter * 1000)
                .queue(function () {
                    $(this).removeClass(animationIn).addClass(animationOut).delay(1000).queue(function () {
                        $(this).remove()
                    }).dequeue();
                });
        } else {
            $(element)
                .appendTo('#log');
        }
    } else {
        if (hideAfter !== 0) {
            $(element)
                .prependTo('#log')
                .delay(hideAfter * 1000)
                .queue(function () {
                    $(this).removeClass(animationIn).addClass(animationOut).delay(1000).queue(function () {
                        $(this).remove()
                    }).dequeue();
                });
        } else {
            $(element)
                .prependTo('#log');
        }
    }

    if (messagesLimit > 0 && totalMessages > messagesLimit) {
        removeRow();
    }
}

function attachEmotes(message) {
    let text = html_encode(message.text);
    let data = message.emotes;
    if (typeof message.attachment !== "undefined") {
        if (typeof message.attachment.media !== "undefined") {
            if (typeof message.attachment.media.image !== "undefined") {
                text = `${message.text}<img src="${message.attachment.media.image.src}">`;
            }
        }
    }
    return text.replace(/([^\s]*)/gi, function (m, key) {
        let result = data.filter((emote) => {
            return emote.name === key;
        });
        if (typeof result[0] !== "undefined") {
            let msgSize = messageSize + 5;
            let url = result[0]["urls"][4];
            if (provider === "twitch") {
                return `<img width="${msgSize}" class="emote" src="${url}"/>`;
            } else {
                if (typeof result[0].coords === "undefined") {
                    result[0].coords = {x: 0, y: 0};
                }
                let x = parseInt(result[0].coords.x);
                let y = parseInt(result[0].coords.y);

                let width = "auto";
                let height = "auto";

                if (provider === "mixer") {
                    console.log(result[0]);
                    if (result[0].coords.width) {
                        width = `${result[0].coords.width}px`;
                    }
                    if (result[0].coords.height) {
                        height = `${result[0].coords.height}px`;
                    }
                }
                return `<div class="emote" style="width: ${width}; height:${height}; display: inline-block; background-image: url(${url}); background-position: -${x}px -${y}px;"></div>`;
            }
        } else return key;
    });
}

function html_encode(e) {
    return e.replace(/[<>"^]/g, function (e) {
        return "&#" + e.charCodeAt(0) + ";";
    });
}

function removeRow() {
    if (!$(removeSelector).length) {
        return;
    }
    if (animationOut !== "none" || !$(removeSelector).hasClass(animationOut)) {
        if (hideAfter !== 0) {
            $(removeSelector).dequeue();
        } else {
            $(removeSelector).addClass(animationOut).delay(1000).queue(function () {
                $(this).remove().dequeue()
            });

        }
        return;
    }

    $(removeSelector).animate({
        height: 0,
        opacity: 0
    }, 'slow', function () {
        $(removeSelector).remove();
    });
}
