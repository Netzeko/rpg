var her ;
function testnpc(){
	her = new NPC(g._nextEntityId++,'testnpc','sww1');
	let acts = [];
	acts.push(new GiveObject(her,'HealPotion'));
	acts.push(new GiveObject(her,'HealPotion'));
	acts.push(new GiveObject(her,'HealPotion'));
	her.addState(1,'wantsomepotion');
	her.addStateOption(1,'button',['yes',20,20],acts ,2);
	her.addStateOption(1,'button',['no',400,20], [] ,2);
	
	her.addStateOption(1,'dialog',['yes'],acts ,2);
	her.addStateOption(1,'dialog',['no'], [] ,2);
	her.addState(2,'takecare');


}
	


class NPC extends Entity{
	constructor(id,name,sprite){
		super(id);
		this.name = name;
		
		/* Row : 0 => texte a afficher
		 *       1 => option1
		 *       2 => option2....
		 */
		this._states = [];
		
		/* Row : 0=> optiontype
		 *       1=> [ 0=> optiontext, 1=> positionright, 2=> positionbottom ]
		 *       2=> actions array
		 *       3=> next state
		 */
		this._options = [];
		
		this.sprite = sprite;
		this._square = null;
		this._optionid = 1;
		this.currentstate = 1;
		
	}
	
	addState(stateid,statetext){
		if(!this._states[stateid]){
			this._states[stateid] = [ statetext ];
		}else{
			this._states[stateid][0] = statetext;
		}
	}
	
	/* opttype : 'needobject','dialog','button'
	 * opttext : 0 => vartrad du texte afficher, 1=> right, 2=> bottom
	 * act : tableau d'objet de classe action
	 */
	addStateOption(stateid,opttype,opttext,acts,nextstate,npcanswer = ''){
		if(!this._states[stateid]){
			this._states[stateid] = [ '' ];
		}
		let newopt = this._optionid++;
		this._states[stateid].push(newopt);
		this._options[newopt] = [opttype,opttext,acts,nextstate];
	}
	
	interact(optionid,item = null){
		let ok = 0;
		if(this._options[optionid][0] != 'needitem'){
			ok = 1
		}else if(this._options[optionid][0] == 'needitem'){
			if(this.neededitem == item.getClassName()
			&& (!this.neededprop || item[this.neededprop] == this.neededval ) ){
				ok = 1;
			}else{
				//console.log('give back');
				moveItem(item,document.getElementById('inventoryWindow') );
			}
		}
		if(ok){
			for(let i=0;i<this._options[optionid][2].length;i++){
				if(!this._options[optionid][2][i].trigger()){
					for(let j=0;j<i;j++){
						this._options[optionid][2][i].revert();
					}
					ok = 0;
					break;
				}
			}
			if(ok){
				this.currentstate = this._options[optionid][3];
			}
		}
		this.showWindow();
	}
	
	saveInCookie(savename=''){
		console.log('saving entity'+this._id);
		
		this.maxstates = 1;
		for(let i=0;i<this._states.length;i++){
			this.maxstates ++;
			if(!this._states[i]) continue;
			this['state'+i] = this._states[i][0];
			for(let j=1;j<this._states[i].length;j++){
				this['state'+i]+=','+this._states[i][j];
			}
		}
		
		
		/* Row : 0 => texte a afficher
		 *       1 => option1
		 *       2 => option2....
		 */
		this.maxoptions = 1;
		for(let i=0;i<this._options.length;i++){
			this.maxoptions ++;
			if(!this._options[i]) continue;
			this['option'+i] = 
				this._options[i][0]+','+
				this._options[i][1][0]+','+
				this._options[i][1][1]+','+
				this._options[i][1][2]+','+
				this._options[i][3];
			this['optionaction'+i] = '';
			for(let j=0;j<this._options[i][2].length;j++){
				let act = this._options[i][2][j];
				this['optionaction'+i]+=act.getClassName()+'_'+act.saveToString()+',';
			}
		}
		
		/* Row : 0=> optiontype
		 *       1=> [ 0=> optiontext, 1=> positionright, 2=> positionbottom ]
		 *       2=> actions array
		 *       3=> next state
		 */
		
		super.saveInCookie(savename);
		
	}
	
	loadFromCookie(savename=''){
		super.loadFromCookie(savename);
		
		for(let i=0;i<this.maxstates;i++){
			if(!this['state'+i]) continue;
			let statedata = this['state'+i].split(',');
			this._states[i] = statedata;
			delete this['state'+i];
		}
		
		for(let i=0;i<this.maxoptions;i++){
			//console.log('option'+i);
			//console.log(this['option'+i]);
			if(!this['option'+i]) continue;
			let optiondata = this['option'+i].split(',');
			let optionformated = [optiondata[0] , [optiondata[1],optiondata[2],optiondata[3]],[/*actions here*/],optiondata[4]  ];
			if(this['optionaction'+i]){
				let allactions = this['optionaction'+i].split(',');
				//console.log(allactions);	
				for(let j=0;j<allactions.length;j++){
					
					if(!allactions[j]) continue;
					let actionClass = allactions[j].split('_')[0];
					let actionSaveData = allactions[j].split('_')[1];
					let act = new window[actionClass](this);
					act.loadFromString(actionSaveData);
					optionformated[2].push(act);
				}
			}
			
			this._options[i] = optionformated;
			delete this['option'+i];
			delete this['optionaction'+i];
		}
	}
	
	showWindow(){
		clearOverWindow();
		this._needoption  = 0;
		showDialog(l.text(this._states[this.currentstate][0],1));
		for(let i=1;i<this._states[this.currentstate].length;i++){
			let optid = this._states[this.currentstate][i];
			switch( this._options[optid][0] ){
				case 'needitem':
					showKeySlot('npc',this._options[optid][1][1],this._options[optid][1][2]);
					this._needoption = optid;
					break;
				case 'dialog':
					showAnswer(l.text(this._options[optid][1][0],1),'interact('+optid+')');
					break;
				case 'button':
					showButton(l.text(this._options[optid][1][0],1),this._options[optid][1][1],this._options[optid][1][2],'interact('+optid+')');
					break;
			}
		}
		super.showWindow();
	}
	
	addItem(item,slot){
		item._character = this;
		this._item = item;
		this.interact(this._needoption,item);
	}
	
	removeItem(item){
		if(this._item){
			delete this._item;
			return 1;
		}
		return 0;
	}
	
	getClassName(){ return 'NPC'; }
	static staticClassName(){ return 'NPC'; }

}
registerClass(NPC);
//option : give object (keyslot),answer, action (button)

class Action{
	constructor(npc){
		this.isaction = 1;
		this._npc = npc;
	}
	
	//retourne 1 si exécuté avec succès 
	trigger(){
		return 1;
	}
	
	saveToString(){
		//console.log('saving ');
		let keys = Object.keys(this);
		let savetext = '';
		for(let i = 0;i<keys.length;i++){
			if(keys[i][0] == '_') continue;
			//console.log('saving prop '+keys[i]);
			savetext+=''+keys[i]+'|'+this[keys[i]]+'|'+(typeof this[keys[i]]).substr(0,1)+'\\';
		}
		return savetext;
	}
	
	loadFromString(str){
		let dataArray = str.split('\\');
		for(let i = 0;i<dataArray.length;i++){
			
			let variable = dataArray[i].split('|');
			if(variable[0].length ==0) continue;
			if(variable.length < 3) continue;
			
			if(variable[2] == 'number' || variable[2] == 'n'){
				this[variable[0]] = Number(variable[1]);
			}else if(variable[2] == 'string' || variable[2] == 's'){
				this[variable[0]] = variable[1];
			}
		}
	}
	
	revert(){
		
	}
	
	getClassName(){ return 'Action'; }
	static staticClassName(){ return 'Action'; }
}
registerClass(Action);

class GiveObject extends Action{
	constructor(npc,itemname){
		super(npc);
		this.itemname = itemname;
	}
	
	trigger(){
		addItemFromName(this.itemname);
		return 1;
	}
	
	getClassName(){ return 'GiveObject'; }
	static staticClassName(){ return 'GiveObject'; }

}
registerClass(GiveObject);

class MoveTo extends Action{
	constructor(npc,level,x,y,z){
		super(npc);
		this.level = level;
		this.x = x;
		this.y = y;
		this.z = z;
	}
	
	trigger(){
		if(this._square){
			this._square._entity = null;
		}
		g._levels[this.level].getSquare(this.x,this.y,this.z)._entity = this._npc;
		return 1;
	}
	getClassName(){ return 'MoveTo'; }
	static staticClassName(){ return 'MoveTo'; }
}
registerClass(MoveTo);


class GiveGold extends Action{
	constructor(npc,amount){
		super(npc);
		this.amount = amount;
	}
	
	trigger(){
		if(g.gold + this.amount >= 0){
			g.addGold(this.amount)
			return 1;
		}
		return 0;
	}
	getClassName(){ return 'GiveGold'; }
	static staticClassName(){ return 'GiveGold'; }
}
registerClass(GiveGold);

class GiveExp extends Action{
	constructor(npc,amount){
		super(npc);
		this.amount = amount
	}
	
	trigger(){
		g.giveExpToAll(this.amount);
		return 1;
	}
	getClassName(){ return 'GiveExp'; }
	static staticClassName(){ return 'GiveExp'; }
}
registerClass(GiveExp);