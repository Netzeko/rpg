class Skill{
	static use(user,target){
		if(this.possible(user,target)){
			this.consume(user);
			this.animate(target);
			return 1;
		}
		return 0;
	}

	static getName(){return 'Skill';}
	static getClassName(){return 'Skill';}
	static getHealthConsumption(){return 0;}
	static getEnduranceConsumption(){return 0;}
	static getManaConsumption(){return 0;}
	static getMindConsumption(){return 0;}
	static potent(){return 0;}
	static passive(){ return 0; }
	static learn(c){ }
	static unlock(){ return [];}
	static require(){ return [];}
	static pointCost(){ return 1; }
	static offensive(){ return 0; }
	static computeMagicDamage(user,target,potent = this.potent()){
		//console.log('mpower : *'+(user.magicpower/5));
		//console.log('boost : *'+(1+user['boost'+this.element()]));
		//console.log('resist : '+target['_res'+this.element()]+'%');
		let dmg = potent * (user.magicpower/5) * (1+user['boost'+this.element()]/100) * (1+user['bonus'+target.creaturetype]/100) * ( (100-target['_res'+this.element()])/100 ) * (1+rand(0,10)/20); 
		dmg = Math.floor(dmg);
		console.log(dmg+' magic damages');
		if(user.throwcrit()){
			dmg = 3*dmg;
			console.log('Critical magic damages !');
		}
		if(target.throwcrit()){
			dmg = Math.floor(dmg/3);
			console.log('Critical magic guard!');
		}
		return dmg;
	}
	static computePhysicalDamage(user,target){
		let dmg = (15 * user.attack * this.potent() ) * (1+user['bonus'+target.creaturetype]/100) / (50 + 5*target.defense);
		dmg = Math.floor(dmg);
		
		if(user.throwcrit()){
			dmg = 3*dmg;
			console.log('Critical physic damages !');
		}
		if(target.throwcrit()){
			dmg = Math.floor(dmg/3);
			console.log('Critical physic guard!');
		}
		return dmg;
	}
	
	static possible(user,target){
		console.log('is it possible ?');
		let cond =  user && target 
		&& !user.dead > 0 
		&& !target.dead > 0
		&& user.health >= this.getHealthConsumption()
		&& user.mana >= this.getManaConsumption()
		&& user.endurance >= this.getEnduranceConsumption()
		&& user.mind >= this.getMindConsumption();
		let cond2 = user.isCharacter && (this.offensive() && target.isMonster   || !this.offensive() && target.isCharacter )
		        ||  user.isMonster   && (this.offensive() && target.isCharacter || !this.offensive() && target.isMonster );
		console.log('cond='+cond);
		console.log('cond2='+cond2);
		return cond && cond2;
	}
	
	static consume(user){
		user.modStat('health',-this.getHealthConsumption(),user);
		user.modStat('mana',-this.getManaConsumption());
		user.modStat('endurance',-this.getEnduranceConsumption());
		user.modStat('mind',-this.getMindConsumption());
	}
	
	//A surcharger pour les passifs qui ajoutent des event listener
	static loadFromCookie(user){}
	
	static getAnimationSprite(){ return 'hit' };
	static getAnimationTime(){ return 250 };
	static animate(target,sprite = this.getAnimationSprite(),delay = this.getAnimationTime()){
		if(!target || !sprite)return;
		let topbot = '';
		let fromtop = 0;
		let fromleft = 0;
		if(target.isMonster){
			
			topbot = 'top';
		}else{
			topbot = 'bottom';
		}
		switch(target.slot){
			case 1:
				fromtop = 200;
				fromleft = 200;
				break;
			case 2:
				fromtop = 200;
				fromleft = 0;
				break;
			case 3:
				fromtop = 200;
				fromleft = 400;
				break;
			case 4:
				fromtop = 0;
				fromleft = 200;
				break;
			case 5:
				fromtop = 0;
				fromleft = 0;
				break;
			case 5:
				fromtop = 0;
				fromleft = 400;
				break;

		}
		
		let id = g._nextEffectId++;
		let e = document.createElement('div');
		e.className = 'skillEffect';
		e.id = 'effect'+id;
		e.style = topbot+':'+fromtop+'; left:'+fromleft+';background-image:url("../ressources/effects/'+sprite+'.png");';
		document.getElementById('leftPanel').appendChild(e);
		// console.log(e);
		setTimeout('document.getElementById("'+e.id+'").parentNode.removeChild(document.getElementById("'+e.id+'"));',delay);
	}
	
	
}

class Heal extends Skill{
	static use(user,target){
		if(super.use(user,target)){
			
			target.modStat('health', +this.computeMagicDamage(user,target),user );
			return 1;
		}
		return 0;
	}
	
	static getName(){return 'Heal';}
	static getClassName(){return 'Heal';}

	static getManaConsumption(){
		return 7;
	}
	static potent(){return 10;}
	static offensive(){ return 0; }
	static element(){ return 'life';}
	static getAnimationSprite(){ return 'heal2' };
}

class Attack extends Skill{
	static use(user,target){
		if(super.use(user,target)){			
			
			user.triggerEvents('evattack',[user,target]);
			target.triggerEvents('evattacked',[user,target]);
			console.log(user.name+' attack '+target.name+' ('+user.precision+'/'+target.dodge+')');
			//var damages = Math.max(attacker.attack - defenser.defense,0);
			let damages = this.computePhysicalDamage(user,target);
			let hit = (user.precision / target.dodge) *0.4;
			
			if(user.throwcrit()){
				hit = 3*hit;
				console.log('Critical precision !');
			}
			if(target.throwcrit()){
				hit = Math.floor(hit/4);
				console.log('Critical dodge !');
			}
			
			let res = 1.0-Math.random();
			if(res > hit){
				//console.log('miss!');
				target.triggerEvents('evmissed',[user,target]);
				return 0;
			}
			target.triggerEvents('evhit',[user,target]);
			console.log('>Deal '+damages+' damages ('+user.attack+' ATT - '+target.defense+' DEF)');
			target.modStat('health',- damages,user);
			user.triggerEvents('evonstrike',[user,target]);
			if(damages){
				target.triggerEvents('evhurt',[user,target]);
			}
			return 1;
			
			
		}
		return 0;
	}
	
	
	static getName(){return 'Attack';}
	static getClassName(){return 'Attack';}

	static getEnduranceConsumption(){ return 1; }
	static potent(){return 10;}
	static getAnimationSprite(){ return 'attack' };
	static offensive(){ return 1; }
}

class Bite extends Attack{
	
	
	static getName(){return 'Bite';}
	static getClassName(){return 'Bite';}
	static require(){ return [Bite];}
	static getAnimationSprite(){ return 'bite' };

}



class UseItem extends Skill{
	static use(user,target){
		if(super.use(user,target)){			

			useItem(null,target);
			return 1;
		}
		return 0;
	}
	
	
	static getName(){return 'Use item';}
	static getClassName(){return 'UseItem';}
	static unlock(){ return [];}
	static offensive(){ return 0; }
	static getAnimationSprite(){ return 'item' };
}

class Fireball extends Skill{
	static use(user,target){
		if(super.use(user,target)){
			target.modStat('health', -this.computeMagicDamage(user,target),user );
			return 1;
		}
		return 0;
	}

	static getName(){return 'Fireball';}
	static getClassName(){return 'Fireball';}
	static getManaConsumption(){ return 15; }
	static element(){ return 'fire'; }
	static potent(){return 20;}
	static require(){ return [FireBasics];}
	static getAnimationSprite(){ return 'fire1' };
	static offensive(){ return 1; }
}

class FireRain extends Skill{
	static use(user,target){
		if(this.possible(user,target)){
			this.consume(user);
			for(let i=0;i<ennemyCards.length;i++){
				if(!ennemyCards[i])continue;
				
				this.animate(ennemyCards[i]);
				ennemyCards[i].modStat('health', -this.computeMagicDamage(user,ennemyCards[i]),user );
			}
			
			return 1;
		}
		return 0
	}

	static getName(){return 'FireRain';}
	static getClassName(){return 'FireRain';}
	static getManaConsumption(){ return 35; }
	static element(){ return 'fire'; }
	static potent(){return 18;}
	static require(){ return [FireAdvanced];}
	static getAnimationSprite(){ return 'fire1' };
	static offensive(){ return 1; }
}


class Explosion extends Skill{
	static use(user,target){
		if(this.possible(user,target)){
			this.consume(user);
			let mult = 1 + user.mana/45;
			console.log('EXPLOSION ! *'+mult);
			user.modStat('mana',-user.mana);
			for(let i=0;i<ennemyCards.length;i++){
				if(!ennemyCards[i])continue;
				
				this.animate(ennemyCards[i]);
				ennemyCards[i].modStat('health', Math.floor(-this.computeMagicDamage(user,ennemyCards[i])*mult),user );
			}
			
			return 1;
		}
		return 0
	}

	static getName(){return 'Explosion';}
	static getClassName(){return 'Explosion';}
	static getManaConsumption(){ return 50; }
	static element(){ return 'fire'; }
	static potent(){return 25;}
	static require(){ return [FireAdvanced];}
	static getAnimationSprite(){ return 'explosion' };
	static offensive(){ return 1; }
}

class Firebolt extends Fireball{
	

	static getName(){return 'Fire bolt';}
	static getClassName(){return 'Firebolt';}
	static getManaConsumption(){ return 5; }
	static element(){ return 'fire'; }
	static potent(){return 10;}
	static require(){ return [FireBasics];}
	static getAnimationSprite(){ return 'fire1' };
}

class Burn extends Skill{
	static use(user,target){
		if(super.use(user,target)){
			//(id,nb,delay,user,target,effect,skill,damage){
			let id = g._nexteotId++;
			if(target._burning && window.eot[target._burning]){
				clearTimeout(window.eot[target._burning].timer);
				removeEOT(window.eot[target._burning]);
			}
			target._burning = id;
			new DamageOnTime(id,10,1500,user,target,'burn',Burn,this.computeMagicDamage(user,target) );
			return 1;
		}
		return 0;
	}
	static getName(){return 'Burn';}
	static getClassName(){return 'Burn';}
	static getManaConsumption(){ return 10; }
	static element(){ return 'fire'; }
	static potent(){return 3;}
	static require(){ return [FireBasics];}
	static getAnimationSprite(){ return '' };
	static offensive(){ return 1; }
}


class FirePillar extends Skill{
	static use(user,target){
		if(super.use(user,target)){
			target.modStat('health', -this.computeMagicDamage(user,target),user );
			//(id,nb,delay,user,target,effect,skill,damage){
			let id = g._nexteotId++;
			if(target._burning && window.eot[target._burning]){
				clearTimeout(window.eot[target._burning].timer);
				removeEOT(window.eot[target._burning]);
			}
			target._burning = id;
			new DamageOnTime(id,3,1500,user,target,'burn',FirePillar,this.computeMagicDamage(user,target,7) );
			return 1;
		}
		return 0;
	}
	static getName(){return 'Fire pillar';}
	static getClassName(){return 'FirePillar';}
	static getManaConsumption(){ return 40; }
	static element(){ return 'fire'; }
	static potent(){return 25;}
	static require(){ return [FireAdvanced];}
	static getAnimationSprite(){ return 'firepillar' };
	static offensive(){ return 1; }
}

class FireBarrier extends Skill{
	static use(user,target){
		if(super.use(user,target)){
			
			let id = g._nexteotId++;
			if(target._barrier && window.eot[target._barrier]){
				clearTimeout(window.eot[target._barrier].timer);
				removeEOT(window.eot[target._barrier]);
			}
			target._barrier = id;
			new BuffStat(id,1,10000,user,target,'',FireBarrier,'resistfire',50 );
			return 1;
		}
		return 0;
	}
	static getName(){return 'FireBarrier';}
	static getClassName(){return 'FireBarrier';}
	static getManaConsumption(){ return 12; }
	static element(){ return 'fire'; }
	static require(){ return [FireAdvanced];}
	static getAnimationSprite(){ return '' };
}

class FireBasics extends Skill{
	static passive(){ return 1; }
	static getName(){return 'Fire basics';}
	static getClassName(){return 'FireBasics';}
	static unlock(){ return [Fireball,Firebolt,Burn,FireAdvanced];}
	static learn(c){ 
		c.boostfire += 0;
	}
}

class FireAdvanced extends FireBasics{
	static getName(){return 'Fire advanced';}
	static getClassName(){return 'FireAdvanced';}
	static unlock(){ return [FirePillar,FireBarrier,EndoFire,FireRain,Explosion];}
	static require(){ return [FireBasics];}
	static learn(c){ 
		c.boostfire += 10;
	}
}

class EndoFire extends Skill{
	static use(user,target){
		if(super.use(user,target)){
			
			let id = g._nexteotId++;
			if(target._endo && window.eot[target._endo]){
				clearTimeout(window.eot[target._endo].timer);
				removeEOT(window.eot[target._endo]);
			}
			target._endo = id;
			let evl = new EventListener(id,1,30000,user,target,'',EndoFire,'onstrike' );
			evl.user = user;
	
			return 1;
		}
		return 0;
	}
	
	static onstrike(param,caller){
		//console.log('onstrike : param,caller');
		//console.log(param);
		//console.log(caller);
		let dmg = this.computeMagicDamage(caller.user,param[1],this.potent() );
		console.log('EndoFire deal '+dmg+' damages to '+param[1].name);
		param[1].modStat('health',-dmg,param[0]);
		Skill.animate(param[1],'fire1',200);
	}
	//this.skill[ev](param,this);
	static getName(){return 'EndoFire';}
	static getClassName(){return 'EndoFire';}
	static getManaConsumption(){ return 12; }
	static element(){ return 'fire'; }
	static require(){ return [FireAdvanced];}
	static getAnimationSprite(){ return '' };
	static potent(){ return 5; }
}

class Conflagration extends Fireball{
	
}

/*
class Meditate extends Skill{
	static use(user,target){
		if(Meditate.possible(user)){
			user._inMeditateCooldown = 1;
			user.regenerate();
			setTimeout(function(){Meditate.clearDelay(user)},5000);
			return 1;
		}else{
			console.log('Meditate in delay');
			return 0;
		}
	}
	static possible(user){
		return !user._inMeditateCooldown;
	}
	static getName(){return 'Meditate';}
	static getClassName(){return 'Meditate';}
	static clearDelay(user){
		if(Meditate.possible(user)){
			console.log('already cleared');
		}
		user._inMeditateCooldown = 0;
		console.log('ok cleared');
	}

}
*/