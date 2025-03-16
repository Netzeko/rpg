class Creature{
	constructor(name,id) {
		this.level = 1;
		this._id = id;
		this.name = name;
		//Attributes
		// https://en.wikipedia.org/wiki/Attribute_(role-playing_games)
		this.strength = 5;
		this.constitution = 5;
		this.dexterity = 5;
		this.perception = 5;
		this.spirit = 5;
		this.wisdom = 5;
		this.luck = 5;
		this.speed = 5;
		
		this.weaponAttack = 5;
		this.armor = 0;
		
		this.modifier_strength = 0;
		this.modifier_constitution = 0;
		this.modifier_dexterity = 0;
		this.modifier_perception = 0;
		this.modifier_spirit = 0;
		this.modifier_wisdom = 0;
		this.modifier_luck = 0;
		this.modifier_speed = 0;
		this.modifier_maxhealth = 0;
		this.modifier_maxendurance = 0;
		this.modifier_maxmana = 0;
		this.modifier_maxmind = 0;
		
		
		this.calculateStats(true);
		
	}
	
	calculateStats(refresh = false){
		this.maxhealth = 10+this.level+(this.constitution+this.modifier_constitution)*8 + this.modifier_maxhealth;
		this.maxendurance = 10+this.level+(this.strength+this.modifier_strength)*8 + this.modifier_maxendurance;
		this.maxmana = 10+this.level+(this.wisdom+this.modifier_wisdom)*8 + this.modifier_maxmana;
		this.maxmind = 10+this.level+(this.spirit+this.modifier_spirit)*8 + this.modifier_maxmind;
		
		if(refresh){
			this.health = this.maxhealth;
			this.endurance = this.maxendurance;
			this.mana = this.maxmana;
			this.mind = this.maxmind;
		}
		
		this.attack = (this.strength+this.modifier_strength / 5)*this.weaponAttack;//changer par l'attaque de l'arme
		this.defense = this.armor;//changer par l'armure
		this.precision = 10+(this.dexterity+this.modifier_dexterity)*5;
		this.dodge = 10+(this.perception+this.modifier_perception)*5;
		this.timeAttack = Math.floor(1000 * (50.0 / (10+this.speed+this.modifier_speed)));
	}
	
	getAttribute(i){
		switch(i){
			case 0:
			 return 'strength';
		 case 1:
			 return 'constitution';
		 case 2:
			 return 'dexterity';
		 case 3:
			 return 'perception';
		 case 4:
			 return 'spirit';
		 case 5:
			 return 'wisdom';
		 case 6:
			 return 'luck';
		 case 7:
			 return 'speed';
		}
		return '';
	}
}