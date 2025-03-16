class Monster extends Creature{
	constructor(name,id,game,cat) {
		super(name,id,game);
		
		this.isMonster = 1;
		this.exp = 70;
		
		
		
		this.cat = cat;
		//this.upToPartyLevel();
		this.calculateStats();
		this.creaturetype = 'demon';
		this._loot = [];

		this.initLoot();
	}
	
	upToPartyLevel(){
		let plevel = Math.max(s.getPartyLevel(),1);
		let p = 10*(plevel-1);
		//console.log('plevel='+s.getPartyLevel()+' points='+p);
		this.exp = 50+8*plevel;
		let ok = 1;
		while(ok){
			let r = rand(0,7);
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
	
	initLoot(){}
	
	lowestAttribute(){
		//maybe ?
	}
	
	showProperty(prop){			
		let htmlout = document.getElementById('monster'+this._id+prop);
		if(htmlout){
			htmlout.innerHTML = this[prop];
		}
	}
	
	showProperties(){
		let keys = Object.keys(this);
		for(let i = 0;i<keys.length;i++){
			this.showProperty(keys[i]);
		}
	}
	
	
	
	doAction(){
		
		let c = randomCharacter();
		if(c){
			//console.log(this.name+this._id+' attack '+c.name);
			g.computeAttack(this,c);
		}else{
			console.log(this.name+' : i\'m hungry !');
		}
		setTimeout('doAction("m",'+this._id+')',this.timeAttack);
	}
	
	computeDeath(attacker){
		if( !super.computeDeath(attacker)) return 0;
		//Todo:gerer si un monstre en tue un autre
		if(!attacker.isMonster){
			g.giveExpToAll(this.exp);
			
			//addItemFromName(this.itemname);

		}
		for(let i=0;i<this._loot.length;i++){
			//console.log(this._loot[i]);
			let chance = this._loot[i][1] * this.cat;
			let r = Math.random();
			if(r < chance){
				addItemFromName(this._loot[i][0]);
			}
		}
		clearTimeout(this.nextAttack);
		removeEnnemy(this._id,this.slot);
		return 2;
	}
}


class Nightmare extends Monster{
	constructor(id,game,cat) {
		super('Nightmare',id,game,cat);
		if(cat == 4){
			this.name += ' Champion';
			this.sprite = 'nightmarechampion';
		}else if(cat >= 2){
			this.name += ' Elite';
			this.sprite = 'nightmareelite';
		}else{
			this.sprite = 'nightmare';
		}
		
		this.exp = 50 * cat;

		this.strength = 6;
		this.constitution = 4+4*cat;
		this.dexterity = 10+2*cat;
		this.perception = 10+4*cat;
		this.spirit = 10;
		this.wisdom = 10;
		this.luck = 10;
		this.speed = 10+6*cat;
		
		this.weaponAttack = 5+2*cat;
		this.armor = 2*cat;
		this.creaturetype = 'demon';
		this.calculateStats();
		
		
		
	}
	static staticClassName(){
		return 'Nightmare';
	}
	
	initLoot(){
		this._loot.push(['Tooth',0.4]);
		this._loot.push(['Tooth',0.3]);
		this._loot.push(['Wing',0.1]);
		this._loot.push(['Cristaldark',0.004]);
	}
	
	
	doAction(){
		
		let c = randomCharacter();
		if(c){
			//console.log(this.name+this._id+' attack '+c.name);
			Bite.use(this,c);
		}else{
			console.log(this.name+' fly around in circle.');
		}
		setTimeout('doAction("m",'+this._id+')',this.timeAttack);
	}
	
	
}

registerClass(Nightmare);