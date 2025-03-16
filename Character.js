class Character extends Creature{
	constructor(name,id,game){
		super(name,id,game);
		this.hiredtimes = 0;
		this.isCharacter = 1;
		this.exp = 0;
		this.totalexp = 0;
		this.skillpoints = 3;
		this.points = 60;
		
		this.dead = 0;
		this.regeneration = 1;
		this.skillsLearned = '';
		this._skills = [];
		this.maxqslot = 9;
		this._quickSlots = [null,null,null,null,null,null,null,null,null];
		this.maxequip = 10
		this._equipSlots = [null,null,null,null,null,
												null,null,null,null,null];
		this._equipSlotsNames = ['headgear','rhand','armor','lhand','gloves',
														'necklace','belt','ring','boots','ring' ];
		this._equipSlotsType = ['headgear','hand','armor','hand','gloves',
														'necklace','belt','ring','boots','ring' ];
		this.imageid = 1;
		this._prio = [ ['1m','t','100','Attack','rm'] ];
		
		this._quickSkills = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];
		this.maxqskill = 18;
		this.inTeam = 0;
		this.baseprice = 200;
		this.moral = 2;
		this.creaturetype = 'human';
	}
	
	initChar(){
		this._skills.push(Attack);
		this._skills.push(UseItem);
		this._skills[Attack.getClassName()] = Attack;
		this._skills[UseItem.getClassName()] = UseItem;
		this.skillsLearned += Attack.getClassName()+',';
		this.skillsLearned += UseItem.getClassName()+',';
		this._quickSkills[0] = 'Attack';
		this._quickSkills[1] = 'UseItem';
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
		
		for(let i=0;i<this.maxqskill;i++){
			if(!this['qskill'+i])continue;
			this._quickSkills[i] = this['qskill'+i];
		}
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
		
		for(let i=0;i<this._quickSkills.length;i++){
			if(!this._quickSkills[i])continue;
			this['qskill'+i] = this._quickSkills[i];
		}
		
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
		 htmlout = document.getElementById(prop+this._id+'_2');
		if(htmlout){
			htmlout.innerHTML = this[prop];
		}
	}
	
	getMoral(){
		if(this.moral <= 0){
			//really happy
			return 0;
		}
		else if(this.moral <= 1.2){
			//pretty happy
			return 1;
		}
		else if(this.moral <= 2.7){
			//neutral
			return 2;
		}
		else if(this.moral <= 4){
			//unhappy
			return 3;
		}
		else{
			//really unhappy
			return 4;
		}
	}

	modMoral(d){
		this.moral += d;
		this._price = Math.floor(Math.max(this.moral,0) * this.baseprice * (this.level+2)/3 * 4/(4+this.hiredtimes) );
		this.showProperty('_price');
		let smile = document.getElementById('smile'+this._id);
		let smile2 = document.getElementById('smile'+this._id+'_2');
		if(smile){
			smile.setAttribute('src','../ressources/icons/moral'+this.getMoral()+'.png');
		}

		if(smile2){
			smile2.setAttribute('src','../ressources/icons/moral'+this.getMoral()+'.png');
		}
	}
	
	showProperties(){
		this.modMoral(0);

		let keys = Object.keys(this);
		for(let i = 0;i<keys.length;i++){
			this.showProperty(keys[i]);
		}
		showSkillsChar(this._id);
		showSkillsCharInn(this);
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
	
	
	
	
	computeDeath(attacker){
		if(!this.dead){
			super.computeDeath(attacker);
			this.regeneration = 0;
			showDead(this._id);
			
			this.modMoral(+0.5);
			for(let i=0;i<g._partyMembers.length;i++){
				if(!g._partyMembers[i]) continue;
				g._partyMembers[i].modMoral(+0.04);
			}
			
			console.log('You are dead');
		}
	}
	
	resurrect(){
		if(!this.dead) return;
		this.dead = 0;
		this.health = 1;
		this.regeneration = 1;
		showAlive(this._id);
	}
	
	removeItem(item){
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
			this.points += 30 + Math.floor(this.level/10);
			this.skillpoints += 1;
			this.modMoral(-0.3);
			for(let i=0;i<g._partyMembers.length;i++){
				if(!g._partyMembers[i]) continue;
				g._partyMembers[i].modMoral(-0.03);
			}
			this.calculateStats();
			this.showProperties();
			return 1;
		}
		return 0;
	}
	
	
	
	learnSkill(skill){
		if(!skill)return;
		if(this._skills.indexOf(skill) != -1){
			console.log('skill already learned');
			return;
		}
		if(this.skillpoints <= 0){
			console.log('no skillpoint');
			return;
		}
		this._skills.push(skill);
		this._skills[skill.getClassName()] = skill;
		this.skillsLearned += skill.getClassName()+',';
		this.skillpoints--;
		skill.learn(this);
		this.showProperties();
		updateprio(this._id,-1);
	}
	
	loadSkills(){
		// console.log('loading skills for '+this.name);
		this._skills = [];
		let listNames = this.skillsLearned.split(',');
		for(let i=0;i<listNames.length;i++){
			if(listNames[i].length <= 0) continue;
			// console.log('-adding '+listNames[i]);
			this._skills[this._skills.length] = skills[listNames[i]];
			this._skills[listNames[i]] = skills[listNames[i]];
		}
	}
	
	doAction(){
		// console.log('doAction Start');
		if(!this.inTeam) return;
		let ok = 0;
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
			// console.log('targetcond=');
			// console.log(targetcond);
			
			ok = 0;
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
				if(!targetcond[j])continue;
				let okthis = 0;
				let prop = targetcond[j][stat];
				if(stat == 'health' || stat == 'mana' || stat == 'endurance' || stat=='mind'){
					prop = targetcond[j][stat]/targetcond[j]['max'+stat];
				}
				// console.log('testing '+prop+comp+treshold);
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
				// console.log('halt');
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
				ok = 0;
				// console.log('halt');
				continue;
			}
			
			switch(this._prio[i][3]){
				case '':
					ok = 0;
					break;
				/*
				case 'Attack':
					g.computeAttack(this,curtarget);
					ok = 1;
					break;*/
				case 'Nothing':
					ok = 1;
					break;
				default:
				//console.log(skills[this._prio[i][3]]);
					if( skills[this._prio[i][3]].possible(this,curtarget) ){
						//console.log('lets do this');
						g.useSkill(this,this._prio[i][3],curtarget);
						ok = 1;
					}else{
						//console.log('impossible');
						ok = 0;
					}
			
			}
			//console.log('end row;ok='+ok);
			if(ok){
				break;
			}
			
		}
		if(!ok){
			//console.log(this.name+' has nothing to do ');
			this.modStat('endurance',1);
		}
		setTimeout('doAction("c",'+this._id+')',this.timeAttack);
	}
	
	
	switchprio(m,n){
		if(m >= 0 && n >= 0 && m < this._prio.length && n < this._prio.length){
			let o = this._prio[n];
			this._prio[n] = this._prio[m];
			this._prio[m] = o;
			return 1;
		}
		return 0;
	}
	
	init(){
		console.log('Initialize');
		this.showProperties();
		setTimeout(this.regenerate,2000);
		console.log('End initialize');
	}
}

