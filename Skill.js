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