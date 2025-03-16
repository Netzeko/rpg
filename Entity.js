class Entity{
	constructor(id){
		this._id = id;
		this._square = null;
		window['entity'+this._id] = this;
		this.sprite = '';
	}
	
	
	saveInCookie(savename=''){
		console.log('saving entity'+this._id);
		
		if(this._square){
			this.x = this._square.x;
			this.y = this._square.y;
			this.z = this._square.z;
			this.level = this._square._level.name;
		}
		
		let keys = Object.keys(this);
		let savetext = '';
		for(let i = 0;i<keys.length;i++){
			if(keys[i][0] == '_') continue;
			savetext+=''+keys[i]+':'+this[keys[i]]+':'+(typeof this[keys[i]])+'/';
		}
		setCookie('save'+savename+'entity'+this._id,savetext);
		
	}
	
	loadFromCookie(savename=''){
		console.log('loading entity'+this._id);
		let data = getCookie('save'+savename+'entity'+this._saveid);
		if(!data || data.length == 0){
			console.log('no spawn data');
			return false;
		}

		let dataArray = data.split('/');
		for(let i = 0;i<dataArray.length;i++){
			
			let variable = dataArray[i].split(':');
			if(variable[0].length ==0) continue;
			if(variable.length < 3) continue;
			
			//console.log('loading prop '+variable[0]+'='+variable[1]+' ('+variable[2]+')');
			if(variable[2].localeCompare('number') == 0){
				this[variable[0]] = Number(variable[1]);
			}else if(variable[2].localeCompare('string') == 0){
				this[variable[0]] = variable[1];
			}
		}
		
		if(this.level){
			this._square = g._levels[this.level].getSquare(this.x,this.y,this.z);
			this._square._entity = this;
			delete this.level;
			delete this.x;
			delete this.y;
			delete this.z;
		}
	}
	
	showWindow(){
		document.getElementById('overWindow').style = 
				'background-image : url("../ressources/textures/'+this.sprite+'.png");'+
				'z-index:2;'+
				'display : block;';
	}
	
	interact(n){
		console.log('interact');
	}
	
	static staticClassName(){ return 'Entity'; };
	getClassName(){return 'Entity';}
}

registerClass(Entity);