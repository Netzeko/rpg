class SpawnArea{
	constructor(level,id){
		this._id = id;
		this._level = level;
		this._monsterGroups = [];
		this._currentMonsters = 0;
		this._squares = [];//a sauvegarder sous forme de coordonnées
		//this._groupsType
		this.maxmonsters = 2;
		this.spawndelay = 50000;
		this.mindistance = 4;
		this._spawning = 0;
		window['spawn'+this._id] = this;
		g._spawnareas.push(this);
	}
	
	addSquares(sqarr){
		for(let i =0;i<sqarr.length;i++){
			this._squares.push(sqarr[i]);
		}
	}
	
	addSquare(sq){
		this._squares.push(sq);
	}
	
	saveInCookie(savename=''){
		console.log('saving spawnarea'+this._id);
		
		for(let i=0;i<this._squares.length;i++){
			if(!this._squares[i]) console.log('error : null element in square array');
			this['square'+this._squares[i].x+'_'+this._squares[i].y+'_'+this._squares[i].z] = 1;
		}
		
		let keys = Object.keys(this);
		let savetext = '';
		for(let i = 0;i<keys.length;i++){
			if(keys[i][0] == '_') continue;
			savetext+=''+keys[i]+':'+this[keys[i]]+':'+(typeof this[keys[i]])+'/';
		}
		setCookie('save'+savename+'spawn'+this._id,savetext);
		
		for(let i=0;i<this._squares.length;i++){
			delete this['square'+this._squares[i].x+'_'+this._squares[i].y+'_'+this._squares[i].z];
		}
	}
	
	loadFromCookie(savename=''){
		console.log('loading spawnarea'+this._saveid);

		let data = getCookie('save'+savename+'spawn'+this._saveid);
		if(!data || data.length == 0){
			console.log('no spawn data');
			return false;
		}

		let dataArray = data.split('/');
		//console.log('loading spawn'+this._saveid+', '+dataArray.length+' properties');
		for(let i = 0;i<dataArray.length;i++){
			
			let variable = dataArray[i].split(':');
			if(variable[0].length ==0) continue;
			if(variable.length < 3) continue;
			
			if(variable[0].startsWith('square')){
				//console.log('loading spawnarea square '+variable[0]);
				let str = variable[0].substr(6);
				let coord = str.split('_');
				//console.log(coord);
				//console.log(this._level);
				let sq = this._level.getSquare(coord[0],coord[1],coord[2]);
				//console.log(sq);
				this._squares.push(sq);
				
				delete this[variable[0]];
			}else{
			
				//console.log('loading prop '+variable[0]+'='+variable[1]+' ('+variable[2]+')');
				if(variable[2].localeCompare('number') == 0){
					this[variable[0]] = Number(variable[1]);
				}else if(variable[2].localeCompare('string') == 0){
					this[variable[0]] = variable[1];
				}
			}
		}
	}
	
	spawn(){
		if(this._currentMonsters < this.maxmonsters && this._spawning){
			console.log('spawning...');
			let maxr = this._squares.length;
			let r;
			let go = 3;
			let tooclose = 0;
			while(go > 0){
				tooclose = 0;
				r	= rand(0,maxr-1);
				if(this._squares[r]	&& !this._squares[r]._entity){
					//console.log('trying to spawn at '+this._squares[r].x+' '+this._squares[r].y+' '+this._squares[r].z);

					for(let i=0;i<this._monsterGroups.length;i++){
						//console.log('compare with '+this._monsterGroups[i].square.x+' '+this._monsterGroups[i].square.y+' '+this._monsterGroups[i].square.z);
						if( Math.abs(this._monsterGroups[i]._square.x - this._squares[r].x)
							+ Math.abs(this._monsterGroups[i]._square.y - this._squares[r].y) 
							+ Math.abs(this._monsterGroups[i]._square.z - this._squares[r].z) 
							< this.mindistance){
							go--;
							tooclose = 1;
							break;
						}
					}
					if(tooclose){
						continue;
					}
					let group = new MonsterGroup(g._nextEntityId++,this);// a configurer ici quel genre de monstre on veut faire apparaitre
					group.generate();
					this._monsterGroups.push(group);
					this._squares[r]._entity = group;
					group._square = this._squares[r];
					this._currentMonsters++;
					console.log('new monster appeared');
					if(this._level == g._currentMap){
						g._scene.addEntity(group);
						this._squares[r]._level.addEntity(group);
					}
					group.automove();
					go = 0;
				}else{
					go--;
				}
			}
		}
		//console.log('spawning done ?');
		setTimeout('spawn'+this._id+'.spawn()',this.spawndelay);
	}
	
	removeGroup(group){
		this._monsterGroups.splice(this._monsterGroups.indexOf(group),1);
		this._currentMonsters --;
		g._scene.removeEntity(group);
	}
}
