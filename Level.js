function opposite(dir){
	switch(dir){
		case 'north':
			return 'south';
		case 'south':
			return 'north';
		case 'west':
			return 'east';
		case 'east':
			return 'west';
		case 'up':
			return 'down';
		case 'down':
			return 'up';
		case 'left':
			return 'right';
		case 'right':
			return 'left';
	}
	return '';
}

function direction(x,y){
	if(x > 0) return 'east';
	if(x < 0) return 'west';
	if(y > 0) return 'north';
	if(y < 0) return 'south';
}

function shifting(dir){
	if(dir == 'east') return [1,0];
	if(dir == 'west') return [-1,0];
	if(dir == 'north') return [0,1];
	if(dir == 'south') return [0,-1];
}

function dirToDir(dir){
		switch(dir){
			case 'up': return 'north';
			case 'north': return 'up';
			case 'right': return 'east';
			case 'east': return 'right';
			case 'down': return 'south';
			case 'south': return 'down';
			case 'left': return 'west';
			case 'west': return 'left';
		}
		return '';
}

class Level{
	constructor(name,p,id){
		this.name = name;
		this._mapData = [];
		this.z = 1;
		this.x = 0;
		this.y = 0;
		this._party = p;
		this.dir = 'up';
		this._toActualize = [];
		this._id = id;
		this._all = [];
		this.defaultWall = 'wall';
		this.defaultGround = 'ground';
		this.defaultCeiling = 'ceilingdark';
		this._spawnAreas = [];
		this._entities = [];//pas encore géré, pour sauvegarder les entités
	}
	
	allocate(x,y,z){
		if(!this._mapData[z]){
			this._mapData[z] = [];
		}
		if(!this._mapData[z][x]){
			this._mapData[z][x] = [];
		}
		if(!this._mapData[z][x][y]){
			this._mapData[z][x][y] = null;
		}
	}
	
	addSquare(x,y,z,classSq = Square){
		
		let s = new classSq(x,y,z,this);
		if(x==1 && y==2 && z ==0){
			console.log('add Stair1');
		}
		this.allocate(x,y,z);
		this._mapData[z][x][y] = s;
		this._all.push(s);
		if(x==1 && y==2 && z ==0){
			console.log(s);
			console.log(this._mapData);
		}
		return s;
	}
	
	setSquare(sq){
		this.allocate(sq.x,sq.y,sq.z);
		this._mapData[sq.z][sq.x][sq.y] = sq;
		if(sq.minz != sq.z){
			//console.log(sq);
			this.allocate(sq.x,sq.y,sq.minz);
			this._mapData[sq.minz][sq.x][sq.y] = sq;
		}
		this._all.push(sq);
	}
	
	getSquare(x,y,z){
		if(!this._mapData[z]) return null;
		if(!this._mapData[z][x]) return null;
		if(!this._mapData[z][x][y]) return null;
		return this._mapData[z][x][y];
	}
	
	getCurrentSquare(){
		return this.getSquare(this.x,this.y,this.z);
	}
	
	animationStart(fromSq,toSq){
		this._animationStartSquare = fromSq;
		this._animationEndSquare = toSq;
		document.getElementById('overWindow').style.display = 'none';
		document.getElementById('overWindow').style.backgroundImage = '';
		document.getElementById('overWindow').innerHTML = '';
	}
	
	animationFinish(){
		if(this._animationStartSquare != this._animationEndSquare){
			this._animationStartSquare.exited();
			this._animationEndSquare.entered();
		}
		
		if(this._animationEndSquare._entity && !this._animationEndSquare._entity.ismonster){
			//console.log('SHOW');
			this._animationEndSquare._entity.showWindow();
		}
		
		
		let cursq = this._animationEndSquare;
		if(cursq['ii'+dirToDir(this.dir)]){
			this.initinteract(cursq,dirToDir(this.dir)/*,cursq['ii'+dirToDir(this.dir)].split(',')*/);
		}
		
		this._animationStartSquare = null;
		this._animationEndSquare = null;
	}
	
	//cursq['ii'+dirToDir(this.dir)],
	initinteract(sq,d){
		document.getElementById('overWindow').innerHTML = '';
		console.log('initinteract');
		//ii => interaction id
		switch(sq['ii'+d]){
			case 'closeddoor' :
				showDialog( l.text('closeddoor',1) );
				showButton( l.text('open',1) , 220,20,'g._currentMap.interact(0)');
				document.getElementById('overWindow').style.display = 'block';
				break;
			case 'openeddoor' :
				showButton( l.text('open',1) , 220,20,'g._currentMap.interact(0)');
				document.getElementById('overWindow').style.display = 'block';
				break;
			case 'lockeddoor' :
				showKeySlot('interact',280,140);
				showDialog( l.text('doorneedkey',1));
				document.getElementById('overWindow').style.display = 'block';
				break;
		}
	}
	
	interact(n=0,item = null){
		
		let sq = this.getCurrentSquare();
		let d = dirToDir(this.dir);
		
		if(sq._entity && !sq._entity.ismonster){
			sq._entity.interact(n,item);
			return;
		}
		
		if(!sq['ii'+d])return;
		switch(sq['ii'+d]){
			case 'closeddoor' :
				if(sq['ip'+d+'needkey'] == 1){ //besoin d'une cle pour ouvrir
					sq['ii'+d] = 'lockeddoor';
					this.initinteract(sq,d);
				}else if(sq['ip'+d+'needkey'] == 2){//ne peut pas être ouverte
					showDialog( l.text('unableopen',1));
				}else{
					sq['ii'+d] = 'openeddoor';
					let adj = sq.getAdjacentSquare(d);
					this.setPosition(adj.x,adj.y,adj.z);
					g._scene.actualizePosition();
					moveMap(this);
				}
				break;
			case 'openeddoor' :
				//showButton( l.text('open',1) , 220,20,'g._currentMap.interact()');
				let adj = sq.getAdjacentSquare(d);
				this.setPosition(adj.x,adj.y,adj.z);
				g._scene.actualizePosition();
				moveMap(this);
				break;
			case 'lockeddoor' :
				if(n==1){
					if(item.getClassName() == sq['ip'+d+'neededkey'] ){
						if(!sq['ip'+d+'neededprop'] 
						|| !sq['ip'+d+'neededval'] 
						|| item[sq['ip'+d+'neededprop']] == sq['ip'+d+'neededval'] ){
								console.log('door unlocked');
								sq['ii'+d] = 'openeddoor';
								this.initinteract(sq,d);
						}
					}
					console.log('end interact key');
				}
				
				break;
		}
	}
	
	addItem(item,targetSlot){
		this.interact(1,item);
	}
	
	setPosition(x,y,z){
		this.z = z;
		this.x = x;
		this.y = y;
		if(this.getCurrentSquare()){
			this.getCurrentSquare().unknown = 0;
		}
		if(this.getSquare(x-1,y,z)){
			this.getSquare(x-1,y,z).unknown &= 1;
		}
		if(this.getSquare(x+1,y,z)){
			this.getSquare(x+1,y,z).unknown &= 1;
		}
		if(this.getSquare(x,y-1,z)){
			this.getSquare(x,y-1,z).unknown &= 1;
		}
		if(this.getSquare(x,y+1,z)){
			this.getSquare(x,y+1,z).unknown &= 1;
		}
		this._toActualize.push([this.x,this.y,this.z]);
		this._toActualize.push([this.x-1,this.y,this.z]);
		this._toActualize.push([this.x+1,this.y,this.z]);
		this._toActualize.push([this.x,this.y-1,this.z]);
		this._toActualize.push([this.x,this.y+1,this.z]);
		document.getElementById('overWindow').style.display = 'none';
		
		if(this.getCurrentSquare() && this.getCurrentSquare()._entity){
			if( this.getCurrentSquare()._entity.ismonster && !g.invisible){
				startBattle(this.getCurrentSquare()._entity);
			}
		}
		
	}
	
	walk(movex,movey){
		//console.log('walk '+movex+' '+movey);
		if(Math.abs(movex) + Math.abs(movey) > 1) return 0;
		let dirout = direction(movex,movey);
		let dirin = opposite(direction(movex,movey));
		let oldz = this.z;
		let nextSquare = this.getSquare(this.x,this.y,this.z).getAdjacentSquare(dirout);
		if(nextSquare && nextSquare.walkable){
			if(!this.getSquare(this.x,this.y,this.z).exit(dirout)){
				console.log('unable to move there');
				return 0;
			}
			//this.getSquare(this.x,this.y)._entity = null;
			this.setPosition(this.x+movex,this.y+movey,this.z);
			//this.getSquare(this.x,this.y)._entity = this._party;
			nextSquare.enter(dirin);

			if(oldz != this.z){
				//On a changé de niveau
				showMap(this);
			}
			//actualizeMap(this);
			return 1;
		}
		return 0;
	}
	
	turnLeft(){
		this.getSquare(this.x,this.y,this.z).turnLeft();
	}
	
	turnRight(){
		this.getSquare(this.x,this.y,this.z).turnRight();
	}
	
	moveForward(forward = 1){
		switch(this.dir){
			case 'left':
				this.walk(-1*forward,0);
				break;
			case 'up':
				this.walk(0,1*forward);
				break;
			case 'right':
				this.walk(+1*forward,0);
				break;
			case 'down':
				this.walk(0,-1*forward);
				break;
		}
	}
	
	loadFromCookie(savename=''){
		let data = getCookie('save'+savename+'level'+this.name);
		if(data.length == 0){
			return false;
		}
		let dataArray = data.split('/');
		console.log('loading '+this.name+', '+dataArray.length+' properties');
		for(let i = 0;i<dataArray.length;i++){
			
			let variable = dataArray[i].split(':');
			if(variable[0].length ==0) continue;
			if(variable.length < 3) continue;
			
			//console.log('loading prop '+variable[0]+'='+variable[1]+' ('+variable[2]+')');
			if(variable[2].localeCompare('number') == 0){
				this[variable[0]] = Number(variable[1]);
			}else if(variable[2].localeCompare('string') == 0){
				this[variable[0]] = variable[1];
				if(variable[0].startsWith('square')){
					let str = variable[0].substr(6);
					let coord = str.split('_');
					let sq = new window[coord[1]](0,0,0,this);
					sq.loadFromString(variable[1]);
					this.setSquare(sq);
					delete this[variable[0]];
				}else if(variable[0].startsWith('spawn')){
					//console.log('Loading spawn');
					let str = variable[0].substr(5);
					let sp = new SpawnArea(this,g._nextLevelId++);
					sp._saveid = Number(str);
					sp.loadFromCookie(savename);
					this._spawnAreas.push(sp);
					delete this[variable[0]];
				}
				
			}	
		}
		
		let ent = this.entities.split(',');
		for(let i=0;i<ent.length;i++){
			if(!ent[i] || !ent[i].length) continue;
			let entity = ent[i].split('-');
			let e = new window[entity[1]](g._nextEntityId++);
			e._saveid = entity[0];
			e.loadFromCookie(savename);
			this._entities.push(e);
		}
	}
	
	saveInCookie(savename=''){
		console.log('saving level '+this.name);
		
		this.saveSquares(savename);
		this.saveSpawnArea(savename);
		
		this.entities = '';
		for(let i=0;i<this._entities.length;i++){
			this.entities += this._entities[i]._id+'-'+this._entities[i].getClassName()+',';
			this._entities[i].saveInCookie(savename);
		}
		
		
		let keys = Object.keys(this);
		let savetext = '';
		for(let i = 0;i<keys.length;i++){
			//console.log('saving key '+keys[i]);
			if(keys[i][0] == '_') continue;
			savetext+=''+keys[i]+':'+this[keys[i]]+':'+(typeof this[keys[i]])+'/';
		}
		setCookie('save'+savename+'level'+this.name,savetext);
		
		this.clearProperties();
	}
	
	saveSpawnArea(savename){
		for(let i=0;i<this._spawnAreas.length;i++){
			console.log('save spawn');
			this['spawn'+this._spawnAreas[i]._id] = '1';
			this._spawnAreas[i].saveInCookie(savename);
		}
	}

	saveSquares(savename){
		console.log('saving squares...');
		for(let i=0;i<this._all.length;i++){
			if(!this._all[i]) continue;
			this['square'+i+'_'+this._all[i].getClassName()] = this._all[i].saveToString();
		}
		/*
		for(let k=0;k<this._mapData.length;k++){
			for(let i=0;i<this._mapData[k].length;i++){
				if(!this._mapData[k][i]) continue;
				for(let j=0;j<this._mapData[k][i].length;j++){
					if( !this._mapData[k][i][j]) continue;
					this['square'+k+'_'+i+'_'+j+'_'+this._mapData[i][j].getClassName()] = this._mapData[i][j].saveToString();
				}
			}
		}
		*/
	}
	
	getCurrentSquare(){
		return this.getSquare(this.x,this.y,this.z);
	}

	//Enleve les propriété temporaires créées pour la sauvegarde
	clearProperties(){
		let keys = Object.keys(this);
		let savetext = '';
		for(let i = 0;i<keys.length;i++){
			if(keys[i].startsWith('square')){
				delete this[keys[i]];
			}
		}
	}

	placeWalls(){
		let cur;
		for(let i=0;i<this._all.length;i++){
			cur = this._all[i]
			
			if( !cur.west && !cur.getAdjacentSquare('west') /* !this.getSquare(cur.x-1,cur.y,cur.z) && */ ){
				cur.west = this.defaultWall;
			}
			if( !cur.east && !cur.getAdjacentSquare('east') /* !this.getSquare(cur.x+1,cur.y,cur.z) &&*/ ){
				cur.east = this.defaultWall;
			}
			if( !cur.south && !cur.getAdjacentSquare('south') /* !this.getSquare(cur.x,cur.y-1,cur.z) && */){
				cur.south = this.defaultWall;
			}
			if( !cur.north && !cur.getAdjacentSquare('north') /* !this.getSquare(cur.x,cur.y+1,cur.z) && */ ){
				cur.north = this.defaultWall;
			}
			
		}
	}

	moveEntity(e,sq){
		let oldsq = e._square;
		if(e._square){
			this._toActualize.push([e._square.x,e._square.y,e._square.z]);
			e._square._entity = null;
		}
		sq._entity = e;
		e._square = sq;
		this._toActualize.push([sq.x,sq.y,sq.z]);
		if(g._currentMap == this){
			g._scene.addEntityMovement(e,oldsq.getPosition(),new Date().getTime(),
																sq.getPosition(),new Date().getTime()+(e.movementdelay*1) );
			//g._scene.actualizeEntity(e);
			//console.log('moveentity ');
			actualizeMap(this);
			if(e._square == this.getCurrentSquare() && !g.invisible){
				startBattle(e);
			}
		}
		
	}
	
	addEntity(e){
		if(e._square){
			this._toActualize.push([e._square.x,e._square.y,e._square.z]);
			if(g._currentMap == this){
				actualizeMap(this);
			}
		}
	}

}


class Underground extends Level{
	constructor(name,p,id){
		super(name,p,id);
	}
	
	//Utilisé lors de la toute premiere création du niveau
	initMap(){
		if(this._initialized){
			console.log('Error : already initialize');
			return;
		}
		console.log('Initialize map');
		this._initialized = 1;
		
		let area1 = new SpawnArea(this,g._nextLevelId++);
		this._spawnAreas.push(area1);
		
		area1.addSquare(this.addSquare(2,2,1));
		area1.addSquare(this.addSquare(3,2,1));
		area1.addSquare(this.addSquare(4,2,1));
		area1.addSquare(this.addSquare(5,2,1));
		area1.addSquare(this.addSquare(6,2,1));
		area1.addSquare(this.addSquare(7,2,1));
		area1.addSquare(this.addSquare(2,3,1));
		area1.addSquare(this.addSquare(3,3,1));
		area1.addSquare(this.addSquare(6,3,1));
		area1.addSquare(this.addSquare(7,3,1));
		area1.addSquare(this.addSquare(2,4,1));
		area1.addSquare(this.addSquare(7,4,1));
		area1.addSquare(this.addSquare(2,5,1));
		area1.addSquare(this.addSquare(3,5,1));
		area1.addSquare(this.addSquare(4,5,1));
		area1.addSquare(this.addSquare(5,5,1));
		area1.addSquare(this.addSquare(6,5,1));
		area1.addSquare(this.addSquare(7,5,1));

		let sq = this.getSquare(6,5,1);
		sq.north = 'door';
		sq.iinorth = 'closeddoor';
		sq.ipnorthneedkey = 1;
		sq.ipnorthneededkey = 'LeatherGloves';

		sq = this.addSquare(6,6,1);
		sq.south = 'door';
		sq.iisouth = 'closeddoor';
		
		
		let stairs = this.addSquare(8,5,2,Stairs);
		stairs.destination = 1;
		stairs.destinationlevel = this.name;
		stairs.destinationx = 20;
		stairs.destinationy = 22;
		stairs.destinationz = 1;
		stairs.destinationdir = 'right';
		stairs.tiletype = 'stairs';
		stairs.stairsdirection = 'west';
		stairs.minz = 1;
		stairs.maxz = 2;
		this.setSquare(stairs);
		
		
		
		
		this.addSquare(21,22,1);
		this.addSquare(22,22,1);
		this.addSquare(21,23,1);
		this.addSquare(22,23,1);
		
		stairs = this.addSquare(20,22,1,Stairs);
		stairs.destination = 1;
		stairs.destinationlevel = this.name;
		stairs.destinationx = 8;
		stairs.destinationy = 5;
		stairs.destinationz = 1;
		stairs.destinationdir = 'left';
		stairs.stairsdirection = 'west';
		stairs.tiletype = 'stairs';
		stairs.minz = 0;
		stairs.maxz = 1;
		this.setSquare(stairs);
		
		stairs = this.addSquare(23,23,2,Stairs);
		stairs.destination = 1;
		stairs.destinationlevel = 'sewers';
		stairs.destinationx = 4;
		stairs.destinationy = 5;
		stairs.destinationz = 1;
		stairs.destinationdir = 'right';
		stairs.stairsdirection = 'west';
		stairs.tiletype = 'stairs';
		stairs.minz = 1;
		stairs.maxz = 2;
		this.setSquare(stairs);
		
		stairs = this.addSquare(1,2,1,Stairs);
		stairs.destination = 1;
		stairs.destinationlevel = '';
		stairs.destinationx = 0;
		stairs.destinationy = 0;
		stairs.destinationz = 1;
		stairs.destinationdir = 'left';
		stairs.stairsdirection = 'west';
		stairs.tiletype = 'stairs';
		stairs.minz = 0;
		stairs.maxz = 1;
		this.setSquare(stairs);
		
		
		stairs = this.addSquare(2,6,1,Stairs);
		stairs.destination = 0;
		stairs.stairsdirection = 'north';
		stairs.tiletype = 'stairs';
		stairs.minz = 0;
		stairs.maxz = 1;
		this.setSquare(stairs);
		
		stairs = this.addSquare(4,6,2,Stairs);
		stairs.destination = 0;
		stairs.stairsdirection = 'south';
		stairs.tiletype = 'stairs';
		stairs.minz = 1;
		stairs.maxz = 2;
		this.setSquare(stairs);
		
		this.addSquare(4,7,2);
		
		stairs = this.addSquare(4,8,3,Stairs);
		stairs.destination = 0;
		stairs.stairsdirection = 'south';
		stairs.tiletype = 'stairs';
		stairs.minz = 2;
		stairs.maxz = 3;
		this.setSquare(stairs);
		
		stairs = this.addSquare(4,9,4,Stairs);
		stairs.destination = 0;
		stairs.stairsdirection = 'south';
		stairs.tiletype = 'stairs';
		stairs.minz = 3;
		stairs.maxz = 4;
		this.setSquare(stairs);
		
		stairs = this.addSquare(4,10,5,Stairs);
		stairs.destination = 0;
		stairs.stairsdirection = 'south';
		stairs.tiletype = 'stairs';
		stairs.minz = 4;
		stairs.maxz = 5;
		this.setSquare(stairs);
		
		stairs = this.addSquare(6,7,1,Stairs);
		stairs.destination = 0;
		stairs.stairsdirection = 'north';
		stairs.tiletype = 'stairs';
		stairs.minz = 0;
		stairs.maxz = 1;
		this.setSquare(stairs);
		this.addSquare(5,8,0);
		this.addSquare(4,8,0);
		this.addSquare(3,8,0);
		this.addSquare(2,8,0);
		this.addSquare(2,7,0);
		this.addSquare(6,8,0);
		
		this.addSquare(3,11,5);
		this.addSquare(4,11,5);
		this.addSquare(5,11,5);
		this.addSquare(3,12,5);
		this.addSquare(4,12,5);
		this.addSquare(5,12,5);
		this.addSquare(3,13,5);
		this.addSquare(4,13,5);
		this.addSquare(5,13,5);
		
		
		let her = new NPC(g._nextEntityId++,'testnpc','sww1');
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
		this._entities.push(her);
		her._square = this.getSquare(3,3,1);
		this.getSquare(3,3,1)._entity = her;
		
		let beggar = new NPC(g._nextEntityId++,'testnpc2','beggar');
		acts = [];
		acts.push(new GiveGold(beggar,-50));
		acts.push(new GiveExp(beggar,500));
		beggar.addState(1,'ineedmoney');
		beggar.addStateOption(1,'button',['give50',20,20],acts ,2);
		beggar.addStateOption(1,'needitem',['',380,240],[new GiveExp(beggar,10)] ,2);
		beggar.neededitem = 'HealPotion';
		beggar.addState(2,'thankyou');
		beggar.addStateOption(2,'dialog',['needsomething'], [] ,1);
		
		this.addSquare(2,1,1);
		this._entities.push(beggar);
		beggar._square = this.getSquare(2,1,1);
		this.getSquare(2,1,1)._entity = beggar;
		
		/*
		acts.push(new GiveGold(her,-50));
	acts.push(new GiveExp(her,500));
		*/
		/*
		let testsp = new Entity(g._nextEntityId++);
		this._entities.push(testsp);
		testsp._square = this.getSquare(3,3,1);
		testsp.sprite = 'sww1';
		this.getSquare(3,3,1)._entity = testsp;
		*/
		let chest = new Chest(g._nextEntityId++);
		this._entities.push(chest);
		chest.setNeededKey('HealPotion',null,null);
		chest.insertItems([new BloodSword(g._nextItemId++)]);
		chest._square = this.getSquare(6,3,1);
		this.getSquare(6,3,1)._entity = chest;
		
		this.placeWalls();
	}
	
	initinteract(sq,d){
		switch(sq['ii'+d]){
			default : 
				super.initinteract(sq,d);
		}
	}
	
	getClassName(){
		return 'Underground';
	}
	
	static staticClassName(){
		return 'Underground';
	}
}


class Sewers extends Level{
	constructor(name,p,id){
		super(name,p,id);
	}
	
	//Utilisé lors de la toute premiere création du niveau
	initMap(){
		if(this._initialized){
			console.log('Warning : already initialize');
			return;
		}
		this._initialized = 1;
		this.addSquare(5,5,1);
		this.addSquare(6,5,1);
		this.addSquare(7,5,1);
		this.addSquare(7,6,1);
		this.addSquare(7,7,1);
		this.addSquare(6,7,1);
		this.addSquare(5,7,1);
		this.addSquare(5,6,1);

		let stairs = this.addSquare(4,5,1,Stairs);
		stairs.destination = 1;
		stairs.destinationlevel = 'underground';
		stairs.destinationx = 23;
		stairs.destinationy = 23;
		stairs.destinationz = 1;
		stairs.destinationdir = 'left';
		stairs.tiletype = 'stairs';
		stairs.stairsdirection = 'west';
		stairs.minz = 0;
		stairs.maxz = 1;
		this.setSquare(stairs);

		this.placeWalls();
	}
	
	getClassName(){
		return 'Sewers';
	}
	
	static staticClassName(){
		return 'Sewers';
	}
}

var l;
function testmap(){
	l = new Underground('under',s,1);
	l.initMap();
	
	
	showMap(l);
	moveMap(l);
}


registerClass(Underground);
registerClass(Sewers);

