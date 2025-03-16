class MonsterGroup extends Entity{
	constructor(id,spawnarea){
		super(id);
		this.monsterType1 = 'Nightmare';
		this.monsterType1Chance = 100;
		this.monsterType1Power = 1;
		this.monsterType2 = '';
		this.monsterType2Chance = 0;
		this.monsterType2Power = 1;
		this.monsterType3 = '';
		this.monsterType3Power = 1;
		this.minmonsterspow = 1;//4;
		this.maxmonsterspow = 4;//8;
		this.elitechance = 10;//15;
		this.champchance = 5;//7;
		this._monsters = [];
		this._leader = null;
		this.totalpower = 0;
		this._spawnarea = spawnarea;
		this._lastdir = '';
		this.movementdelay = 1000;
		this.ismonster = 1;
		
	}
	
	generate(){
		let pow = rand(this.minmonsterspow,this.maxmonsterspow);
		
		let loop=3;
		let leaderpow = 0;
		let r,monstertype,monstercat,monsterpow;
		while(loop > 0 && this.totalpower < pow && this._monsters.length < 6){
			r = rand(0,99);
			if(r < this.monsterType1Chance){
				//monster 1
				monstertype = this.monsterType1;
				monsterpow = this.monsterType1Power;
			}else{
				r -= this.monsterType1Chance;
				if(r < this.monsterType2Chance){
					//monster2
					monstertype = this.monsterType2;
					monsterpow = this.monsterType2Power;
				}else{
					//monster3
					monstertype = this.monsterType3;
					monsterpow = this.monsterType3Power;
				}
			}
			
			
			r = rand(0,99);
			if(r < this.champchance ){
				//champion
				monstercat = 4;
			}else if(r < this.champchance+this.elitechance ){
				//elite
				monstercat = 2;
			}else{
				//normal
				monstercat = 1;
			}
			
			monsterpow = monstercat * monsterpow;
			if( monsterpow + this.totalpower > pow && loop > 1){
				loop--;
				continue;
			}
			
			let newm = new window[monstertype](g._nextMonsterId++,g,monstercat);
			this._monsters.push(newm);
			this.totalpower += monsterpow;
			if(!this._leader || monsterpow > leaderpow){
				this._leader = newm;
				this.sprite = newm.sprite;
			}
		}
		
	}
	
	
	automove(){
		if(!this._square || this._inBattle) return;
		if(this._square._level == g._currentMap){
			let possibledir = [];
			let possibledest = [];
			let existantdir = ['north','south','west','east'];

			for(let i =0;i<existantdir.length;i++){
				let adj = this._square.getAdjacentSquare(existantdir[i]);
				if(adj && this._spawnarea._squares.indexOf(adj) >= 0 && !adj._entity){
					possibledir.push(existantdir[i]);
					possibledest.push(adj);
					if(existantdir[i] == this._lastdir ){
						//Il a 3 fois plus de chance de continuer dans la même direction
						possibledir.push(existantdir[i]);
						possibledir.push(existantdir[i]);
						possibledir.push(existantdir[i]);
						possibledest.push(adj);
						possibledest.push(adj);
						possibledest.push(adj);
					}
				}
			}
			
			if(possibledir.length){
				let r = rand(0, possibledir.length-1);
				this._square._level.moveEntity(this,possibledest[r]);
				this._lastdir = possibledir[r];
			}
		}
		let delay;
		if(this._square._level == g._currentMap ){
			delay = this.movementdelay;
		}else{
			delay = this.movementdelay*4;
		}
		this._nextMove = setTimeout('entity'+this._id+'.automove()',delay);
	}
	
}