

class NPC extends Entity{
	constructor(id,name){
		super(id);
		this.name = name;
		this._states = [];
		this._options = [];
		this._square = null;
		this._optionid = 1;
		this.currentstate = 1;
		
	}
	
	/* opt : tableau avec 0=>type option,1=>text 
	 * act : tableau d'objet de classe action
	 */
	addStateOption(stateid,opttype,opttext,acts,nextstate){
		if(!this._states[stateid]){
			this._states[stateid] = [];
		}
		let newopt = this._optionid++;
		this._states[stateid].push(newopt);
		this.options[newopt] = [opttype,opttext,acts,nextstate];
	}
	
	interact(optionid,item = null){
		let ok = 0;
		if(this._options[optionid][0] != 'needitem'){
			ok = 1
		}else{
			if(this.neededitem == item.getClassName()
			&& (!this.neededprop || item[this.neededprop] == this.neededval ) ){
				ok = 1;
			}else{
				moveItem(item,document.getElementById('inventoryWindow') );
			}
		}
		if(ok){
			for(let i=0;i<this._options[optionid][2].length;i++){
				this._options[optionid][2][i].trigger();
			}
			this.currentstate = this._options[optionid][3];
		}
	}
	
	showWindow(){
		
		super.showWindow();
	}
	
	addItem(item,slot){
		item._character = this;
		this._item = item;
		this.interact(slot,item);
	}
	
	removeItem(item){
		if(this._item){
			delete this._item;
			return 1;
		}
		return 0;
	}

}
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
	
	saveAsString(){
		//todo
		//instring
	}
	
	loadFromString(){
		//todo
	}
}

class GiveObject extends Action{
	constructor(npc,itemname){
		super(npc);
		this.itemname = itemname;
	}
	
	trigger(){
		addItemFromName(this.itemname);
		return 1;
	}
}

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
}