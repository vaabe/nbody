dataset = "cartposition.csv";

var positionData;
var numParticles; 
var numTimePoints; 

d3.csv(dataset, function(d) {
	return {
		x : +d.x, 
		y : +d.y, 
		z : +d.z,
		mass : +d.mass,
		particle: d.particle
	};
}).then(function(data) {
	positionData = data;
	var numRows = d3.selectAll(data).size();

	numTimePoints = 0; 
	for (i = 0; i < numRows; i++) {
		if (positionData[i].particle == "m1") {
			numTimePoints += 1; 
		}
	}

	numParticles = numRows / numTimePoints; 
	renderAnimation();
}); 

function renderAnimation() {

	/* scene */ 
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera( 
		75, window.innerWidth / window.innerHeight, 0.1, 1000 );

	/* renderer */ 
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight ); 
	document.body.appendChild( renderer.domElement );
	
	var time = 0;

	/* sphere geometry */ 
	var sphereGeometry = new THREE.SphereGeometry( 0.1 ); 
	var sphereMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	var sphere = []; 

	for (i = 0; i < numParticles; i++) {
		sphere[i] = new THREE.Mesh( sphereGeometry, sphereMaterial); 
		scene.add(sphere[i]); 
	}

	/* line geometry*/ 
	var lineGeometry = new THREE.Geometry(); 
	var lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff } ); 
	var line = []; 

	for (i = 0; i < numParticles; i++) {
		line[i] = new THREE.Line( lineGeometry, lineMaterial ); 

		lineGeometry.vertices.push (
			new THREE.Vector3( 0, 0, 0 ),
			new THREE.Vector3( 0, 0, 0 )
		);

		scene.add(line[i]);
	}

	var axesHelper = new THREE.AxesHelper( 3 ); 
	scene.add( axesHelper ); 

	var cameraRadius = 7; 
	var cameraRotationSpeed = 0.01; 

	camera.position.set(0, 4, -7); 
	camera.lookAt(0, 0, 0); 
	// var time = 0;

	var animate = function () {
		requestAnimationFrame( animate );

		for (i = 0; i < numParticles; i++) {
			sphere[i].position.x = positionData[2 * time + i].x; 
			sphere[i].position.y = positionData[2 * time + i].y; 
			sphere[i].position.z = positionData[2 * time + i].z;

		}

		for (i = 0; i < numParticles; i++) {
			if (i == 0) {
				line[0].geometry.vertices[0].x = 0; 
				line[0].geometry.vertices[0].y = 0; 
				line[0].geometry.vertices[0].z = 0; 
				line[0].geometry.vertices[1].x = sphere[0].position.x
				line[0].geometry.vertices[1].y = sphere[0].position.y
				line[0].geometry.vertices[1].z = sphere[0].position.z
			}

			else {
				line[i].geometry.vertices[0].x = sphere[i - 1].position.x
				line[i].geometry.vertices[0].y = sphere[i - 1].position.y
				line[i].geometry.vertices[0].z = sphere[i - 1].position.z
				line[i].geometry.vertices[1].x = sphere[i].position.x
				line[i].geometry.vertices[1].y = sphere[i].position.y
				line[i].geometry.vertices[1].z = sphere[i].position.z
			}

			line[i].geometry.verticesNeedUpdate = true; 
		}

		camera.position.x = 
			camera.position.x * Math.cos(cameraRotationSpeed) -
			camera.position.z * Math.sin(cameraRotationSpeed); 

		camera.position.z = 
			camera.position.z * Math.cos(cameraRotationSpeed) +
			camera.position.x * Math.sin(cameraRotationSpeed); 

		camera.lookAt(0, 0, 0); 

		renderer.render( scene, camera );

		if (time < (numTimePoints - 1)) { 
			time += 1; 
		}
		else { 
			time = 0; 
		}
	}; 

	animate(); 
}
