class Monster{
	constructor(id) {
		this.strength = 5;
		this.constitution = 5;
		this.dexterity = 5;
		this.perception = 4;
		this.spirit = 5;
		this.wisdom = 5;
		this.luck = 5;
		
		this.exp = 200;
		this.id = id;
		this.name = 'sampleMonster';
		this.calculateStats();
		
	}
	
	calculateStats(){
		//console.log('calcStats');
		this.maxhealth = 10+this.constitution*8;
		this.health = this.maxhealth;
		this.maxendurance = 10+this.strength*8;
		this.endurance = this.maxendurance;
		this.maxmana = 10+this.wisdom*8;
		this.mana = this.maxmana;
		this.maxmind = 10+this.spirit*8;
		this.mind = this.maxmind;
		
		this.attack = (this.strength / 5)*10;//changer par l'attaque de l'arme
		this.defense = 5;//changer par l'armure
		this.precision = 10+this.perception*5;
		this.dodge = 10+this.perception*5;
	}
	
	/*Retourne -1 si erreur, 0 manqué, 1 touché, 2 si mort*/
	attacked(chara){
		if(this.health <= 0) return -1;
		
		var damages = chara.attack - this.defense;
		var hit = (chara.precision / this.dodge) *0.4;
		
		var res = 1.0-Math.random();
		if(res > hit){
			console.log('miss!');
			return 0;
		}

		console.log('hit!');
		this.health -= damages;
		this.showProperty('health');
		
		if(this.health <= 0){
			console.log('dead');
			return 2;
		}
		return 1;
		
	}
	
	showProperty(prop){			
		var htmlout = document.getElementById('monster'+this.id+prop);
		if(htmlout){
			htmlout.innerHTML = this[prop];
		}
	}
	
	showProperties(){
		var keys = Object.keys(this);
		for(var i = 0;i<keys.length;i++){
			this.showProperty(keys[i]);
		}
	}
}