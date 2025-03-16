class Church{
	constructor(name,village){
		this.name = name;//must be unique
		this._village = village;
		this.church = 1;
		//this.availableitems = '';//only for save
	}
	
	
	
	createDiv(div){
		let e = document.createElement('div');
		e.className = 'buttonVillage';
		e.style =	'left : 40px; bottom : 20px;z-index:3;';
		e.innerHTML = l.text('backtovillage',1);
		e.setAttribute('onclick','showMainWindow("villageWindow")');
		div.appendChild(e);
		
		e = document.createElement('div');
		e.className = 'buttonVillage';
		e.style =	'right : 40px; bottom : 20px;z-index:3;';
		e.innerHTML = l.text('save',1);
		e.setAttribute('onclick','save()');
		div.appendChild(e);
		
		e = document.createElement('div');
		e.className = 'buttonVillage';
		e.style =	'right : 40px; bottom : 60px;z-index:3;';
		e.innerHTML = l.text('resurrect',1)+' (<img src="../ressources/icons/gold.png" class="mediumicon icontext" />400 )';
		e.setAttribute('onclick','resurrectMember(400)');
		div.appendChild(e);
		
		let npc = document.createElement('div');
		npc.className = 'hoverEntity';
		npc.style = 
					'background-image : url("../ressources/textures/priest.png");'+
					'z-index:2;'+
					'display : block;';
		div.appendChild(npc);

		
	}
	
	saveInCookie(savename = ''){
		
		
		let keys = Object.keys(this);
		let savetext = '';
		for(let i = 0;i<keys.length;i++){
			if(keys[i][0] == '_') continue;
			savetext+=''+keys[i]+':'+this[keys[i]]+':'+(typeof this[keys[i]]).substr(0,1)+'/';
		}
		setCookie('save'+savename+'church'+this.name,savetext);
		
	}
	
	loadFromCookie(savename=''){
		let data = getCookie('save'+savename+'church'+this.name);
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
	}
	
	getClassName(){
		return 'Church';
	}
	
	static staticClassName(){
		return 'Church';
	}
}


registerClass(Church);