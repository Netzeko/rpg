class Merchant{
	constructor(name,village){
		this.name = name;//must be unique
		this._village = village;
		this.cash = 0;
		this.totalworth = 0;
		this._items = [];
		this.shop = 1;
		//this.availableitems = '';//only for save
		this._available = [];
		if(!window.shop){
			window.shop = [];
		}
		window.shop.push(this);
	}
	
	//Only at init
	addAvailableItems(itemscl){
		for(let i =0;i<itemscl.length;i++){
			if( this._available.indexOf(itemscl[i]) < 0 && itemscl[i]){
				this._available.push(itemscl[i]);
			}
		}
	}
	
	copiesNumber(itemName){
		let n =0;
		for(let i =0;i<this._items.length;i++){
			if(this._items[i].getClassName() == itemName){
				n++;
			}
		}
		return n;
	}
	
	sellUselessItems(){
		for(let i =0;i<this._items.length;i++){
			if( this._items[i].price < this.totalworth /20 
			|| this._available.indexOf(this._items[i].getClassName()) < 0 
			|| this.copiesNumber(this._items[i].getClassName()) >= 2 ){
				//console.log('selling item');
				//console.log(this._items[i]);
				this._items[i]._e.parentNode.removeChild(this._items[i]._e);
				this.cash += this._items[i].price;
				//console.log('gained '+this._items[i].price+' gold');
				//delete items[this._items[i]._id];
				this._items.splice(i,1);
				i--;//On a retiré un index du tableau
			}
		}
		this.showCash();
	}
	
	buyNewItems(){
		let tobuy = [];
		for(let i =0;i<this._available.length;i++){
			//console.log(this._available[i]+' price:'+window[this._available[i]].basePrice());
			if( window[this._available[i]].basePrice() > this.totalworth /50
			&& window[this._available[i]].basePrice() <= this.totalworth /5 ){
				tobuy.push(this._available[i]);
			}
		}

		if(!tobuy.length) return;
		let b = 1;
		while(b && (this.cash > this.totalworth / 3) ){
			let r = rand(0,tobuy.length-1);
			if(this.cash >= window[tobuy[r]].basePrice()){
				let item = new window[tobuy[r]](g._nextItemId++);
				item._character = this;
				this.cash -= item.price;
				this._items.push(item);
				addItem(item,'shop'+this.name);
			}else{
				b = 0;
			}
		}
		this.showCash();
	}
	
	showCash(){
		if(document.getElementById('gold'+this.name))
			document.getElementById('gold'+this.name).innerHTML = this.cash;
	}
	
	addCash(n){
		this.cash += n;
		this.totalworth +=n;
		this.showCash();
	}
	
	//Used on drag'n'drop, to sell item ONLY
	removeItem(item){
		let index = this._items.indexOf(item);
		if( index < 0) return 0;
		if(g.gold < Math.floor(item.price*1.5) ) return 0;
		this.cash += Math.floor(item.price*1.5);
		g.addGold(-Math.floor(item.price*1.5));
		this.totalworth += Math.floor(item.price*1.5) - item.price;
		this._items.splice(index,1);
		this.showCash();
		return 1;
	}
	
	addItem(item,slot,transaction = 1){
		let index = this._items.indexOf(item);
		if( index >= 0) return 0;
		if(transaction){
			if(this.cash < Math.floor(item.price*0.5) ) return 0;
			this.cash -= Math.floor(item.price*0.5);
			g.addGold(Math.floor(item.price*0.5));
			this.totalworth +=  item.price - Math.floor(item.price*0.5);
		}
		this._items.push(item);
		item._character = this;
		this.showCash();
		return 1;
	}
	
	createDiv(div){
		let e = document.createElement('div');
		e.className = 'buttonVillage';
		e.style =	'left : 40px; bottom : 20px;z-index:3;';
		e.innerHTML = 'Back to village';
		
		e.setAttribute('onclick','showMainWindow("villageWindow")');
		
		div.appendChild(e);
		
		
		let it = document.createElement('div');
		it.className = 'itemsShopWindow';
		it.shop = this;
		it.itemContainer = this;
		it.id = 'shop'+this.name;
		it.style =	'z-index:3;';
		it.setAttribute('ondrop','dropItem(event)');
		it.setAttribute('ondragover','allowDrop(event)');
		it.validDropTarget = 1;
		div.appendChild(it);
		
		for(let i =0;i<this._items.length;i++){
			addItemDiv(this._items[i],it.id);
		}
		
		let npc = document.createElement('div');
		npc.className = 'hoverEntity';
		npc.style = 
					'background-image : url("../ressources/textures/'+this.name+'.png");'+
					'z-index:2;'+
					'display : block;';
		div.appendChild(npc);
		
		let goldiv = document.createElement('div');
		goldiv.className = 'shopgold';
		goldiv.style =	'z-index:3;';
		goldiv.innerHTML = 'Cash : <span id="gold'+this.name+'">'+this.cash+'</span>';
		div.appendChild(goldiv);
		
	}
	
	saveInCookie(savename = ''){
		//On commence par les objets pour générer la liste des cookies à charger
		console.log('saving items...');
		this.itemlist = '';
		for(let i = 0;i<this._items.length;i++){
			if( !this._items[i]) continue;
			this.itemlist += this._items[i].getClassName()+'_'+this._items[i]._id+',';
			this._items[i].saveInCookie(savename);
		}
		
		this.availableitems = '';
		for(let i = 0;i<this._available.length;i++){
			this.availableitems += this._available[i]+',';
		}
		
		let keys = Object.keys(this);
		let savetext = '';
		for(let i = 0;i<keys.length;i++){
			if(keys[i][0] == '_') continue;
			savetext+=''+keys[i]+':'+this[keys[i]]+':'+(typeof this[keys[i]]).substr(0,1)+'/';
		}
		setCookie('save'+savename+'shop'+this.name,savetext);
		
	}
	
	loadFromCookie(savename=''){
		let data = getCookie('save'+savename+'shop'+this.name);
		if(!data || data.length == 0){
			return false;
		}
		let dataArray = data.split('/');
		for(let i = 0;i<dataArray.length;i++){
			
			let variable = dataArray[i].split(':');
			if(variable[0].length ==0) continue;
			if(variable.length < 3) continue;
			
			if(variable[2] == 'n'){
				this[variable[0]] = Number(variable[1]);
			}else if(variable[2] == 's'){
				this[variable[0]] = variable[1];
			}
			
		}
		
		
		console.log('Loading shop items...');
		let listItems = this.itemlist.split(',');
		for(let i = 0;i<listItems.length;i++){
			if(listItems[i].length <= 0) continue;
			let itemSave = listItems[i].split('_');
			let item = new window[itemSave[0]](g._nextItemId++);
			item._character = this;
			this._items.push( item );
			
			item.loadFromCookie(savename,itemSave[1]);
			
		}
		
		this.addAvailableItems(this.availableitems.split(','));
	}
	
	getClassName(){
		return 'Merchant';
	}
	
	static staticClassName(){
		return 'Merchant';
	}
}


registerClass(Merchant);