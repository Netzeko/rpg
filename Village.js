class Village{
	constructor(game){
		this._access = [];
		this._houses = [];
		this._game = game;
		//this._panel = div;
	}
	
	addAccess(l,x,y,z,dir,accessname){
		this._access.push([l,x,y,z,dir,accessname]);
	}
	addHouse(h,name,accessname){
		this._houses.push([h,name,accessname]);
	}
	
	createMenu(div){
		this._panel = document.getElementById(div);
		for(let i=0;i<this._access.length;i++){
			let e = document.createElement('div');
			e.className = 'buttonVillage';
			e.style =	'right : 40px; bottom : '+(20+40*i)+'px;';
			e.innerHTML = this._access[i][5];
			
			let f = new Function([],'g.travel("'+this._access[i][0].name+'",'+this._access[i][1]+','+this._access[i][2]+','+this._access[i][3]+',"'+this._access[i][4]+'");');
			e.onclick = f;
			this._panel.appendChild(e);
		}

		for(let i=0;i<this._houses.length;i++){
			let h = document.createElement('div');
			h.className = 'mainPanel';
			h.id = 'house'+this._houses[i][1];
			h.style = 'background-image:url("../ressources/bg/'+this._houses[i][1]+'.png")'
			document.getElementById('mainWindow').appendChild(h);
			this._houses[i][0].createDiv(h);
			
			let e = document.createElement('div');
			e.className = 'buttonVillage';
			e.style =	'left : 40px; bottom : '+(20+40*i)+'px;';
			e.innerHTML = this._houses[i][2];
			
			
			e.setAttribute('onclick','showMainWindow("'+h.id+'")');
			this._panel.appendChild(e);
		}
	}
	
	disposeItemsShops(){
		console.log('Selling old stuff');
		for(let i=0;i<this._houses.length;i++){
			if(this._houses[i][0].shop ){
				this._houses[i][0].sellUselessItems();
			}
		}
	}
	
	
	refillShops(){
		console.log('Buying new stuff');
		for(let i=0;i<this._houses.length;i++){
			if(this._houses[i][0].shop){
				//console.log('Refilling');
				this._houses[i][0].buyNewItems();
			}
		}
	}
	
	distributeMoney(amount,sender){
		let shops = [];
		for(let i=0;i<this._houses.length;i++){
			if(this._houses[i][0].shop && this._houses[i][0].name != sender.name){
				shops.push(this._houses[i][0]);
			}
		}
		
		for(let i=0;i<shops.length;i++){
			shops[i].addCash(Math.floor(amount/shops.length) );
		}
	}
	
	saveInCookie(savename = ''){
		for(let i=0;i<this._access.length;i++){
			this['access'+i] = ''+this._access[i][0].name+'|'+this._access[i][1]+'|'+this._access[i][2]+'|'+this._access[i][3]+'|'+this._access[i][4]+'|'+this._access[i][5];
		}
		
		for(let i=0;i<this._houses.length;i++){
			this._houses[i][0].saveInCookie(savename);
			this['house'+i] = ''+this._houses[i][0].getClassName()+'|'+this._houses[i][1]+'|'+this._houses[i][2];
		}
		
		let keys = Object.keys(this);
		let savetext = '';
		for(let i = 0;i<keys.length;i++){
			if(keys[i][0] == '_') continue;
			savetext+=''+keys[i]+':'+this[keys[i]]+':'+(typeof this[keys[i]]).substr(0,1)+'/';
		}
		setCookie('save'+savename+'village',savetext);
		
		for(let i=0;i<this._access.length;i++){
			delete this['access'+i];
		}
		for(let i=0;i<this._houses.length;i++){
			delete this['house'+i];
		}
	}
	
	loadFromCookie(savename=''){
		let data = getCookie('save'+savename+'village');
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
				
				if(variable[0].startsWith('access')){
					let a = variable[1].split('|');
					this.addAccess(this._game._levels[a[0]],a[1],a[2],a[3],a[4],a[5]);
				}else if(variable[0].startsWith('house')){
					let a = variable[1].split('|');
					let h = new window[a[0]](a[1],this);
					h.loadFromCookie(savename);
					this.addHouse(h,a[1],a[2]);
				}else{
					this[variable[0]] = variable[1];
				}
			}
			
		}
	}
	
	
	
}