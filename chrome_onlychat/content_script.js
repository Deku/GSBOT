/*
 *  The MIT License (MIT)
 *
 *  Copyright (c) 2014 Ulysse Manceron
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *  SOFTWARE.
 *
 */

var songleft;
var allSongsId = [];
var lastPlayedSongs = [];
var actionTable = {};
var lastPlay;
var forcePlay = false;
var playingRandom = false;
var followingList = [];
var adminActions = {};
var alreadySaluted = {};

// GroovesharkUtils
var GU = {

    /* 
     * Init functions
     */
    'startBot': function() {
        if (GS.getLoggedInUserID() <= 0)
            alert('Cannot login!');
        else {
            GU.updateFollowing();
            setTimeout(GU.startListening, 3000);
        }
    },
    'inBroadcast': function() {
        return $('#bc-take-over-btn').hasClass('hide');
    },
    'openSidePanel': function() {
        if ($('.icon-sidebar-open-m-gray')[0])
            $('.icon-sidebar-open-m-gray').click()
    },
    'startListening': function() {
        setTimeout(function() {
            GU.sendMsg(GUParams.welcomeMessage);
        }, 1000);
        Grooveshark.setVolume(0); //mute the broadcast.
        if ($('#lightbox-close').length == 1) {
            $('#lightbox-close').click();
        }

        // Overload handlechat
        var handleBroadcastSaved = GS.Services.SWF.handleBroadcastChat;
        GS.Services.SWF.handleBroadcastChat = function(e, t) {
            handleBroadcastSaved(e, t);
            GU.doParseMessage(t);
        };

        // Overload handlejoin
        var handleBroadcastJoin = GS.Services.SWF.handleBroadcastListenerJoined;
        GS.Services.SWF.handleBroadcastListenerJoined = function(e, t) {
            handleBroadcastJoin(e, t);
            GU.doSalute(t);
        };
    },    



    /* 
     * Permissions functions
     */
    'followerCheck': function(userid) {
        return followingList.indexOf(userid) != -1;
    },
    'guestCheck': function(userid) {
        if (!GU.isGuesting(userid)) {
            GU.sendMsg('Only Guests can use that feature, sorry!');
            return false;
        }
        return true;
    },
    'guestOrWhite': function(userid) {
        return (GU.isGuesting(userid) || GU.whiteListCheck(userid));
    },
    'inListCheck': function(userid, list) {
        return list.split(',').indexOf("" + userid) != -1;
    },
    'isGuesting': function(userid) {
        return GS.getCurrentBroadcast().attributes.vipUsers.some(function(elem) {
            return elem.userID == userid;
        });
    },
    'makeGuest': function(current, guestID) {
        guestID = Number(guestID);
        if (!isNaN(guestID))
            GS.Services.SWF.broadcastAddVIPUser(guestID, 0, 63); // 63 seems to be the permission mask
    },
    'ownerCheck': function(userid) {
        if (userid != GS.getCurrentBroadcast().attributes.UserID) {
            GU.sendMsg('Only the Master can use that feature, sorry!');
            return false;
        }
        return true;
    },
    'strictWhiteListCheck': function(userid) {
        if (GU.inListCheck(userid, GUParams.whitelist))
            return true;
        GU.sendMsg('Only user that are explicitly in the whitelist can use this feature, sorry!');
        return false;
    },
    'updateFollowing': function() {
        GS.Services.API.userGetFollowersFollowing().then(
            function(alluser) {
                followingList = [];
                alluser.forEach(function(single) {
                    if (single.IsFavorite === '1') {
                        followingList.push(parseInt(single.UserID));
                    }
                });
            });
    },
    'whiteListCheck': function(userid) {
        if (GU.inListCheck(userid, GUParams.whitelist)) // user in whitelist
        {
            return true;
        } else if (GUParams.whitelistIncludesFollowing.toString() === 'true' && !GU.inListCheck(userid, GUParams.blacklist) && GU.followerCheck(userid)) {
            return true;
        }
        //GU.sendMsg('Only ' + GUParams.whiteListName + ' can use that feature, sorry!');
        return false;
    },



    /* 
     * Chat functions
     */
    'about': function() {
        GU.sendMsg('This broadcast is currently running "EGSA Broadcast Bot" v' + GUParams.version + ', created by grooveshark.com/karb0n13 . GitHub: http://goo.gl/UPGkO5 Forked From: http://goo.gl/vWM41J');
    },
    'doSalute' : function(current) {
        var user = current.extra.n;

        if (Object.keys(alreadySaluted).length > 0) {
            for (var k in alreadySaluted) {
                if (alreadySaluted[k] == user) {
                    return;
                }
            }
        }

        GU.sendMsg('Hi ' + user + '! (づ ￣ 3 ￣)づ ♥');
        alreadySaluted[Object.keys(alreadySaluted).length] = user;
    },
    'doParseMessage': function(current) {
        var string = current.data;
        var regexp = RegExp('^/([A-z0-9]*)([ ]+(.+))?$'); // @author: karb0n13
        var regResult = regexp.exec(string);
        if (regResult != null) {
            var currentAction = actionTable[regResult[1]];
            if (currentAction instanceof Array && currentAction[0].every(function(element) {
                return element(current.userID);
            }))
                currentAction[1](current, regResult[3]);
            if (GU.guestOrWhite(current.userID)) {
                var currentAction = adminActions[regResult[1]];
                if (currentAction instanceof Array && currentAction[0].every(function(element) {
                    return element(current.userID);
                }))
                    currentAction[1](current, regResult[3]);
            }
        }
    },
    'getUserName': function(uID){
        var uName = '';
        GS.Models.User.get(uID).then(function(u){
            uName = u.get('Name');
        })
        return uName;
    },
    'help': function(message, parameter) {
        if (parameter != undefined) {
            var currentAction = actionTable[parameter];
            if (currentAction instanceof Array) {
                GU.sendMsg('Help: /' + parameter + ' ' + currentAction[2]);
                return;
            }
        }
        var helpMsg = 'Command available:';
        Object.keys(actionTable).forEach(function(actionName) {
            helpMsg = helpMsg + ' ' + actionName;
        });
        helpMsg = helpMsg + '. Type /help [command name] for in depth help.';
        GU.sendMsg(helpMsg);

        //if user is a guest then show these:
        var isAdmin = GU.guestOrWhite(message.userID);
        if (isAdmin) {
            helpMsg = 'Admin commands:'
            if (parameter != undefined) {
                var currentAction = adminActions[parameter];
                if (currentAction instanceof Array) {
                    GU.sendMsg('Help: /' + parameter + ' ' + currentAction[2]);
                    return;
                }
            }
            Object.keys(adminActions).forEach(function(actionName) {
                helpMsg = helpMsg + ' ' + actionName;
            });
            GU.sendMsg(helpMsg);
        }
    },
    'isListening': function(user){
        if (isNaN(user)) {
            return GS.getCurrentBroadcast().attributes.listeners.models.some(function(elem) {
                return elem.attributes.Name == user;
            });
        } else {
            return GS.getCurrentBroadcast().attributes.listeners.models.some(function(elem) {
                return elem.attributes.UserID == user;
            });
        }
    },
    'removeMsg': function() {
        $('.chat-message').addClass('parsed');
    },
    'sendMsg': function(msg) {
        var broadcast = GS.getCurrentBroadcast();
        if (broadcast === false)
            return;

        var maxMsgLength = 256; // the max number of caracters that can go in the gs chat
        var index = 0;

        while ((Math.floor(msg.length / maxMsgLength) + (msg.length % maxMsgLength != 0)) >= ++index) {
            broadcast.sendChatMessage(msg.substr((index - 1) * maxMsgLength, maxMsgLength));
        }
    },
    
    

    /* 
     * RPG functions
     */
    'cast': function(current, parameter) {
        if (parameter == undefined) {
            GU.sendMsg('Puff!! Nothing happened.');
            return;
        }

        var caster = GU.getUserName(current.userID);
        parameter = parameter.split(' ');
        var toCast = parameter[0];
        parameter[0] = null;
        parameter = parameter.join(' ');
        parameter = parameter.trim();
        var target = isNaN(parameter) ? parameter : GU.getUserName(parameter);

        var spells = RPG.Testing.Spells;

        if (toCast == '-help') {
            var currentAction = actionTable['cast'];
            if (currentAction instanceof Array) {
                GU.sendMsg('Help: /cast ' + currentAction[2]);
            }
            return;
        } else if (toCast == 'sexiness') {
            var castedSpell = spells[toCast];

            if (target == undefined || target == "" || target == caster) {
                GU.sendMsg(caster + ' casts ' + castedSpell['Name'] + (caster == 'Frayhen' ? '. Fray, why don\'t we both take our pants off and do a Sexy Party?' : '. OMG so sexy!! <3'));
            } else {
                if (GU.isListening(target)){
                    GU.sendMsg(caster +' casts ' + castedSpell['Name'] + ' on ' + target + (target == 'Frayhen' ? '. My sweetie, he can\'t be more sexy' : '. I wanna kiss you right now, ' + target + ' :$'));
                } else {
                    GU.sendMsg(caster +' casts ' + castedSpell['Name'] + ' on ... wait ... where is ' + target + '? (Help: The user must be in chat and the name must be written exactly.)');
                }
            }
            return;
        } else {
            var castedSpell = spells[toCast];
        }

        if (castedSpell == undefined) {
            GU.sendMsg('Spell not found. Are you sure that you know magic?');
            return;
        }

        var damageDone = Math.floor(Math.random() * (castedSpell['MaxDmg'] - castedSpell['MinDmg'])) + castedSpell['MinDmg'];
        var isCrit = Math.random() > 0.9; // 10% crit chance

        if (isCrit) {
            damageDone *= 2;
        }

        if (target == undefined || target == "" || target == caster) {
            GU.sendMsg(caster + ' tries to cast ' + castedSpell['Name'] + ', but the spell fails and lands on himself, dealing '+ damageDone + ' damage.' + (isCrit ? ' Critical strike!' : '') + (damageDone > 100 ? ' REKT!' : ''));
        } else {
            if (GU.isListening(target)){
                GU.sendMsg(caster +' casts ' + castedSpell['Name'] + ' over ' + target + ' dealing ' + damageDone + ' damage.' + (isCrit ? ' Critical strike!' : '') + (damageDone > 100 ? ' Overkill!' : ''));
            } else {
                GU.sendMsg(caster +' casts ' + castedSpell['Name'] + ' over ... wait ... where is ' + target + '? (Help: The user must be in chat and the name must be written exactly.)');
            }
        }
    },
};
adminActions = {
};
actionTable = {
    'cast': [
        [GU.inBroadcast], GU.cast, '[SPELL] [TARGET]- (Work In Progress) Simple roleplaying command. Current spells are: fireball, arcanemissiles, frostbolt, corruption, drainlife, deathcoil, searingpain, dongerstrike, sexiness'
    ],
};

(function() {
    var callback_start = function() {
        onbeforeunload = null;
        if (GUParams.userReq != '' && GUParams.passReq != '') {
            GS.Services.API.logoutUser().then(function() {
                GS.Services.API.authenticateUser(GUParams.userReq, GUParams.passReq).then(function(user) {
                    window.location = "http://rpgbot-nologin/";
                });
            });
        } else
            GU.startBot();
    }
    var init_check = function() {
        try {
            GS.ready.done(callback_start);
        } catch (e) {
            setTimeout(init_check, 100);
        }
    }
    init_check();
})()