class DungeonScene{
	constructor(){
		this._materials = [];
		this._waiting = 0;//textures pas encore chargées
		this._renderer = null;
		this._scene = null;
		this._camera = null;
		this._meshSquares = [];
		this._meshEntities = [];
		this._boxgeometry = new THREE.BoxGeometry( 1, 1, 1 );
		this._boxgeometrywall = new THREE.BoxGeometry( 0.002, 1, 1 );
		this._boxgeometryflat = new THREE.BoxGeometry( 1, 0.002, 1 );
		this._boxgeometryflatdiag = new THREE.BoxGeometry( Math.sqrt(2), 0.002, 1 );
		this._boxgeometryslab = new THREE.BoxGeometry( 0.2, 0.1, 0.996 );
		this._boxgeometrytrapeze = this.createTrapeze();
		
		
		this._map = null;
		this._entitiesMovement = [];
	}
	
	createTrapeze(){
		
		let geometry = new THREE.Geometry();
		geometry.vertices.push(
			new THREE.Vector3( -0.5,  0.5, -0.5 ),
			new THREE.Vector3( -0.5, -0.5, -0.5 ),
			new THREE.Vector3(  0.5, -0.5, -0.5 ),
			new THREE.Vector3( -0.5,  0.5, +0.5 ),
			new THREE.Vector3( -0.5, -0.5, +0.5 ),
			new THREE.Vector3(  0.5, -0.5, +0.5 )
		);
		geometry.faces.push( new THREE.Face3( 2, 1, 0 ) );
		geometry.faces.push( new THREE.Face3( 3, 4, 5 ) );
		geometry.faces.push( new THREE.Face3( 2, 4, 1 ) );//en bas a gauchefond
		geometry.faces.push( new THREE.Face3( 5, 4, 2 ) );//en bas a  droitedevant
		geometry.faces.push( new THREE.Face3( 0, 1, 3 ) );//cote hautfond
		geometry.faces.push( new THREE.Face3( 1, 4, 3 ) );//cote basdevant
		geometry.faces.push( new THREE.Face3( 5, 2, 0 ) );//face penchee 
		geometry.faces.push( new THREE.Face3( 3, 5, 0 ) );//face penchee 
		geometry.computeBoundingBox();
		/**/
		let max = geometry.boundingBox.max,
			min = geometry.boundingBox.min;
		let offset = new THREE.Vector2(0 - min.x, 0 - min.y);
		let range = new THREE.Vector2(max.x - min.x, max.y - min.y);
		let faces = geometry.faces;

		geometry.faceVertexUvs[0] = [];
		for (let i = 0; i < 2 ; i++) {

				let v1 = geometry.vertices[faces[i].a], 
						v2 = geometry.vertices[faces[i].b], 
						v3 = geometry.vertices[faces[i].c];
				geometry.faceVertexUvs[0].push([
						new THREE.Vector2((v1.x + offset.x)/range.x ,(v1.y + offset.y)/range.y),
						new THREE.Vector2((v2.x + offset.x)/range.x ,(v2.y + offset.y)/range.y),
						new THREE.Vector2((v3.x + offset.x)/range.x ,(v3.y + offset.y)/range.y)
				]);
		}
		//Base
		geometry.faceVertexUvs[0].push([
			new THREE.Vector2(1,1),//2
			new THREE.Vector2(0,0),//4
			new THREE.Vector2(1,0) //1
		]);
		geometry.faceVertexUvs[0].push([
			new THREE.Vector2(0,1),//5
			new THREE.Vector2(0,0),//4
			new THREE.Vector2(1,1) //2
		]);
		
		//Dos
		geometry.faceVertexUvs[0].push([
			new THREE.Vector2(0,1),
			new THREE.Vector2(0,0),
			new THREE.Vector2(1,1)
		]);
		geometry.faceVertexUvs[0].push([
			new THREE.Vector2(0,0),
			new THREE.Vector2(1,0),
			new THREE.Vector2(1,1)
		]);
		
		
		//Face penchée
		geometry.faceVertexUvs[0].push([
			new THREE.Vector2(0,0),
			new THREE.Vector2(1,0),
			new THREE.Vector2(1,1)
		]);
		geometry.faceVertexUvs[0].push([
			new THREE.Vector2(0,1),
			new THREE.Vector2(0,0),
			new THREE.Vector2(1,1)
		]);
		
		geometry.uvsNeedUpdate = true;
		return geometry;
	}
	
	addMaterial(matname,type='texture',transparent = false){
		this._waiting++;
		let texture = new THREE.TextureLoader().load( '../ressources/textures/'+matname+'.png',function(){g._scene.loaded()});
		let material = null;
		if(type == 'texture'){
			material = new THREE.MeshBasicMaterial({map: texture});
			material.transparent = transparent;
		}else if(type='sprite'){
			material = new THREE.SpriteMaterial({map: texture});
		}else{
			this._waiting --;
			console.log('unknown texture type');
			return;
		}
		this._materials[matname] = material;
		this._materials.push(material);
	}
	
	
	createMesh(meshtype,x,y,z){
		let mesh;
		if(meshtype != 'sprite'){
			mesh = new THREE.Mesh( this._boxgeometry, this._materials[meshtype] );
			if(meshtype == 'wall' || meshtype == 'door'){
				mesh.position.y = 0+z;
			}else if(meshtype == 'ceiling'){
				mesh.position.y = 1+z;
			}else if(meshtype == 'ground'){
				mesh.position.y = -1+z;
			}
		}
		else{
			if(!this._materials[meshtype]){
				addMaterial(meshtype,'sprite');
			}
			mesh = new THREE.Sprite( this._materials[meshtype] );
			mesh.position.y = 0+z;
		}
		mesh.position.x = x;
		mesh.position.z = -y;

		return mesh;
	}
	
	createSprite(sq){
		if(!this._materials[sq._entity.sprite]){
			this.addMaterial(sq._entity.sprite,'sprite');
		}
		let mesh = new THREE.Sprite( this._materials[sq._entity.sprite] );
	
		mesh.position.y = -sq.z;
		mesh.position.x = sq.x;
		mesh.position.z = -sq.y;

		return mesh;
	}
	
	//Utilisé lorsqu'une entité apparait alors que la scène est déjà chargée.
	addEntity(e){
		let sp = this.createSprite(e._square);
		this._scene.add(sp);
		this._sprites[e._id] = sp;
		this._renderer.render( this._scene, this._camera );
	}

	buildMeshSquare(square){
	//buildMeshSquare(x,y,z,wallsouth,walleast,wallnorth,wallwest,ground,ceiling,inside){
		let squareMesh = new THREE.Object3D();
		let mesh;
		let defaultCeiling = 1;
		squareMesh.position.x = square.x;
		squareMesh.position.z = -square.y;
		squareMesh.position.y = -square.z;
		
		
		if(square.stairs){
			let pivot = new THREE.Object3D();
			let meshslab;
			for(let i =0;i<10;i++){
				meshslab = new THREE.Mesh( this._boxgeometryslab, this._materials[square.stairstexture] );
				meshslab.position.x = +0.4-i/10;
				meshslab.position.z = 0;
				meshslab.position.y = -0.45+i/10;
				pivot.add( meshslab );
			}
			
			mesh = new THREE.Mesh( this._boxgeometryflatdiag, this._materials[square.ceiling] );
			mesh.position.y = +1;
			mesh.rotation.z = -Math.PI/4;
			pivot.add(mesh);
			
			switch(square.stairsdirection){
				case 'west':
					pivot.rotation.y = 0;
					break;
				case 'north':
					pivot.rotation.y = -Math.PI/2;
					break;
				case 'east':
					pivot.rotation.y = Math.PI;
					break;
				case 'south':
					pivot.rotation.y = Math.PI/2;
					break;
			}
			defaultCeiling = 0
			squareMesh.add(pivot);
			
			if(square.south && square.stairsdirection != 'south'){
				mesh = new THREE.Mesh( this._boxgeometrywall, this._materials[square.south] );
				mesh.position.z = +0.499;
				mesh.position.y = 1;
				mesh.rotation.y = Math.PI/2;
				squareMesh.add(mesh);
			}
			if(square.north && square.stairsdirection != 'north'){
				mesh = new THREE.Mesh( this._boxgeometrywall, this._materials[square.north] );
				mesh.position.z = -0.499;
				mesh.position.y = 1;
				mesh.rotation.y = Math.PI/2;
				squareMesh.add(mesh);
			}
			
			if(square.west && square.stairsdirection != 'west'){
				mesh = new THREE.Mesh( this._boxgeometrywall, this._materials[square.west] );
				mesh.position.x = -0.499;
				mesh.position.y = 1;
				squareMesh.add(mesh);
			}
			if(square.east && square.stairsdirection != 'east'){
				mesh = new THREE.Mesh( this._boxgeometrywall, this._materials[square.east] );
				mesh.position.x = +0.499;
				mesh.position.y = 1;
				squareMesh.add(mesh);
			}
		}
		
		if(square.ground){
			mesh = new THREE.Mesh( this._boxgeometryflat, this._materials[square.ground] );
			mesh.position.y = -0.499;
			squareMesh.add(mesh);
		}
		
		if(square.ceiling && defaultCeiling){
			mesh = new THREE.Mesh( this._boxgeometryflat, this._materials[square.ceiling] );
			mesh.position.y = +0.499;
			squareMesh.add(mesh);
		}
		
		if(square.south && !(square.stairs && square.stairsdirection == 'north') ){
			mesh = new THREE.Mesh( this._boxgeometrywall, this._materials[square.south] );
			mesh.position.z = +0.499;
			mesh.rotation.y = Math.PI/2;
			squareMesh.add(mesh);
		}
		if(square.north && !(square.stairs && square.stairsdirection == 'south') ){
			mesh = new THREE.Mesh( this._boxgeometrywall, this._materials[square.north] );
			mesh.position.z = -0.499;
			mesh.rotation.y = Math.PI/2;
			squareMesh.add(mesh);
		}
		
		if(square.west && !(square.stairs && square.stairsdirection == 'east') ){
			mesh = new THREE.Mesh( this._boxgeometrywall, this._materials[square.west] );
			mesh.position.x = -0.499;
			squareMesh.add(mesh);
		}
		if(square.east && !(square.stairs && square.stairsdirection == 'west') ){
			mesh = new THREE.Mesh( this._boxgeometrywall, this._materials[square.east] );
			mesh.position.x = +0.499;
			squareMesh.add(mesh);
		}
		
		
		return squareMesh;
		/**/
		
	}
	
	loaded(){
		this._waiting --;
		if(this._renderer){
			this._renderer.render(this._scene,this._camera);
		}
	}
	
	addMeshSquare(x,y,mesh){
		if(!this._meshSquares[x]){
			this._meshSquares[x] = [];
		}
		this._meshSquares[x][y] = mesh;
		//this._meshSquares['all'].push(t);
	}

	getMeshSquare(x,y){
		if(!this._meshSquares[x]) return null;
		if(!this._meshSquares[x][y]) return null;
		return this._meshSquares[x][y];
	}
	
	actualizeEntity(e,render = true){
		this._sprites[e._id].position.x = e._square.x;
		this._sprites[e._id].position.y = -e._square.z;
		this._sprites[e._id].position.z = -e._square.y;
		if(render){
			this._renderer.render( this._scene, this._camera );
		}
	}
	
	removeEntity(e){
		this._scene.remove(this._sprites[e._id]);
		this._renderer.render( this._scene, this._camera );
	}
	
	createScene(map){
		console.log('new scene');
		this._map = map;
		this._meshSquares = [];
		this._sprites = [];
		this._entitiesMovement = [];

		this._camera = new THREE.PerspectiveCamera( 80, 600 / 360, 0.01, 15 );
		this._camera.position.y = -0.1-this._map.z;
		this._camera.position.x = this._map.x;
		this._camera.position.z = -this._map.y;
		
		this._scene = new THREE.Scene();
		this._renderer = new THREE.WebGLRenderer( { antialias: true } );
		this._renderer.setSize( 600, 370 );
		
		
		let sq = null;
		for(let i=0;i<this._map['_all'].length;i++){
			sq = this._map['_all'][i];
			let meshSquare = this.buildMeshSquare(sq);			
			this._scene.add( meshSquare );
			this.addMeshSquare(sq.x,sq.y,meshSquare);
			
			if(sq._entity){
				let sp = this.createSprite(sq);
				this._scene.add( sp );
				this._sprites[sq._entity._id] = sp;
			}
		}
		
		//For test purpose only
		//let sp = this.createMesh('sprite',2,2,-1);
		//this._scene.add( sp );

		clearChildren(document.getElementById('dungeonView'));
		document.getElementById('dungeonView').appendChild( this._renderer.domElement );
		this.actualizePosition();
		setTimeout('requestAnimationFrame(animate)',7);
		//requestAnimationFrame(animate);

	}
	
	actualizePosition(){
		//console.log('actualize');
		// let d = new Date();
    // let n = d.getTime();

		if(!this._map) return;
		
		let curPos = this._map.getCurrentSquare().getPosition();
		this._camera.position.x = curPos[0];
		this._camera.position.y = -curPos[2];
		this._camera.position.z = -curPos[1];
		
		let lookat = this._map.getCurrentSquare().getDirection(this._map.dir);
		g._scene._camera.lookAt(lookat[0],-lookat[2],-lookat[1]);
		
		this._renderer.render( this._scene, this._camera );

		let d2 = new Date();
    let n2 = d2.getTime();
		//console.log('rendering time:'+(n2-n)+'ms');
		 
	}
	
	initMovement(fromCoord,fromLookat,fromTime,toCoord,toLookat,toTime){
		this.fromCoord = fromCoord;
		this.fromLookat = fromLookat;
		this.fromTime = fromTime;
		this.toCoord = toCoord;
		this.toLookat = toLookat;
		this.toTime = toTime;
		//console.log('received data : '+this.fromCoord+' '+this.fromLookat+' '+this.fromTime+' '+this.toCoord+' '+this.toLookat+' '+this.toTime+' ');
		this.framenumber = 0;
		this.playeranimation = 1;
console.log('Movement initiated start='+fromTime+' end='+toTime);
	}
	
	addEntityMovement(e,fromCoord,fromTime,toCoord,toTime){
		this._entitiesMovement.push([e,fromCoord,fromTime,toCoord,toTime]);
	}
	
	animateMovement(){
    let curTime = new Date().getTime();
		if(this.playeranimation && curTime > this.toTime){
			//console.log(this.framenumber+' frames ('+(this.framenumber/((this.toTime-this.fromTime)/1000))+' ips)')
			console.log('Movement ended cur='+curTime+' end='+this.toTime);
			this.actualizePosition();
			g._currentMap.animationFinish();
			inAnimation = 0;
			this.playeranimation = 0;

		}
		
		for(let i =0;i<this._entitiesMovement.length;i++){
			if(curTime > this._entitiesMovement[i][4]){
				this.actualizeEntity(this._entitiesMovement[i][0],false);
				this._entitiesMovement.splice(i,1);
				if(!renderanimation){
					this._renderer.render( this._scene, this._camera );
				}
				//console.log(this._entitiesMovement);
				i--;
			}
		}
		
		if(this.playeranimation){
			this.framenumber ++;
			let curCoord = [];
			let curLookat = [];
			let progression = (curTime - this.fromTime) / (this.toTime - this.fromTime);
			//console.log('received data : '+this.fromCoord+' '+this.fromLookat+' '+this.fromTime+' '+this.toCoord+' '+this.toLookat+' '+this.toTime+' ');
			//console.log('progression:'+progression+' from='+this.fromTime+' cur='+curTime+' totime='+this.toTime);
			curCoord[0] = (this.toCoord[0] - this.fromCoord[0])*progression + this.fromCoord[0];
			curCoord[1] = (this.toCoord[1] - this.fromCoord[1])*progression + this.fromCoord[1];
			curCoord[2] = (this.toCoord[2] - this.fromCoord[2])*progression + this.fromCoord[2];
			curLookat[0] = (this.toLookat[0] - this.fromLookat[0])*progression + this.fromLookat[0];
			curLookat[1] = (this.toLookat[1] - this.fromLookat[1])*progression + this.fromLookat[1];
			curLookat[2] = (this.toLookat[2] - this.fromLookat[2])*progression + this.fromLookat[2];
			
			//console.log('camerapos='+this._camera.position.x+' '+this._camera.position.y+' '+this._camera.position.z );
			//console.log('camerarota='+this._camera.rotation.x+' '+this._camera.rotation.y+' '+this._camera.rotation.z );
			
			this._camera.position.x = curCoord[0];
			this._camera.position.y = -curCoord[2];
			this._camera.position.z = -curCoord[1];
			
			g._scene._camera.lookAt(curLookat[0],-curLookat[2],-curLookat[1]);
		}
		
		for(let i =0;i<this._entitiesMovement.length;i++){
			let curCoord = [];
			let curMove = this._entitiesMovement[i]; //entité,fromcoord,fromtime,tocoord,totime
			let prog = (curTime - curMove[2]) / (curMove[4] - curMove[2]);
			curCoord[0] = (curMove[3][0] - curMove[1][0])*prog + curMove[1][0];
			curCoord[1] = (curMove[3][1] - curMove[1][1])*prog + curMove[1][1];
			curCoord[2] = (curMove[3][2] - curMove[1][2])*prog + curMove[1][2];
			this._sprites[curMove[0]._id].position.x = curCoord[0];
			this._sprites[curMove[0]._id].position.y = -curCoord[2];
			this._sprites[curMove[0]._id].position.z = -curCoord[1];

		}
		if(renderanimation){
			this._renderer.render( this._scene, this._camera );
		}
		requestAnimationFrame(animate);
	}
}


function animate() {
  // Do whatever
	if(g._scene){
		g._scene.animateMovement();
	}
}
//requestAnimationFrame(repeatOften);


