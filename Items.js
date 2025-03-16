class Item{
	constructor(id){
		this._id = id;
		this.used = 0;
		this._character = null;
		items[this._id] = this;
	}
	static staticName(){return 'Item';}
	static staticClassName(){return 'Item';}	
	getName(){return 'Item';}
	getClassName(){return 'Item';}
	possible(user){return 0;}
	
	saveInCookie(savename = ''){
		console.log('saving '+this.getName());
		var keys = Object.keys(this);
		var savetext = '';
		for(var i = 0;i<keys.length;i++){
			if(keys[i][0] == '_') continue;
			//console.log('saving prop '+keys[i]);
			savetext+=''+keys[i]+':'+this[keys[i]]+':'+(typeof this[keys[i]])+'/';
		}
		setCookie('save'+savename+'item'+this._id,savetext);
	}
	
	loadFromCookie(savename='',iid){
		var data = getCookie('save'+savename+'item'+iid);
		if(data.length == 0){
			return false;
		}
		var dataArray = data.split('/');
		console.log('loading '+this.getName()+', '+dataArray.length+' properties');
		for(var i = 0;i<dataArray.length;i++){
			
			var variable = dataArray[i].split(':');
			if(variable[0].length ==0) continue;
			if(variable.length < 3) continue;
			
			//console.log('loading prop '+variable[0]+'='+variable[1]+' ('+variable[2]+')');
			if(variable[2].localeCompare('number') == 0){
				this[variable[0]] = Number(variable[1]);
			}else if(variable[2].localeCompare('string') == 0){
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
	}
	//Retourne 1 si détruit, 0 sinon
	use(user,target){
		target.modStat('health', 30 );
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

}

class Equipment extends Item{
	constructor(id){
		super(id);
		this._char = null;
		this.slot = -1;
		this.equipment = 1;
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
		console.log('E');
		console.log(user);
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
		console.log('Q');
		console.log(user);
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
	
	getName(){return 'Armor';}
	getClassName(){return 'Armor';}
	static staticName(){return 'Armor';}
	static staticClassName(){return 'Armor';}
}


class QuiltedArmor extends Armor{
	constructor(id){
		super(id);
		this.armorValue = 10;
		this.armorSlot = 'armor';
	}
	
	getName(){return 'Quilted Armor';}
	getClassName(){return 'QuiltedArmor';}
	static staticName(){return 'Quilted Armor';}
	static staticClassName(){return 'QuiltedArmor';}
}

class LeatherGloves extends Armor{
	constructor(id){
		super(id);
		this.armorValue = 5;
		this.armorSlot = 'gloves';
	}
	
	getName(){return 'Leather Gloves';}
	getClassName(){return 'LeatherGloves';}
	static staticName(){return 'Leather Gloves';}
	static staticClassName(){return 'LeatherGloves';}
}


class Accessory extends Equipment{
	constructor(id){
		super(id);

		
		this.expMult = 1;//unused, need events
	}
	
	unequip(){
		let c = this._char;
		if(super.unequip()){
			let keys = Object.keys(this);
			let keyname = '';
			for(var i = 0;i<keys.length;i++){
				if(keys[i].startsWith('modifier_')){
					c[keys[i]] -= this[keys[i]];
				}
			}
			c.calculateStats();
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
			for(var i = 0;i<keys.length;i++){
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
	}
	
	getName(){return 'Copper Ring';}
	getClassName(){return 'CopperRing';}
	static staticName(){return 'Copper Ring';}
	static staticClassName(){return 'CopperRing';}
}

