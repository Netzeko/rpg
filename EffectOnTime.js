class EffectOnTime{
	constructor(id,nb,delay,user,target,effect,skill){
		this._id = id;
		this.nb = nb;
		this.delay = delay;
		this.user = user;
		this.target = target;
		this.effect = effect;
		this.skill = skill;
		
		if(!window.eot){
			window.eot = [];
		}
		window.eot[this._id] = this;
		addEOT(this);
		this.timer = setTimeout('window.eot['+this._id+'].trigger()',this.delay);
	}
	
	trigger(){
		//console.log('trigger '+this.skill.getClassName()+' '+this._id+' '+this.nb);
		this.nb--;
		Skill.animate(this.target,this.effect,200);
		if(this.nb >0){
			this.timer = setTimeout('window.eot['+this._id+'].trigger()',this.delay);
		}else{
			removeEOT(this);
		}
	}
	
	over(){//A utiliser a la fin d'un effet
		
	}
}

class DamageOnTime extends EffectOnTime{
	constructor(id,nb,delay,user,target,effect,skill,damage){
		super(id,nb,delay,user,target,effect,skill);
		this.damage = damage;
	}
	
	trigger(){
		if(!this.target.dead){
			this.target.modStat('health',-this.damage,this.user);
			super.trigger();
		}else{
			removeEOT(this);
		}
	}
}



class BuffStat extends EffectOnTime{
	constructor(id,nb,delay,user,target,effect,skill,stat,value){
		super(id,nb,delay,user,target,effect,skill);
		this.stat = stat;
		this.value = value;
		this.target['_tmp_modifier_'+this.stat] += this.value;
		this.target.calculateStats();
	}
	
	trigger(){
		if(!this.target.dead){
			super.trigger();
		}else{
			removeEOT(this);
		}
	}
	
	over(){
		this.target['_tmp_modifier_'+this.stat] -= this.value;
		this.target.calculateStats();

	}
}


class EventListener extends EffectOnTime{
	constructor(id,nb,delay,user,target,effect,skill,ev){
		super(id,nb,delay,user,target,effect,skill);
		this.ev = ev;
		this.target.addEvent('ev'+this.ev,this,'execute');
		
		
	}
	
	execute(param){
		//console.log('EventListener execute : param');
		//console.log(param);
		this.skill[this.ev](param,this);
	}
	
	trigger(){
		if(!this.target.dead){
			super.trigger();
		}else{
			removeEOT(this);
		}
	}
	
	over(){
		this.target.removeEvent('ev'+this.ev,this,'execute');
	}
}