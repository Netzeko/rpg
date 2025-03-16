class Chest extends Entity{
	constructor(id){
		super(id);
		this._square = null;
		this.state = 1;//1 = closed,not locked ; 2 = opened ; 3 = locked ;
		this._items = [];
		this.needkey = 0;
		this.sprite = 'chest';
	}
	
	setNeededKey(key,prop,val){
		this.needkey = 1;
		this.neededkey = key;//itemclass of the needed key
		this.neededprop = prop;//test key[prop] == val
		this.neededval  = val;
	}
	
	insertItems(items){//a l'initialisation, pas une interaction joueur
		for(let i =0;i<items.length;i++){
			items[i]._character = this;
			this._items.push(items[i]);
		}
		//this._items = this._items.concat(items);
	}
	
	addItem(item){
		//console.log('additem chest');
		if(this.state == 2){
			//Le coffre est ouvert, on peut mettre des objets dedans
			this._items.push(item);
			item._character = this;
			return 1;
		}else if(this.state == 3){
			//utilise clé
			if(item.getClassName() == this.neededkey && (!this.neededprop || item[this.neededprop] == this.neededval) ){
				this.state = 2;
				this.showWindow();
			}
			
		}
		return 0;
	}
	
	removeItem(item){
		if(!this.needkey || this.state == 2){
			this._items.splice(this._items.indexOf(item),1);
			return 1;
		}else{
			return 0;
		}
	}
	
	openChest(){
		if(this.state == 1){
			if(this.needkey){
				this.state = 3;
			}else{
				this.state = 2;
			}
			this.showWindow();
		}
	}
	
	interact(n){
		if(this.state == 1){
			if(n == 0){
				this.openChest();
			}
		}
	}
	
	showWindow(){
		super.showWindow();
		document.getElementById('overWindow').innerHTML = '';
		if(this.state == 1){
			showDialog('A normal looking wooden chest.');
			/*let dialogText = document.createElement('div');
			dialogText.className = 'dialogDiv';
			dialogText.innerHTML = ;
			document.getElementById('overWindow').appendChild(dialogText);
			*/
			showButton('Open',220,20,'g._currentMap.getCurrentSquare()._entity.openChest()');
			/*
			let openbutton = document.createElement('div');
			openbutton.className = 'buttonVillage';
			openbutton.innerHTML = 'Open';
			openbutton.style  = 'bottom : 20px;right:220px;';
			openbutton.setAttribute('onclick','g._currentMap.getCurrentSquare()._entity.openChest()');
			document.getElementById('overWindow').appendChild(openbutton);
			*/
		}
		else if(this.state == 2){
			let it = document.createElement('div');
			it.className = 'itemsShopWindow';
			it.chest = this;
			it.itemContainer = this;
			it.id = 'chestitems';
			it.style =	'z-index:3;';
			it.setAttribute('ondrop','dropItem(event)');
			it.setAttribute('ondragover','allowDrop(event)');
			it.validDropTarget = 1;
			
			
			document.getElementById('overWindow').appendChild(it);
			
			/*Charger objets*/
			for(let i =0;i<this._items.length;i++){
				addItemDiv(this._items[i],it.id);
			}
		}
		else if(this.state == 3){
			showKeySlot('chest'+this._id,280,140);
			
			showDialog('The chest is locked. What could be able to open it ?');
			/*
			let dialogText = document.createElement('div');
			dialogText.className = 'dialogDiv';
			dialogText.innerHTML = 'The chest is locked. What could be able to open it ?';
			
			document.getElementById('overWindow').appendChild(dialogText);
			*/

		}
	}
	
	saveInCookie(savename=''){
		this.listitems = '';
		for(let i =0;i<this._items.length;i++){
			this.listitems+=this._items[i].getClassName()+'_'+this._items[i]._id+',';
			this._items[i].saveInCookie(savename);
		}
		super.saveInCookie(savename);
	}
	
	loadFromCookie(savename = ''){
		super.loadFromCookie(savename);
		
		let list = this.listitems.split(',');
		for(let i =0;i<list.length;i++){
			if(!list[i]) continue;
			let data = list[i].split('_');
			let item = new window[data[0]](g._nextItemId++);
			item.loadFromCookie(savename,data[1]);
			this._items.push(item);
		}
	}
	
	static staticClassName(){ return 'Chest'; };
	getClassName(){return 'Chest';}
}
registerClass(Chest);

/*
ajout dans char : 
-resistfire / resistthunder / resistcold / resistearh / resistwater / resistwind / resistholy / resistdark
-boostfire / boostthunder / boostcold / boostearth / boostwater / boostwind / boostholy / boostdark
-baneinsect / banebeast / banedemon / baneelemental / baneflying
-passif qui augmente mod ou resist, ajout dans liste passifs (pas liste skills)
-prio : cond isinsect,isbeast,isdeemon...

*/