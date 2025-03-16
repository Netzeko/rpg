
function setCookie(cname, cval) {
    document.cookie = cname + "=" + cval + ";";
}

function getCookie(cname){
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