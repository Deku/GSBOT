RPG.PlayerManager = {
	'CreatePlayer' : function(playerID) {
		RPG.PlayerList[playerID] = new Player(GU.getUserName(playerID));
	},
	'playerExists' : function(playerID) {
		if (RPG.PlayerList[playerID] != undefined) {
			return true;
		}

		return false;
	},
	'ModifyClass' : function(playerID, newClass) {
		if (!this.playerExists(playerID)) {
			this.createPlayer(playerID);
		}

		if (RPG.PlayerList[playerID].class == undefined) {
			return RPG.PlayerList[playerID].class = newClass;
		} else {
			GU.sendMsg('You already have a class. Try resetting first.');
		}

		return false;
	},
	'ResetClass' : function(playerID) {
		if (this.playerExists(playerID)) {
			return RPG.PlayerList[playerID].class = undefined;
		}
	}
};

RPG.SpellManager = {
	'ExecuteSpell' : function(spell, casterID, targetID) {
		var spell = RPG.Spells[spell];
		var caster = RPG.PlayerList[casterID];
        var target = RPG.PlayerList[targetID];

        if (spell == undefined) {
            GU.sendMsg('Spell not found. Are you sure that you know magic?');
            return;
        }

        var isSelfCast = (target == undefined) || (casterID == targetID) ? true : false; // I don't like this but meh
        var damageDone = Math.floor(Math.random() * (spell['MaxDmg'] - spell['MinDmg'])) + spell['MinDmg'];
        var isCrit = Math.random() > 0.9; // 10% crit chance

        if (isCrit) {
            damageDone *= 2;
        }

        if (isSelfCast) {
        	GU.sendMsg(caster.Name + ' casts ' + spell.Name + ' on himself dealing ' + damageDone + ' damage.' + (isCrit ? ' Critical strike!' : '') + (damageDone > target.HP ? ' REKT!' : ''));
        } else {
        	GU.sendMsg(caster.Name + ' casts ' + spell.Name + ' (' + damageDone + ' damage) -> ' target.Name + (isCrit ? ' Critical strike!' : '') + (damageDone > target.HP ? ' REKT!' : ''));
        }
	}
}

RPG.DungeonManager = {
	PlayerQueue : {}
};