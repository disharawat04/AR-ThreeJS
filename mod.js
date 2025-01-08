// Import necessary loaders (Make sure to use the correct path if you're using modules)
const loader = new THREE.GLTFLoader();

const scene = new THREE.Scene();
const camera = new THREE.Camera();
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ArToolkitSource = new THREEx.ArToolkitSource({
  sourceType: "webcam",
});
ArToolkitSource.init(function () {
  setTimeout(function () {
    ArToolkitSource.onResizeElement();
    ArToolkitSource.copyElementSizeTo(renderer.domElement);
  }, 2000);
});

const ArToolkitContext = new THREEx.ArToolkitContext({
  cameraParametersUrl: "./camera_para.dat",
  detectionMode: "color_and_matrix",
});
ArToolkitContext.init(function () {
  camera.projectionMatrix.copy(ArToolkitContext.getProjectionMatrix());
});

const ArMarkerControls = new THREEx.ArMarkerControls(
  ArToolkitContext,
  camera,
  {
    type: "pattern",
    patternUrl: "pattern-AR monogram.patt", // Ensure this pattern URL is correct
    changeMatrixMode: "cameraTransformMatrix",
  }
);

// Initially hide the scene
scene.visible = false;

// Load a GLB model (replace 'model.glb' with your actual model URL)
loader.load('grog_the_adventurer.glb', function (gltf) {
  const model = gltf.scene;  // The actual 3D model object
  model.scale.set(2, 2, 2);  // Scale the model
  model.position.set(0, 0, 0);  // Set position (adjust as needed)
  scene.add(model);  // Add model to the scene
}, undefined, function (error) {
  console.error('Error loading 3D model:', error);
});

// Handle marker found and lost events
ArMarkerControls.addEventListener('markerFound', function () {
  console.log('Marker found!');
  scene.visible = true;  // Show the scene when the marker is detected
});

ArMarkerControls.addEventListener('markerLost', function () {
  console.log('Marker lost');
  scene.visible = false; // Hide the scene when the marker is lost
});

function animate() {
  requestAnimationFrame(animate);
  ArToolkitContext.update(ArToolkitSource.domElement);
  scene.visible = camera.visible;  // Update visibility based on the camera
  renderer.render(scene, camera);
}

animate();
