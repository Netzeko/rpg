
class Skill{
	constructor(name,healthConsumption,enduranceConsumption,manaConsumption,mindConsumption) {
		this.name = name;
		this.healthConsumption = healthConsumption;
		this.enduranceConsumption = enduranceConsumption;
		this.manaConsumption = manaConsumption;
		this.mindConsumption = mindConsumption;
	}
	use(user,target){
		if(this.possible(user)){
			this.action(user,target);
		}
	}
	//Renvoie vrai si l'utilisateur peux lancer la compétence
	possible(user){
		
	}
}

class Heal{
	static use(user,target){
		if(Heal.possible(user)){
			user.modStat('mana', -Heal.getManaConsumption() );
			target.modStat('health', 15 );
		}
	}
	static possible(user){
		return user.mana >= Heal.getManaConsumption();
	}
	static getName(){
		return 'Heal';
	}
	static getClassName(){
		return 'Heal';
	}
	static getHealthConsumption(){
		return 0;
	}
	static getEnduranceConsumption(){
		return 0;
	}
	static getManaConsumption(){
		return 10;
	}
	static getMindConsumption(){
		return 0;
	}
	
	//Renvoie vrai si l'utilisateur peux lancer la compétence
	possible(user){
		return user.mana >= Heal.getManaConsumption();
	}
}


class Fireball{
	static use(user,target){
		if(Fireball.possible(user)){
			user.modStat('mana', -Fireball.getManaConsumption() );
			target.modStat('health', -15 );
		}
	}
	static possible(user){
		return user.mana >= Heal.getManaConsumption();
	}
	static getName(){
		return 'Fireball';
	}
	static getClassName(){
		return 'Fireball';
	}
	static getHealthConsumption(){
		return 0;
	}
	static getEnduranceConsumption(){
		return 0;
	}
	static getManaConsumption(){
		return 10;
	}
	static getMindConsumption(){
		return 0;
	}
	
	//Renvoie vrai si l'utilisateur peux lancer la compétence
	possible(user){
		return user.mana >= Heal.getManaConsumption();
	}
}