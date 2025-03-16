class Skill{
	static use(user,target){
		if(Heal.possible(user)){
			user.modStat('mana', -Heal.getManaConsumption() );
			target.modStat('health', 15 );
			return 1;
		}
		return 0;
	}
	static possible(user){
		return 0;
	}
	static getName(){return 'Skill';}
	static getClassName(){return 'Skill';}
	static getHealthConsumption(){return 0;}
	static getEnduranceConsumption(){return 0;}
	static getManaConsumption(){return 0;}
	static getMindConsumption(){return 0;}
	static potent(){return 0;}
}

class Heal extends Skill{
	static use(user,target){
		if(Heal.possible(user)){
			user.modStat('mana', -Heal.getManaConsumption() );
			target.modStat('health', 15 );
			return 1;
		}
		return 0;
	}
	static possible(user){
		return user.mana >= Heal.getManaConsumption();
	}
	static getName(){return 'Heal';}
	static getClassName(){return 'Heal';}

	static getManaConsumption(){
		return 10;
	}
	static potent(){return 15;}
}

class Attack extends Skill{
	static use(user,target){
		if(Attack.possible(user)){
			
			user.modStat('endurance', -Attack.getEnduranceConsumption() );
			
			if(user.health > 0 && target.health > 0){
				user.triggerEvents('evattack',[user,target]);
				target.triggerEvents('evattacked',[user,target]);
				console.log(user.name+' attack '+target.name+' ('+user.precision+'/'+target.dodge+')');
				//var damages = Math.max(attacker.attack - defenser.defense,0);
				let damages = Math.floor( (10 * user.attack) / (10 + target.defense));
				let hit = (user.precision / target.dodge) *0.4;
				
				let res = 1.0-Math.random();
				if(res > hit){
					//console.log('miss!');
					target.triggerEvents('evmissed',[user,target]);
					return 0;
				}
				target.triggerEvents('evhit',[user,target]);
				console.log('>Deal '+damages+' damages ('+user.attack+' ATT - '+target.defense+' DEF)');
				target.modStat('health',- damages);
				if(damages){
					target.triggerEvents('evhurt',[user,target]);
				}
				return 1;
			}
			
		}
		return 0;
	}
	
	static possible(user){
		return user.endurance >= Attack.getEnduranceConsumption();
	}
	static getName(){return 'Attack';}
	static getClassName(){return 'Attack';}

	static getEnduranceConsumption(){
		return 1;
	}
	static potent(){return 10;}
}


class UseItem extends Skill{
	static use(user,target){
		useItem(null,target);
		return 1;
	}
	
	static possible(user){
		return 1;
	}
	static getName(){return 'Use item';}
	static getClassName(){return 'UseItem';}

}

class Fireball extends Skill{
	static use(user,target){
		if(Fireball.possible(user)){
			user.modStat('mana', -Fireball.getManaConsumption() );
			target.modStat('health', -15 );
			return 1;
		}
		return 0;
	}
	static possible(user){
		return user.mana >= Heal.getManaConsumption() ;
	}
	static getName(){return 'Fireball';}
	static getClassName(){return 'Fireball';}
	static getManaConsumption(){
		return 10;
	}
	static potent(){return 15;}
	
}

		
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