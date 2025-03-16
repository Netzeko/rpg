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
		this.unsellable = 0;//pour les objets-clés
		this.rarity = 0;
	}
	
	backColor(){
		let color = 'rgba(0,0,0,0)';
		switch(this.rarity){
			case 0:
				color = 'rgba(100,100,100,0.5)';
				break;
			case 1:
				color = 'rgba(0,150,0,0.7)';
				break;
			case 2:
				color = 'rgba(0,50,200,0.7)';
				break;
			case 3:
				color = 'rgba(100,0,150,0.7)';
				break;
			case 4:
				color = 'rgba(255, 140, 26,0.7)';
				break;
		}
		return color;
	}
	
	foreColor(){
		let color = 'rgba(0,0,0,1)';
		switch(this.rarity){
			case 0:
				color = 'rgba(100,100,100,1)';
				break;
			case 1:
				color = 'rgba(0,150,0,1)';
				break;
			case 2:
				color = 'rgba(0,50,200,1)';
				break;
			case 3:
				color = 'rgba(100,0,150,1)';
				break;
			case 4:
				color = 'rgba(255, 140, 26,1)';
				break;
		}
		return color;
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
		if(!target.dead){
			target.modStat('health', this.healPower,user );
			this.used = 1;
			return 1;
		}
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


class SweetDrink extends HealPotion{
	constructor(id){
		super(id);
		this.name = 'Sweet drink';
		this.price = 50;
		this.buyprice = 75;
		this.moraleffect = -0.1;
		this.healPower = 20;
		this.manaRegen = 20;
		this.enduranceRegen = 20;
		this._propertiesToDisplay.push(['manaRegen','Mana']);
		this._propertiesToDisplay.push(['enduranceRegen','Endurance']);
		this.rarity = 1;
	}
	
	use(user,target){
		if(super.use(user,target)){
			target.modMoral(this.moraleffect);
			return 1;
		}
		return 0;
	}
	
	getName(){return 'Sweet drink';}
	getClassName(){return 'SweetDrink';}
	static staticName(){return 'Sweet drink';}
	static staticClassName(){return 'SweetDrink';}
	static basePrice(){ return 50; }

}


class BloodDrink extends HealPotion{
	constructor(id){
		super(id);
		this.name = 'Blood drink';
		this.price = 30;
		this.buyprice = 45;
		this.moraleffect = +6;
		this.healPower = 500;
		this.rarity = 4;
	}
	
	use(user,target){
		if(super.use(user,target)){
			target.modMoral(this.moraleffect);
			target.modifier_strength+=1;
			target.showProperties();
			return 1;
		}
		return 0;
	}
	
	getName(){return 'Blood drink';}
	getClassName(){return 'BloodDrink';}
	static staticName(){return 'Blood drink';}
	static staticClassName(){return 'BloodDrink';}
	static basePrice(){ return 30; }

}
