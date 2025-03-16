var saveData = [];
var listSkin = ['1','2']
function init(){
	for(let i=1;i<=6;i++){
		let dataString = getCookie('slot'+i);
		if(dataString){
			
			let dataArray = dataString.split('/');
			saveData[i] = [];
			for(let j = 0;j<dataArray.length;j++){
				let variable = dataArray[j].split(':');
				if(variable[0].length == 0) continue;
				
				if(variable[2] == 'number' || variable[2] == 'n'){
					saveData[i][variable[0]] = Number(variable[1]);
				}else if(variable[2] == 'string' || variable[2] == 's'){
					saveData[i][variable[0]] = variable[1];
				}
			}
			//		savetext = 'savename:'+this.savename+':s/'+'time:'+this.spenttime+':n/'+'level:'+this._partyMembers[1].level+':n/'+'sprite:'+this._partyMembers[1].imageid+':n/';

			let d = document.createElement('div');
			d.className = 'saveslot';
			d.innerHTML = saveData[i].savename;
			d.saveslot = i;
			d.setAttribute('onclick','hideChildren("savedata");show("sd'+i+'");');
			document.getElementById('savelist').appendChild(d);
			
			let ds = document.createElement('div');
			ds.className = 'savedata';
			ds.id = 'sd'+i;
			
			ds.style.display = 'none';
			ds.saveslot = i;
			let hours = Math.floor(Number(saveData[i].time)/3600);
			let minutes = Math.floor((Number(saveData[i].time) - hours*3600)/60);
			ds.innerHTML = ''+
				'<img src="../ressources/char/'+saveData[i].sprite+'.png" class="spritesave"/>'+
				'<div class="saveinfowrapper"><div class="saveinfo">'+saveData[i].name+'</div></div>'+
				'<div class="saveinfowrapper"><div class="saveinfo"><img src="../ressources/icons/level.png" class="mediumicon"/> <span class="mediumtext">'+saveData[i].level+'</span> '+
				'<img src="../ressources/icons/time.png" class="mediumicon"/> <span class="mediumtext">'+('00' + hours).slice(-2)+':'+('00' + minutes).slice(-2)+'</span> </div></div>'+
				'<br/>'+
				'<div class="buttonVillage" style="position:relative;float:right" onclick="load('+i+')">Load</div>';
			document.getElementById('savedata').appendChild(ds);
			
		}else{
			let d = document.createElement('div');
			d.className = 'saveslot';
			d.innerHTML = 'NEW SAVE';
			d.id='button'+i;
			d.saveslot = i;
			d.setAttribute('onclick','hideChildren("savedata");show("sd'+i+'");changeSavename('+i+')');
			document.getElementById('savelist').appendChild(d);
			
			
			let ds = document.createElement('div');
			ds.className = 'savedata';
			ds.id = 'sd'+i;
			
			ds.style.display = 'none';
			ds.saveslot = i;

			ds.innerHTML = ''+
				'<img src="../ressources/char/1.png" id="image'+i+'" class="spritesave"/>'+
				'<img class="arrowtop" style="left:40px;" src="../ressources/icons/previous.png" onclick="previousImage('+i+')"/>'+
				'<img class="arrowtop" style="right:40px;" src="../ressources/icons/next.png" onclick="nextImage('+i+')"/>'+
				'<div class="saveinfowrapper"><div class="saveinfo"><input style="background-color:rgba(0, 0, 0, 0.5);color:white;" type="text" id="name'+i+'"/></div></div>'+
				'<div class="saveinfowrapper"><div class="saveinfo"> </div></div>'+
				'<br/>'+
				'<div class="buttonVillage" style="position:relative;float:right" onclick="start('+i+')">Start</div>';
			document.getElementById('savedata').appendChild(ds);
		}
	}
}

var currentImage = [0,0,0,0,0,0];
function previousImage(slot){
	if(currentImage[slot] == 0){
		currentImage[slot] = listSkin.length -1;
	}else{
		currentImage[slot]--;
	}
	document.getElementById('image'+slot).setAttribute('src','../ressources/char/'+listSkin[currentImage[slot]]+'.png');
}
function nextImage(slot){
	if(currentImage[slot] == listSkin.length -1){
		currentImage[slot] = 0;
	}else{
		currentImage[slot]++;
	}
	document.getElementById('image'+slot).setAttribute('src','../ressources/char/'+listSkin[currentImage[slot]]+'.png');
}


function load(slot){
	setCookie('currentSaveSlot',slot);
	window.location.href='clicker.html';
}

function start(slot){
	setCookie('newcharname',document.getElementById('name'+slot).value );
	setCookie('newsavename',document.getElementById('savename'+slot).value);
	setCookie('charimage',listSkin[currentImage[slot]]);
	load(slot);
}

var edited = [];
function changeSavename(slot){
	if(!edited[slot]){
		document.getElementById('button'+slot).innerHTML='<input type="text" style="background-color:rgba(0, 0, 0, 0.5);color:white;" id="savename'+slot+'"/>';
		edited[slot] = 1;
	}
}

init();