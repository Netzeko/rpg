
class Tooth extends Item{
	constructor(id){
		super(id);
		this.usable = 0;
		this.name = 'Tooth';
		this.price = 6;
		this.buyprice = 9;
	}
	
	getName(){return 'Tooth';}
	getClassName(){return 'Tooth';}
	static staticName(){return 'Tooth';}
	static staticClassName(){return 'Tooth';}
	static basePrice(){ return 6; }

}


class Wing extends Item{
	constructor(id){
		super(id);
		this.usable = 0;
		this.name = 'Wing';
		this.price = 12;
		this.buyprice = 18;
	}
	
	getName(){return 'Wing';}
	getClassName(){return 'Wing';}
	static staticName(){return 'Wing';}
	static staticClassName(){return 'Wing';}
	static basePrice(){ return 12; }

}



class Crystaldark extends Item{
	constructor(id){
		super(id);
		this.usable = 0;
		this.name = 'Dark crystal';
		this.price = 300;
		this.buyprice = 450;
	}
	
	getName(){return 'Dark crystal';}
	getClassName(){return 'Crystaldark';}
	static staticName(){return 'Dark crystal';}
	static staticClassName(){return 'Crystaldark';}
	static basePrice(){ return 300; }

}


class RoughSaphire extends Item{
	constructor(id){
		super(id);
		this.price = 50;
		this.buyprice = 75;
	}
	getName(){return 'RoughSaphire';}
	getClassName(){return 'RoughSaphire';}
	static staticName(){return 'RoughSaphire';}
	static staticClassName(){return 'RoughSaphire';}
	static basePrice(){ return 50; }
}