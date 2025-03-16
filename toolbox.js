var lskeys = [];
var lsdatalength = 0;
var lsnamelength = 0;
function setCookie(cname, cval) {
	/*
	var a = new Date();
	a = new Date(a.getTime() +1000*60*60*24*365);
	document.cookie = cname + "=" + cval + "; expires="+a.toGMTString()+";";
	*/
	lskeys.push(cname);
	lsdatalength += cval.length ;
	lsnamelength += cname.length ;
	localStorage.setItem(cname,cval);
}

function getCookie(cname){
	return localStorage.getItem(cname);
	/*
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
					c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
					return c.substring(name.length, c.length);
			}
	}
	return "";
	*/
}
var childrens = [];
function childrenTree(node = document.body,level = 0){
	if(node.childNodes.length) console.log(level+'-'+node.tagName+' id='+node.id+' '+node.childNodes.length+' children');
	if(node.id){ 
		if( !childrens[node.id]){
			childrens[node.id] = node.childNodes.length;
		}else{
			console.log(' '+childrens[node.id]+'->'+node.childNodes.length);
		}
	}
	//if(node.tagName == undefined){ console.log(node); }
	for(let i=0;i<node.childNodes.length;i++){
		childrenTree(node.childNodes[i],level+1);
	}
}

function show(id,display = 'block'){
	var node = document.getElementById(id);
	if(node){
		node.style.display = display;
	}
}

function hide(id){
	var node = document.getElementById(id);
	if(node){
		node.style.display = 'none';
	}
}

function switchDisplay(id,display = 'block'){
	var node = document.getElementById(id);
	if(node ){
		if(node.style.display == 'none'){
			node.style.display = display;
		}else{
		node.style.display = 'none';
		}
	}
}

function rand(min,max){
	let range = max-min;
	let r = Math.floor(Math.random()*(range+1))+min;
	return r;
}

function testrand(min,max){
	let result = [];
	for(let i =0;i<10000;i++){
		let r = rand(min,max);
		if(!result[r]){
			result[r] = 0;
		}
		result[r]++;
	}
	console.log(result);
}

function testrandm(f){
	var results = [];
	for(var j=0;j<10000;j++){
		var m  =f();
		var id;
		if(m == null){
			id = 0;
		}else{
			id = m._id;
		}
		if(results[id]){
			results[id]++;
		}else{
			results[id] = 1;
		}
	}
	console.log(results);
}

function clearChildren(node){
	while (node.firstChild) {
			node.removeChild(node.firstChild);
	}
}

function registerClass(cl){
	window[cl.staticClassName()] = cl;
	//maintenant on peut instancier en faisant o = new window['MyClass']
}