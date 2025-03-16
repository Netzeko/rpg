class Character extends Creature{
	constructor(name,id,game) {
		super(name,id,game);
		
		this.isCharacter = 1;
		this.exp = 0;
		this.totalexp = 0;
		this.skillpoints = 1;
		this.points = 10;
		
		this.dead = 0;
		this.regeneration = 1;
		this.skillsLearned = '';
		this._skills = [];
		this.maxqslot = 6;
		this._quickSlots = [null,null,null,null,null,null];
		this.maxequip = 12
		this._equipSlots = [null,null,null,null,null,null,
												null,null,null,null,null,null];
		this._equipSlotsNames = ['headgear','rhand','armor','lhand','gloves','necklace',
														'belt','bracelet','pants','ring','boots','ring' ];
		this._equipSlotsType = ['headgear','hand','armor','hand','gloves','necklace',
														'belt','bracelet','pants','ring','boots','ring' ];
		this.imageid = 1;
		this._prio = [ ['1m','t','100','Attack','rm'] ];
	}
	
	loadFromCookie(savename=''){
		let data = getCookie('save'+savename+'char'+this.name);
		if(!data || data.length == 0){
			return false;
		}
		let dataArray = data.split('/');
		console.log('loading '+this.name+', '+dataArray.length+' properties');
		for(let i = 0;i<dataArray.length;i++){
			
			let variable = dataArray[i].split(':');
			if(variable[0].length ==0) continue;
			if(variable.length < 3) continue;
			
			//console.log('loading prop '+variable[0]+'='+variable[1]+' ('+variable[2]+')');
			if(variable[2] == 'number' || variable[2] == 'n'){
				this[variable[0]] = Number(variable[1]);
			}else if(variable[2] == 'string' || variable[2] == 's'){
				if(variable[0].startsWith('prio')){
					let numrow = Number(variable[0].substr(4));
					let prio = variable[1].split('_');
					this._prio[numrow] = prio;
					
				}else{
					this[variable[0]] = variable[1];
				}
			}
			//console.log('saved as '+typeof this[variable[0]]);
			
		}
		
		this.loadSkills();
		this.loadQuickSlots(savename);
		this.loadEquipments(savename);
	}
	
	loadQuickSlots(savename){
		//console.log('Loading qslots...');
		for(let i = 0;i<this.maxqslot;i++){
			if(!this['qslot'+i]) continue;
			let itemSave = this['qslot'+i].split('_');
			let item = new window[itemSave[0]](this._game._nextItemId++);
			this._quickSlots[i] = item;
			//items[item._id] = item;
			item._character = this;
			item.loadFromCookie(savename,itemSave[1]);
			delete this['qslot'+i];
		}
	}
	
	loadEquipments(savename){
		//console.log('Loading equipments...');
		for(let i = 0;i<this.maxequip;i++){
			if(!this['equip'+i]) continue;
			let itemSave = this['equip'+i].split('_');
			let item = new window[itemSave[0]](this._game._nextItemId++);
			this._equipSlots[i] = item;
			//items[item._id] = item;
			item._character = this;
			item._char = this;
			item.loadFromCookie(savename,itemSave[1]);
			delete this['equip'+i];
		}
	}
	
	saveInCookie(savename=''){
		console.log('saving '+this.name);
		
		this.saveQuickSlots(savename);
		this.saveEquipments(savename);
		
		for(let i =0;i<this._prio.length;i++){
			this['prio'+i] = this._prio[i][0]+'_'+this._prio[i][1]+'_'+this._prio[i][2]+'_'+this._prio[i][3]+'_'+this._prio[i][4];
		}
		
		let keys = Object.keys(this);
		let savetext = '';
		for(let i = 0;i<keys.length;i++){
			if(keys[i][0] == '_') continue;
			//console.log('saving prop '+keys[i]);
			savetext+=''+keys[i]+':'+this[keys[i]]+':'+(typeof this[keys[i]]).substr(0,1)+'/';
		}
		setCookie('save'+savename+'char'+this.name,savetext);
	}
	
	saveQuickSlots(savename){
		//console.log('saving quickslots...');
		for(let i=0;i<this._quickSlots.length;i++){
			if( !this._quickSlots[i]) continue;
			//console.log('index'+i);
			this._quickSlots[i].saveInCookie(savename);
			this['qslot'+i] = this._quickSlots[i].getClassName()+'_'+this._quickSlots[i]._id;
		}
	}
	
	saveEquipments(savename){
		console.log('saving equipments...');
		for(let i=0;i<this._equipSlots.length;i++){
			if( !this._equipSlots[i]) continue;
			console.log('index'+i);
			this._equipSlots[i].saveInCookie(savename);
			this['equip'+i] = this._equipSlots[i].getClassName()+'_'+this._equipSlots[i]._id;
		}
	}
	
	showProperty(prop){			
		let htmlout = document.getElementById(prop+this._id);
		if(htmlout){
			htmlout.innerHTML = this[prop];
		}
	}
	
	showProperties(){
		let keys = Object.keys(this);
		for(let i = 0;i<keys.length;i++){
			this.showProperty(keys[i]);
		}
		showSkillsChar(this._id);
		showBars(this);
	}
	
	nextQuickslot(){
		for(let i=0;i<this._quickSlots.length;i++){
			if(!this._quickSlots[i]){
				return i;
			}
		}
		return -1;
	}
	
	//free = on cherche un emplacement libre
	equipslot(slotname,free = 1){
		let slot = null;
		for(let i=0;i<this._equipSlotsType.length;i++){
			if(this._equipSlotsType[i] == slotname){
				if(free && !this._equipSlots[i]){
					return i;
				}
				if(!free && this._equipSlots[i]){
					return i;
				}
			}
		}
		return -1;
	}
	
	regenerate(force = false){
		if( this.regeneration || force){		
			if(this.health < this.maxhealth ){
				this.health += Math.floor(1+this.constitution/10);
				if(this.health > this.maxhealth){
					this.health = this.maxhealth;
				}
				this.showProperty('health');
			}
			if(this.endurance < this.maxendurance ){
				this.endurance += Math.floor(1+this.strength/10);
				if(this.endurance > this.maxendurance){
					this.endurance = this.maxendurance;
				}
				this.showProperty('endurance');
			}
			if(this.mana < this.maxmana ){
				this.mana += Math.floor(1+this.wisdom/10);
				if(this.mana > this.maxmana){
					this.mana = this.maxmana;
				}
				this.showProperty('mana');
			}
			if(this.mind < this.maxmind ){
				this.mind += Math.floor(1+this.spirit/10);
				if(this.mind > this.maxmind){
					this.mind = this.maxmind;
				}
				this.showProperty('mind');
			}
			showBars(this);
		}
		
		//setTimeout("regenerate()",1000);
	}
	
	
	modStat(stat,value){
		let stats = ['health','endurance','mana','mind'];
		if(stats.indexOf(stat) != -1){
			this[stat] += value;
			if(this[stat] > this['max'+stat]){
				this[stat] = this['max'+stat];
			}
			if(this[stat] < 0){
				this[stat] = 0;
			}
			
			this.showProperty(stat);
			showBars(this);
			return 1;

		}
		return -1;
	}
	
	computeDeath(attacker){
		super.computeDeath(attacker);
		this.regeneration = 0;
		showDead(this._id);
		console.log('You are dead');
	}
	
	resurrect(){
		if(!this.dead) return;
		this.dead = 0;
		this.health = 1;
		this.regeneration = 1;
		showAlive(this._id);
	}
	
	removeItem(item){
		console.log('character removeitem');
		if(item.usable && this._quickSlots.indexOf(item) > -1){
			this._quickSlots[this._quickSlots.indexOf(item)] = null;
			return 1;
		}else if(item.equipment && this._equipSlots.indexOf(item) > -1){
			let slot = this._equipSlots.indexOf(item);
			console.log('character removeitem : found');
			item.unequip();
			showEquipmentName(this._id,slot,'['+this._equipSlotsNames[slot]+']');

			//this._equipSlots[this._equipSlots.indexOf(item)] = null;
			return 1;
		}
		return 0;
	}
	
	addItem(item,slot){
		//console.log(item);
		//console.log(slot);
		if(slot <100 ){
			if(this._quickSlots[slot]) return 0;//TODO : inverser equipement si deja pris
			if(item._character){
				item._character.removeItem(item);
			}
			item._character = this;
			this._quickSlots[slot] = item;
			return 1;
		}else{ //Equipement
			slot -=100;
			if(this._equipSlots[slot]) return 0;
			item.unequip();
			item.equip(this,slot);
			item._character = this;
			showEquipmentName(this._id,slot,item.name);

			return 1;

		}
	}
	
	upgrade(attr){
		let attributes = ['strength','constitution','dexterity','perception','spirit','wisdom','luck','speed'];
		if(attributes.indexOf(attr) != -1){
			if(this.points >= this[attr] ){
				this.points -= this[attr];
				this[attr]++;
				this.calculateStats();
				this.showProperties();
				return 1;
			}
			return 0;
		}
		return -1;
	}
	
	neededExp(){
		return 100*this.level+500;
	}
	
	levelUp(){
		if(this.exp >= this.neededExp()){
			console.log('LEVEL UP !');
			this.exp -= this.neededExp();
			this.level ++;
			this.points += 20 + Math.floor(this.level/10);
			this.skillpoints += 1;
			this.calculateStats();
			this.showProperties();
			return 1;
		}
		return 0;
	}
	
	crit(){
		//luck > 285 => crit 100% (?a ne doit jamais arriver)
		return Math.random() * 300.0 < 15+this.luck;
	}
	
	learnSkill(skill){
		if(this._skills.indexOf(skill) != -1){
			console.log('skill already learned');
			return;
		}
		if(this.skillpoints <= 0){
			console.log('no skillpoint');
			return;
		}
		this._skills[this._skills.length] = skill;
		this._skills[skill.getClassName()] = skill;
		this.skillsLearned += skill.getClassName()+',';
		this.skillpoints--;
		this.showProperties();
		updateprio(this._id,-1);
	}
	
	loadSkills(){
		console.log('loading skills for '+this.name);
		this._skills = [];
		let listNames = this.skillsLearned.split(',');
		for(let i=0;i<listNames.length;i++){
			if(listNames[i].length <= 0) continue;
			console.log('-adding '+listNames[i]);
			this._skills[this._skills.length] = skills[listNames[i]];
			this._skills[listNames[i]] = skills[listNames[i]];
		}
	}
	
	doAction(){
		//console.log('doAction Start');
		for(let i=0;i<this._prio.length;i++){
			//console.log('Row 1');
			let targetcond = [];
			let condall = 0;
			switch( this._prio[i][0] ){
				case '1m':
					if(currentGroup){
						targetcond = currentGroup._monsters;
						condall = 0;
					}
					break;
				case 'am':
					if(currentGroup){
						targetcond = currentGroup._monsters;
						condall = 1;
					}
					break;
				case 'tm':
					if(targetedChar && targetedChar.isMonster){
						targetcond = [targetedChar];
						condall = 0;
					}
					break;
				case '1a':
					targetcond = g._partyMembers.slice(1);
					condall = 0;
					break;
				case 'aa':
					if(currentGroup){
						targetcond = g._partyMembers.slice(1);
						condall = 1;
					}
					break;
				case 'ta':
					if(targetedChar && targetedChar.isCharacter){
						targetcond = [targetedChar];
						condall = 0;
					}
					break;
				case 's':
					targetcond = [this];
					break;
			}
			//console.log('targetcond=');
			//console.log(targetcond);
			
			let ok = 0;
			let stat = '';
			let comp = '=';
			let treshold = Number(this._prio[i][2])/100;
			switch( this._prio[i][1] ){
				case '':
					ok = 0;
					break;
				case 'hp':
					stat = 'health';
					comp = '>';
					break;
				case 'hm':
					stat = 'health';
					comp = '<';
					break;
				case 'ep':
					stat = 'mana';
					comp = '>';
					break;
				case 'em':
					stat = 'mana';
					comp = '<';
					break;
				case 'sp':
					stat = 'endurance';
					comp = '>';
					break;
				case 'sm':
					stat = 'endurance';
					comp = '<';
					break;
				case 'mp':
					stat = 'mind';
					comp = '>';
					break;
				case 'mm':
					stat = 'mind';
					comp = '<';
					break;
				case 'd':
					stat = 'dead';
					comp = '>=';
					treshold = 1;
					break;
				case 't':
					stat = '_id';
					comp = '>=';
					treshold = 1;
					ok = 1;
					break;
			}
			
			let curtarget = null;
			for(let j=0;j<targetcond.length;j++){
				let okthis = 0;
				let prop = targetcond[j][stat];
				if(stat == 'health' || stat == 'mana' || stat == 'endurance' || stat=='mind'){
					prop = targetcond[j][stat]/targetcond[j]['max'+stat];
				}
				//console.log('testing '+prop+comp+treshold);
				if( eval( prop+comp+treshold )){
					okthis = 1;
				}
				
				if(!condall && okthis){
					ok = 1;
					curtarget = targetcond[j];
					break;
				}
				if(condall && !okthis){
					ok = 0;
					break;
				}
			}
			
			if(!ok){
				continue;
			}
			
			switch(this._prio[i][4]){
				case '':
					ok = 0;
					break;
				case 's':
					curtarget = this;
					break;
				case 'ct':
					curtarget = curtarget;
					break;
				case 'rm':
					curtarget = randomMonster();
					break;
				case 'ra':
					curtarget = randomCharacter();
					break;
				case 'tm':
					if(targetedChar && targetedChar.isMonster){
						curtarget = targetedChar;
					}else{
						curtarget = null;
					}
					break;
				case 'ta':
					if(targetedChar && targetedChar.isCharacter){
						curtarget = targetedChar;
					}else{
						curtarget = null;
					}
					break;
			}
			//console.log('curtarget=');
			//console.log(curtarget);
			if(!curtarget || !ok){
				continue;
			}
			
			switch(this._prio[i][3]){
				case '':
					ok = 0;
					break;
				case 'Attack':
					g.computeAttack(this,curtarget);
					ok = 1;
					break;
				case 'Nothing':
					ok = 1;
					break;
				default:
					g.useSkill(this,curtarget,this._prio[i][3]);
					ok = 1;
			}
			//console.log('end row;ok='+ok);
			if(ok){
				break;
			}
			
		}

		setTimeout('doAction("c",'+this._id+')',this.timeAttack);
	}
	
	
	
	
	init(){
		console.log('Initialize');
		this.showProperties();
		setTimeout(this.regenerate,2000);
		console.log('End initialize');
	}
}

