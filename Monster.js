class Monster extends Creature{
	constructor(id) {
		super('sampleMonster',id);
		
		this.isMonster = 1;
		this.exp = 70;

		this.upToPartyLevel();
		this.calculateStats();
	}
	
	
	
	upToPartyLevel(){
		let plevel = Math.max(s.getPartyLevel(),1);
		let p = 10*(plevel-1);
		//console.log('plevel='+s.getPartyLevel()+' points='+p);
		this.exp = 50+8*plevel;
		let ok = 1;
		while(ok){
			let r = Math.floor(Math.random()*8);
			if(this[this.getAttribute(r)] <= p){
				//console.log('up='+this.getAttribute(r));

				p-=this[this.getAttribute(r)];
				this[this.getAttribute(r)] ++;
				
			}
			else{
				//console.log('nup='+this.getAttribute(r));
				ok = 0;
				for(let j=1;j<8;j++){
					let n =  (r+j)%8 ;
					if(this[this.getAttribute(n)] <= p){
						//console.log('finally up='+this.getAttribute(n));
						p-=this[this.getAttribute(n)];
						this[this.getAttribute(n)] ++;
						ok = 1;
					}
				}
			}
		}
		
	}
	
	
	
	lowestAttribute(){
		//maybe ?
	}
	
	showProperty(prop){			
		var htmlout = document.getElementById('monster'+this._id+prop);
		if(htmlout){
			htmlout.innerHTML = this[prop];
		}
	}
	
	showProperties(){
		var keys = Object.keys(this);
		for(var i = 0;i<keys.length;i++){
			this.showProperty(keys[i]);
		}
	}
	
	modStat(stat,value){
		var stats = ['health','endurance','mana','mind'];
		if(stats.indexOf(stat) != -1){
			this[stat] += value;
			if(this[stat] > this['max'+stat]){
				this[stat] = this['max'+stat];
			}
			if(this[stat] < 0){
				this[stat] = 0;
			}
			
			this.showProperty(stat);
			showBars(this);
			return 1;

		}
		return -1;
	}
	
	/*
	attackChar(){
		if(this.health <=0){
			return;
		}
		s.computeAttack(this,s);
		console.log('attack '+this.id);
		this.nextAttack = setTimeout('attackChar('+this.id+')',this.timeAttack);
	}
	*/
	
	doAction(){
		
		var c = randomCharacter();
		if(c){
			console.log(this.name+this._id+' attack '+c.name);
			s.computeAttack(this,c);
		}else{
			console.log(this.name+' : i\'m hungry !');
		}
		setTimeout('doAction("m",'+this._id+')',this.timeAttack);
	}
	
	computeDeath(attacker){
		//Todo:gerer si un monstre en tue un autre
		//donner l'exp au groupe, pas au perso
		s.giveExpToAll(this.exp);
		
		/*attacker.exp += this.exp;
		attacker.totalexp += this.exp;
		attacker.levelUp();
		attacker.showProperty('exp');
		*/
		clearTimeout(this.nextAttack);
		removeEnnemy(this._id);
		return 2;
	}
}