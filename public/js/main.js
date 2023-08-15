
const fullPath = window.location.hash;
let texture_text  	= 	fullPath.split("&")[0].replace("#", "").split("=")[1].trim();
// let texture_text  	= 	"mark_first";
let model_text  	= 	fullPath.split("&")[1].split("=")[1].trim();
// let model_text  	= 	"model4";
let viewPoint 		= 	fullPath.split("&")[2].split("=")[1].trim()
let flag_dir 		= 	fullPath.split("&")[3].split("=")[1].trim()
let light_text		= 	fullPath.split("&")[4].split("=")[1].trim()

const threejsInit = () => {
	
	const COUNT = 1;
	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0xb9b9b2);
	let lights = [];

	const el = document.querySelector("canvas");
	const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: el });
	renderer.setSize(400, 600);
	document.body.appendChild(renderer.domElement);

	const textureLoader = new THREE.TextureLoader();
	const texture = textureLoader.load('./public/textures/' + texture_text + ".dat");
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;

	var axesHelper = new THREE.AxesHelper(5);

	const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);  
	switch (viewPoint) {
		case "front":
			camera.position.set(0, 0, 2.5);
			break;
		case "back":
			camera.position.set(0, 0, -2.5);
			break;
		case "right":
			camera.position.set(2.5, 0, 0);
			break;
		case "left":
			camera.position.set(-2.5, 0, 0);
			break;
		case "top":
			camera.position.set(0, 2.5, 0);
			break;
		case "bottom":
			camera.position.set(0, -2.5, 0);	
			break;
		default:
			camera.position.set(2, 0, 2);
	}
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	var controls = new THREE.OrbitControls( camera, renderer.domElement );

	let light1 = new THREE.DirectionalLight(0xffffff, 1.0);
	let light2 = new THREE.DirectionalLight(0xffffff, 1.0);
	let light3 = new THREE.DirectionalLight(0xffffff, 1.0);

	light1.position.set(5, -2, -5)
	light1.castShadow = true
	light1.shadow.mapSize.width = 100
	light1.shadow.mapSize.height = 100
	light1.shadow.camera.near = 0.5
	light1.shadow.camera.far = 100

	light2.position.set(-5, 2, -5)
	light2.castShadow = true
	light2.shadow.mapSize.width = 100
	light2.shadow.mapSize.height = 100
	light2.shadow.camera.near = 0.5
	light2.shadow.camera.far = 100

	light3.position.set(0, 2, 5)
	light3.castShadow = true
	light3.shadow.mapSize.width = 100
	light3.shadow.mapSize.height = 100
	light3.shadow.camera.near = 0.5
	light3.shadow.camera.far = 100

	let color;
	const whitecolor = new THREE.Color(1, 1, 1)

	switch(light_text){
		case '0':
			light1.color = whitecolor;
			light2.color = whitecolor;
			light3.color = whitecolor;
			break;
		case '1':
			color = new THREE.Color(0.8, 0.85, 1);
			light1.color = color;
			light2.color = color;
			light3.color = color;
			break;
		case '2':
			color = new THREE.Color(1, 0.95, 0.85);
			light1.color = color;
			light2.color = color;
			light3.color = color;
			break;
		case '3':
			setInterval(updateColors, 1000);

			function updateColors() {
				const randomR = Math.random();
				const randomG = Math.random();
				const randomB = Math.random();

				light1.color = new THREE.Color(randomR, randomG, randomB);
				light2.color = new THREE.Color(randomR, randomG, randomB);
				light3.color = new THREE.Color(randomR, randomG, randomB);
				
			  }
			break;
		default:
			light1.color = whitecolor;
			light2.color = whitecolor;
			light3.color = whitecolor;
	}

	scene.add(light1)
	scene.add(light2)
	scene.add(light3)

	let material = new THREE.MeshPhysicalMaterial({
		color: 0xffffff,
		side: THREE.DoubleSide,roughness: 0.5,
		metalness: 0.5,
		reflectivity: 0.5,
		lightMapIntensity: 1,
		aoMapIntensity: 2,
	});

	const card_angle_list = [];
	const start_angle = -72;

	for (let i = 0; i < COUNT; i++) {
		card_angle_list[i] = start_angle + i * 360 / COUNT;
	}

	const cards = [];
	let cocamodel
	let x = 0;
	let y = 0;
	let z = 0;

	let delta = 3;

	new THREE.GLTFLoader().load('./public/models/' + model_text + ".glb", res => {

		cocamodel = res.scene;
		let cur_angle = 0;

		for (let i = 0; i < COUNT; i++) {
		
			let s = cocamodel.clone();
			cur_angle = card_angle_list[i];
			s.traverse(function(node) {
				if (node.isMesh) {
					node.material = material;
					node.material.map = texture;
				}
			});
			s.position.set(x, y, z);
			
			s.rotation.x = 0;
			s.rotation.y = (cur_angle + 90 )* Math.PI / 180;
			s.rotation.z = 0;

			cards.push(s);
			scene.add(s);
		}
		tweenCards();
	});

	var prev_dir = 1;

	function tweenCards() {
		const time = 100;
		if(flag_dir != 0){
			let cur_angle = 0;
			for (let i = 0; i < cards.length; i++) {

				const card = cards[i];
				cur_angle = card_angle_list[i];
		
				new TWEEN.Tween(card.position)
					.to({x:0, y:-0.5, z:0}, time)
					.easing(TWEEN.Easing.Quadratic.InOut)
					.start();
		
				let target_angle = cur_angle * Math.PI / 180;
		
				new TWEEN.Tween(card.rotation)
					.to({x:0, y:target_angle, z:0}, time)
					.easing(TWEEN.Easing.Quadratic.InOut)
					.start();
		
				if(flag_dir == 1){
					card_angle_list[i] += delta;
				}
				else{
					card_angle_list[i] -= delta;
				}
			}
		} else {
			let cur_angle = 0;
			for (let i = 0; i < cards.length; i++) {

				const card = cards[i];
				cur_angle = card_angle_list[i];
		
				new TWEEN.Tween(card.position)
					.to({x:0, y:-0.5, z:0}, time)
					.easing(TWEEN.Easing.Quadratic.InOut)
					.start();
			}
		}

		setTimeout(() => {
			tweenCards();
		}, time);
	}

	document.addEventListener( 'wheel', onDocumentMouseWheel );
	function onDocumentMouseWheel( event ) {
		if (event.deltaY == 100) {
			flag_dir = -1;
		}
		if (event.deltaY == -100) {
			flag_dir = 1;
		}
		prev_dir = flag_dir;
	}

	var start_mouse_x;

	const raycaster = new THREE.Raycaster();

	document.addEventListener( 'mousedown', onDocumentMousedown );
	function onDocumentMousedown( event ) {
		start_mouse_x = event.screenX;
	}

	document.addEventListener( 'mouseup', onDocumentMouseup );
	function onDocumentMouseup( event ) {
		var delta_x = start_mouse_x - event.screenX;
		if (delta_x > 0) {
			flag_dir = -1
		}
		if (delta_x < 0) {
			flag_dir = 1
		}
		prev_dir = flag_dir;

	}

	document.addEventListener( 'mousemove', onDocumentMousemove );
	function onDocumentMousemove( event ) {
		
		var vector = new THREE.Vector3( 
			( event.clientX / window.innerWidth ) * 2 - 1, 
			- ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 
		);
		vector.unproject( camera );
		raycaster.set( camera.position, vector.sub( camera.position ).normalize() );

		for (let i = 0; i < cards.length; i++) {
			var intersects = raycaster.intersectObject( cards[i] );
			if (intersects.length > 0) {
				flag_dir = 0;
				return
			}
		}

		flag_dir = prev_dir;

	}

	const animate = (time) => {
		TWEEN.update();
		renderer.render(scene, camera);
		requestAnimationFrame(animate);
	};
	animate();
}

threejsInit();