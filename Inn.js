/*
<style>
#wrapper{
	width:600px;
	height:400px;
	background-color:grey;
}
.thirdpanel{
	height : 380px;
	width:180px;
	margin:10px;
	float:left;
	background-color:#404080;
}
.charimg{
	width:180px;
	height:180px;
	background-image:url("");
}
</style>



<div id="wrapper">
	<div class="thirdpanel">
	</div>
	<div class="thirdpanel">
		<div class="charimg">
			IMG
		</div>
		<div class="charskills" id="charskills">
		</div>
	</div>
	<div class="thirdpanel">
	
	</div>
	
</div>
*/

class Inn{
	constructor(name,village){
		//console.log('inn named '+name);
		this.name = name;//must be unique
		this._village = village;
		this._chars = [];
		this.inn = 1;
		this._charpanels = [];
		if(!window.inn){
			window.inn = [];
		}
		window.inn[this.name] = this;
	}
	
	
	createDiv(div){
		/*
	<div class="thirdpanel">
	</div>
	<div class="thirdpanel">
		<div class="charimg">
			IMG
		</div>
		<div class="charskills" id="charskills">
		</div>
	</div>
	<div class="thirdpanel">
	
	</div>
	
*/
		
		let e = document.createElement('div');
		e.className = 'buttonVillage';
		e.style =	'left : 10px; bottom : 20px;z-index:3;width:135px;';
		e.innerHTML = l.text('backtovillage',1);
		
		e.setAttribute('onclick','showMainWindow("villageWindow")');
		
		div.appendChild(e);
		
		//Liste persos
		let panleft = document.createElement('div');
		panleft.className = 'thirdpanel';
		panleft.id='panleft';
		// console.log(panleft);
		div.appendChild(panleft);
		// console.log(div.childNodes);
		let pancharwrapper = document.createElement('div');
		pancharwrapper.id = 'pancharwrapper';
		div.appendChild(pancharwrapper);
		//return;
		for(let i=0;i<this._chars.length;i++){
			let c = this._chars[i];
			let panchar = document.createElement('div');
			panchar.id='panchar'+this._chars[i]._id;
			panchar.style.display = 'none';
			this._charpanels[c._id] = panchar;
			pancharwrapper.appendChild(panchar);

			
			let pancenter = document.createElement('div');
			pancenter.className = 'thirdpanel';
			pancenter.style = 'margin-right:10px;';
			pancenter.innerHTML =
				'<div class="levelinn">'+			
				'	<img class="mediumicon"  src="../ressources/icons/level.png"/>'+
				'<span id="level'+c._id+'_2"></div>'+			
				'</div>'+			
				'<div class="moralinn">'+			
				'	<img class="mediumicon" id="smile'+c._id+'_2" src="../ressources/icons/moral'+c.getMoral()+'.png"/>'+
				'</div>'+			
				
				'<img src="../ressources/char/'+c.sprite+'.png" class="img180"/>'+
				'<div class="attributeWrapper"> '+
				'	<img class="mediumicon"  src="../ressources/icons/strength.png"/>'+
				'	<span class="attribute" id="strength'+c._id+'_2"></span>'+
				'</div>'+
				'<div class="attributeWrapper"> '+
				'	<img class="mediumicon"  src="../ressources/icons/constitution.png"/>'+
				'	<span class="attribute" id="constitution'+c._id+'_2"></span>'+
				'</div>'+
				'<div class="attributeWrapper"> '+
				'	<img class="mediumicon"  src="../ressources/icons/dexterity.png"/>'+
				'	<span class="attribute" id="dexterity'+c._id+'_2"></span>'+
				'</div>'+
				'<div class="attributeWrapper"> '+
				'	<img class="mediumicon"  src="../ressources/icons/perception.png"/>'+
				'	<span class="attribute" id="perception'+c._id+'_2"></span>'+
				'</div>'+
				'<div class="attributeWrapper"> '+
				'	<img class="mediumicon"  src="../ressources/icons/spirit.png"/>'+
				'	<span class="attribute" id="spirit'+c._id+'_2"></span>'+
				'</div>'+
				'<div class="attributeWrapper"> '+
				'	<img class="mediumicon"  src="../ressources/icons/wisdom.png"/>'+
				'	<span class="attribute" id="wisdom'+c._id+'_2"></span>'+
				'</div>'+
				'<div class="attributeWrapper"> '+
				'	<img class="mediumicon"  src="../ressources/icons/luck.png"/>'+
				'	<span class="attribute" id="luck'+c._id+'_2"></span>'+
				'</div>'+
				'<div class="attributeWrapper"> '+
				'	<img class="mediumicon"  src="../ressources/icons/speed.png"/>'+
				'	<span class="attribute" id="speed'+c._id+'_2"></span>'+
				'</div>';
			panchar.appendChild(pancenter);
			
			let panright = document.createElement('div');
			panright.className = 'thirdpanel';
			panright.innerHTML = 
				'<div class="inncharname">'+c.name+'</div>'+
				'<div id="inncharskills'+c._id+'" class="smallcharskills"></div>';
			if(!c.inTeam){
				panright.innerHTML += '<div class="buttonVillage buttonInn" id="buttonhire'+c._id+'" onclick="g.hire('+c._id+')"><img src="../ressources/icons/gold.png" class="mediumicon" style="float:none;" /><span style="position:relative;top:-6px;"><span id="_price'+c._id+'">'+c._price+'</span> '+l.text('hire',1)+' <span></div>';
			}else{
				panright.innerHTML += '<div class="buttonVillage buttonInn" id="buttonhire'+c._id+'" onclick="g.dismiss('+c._id+')"> '+l.text('dismiss',1)+' </div>';
			}
			panchar.appendChild(panright);
		
			let iconchar = document.createElement('div');
			iconchar.className='iconchar';
			iconchar.setAttribute('onclick','window.inn["'+this.name+'"].showChar('+c._id+')');
			iconchar.style = 'background-image:url("../ressources/char/'+c.sprite+'.png");'
			panleft.appendChild(iconchar);
			
			showSkillsCharInn(c);
			c.showProperties();
		}
		
		
		
	}
	
	
	addAvailableCharacter(c){
		this._chars.push(c);
		c.inn = this.name;
	}
	
	hired(c){
		c.hiredtimes ++;
		c.modMoral(0);
		let b = document.getElementById('buttonhire'+c._id);
		if(!b){
			console.log('Error : no hire button');
			return;
		}
		// b.style = 'background-color:rgba(200,0,0,0.5);';
		b.innerHTML ='  '+l.text('dismiss',1)+' ';
		b.style.display='none';
		setTimeout('show("'+b.id+'")',2000)
		b.setAttribute('onclick','g.dismiss('+c._id+')');
	}
	
	dismissed(c){
		let b = document.getElementById('buttonhire'+c._id);
		if(!b){
			console.log('Error : no hire button');
			return;
		}
		// b.style = 'background-color:rgba(0,200,0,0.5);';
		b.innerHTML =
			'<img src="../ressources/icons/gold.png" class="mediumicon" style="float:none;"/>'+
			'<span style="position:relative;top:-6px;"><span id="_price'+c._id+'">'+c._price+'</span> '+l.text('hire',1)+' </span>';
		b.style.display='none';
		setTimeout('show("'+b.id+'")',2000)
		b.setAttribute('onclick','g.hire('+c._id+')');
	}
	
	showChar(id){
		//todo
		for(let i=0;i<this._charpanels.length;i++){
			if(this._charpanels[i]){
				this._charpanels[i].style.display = 'none';
			}
		}
		this._charpanels[id].style.display = 'block';			
	}
	
	saveInCookie(savename = ''){
		this.listAvailableMembers = '';
		for(let i=0;i<this._chars.length;i++){
			//On ne sauvegarde pas ici les personnages de l'équipe, la classe Game s'en chargera
			if(!this._chars[i] || this._chars[i].inTeam ) continue; 
			this.listAvailableMembers += this._chars[i].name+',';
		}
		
		let keys = Object.keys(this);
		let savetext = '';
		for(let i = 0;i<keys.length;i++){
			if(keys[i][0] == '_') continue;
			savetext+=''+keys[i]+':'+this[keys[i]]+':'+(typeof this[keys[i]]).substr(0,1)+'/';
		}
		setCookie('save'+savename+'shop'+this.name,savetext);
		
		
		for(let i = 0;i<this._chars.length;i++){
			if( !this._chars[i] || this._chars[i].inTeam ) continue;
			this._chars[i].saveInCookie(savename);
		}
	}
	
	loadFromCookie(savename=''){
		let data = getCookie('save'+savename+'shop'+this.name);
		if(!data || data.length == 0){
			return false;
		}
		let dataArray = data.split('/');
		for(let i = 0;i<dataArray.length;i++){
			
			let variable = dataArray[i].split(':');
			if(variable[0].length ==0) continue;
			if(variable.length < 3) continue;
			
			if(variable[2] == 'n'){
				this[variable[0]] = Number(variable[1]);
			}else if(variable[2] == 's'){
				this[variable[0]] = variable[1];
			}
			
		}
		
		console.log('Loading availables chars...');
		let listNames = this.listAvailableMembers.split(',');
		for(let i = 0;i<listNames.length;i++){
			if(listNames[i].length <= 0) continue;
			let c = new Character(listNames[i],g._nextCharId++,g);
			g._allcharacters[c._id] = c;
			this._chars.push(c);
			c.loadFromCookie(savename);
		}
		
		
		for(let i = 0;i<g._partyMembers.length;i++){
			if( !g._partyMembers[i] || g._partyMembers[i].inTeam == 2 ) continue;
			this._chars.push(g._partyMembers[i]);
		}
		
	}
	
	getClassName(){
		return 'Inn';
	}
	
	static staticClassName(){
		return 'Inn';
	}
}


registerClass(Inn);