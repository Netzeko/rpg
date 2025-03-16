class Square{
	constructor(x,y,z,level){
		this.x = x;
		this.y = y;
		this.z = z;
		this.walkable = 1;
		this.unknown = 3;
		this._level = level;
		this.tiletype = 'ground';
		this.ground = level.defaultGround;
		this.ceiling = level.defaultCeiling;//'ceilingdark';
		this.north = '';
		this.east = '';
		this.south = '';
		this.west = '';
		/*
		//Interaction Id
		this.iinorth = '';
		this.iieast = '';
		this.iisouth = '';
		this.iiwest = '';
		//Interaction Parameters
		this.ipnorth = '';
		this.ipeast = '';
		this.ipsouth = '';
		this.ipwest = '';
		*/
	}
	//affiché dans la case
	display(){
		return '';
	}
	
	getAdjacentSquare(dir){
		return this._level.getSquare(this.x+shifting(dir)[0],this.y+shifting(dir)[1],this.z);
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
		//console.log('loading square, '+dataArray.length+' properties');
		for(let i = 0;i<dataArray.length;i++){
			
			let variable = dataArray[i].split('|');
			if(variable[0].length ==0) continue;
			if(variable.length < 3) continue;
			
			//console.log('loading prop '+variable[0]+'='+variable[1]+' ('+variable[2]+')');
			if(variable[2] == 'number' || variable[2] == 'n'){
				this[variable[0]] = Number(variable[1]);
			}else if(variable[2] == 'string' || variable[2] == 's'){
				this[variable[0]] = variable[1];
			}
			//console.log('saved as '+typeof this[variable[0]]);
			
		}
	}
	
	//dir peut etre vide si teleport
	enter(dir){
		this.unknown = 0;
		this._entering = dir;
		return 1;
	}
	
	//at the end of the animation
	entered(){
		this._entering = '';
		return 1;
	}
	
	//dir peut etre vide si teleport
	exit(dir){
		if(!dir || ( !this[dir] && !this[dirToDir(dir)]) ){
			this._exiting = dir;
			return 1;
		}
		return 0;
	}
	
	//at the end of the animation
	exited(){
		//console.log('exited');
		this._exiting = '';
		return 1;
	}
	
	//direction actuelle, gauche/droite
	turnLeft(){
		switch(this._level.dir){
			case 'left':
				this._level.dir = 'down';
				break;
			case 'up':
				this._level.dir = 'left';
				break;
			case 'right':
				this._level.dir = 'up';
				break;
			case 'down':
				this._level.dir = 'right';
				break;
		}
	}
	
	turnRight(){
		switch(this._level.dir){
			case 'left':
				this._level.dir = 'up';
				break;
			case 'up':
				this._level.dir = 'right';
				break;
			case 'right':
				this._level.dir = 'down';
				break;
			case 'down':
				this._level.dir = 'left';
				break;
		}
		
	}
	
	//Ou est le joueur lorsqu'il se trouve dans cette case (ou sera la position de la caméra)
	getPosition(){
		return [this.x,this.y,this.z];
	}
	//Vers ou pointe la caméra lorsque le joueur est dans la case dans la direction indiquée
	getDirection(dir){
		switch(dir){
			case 'up':
			case 'north':
				return [this.x,this.y+1,this.z];
			case 'right':
			case 'east':
				return [this.x+1,this.y,this.z];
			case 'down':
			case 'south':
				return [this.x,this.y-1,this.z];
			case 'left':
			case 'west':
				return [this.x-1,this.y,this.z];
		}
	}
	
	setGround(t){
		this.ground = t;
		return this;
	}
	setCeiling(t){
		this.ceiling = t;
		return this;
	}
	setNorth(t){
		this.north = t;
		return this;
	}
	setSouth(t){
		this.south = t;
		return this;
	}
	setEast(t){
		this.east = t;
		return this;
	}
	setWest(t){
		this.west = t;
		return this;
	}
	
	getClassName(){
		return 'Square';
	}
	static staticClassName(){
		return 'Square';
	}
}

class TeleportHome extends Square{
	enter(dir){
		console.log('teleport');
		g.travel(null);
		return 1;
	}
	display(){
		return 'T';
	}
	getClassName(){
		return 'TeleportHome';
	}
	static staticClassName(){
		return 'TeleportHome';
	}
}

class Stairs extends Square{
	constructor(x,y,z,level){
		super(x,y,z,level);
		this.stairs = 1;
		this.stairsdirection = 'north';
		this.stairstexture = 'brownstone';
	}

	enter(dir){
		super.enter(dir);//at the beginning
		//console.log('entering stairs');
		
		return 1;
	}
	
	entered(){
		if(this.destination){
			g.travel(this.destinationlevel,this.destinationx,this.destinationy,this.destinationz,this.destinationdir);
		}
		super.entered();//at the end
		return 1;
	}
	
	exit(dir){
		super.exit(dir);
		if(this._exiting == this.stairsdirection){
			this._level.z = this.minz;
		}
		else if(this._exiting == opposite(this.stairsdirection)){
			this._level.z = this.maxz;
		}
		return 1;
	}
	
	exited(){
		super.exited();
	}
	
	getAdjacentSquare(dir){
		if(dir == this.stairsdirection){
			return this._level.getSquare(this.x+shifting(dir)[0],this.y+shifting(dir)[1],this.minz);
		}
		if(dir == opposite(this.stairsdirection)){
			return this._level.getSquare(this.x+shifting(dir)[0],this.y+shifting(dir)[1],this.maxz);
		}
		return null;
	}
	
	//Ou est le joueur lorsqu'il se trouve dans cette case (ou sera la position de la caméra)
	getPosition(){
		return [this.x,this.y,this.z-0.5];
	}
	//Vers ou pointe la caméra lorsque le joueur est dans la case dans la direction indiquée
	getDirection(dir){
		let z;
		if(this.stairsdirection == dir || this.stairsdirection == dirToDir(dir) ){
			z = this.z-1;
		}else if(opposite(this.stairsdirection) == dir || opposite(this.stairsdirection) == dirToDir(dir)){
			z = this.z;
		}else{
			z = this.z -0.5;
		}
		switch(dir){
			case 'up':
			case 'north':
				return [this.x,this.y+1,z];
			case 'right':
			case 'east':
				return [this.x+1,this.y,z];
			case 'down':
			case 'south':
				return [this.x,this.y-1,z];
			case 'left':
			case 'west':
				return [this.x-1,this.y,z];
		}
	}
	
			
		

	getClassName(){ return 'Stairs'; }
	static staticClassName(){ return 'Stairs'; }
}

class Void extends Square{
	constructor(x,y,z,level){
		super(x,y,z,level);
		//this.void = 1;
		this.ground = '';
	}

	/*
	enter(dir){
		super.enter(dir);//at the beginning
		//console.log('entering stairs');
		return 1;
	}
	*/
	
	entered(){
		
		super.entered();//at the end
		//fall
		// if(g._inBattle || !g._currentMap || inAnimation) return;
		setTimeout(playerFalling,1);
		return 1;
	}
	
	exit(dir){
		super.exit(dir);
		
		return 1;
	}
	
	exited(){
		super.exited();
	}
	
	
	
	getClassName(){ return 'Void'; }
	static staticClassName(){ return 'Void'; }
}

registerClass(Square);
registerClass(TeleportHome);
registerClass(Stairs);
registerClass(Void);
