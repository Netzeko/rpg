class Item{
	constructor(id){
		this._id = id;
		this.used = 0;
	}
	static staticName(){return 'Item';}
	static staticClassName(){return 'Item';}	
	getName(){return 'Item';}
	getClassName(){return 'Item';}
	usable(){return 0;}
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
	}
	//Retourne 1 si détruit, 0 sinon
	use(user,target){
		target.modStat('health', 30 );
		this.used = 1;
		return 1;
	}
	usable(){
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
