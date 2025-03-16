class Item{
	constructor(id){
		this._id = id;
		this.used = 0;
		this._character = null;
		//items[this._id] = this;
		this.name = 'Item';
		this._propertiesToDisplay = [['name','Name'],['buyprice','Value']];//nom de la propriété,nom a afficher
		this.price = 0;
		this.buyprice = 0;
	}
	
	static staticName(){return 'Item';}
	static staticClassName(){return 'Item';}	
	getName(){return 'Item';}
	getClassName(){return 'Item';}
	possible(user){return 0;}
	static basePrice(){ return 0; }
	
	saveInCookie(savename = ''){
		//console.log('saving '+this.getName());
		let keys = Object.keys(this);
		let savetext = '';
		for(let i = 0;i<keys.length;i++){
			if(keys[i][0] == '_') continue;
			//console.log('saving prop '+keys[i]);
			savetext+=''+keys[i]+':'+this[keys[i]]+':'+(typeof this[keys[i]]).substr(0,1)+'/';
		}
		setCookie('save'+savename+'item'+this._id,savetext);
	}
	
	loadFromCookie(savename='',iid){
		let data = getCookie('save'+savename+'item'+iid);
		if(!data || data.length == 0){
			return false;
		}
		let dataArray = data.split('/');
		//console.log('loading '+this.getName()+', '+dataArray.length+' properties');
		for(let i = 0;i<dataArray.length;i++){
			
			let variable = dataArray[i].split(':');
			if(variable[0].length ==0) continue;
			if(variable.length < 3) continue;
			
			//console.log('loading prop '+variable[0]+'='+variable[1]+' ('+variable[2]+')');
			if(variable[2] == 'number' || variable[2] == 'n'){
				this[variable[0]] = Number(variable[1]);
			}else if(variable[2] == 'string' || variable[2] == 's'){
				this[variable[0]] = variable[1];
			}
			//console.log('saved as '+typeof this[variable[0]]);
			
		}
	}
}

class HealPotion extends Item{
	constructor(id){
		super(id);
		this.usable = 1;
		this.healPower = 30;
		this.name = 'Heal potion';
		this._propertiesToDisplay.push(['healPower','Health']);
		this.price = 10;
		this.buyprice = 15;
	}
	//Retourne 1 si détruit, 0 sinon
	use(user,target){
		target.modStat('health', this.healPower );
		this.used = 1;
		return 1;
	}
	
	possible(user){
		return !this.used;
	}
	
	getName(){return 'Heal potion';}
	getClassName(){return 'HealPotion';}
	static staticName(){return 'Heal potion';}
	static staticClassName(){return 'HealPotion';}
	static basePrice(){ return 10; }

}

class Equipment extends Item{
	constructor(id){
		super(id);
		this._char = null;
		this.slot = -1;
		this.equipment = 1;
		this.name = 'Generic Equipment';
		this._propertiesToDisplay.push(['armorType','Type']);
	}

	unequip(){
		console.log('start super unequip');
		if(this._char){
			this._char._equipSlots[this.slot] = null;
			this._char = null;
			this.slot = -1;
			return 1;
		}
		return 0;
	}
	
	equip(user,slot){
		//console.log('E');
		//console.log(user);
		if(user._equipSlots[slot]) return 0;
		if(this._char){
			this.unequip();
		}
		this._char = user;
		this.slot = slot;
		this._char._equipSlots[this.slot] = this;
		return 1;
	}

	possible(user){
		return 1;
	}
	
	
	
	getName(){return 'Equipment';}
	getClassName(){return 'Equipment';}
	static staticName(){return 'Equipment';}
	static staticClassName(){return 'Equipment';}

}


class Armor extends Equipment{
	constructor(id){
		super(id);
		this.name = 'Generic Armor';
		this.armor = 0;
		this._propertiesToDisplay.push(['armorValue','Armor']);

	}
	
	unequip(){
		console.log('start unequip');

		let c = this._char;
		if(super.unequip()){
			console.log('ok super unequip');

			c.armor -= this.armorValue;
			c.calculateStats();
			return 1;
		}
		return 0;
	}
	
	equip(user,slot){
		//console.log('Q');
		//console.log(user);
		if(super.equip(user,slot)){
			console.log('ok super equip');
			this._char.armor += this.armorValue;
			this._char.calculateStats();
			return 1;
		}
		return 0;
	}

	possible(user){
		return 1;
	}
	
	static staticName(){return 'Armor';}
	static staticClassName(){return 'Armor';}
}


class BodyArmor extends Armor{
	constructor(id){
		super(id);
		this.armorSlot = 'armor';
		this.name = 'Generic body armor';
		this.armorType = 'Body armor';
	}
	
	static staticName(){return 'Quilted Armor';}
	static staticClassName(){return 'QuiltedArmor';}
}

class QuiltedArmor extends BodyArmor{
	constructor(id){
		super(id);
		this.armorValue = 3;
		this.name = 'Quilted Armor';
		this.price = 100;
		this.buyprice = 150;
	}
	
	getName(){return 'Quilted Armor';}
	getClassName(){return 'QuiltedArmor';}
	static staticName(){return 'Quilted Armor';}
	static staticClassName(){return 'QuiltedArmor';}
	static basePrice(){ return 100; }
}

class Gloves extends Armor{
	constructor(id){
		super(id);
		this.armorSlot = 'gloves';
		this.name = 'Generic gloves';
		this.armorType = 'Gloves';
	}
	
	static staticName(){return 'Gloves';}
	static staticClassName(){return 'Gloves';}
}

class LeatherGloves extends Gloves{
	constructor(id){
		super(id);
		this.armorValue = 1;
		this.name = 'Leather gloves';
		this.price = 30;
		this.buyprice = 45;
	}
	
	getName(){return 'Leather Gloves';}
	getClassName(){return 'LeatherGloves';}
	static staticName(){return 'Leather Gloves';}
	static staticClassName(){return 'LeatherGloves';}
	static basePrice(){ return 30; }
}

class Accessory extends Equipment{
	constructor(id){
		super(id);
		this.name = 'Generic accessory';
		this.expMult = 1;//unused, need events
	}
	
	unequip(){
		let c = this._char;
		if(super.unequip()){
			let keys = Object.keys(this);
			let keyname = '';
			for(let i = 0;i<keys.length;i++){
				if(keys[i].startsWith('modifier_')){
					c[keys[i]] -= this[keys[i]];
				}
			}
			c.calculateStats();
			c.showProperties();
			return 1;
		}
		return 0;
	}
	
	equip(user,slot){
		console.log('Q');
		console.log(user);
		if(super.equip(user,slot)){
			let keys = Object.keys(this);
			let keyname = '';
			for(let i = 0;i<keys.length;i++){
				if(keys[i].startsWith('modifier_')){
					this._char[keys[i]] += this[keys[i]];
				}
			}
			this._char.calculateStats();
			this._char.showProperties();
			return 1;
		}
		return 0;
	}

	possible(user){
		return 1;
	}
	
	getName(){return 'Accessory';}
	getClassName(){return 'Accessory';}
	static staticName(){return 'Accessory';}
	static staticClassName(){return 'Accessory';}
}

class CopperRing extends Accessory{
	constructor(id){
		super(id);
		this.armorSlot = 'ring';
		this.modifier_strength = 1;
		this.modifier_dexterity = 1;
		this.modifier_maxendurance = 100;
		this.name = 'Copper ring';
		this._propertiesToDisplay.push(['modifier_strength','Strength']);
		this._propertiesToDisplay.push(['modifier_dexterity','Dexterity']);
		this._propertiesToDisplay.push(['modifier_maxendurance','Max endurance']);
		this.price = 250;
		this.buyprice = 375;
	}
	
	getName(){return 'Copper Ring';}
	getClassName(){return 'CopperRing';}
	static staticName(){return 'Copper Ring';}
	static staticClassName(){return 'CopperRing';}
	static basePrice(){ return 250; }
}

class Weapon extends Equipment{
	constructor(id){
		super(id);
		this.armorSlot = 'hand';
		this.name = 'Generic weapon';
		this.armorType = 'Weapon';
		this._propertiesToDisplay.push(['attack','Attack']);
	}
	
	unequip(){
		let c = this._char;
		if(super.unequip()){
			c.weaponAttack -= this.attack;
			c.calculateStats();
			return 1;
		}
		return 0;
	}
	
	equip(user,slot){
		if(super.equip(user,slot)){
			this._char.weaponAttack += this.attack;
			this._char.calculateStats();
			return 1;
		}
		return 0;
	}

	
	getName(){return 'Weapon';}
	getClassName(){return 'Weapon';}
	static staticName(){return 'Weapon';}
	static staticClassName(){return 'Weapon';}
}


class BloodSword extends Weapon{
	constructor(id){
		super(id);
		this.bloodStack = 0;
		this.attack = 15;
		this.name = 'Blood sword';
		this._propertiesToDisplay.push(['bloodStack','Blood charge']);//facultatif, il n'est pas necessaire donner cette info
		this.price = 2000;
		this.buyprice = 3000;
	}
	
	unequip(){
		let c = this._char;
		if(super.unequip()){
			c.modifier_maxhealth -= this.bloodStack*5;
			c.removeEvent('evonkill',this,'onkill');
			c.calculateStats();
			c.showProperties();
			return 1;
		}
		return 0;
	}
	
	equip(user,slot){
		if(super.equip(user,slot)){
			this._char.modifier_maxhealth += this.bloodStack*5;
			this._char.addEvent('evonkill',this,'onkill');
			this._char.calculateStats();
			this._char.showProperties();
			return 1;
		}
		return 0;
	}
	
	onkill(params){
		this.bloodStack ++;
		this.price += 100;
		this._char.modifier_maxhealth += 5;
		this._char.calculateStats();
		this._char.showProperties();
		console.log('kill!');
	}

	loadFromCookie(savename='',iid){
		super.loadFromCookie(savename,iid);
		if(this._char){
			this._char.addEvent('evonkill',this,'onkill');
		}
	}
	getName(){return 'BloodSword';}
	getClassName(){return 'BloodSword';}
	static staticName(){return 'BloodSword';}
	static staticClassName(){return 'BloodSword';}
	static basePrice(){ return 2000; }
}

class RoughSaphire extends Item{
	constructor(id){
		super(id);
		this.price = 50;
	}
	getName(){return 'RoughSaphire';}
	getClassName(){return 'RoughSaphire';}
	static staticName(){return 'RoughSaphire';}
	static staticClassName(){return 'RoughSaphire';}
	static basePrice(){ return 50; }
}