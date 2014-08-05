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

function Player() {
	this.Name : '',
	this.RPGClass : {},
	this.Level : 1,
	this.MaxHP : 1,
	this.CurrentHP : 1,
	this.Money : 0
}

function RPGClass() {
	this.Name;
	this.BaseHP;
	this.BaseResource;
	this.ResourceName;
	this.Spells;
}

function Spell() {
	this.Name;
	this.Resource;
	this.MinDmg;
	this.MaxDmg;
	this.MinLevel;
}