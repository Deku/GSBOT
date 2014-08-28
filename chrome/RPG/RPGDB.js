RPG.Classes = {
	'mage' : new RPGClass(1, 'Mage', 100, 100, 'mana'),
	'warlock' : new RPGClass(2, 'Warlock', 100, 100, 'mana')
};

RPG.Spells = {
	/**
	 * Mage Spells
	 */
	'fireball' : new Spell('Fireball', 8, 24, 60, 1, 1),
	'arcanemissiles' : new Spell('Arcane Missiles', 31, 53, 90, 1, 1),
	'frostbolt' : new Spell('Frostbolt', 6, 18, 20, 1, 1),
	/**
	 * Warlock Spells
	 */
	'corruption' : new Spell('Corruption', 9, 40, 45, 1, 2),
	'drainlife' : new Spell('Drain Life', 17, 50, 55, 1, 2),
	'deathcoil' : new Spell('Death Coil', 23, 50, 90, 1, 2),
	'searingpain' : new Spell('Searing Pain', 8, 59, 71, 1, 2),
	/**
	 * General Spells
	 */
	'dongerstrike' : new Spell('Donger Strike', 1, 30, 70, 1, 0),
	'sexiness' : new Spell('Sexiness', 1, 0, 0, 1, 0)
};