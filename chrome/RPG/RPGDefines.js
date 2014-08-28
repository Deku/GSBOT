/* ======================================
 * ==========SPELL CLASS=================
 * ======================================
 */

function Spell(sname, cat, eff1, eff2, eff3, attr1, attr2, attr3, tartype, cast, cd, mana, minlvl) {
	// Unique Identifier UID
	// @index in the array
	// Spell Name
	this._name = sname;
	// Category of the spell. Determines the type of damage done. (i.e.: fire, ice, etc.)
	this._category = cat;
	// List of effects
	// 1 = Damage
	// 2 = Heal
	this._effect1 = eff1;
	this._effect2 = eff2;
	this._effect3 = eff3;
	// Determines the attributes for each effect
	this._attribute1 = attr1;
	this._attribute2 = attr2;
	this._attribute3 = attr3;
	// Determines the amount of targets.
	// -1 = All
	// 1+ = Number of targets
	this._targetType = tartype;
	// Casting time (in ms)
	this._castingTime = cast;
	// Cooldown
	this._cooldown = cd;
	// Amount of resource used to cast
	this._manaCost = mana;
	// Min. level required to use it
	this._minLevel = minlvl;
};

/**
 * ATTRIBUTES GETTERS AND SETTERS
 */

Spell.prototype = {
	// Name
	get Name() { return this._name; }
}


/* ======================================
 * ==========PLAYER CLASS================
 * ======================================
 */

function Player(pname, sex) {
	// Name of the user (current chat name)
	this._name = pname;
	// Player's RPG class
	this._class = undefined;
	// Level
	this._level = 1;
	// Max HP. Value only affected by leveling up or buffs
	this._maxHP = 1;
	// Current HP. Affected by damage and heal
	this._currentHP = 1;
	// Max mana. Value only affected by leveling up or buffs
	this._maxMana = 1;
	// Current mana. Affected by casting
	this._currentMana = 1;
	// Money
	this._money = 0;
	// Current player's experience. See details in LevelingSystem
	this._experience = 1;
	// Sex. Taken from GS's User model
	this._sex = undefined;
	// Attributes
	this._attributes = {};
};

/**
 * ATTRIBUTES GETTERS AND SETTERS
 */
Player.prototype = {
	// Name
	get Name() { return this._name;	},
	set Name(n) { this._name = n; },
	// Class
	get Class() { return this._class; },
	set Class(c) {
		if (c == undefined) {
			delete this._class;
			delete this._maxHP;
			delete this._currentHP;
			delete this._maxMana;
			delete this._currentMana;
			GU.sendMsg('Class reset!')
			return true;
		}

		if (RPG.Classes[c] != undefined) {
		this._class = RPG.Classes[c];
		this._maxHP = this._class.BaseHP;
		this._currentHP = this._maxHP;
		this._maxMana = this._class.BaseMana;
		this._currentMana = this._maxMana;
		GU.sendMsg('You chose the path of the ' + this._class.Name + '!');
		return true;
		} else {
			GU.sendMsg('Class couldn\'t be found!');
			return false;
		}
	},
	// HP (CurrentHP)
	get HP() { return this._currentHP; },
	set HP(v) {
		var newHP = this._currentHP + v;
		// TODO: People will not die til auras are implemented
		if (newHP < 1) {
			this._currentHP = 1;
			return;
		}

		if (newHP > this._maxHP) {
			this._currentHP = this._maxHP;
			return;
		}

		this._currentHP = newHP;
	},
	// Mana (CurrentMana)
	get Mana() { return this._currentMana },
	set Mana(v) {
		var newMana = this._currentMana + v;
		// TODO: People will not die til auras are implemented
		if (newMana < 1) {
			this._currentMana = 1;
			return;
		}

		if (newMana > this._maxMana) {
			this._currentMana = this._maxMana;
			return;
		}

		this._currentMana = newMana;
	}
};

Player.prototype.hasClass = function() {
	if (this._class != undefined) {
		return true;
	}

	return false;
};

/* ======================================
 * ==========RPGCLASS CLASS==============
 * ======================================
 */

function RPGClass(id, className, baseHP, baseResource, resource) {
	// Class ID, set manually
	this.ID = id;
	// Class name
	this.Name = className;
	// Base HP when the class is created
	this.BaseHP = baseHP;
	// Base amount of resource available
	this.BaseResource = baseResource;
	// Name of the resource used by the class, it can be mana, fury or energy
	this.ResourceName = resource;
};