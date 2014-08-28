var RPG = RPG || {};

RPG.PlayerList = {};

RPG.Shop = {
	ItemList : {},
	ItemPrices : {}
};

RPG.LevelingSystem = {
	MinLevel : 1,
	MaxLevel : 60,
	MaxExp : 100000,
	ExpCurve : 1,

	isLevelUp : function(exp, currLvl) {
		var nextLvl = int.Parse(currLvl) + 1;
		var neededExp = (this.MaxExp / (this.MaxLevel ^ (this.ExpCurve + 1))) * (nextLvl ^ (this.ExpCurve + 1));

		if (exp >= neededExp) {
			return true;
		} else {
			return false;
		}
	},
	isMaxLevel : function(currLvl) {
		if (currLvl < this.MaxLevel) {
			return false;
		} else if (currLvl >= this.MaxLevel) {
			return	true;
		}
	}
};



