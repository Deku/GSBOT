var RPG = RPG || {};

RPG.Dungeon = {
	PlayerList : {},
	PlayerQueue : {}
}

RPG.Shop = {
	ItemList : {},
	ItemPrices : {}
}

RPG.LevelingSystem = {
	MinLevel : 1,
	MaxLevel : 60,
	ExpCurve : 1,

	isLevelUp : function() {}

}

RPG.Testing = {
	Spells : {
		'fireball' : new Spell('Fireball', 8, 53, 73, 1),
		'arcanemissiles' : new Spell('Arcane Missiles', 31, 24, 30, 1),
		'frostbolt' : new Spell('Frostbolt', 6, 18, 20, 1),
		'corruption' : new Spell('Corruption', 9, 40, 45, 1),
		'drainlife' : new Spell('Drain Life', 17, 50, 55, 1),
		'deathcoil' : new Spell('Death Coil', 23, 50, 90, 1),
		'searingpain' : new Spell('Searing Pain', 8, 59, 71, 1),
		'dongerstrike' : new Spell('Donger Strike', 1, 30, 70, 1),
		'sexiness' : new Spell('Sexiness', 1, 1, 1, 1)
	}
}

function Player() {
	this.Name = '';
	this.RPGClass = {};
	this.Level = 1;
	this.MaxHP = 1;
	this.CurrentHP = 1;
	this.Money = 0;
}

function RPGClass() {
	this.Name;
	this.BaseHP;
	this.BaseResource;
	this.ResourceName;
	this.Spells;
}

function Spell(name, resource, mindmg, maxdmg, minlvl) {
	this.Name = name;
	this.Resource = resource;
	this.MinDmg = mindmg;
	this.MaxDmg = maxdmg;
	this.MinLevel = minlvl;
}