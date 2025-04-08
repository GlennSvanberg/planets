import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Initialize scene, camera, and renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000510); // Darker background for space

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Add lights
const ambientLight = new THREE.AmbientLight(0x202030); // Dim ambient light for space
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Add a point light for additional planet illumination
const pointLight = new THREE.PointLight(0x0088ff, 1.5, 100);
pointLight.position.set(3, 2, 3);
scene.add(pointLight);

// Add a second blue point light from another angle
const pointLight2 = new THREE.PointLight(0x0055ff, 1, 100);
pointLight2.position.set(-3, -1, 2);
scene.add(pointLight2);

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Store created objects
const objects = [];
let labelGroup; // To store our label

// Function to create planetary system
function createPlanetarySystem() {
  const planetCount = 5;
  const spacing = 1.5;  // Distance between planets
  const planetSize = 0.4;  // Fixed size for all planets
  
  // Starting position (left-most planet)
  const startX = -(planetCount - 1) * spacing / 2;
  
  for (let i = 0; i < planetCount; i++) {
    // Create planet geometry and material
    const geometry = new THREE.SphereGeometry(planetSize, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0x0066ff,  // Bright blue
      metalness: 0.2,
      roughness: 0.5,
      emissive: 0x002266,  // Slight glow effect
      emissiveIntensity: 0.3
    });
    
    // Create planet mesh
    const planet = new THREE.Mesh(geometry, material);
    
    // Position planets in a perfect straight line
    planet.position.set(startX + i * spacing, 0, 0);
    
    // Add slight random rotation
    planet.rotation.set(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    );
    
    // Add to scene and objects array
    scene.add(planet);
    objects.push(planet);
  }
}

// Function to create a label
function createLabel(text, targetPlanetIndex, yOffset = 0.8, delay = 0) {
  setTimeout(() => {
    // Create a group to hold the label
    const newLabelGroup = new THREE.Group();
    
    // Create a canvas texture for the text
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 200; // Wider canvas
    canvas.height = 100; // Taller canvas
    
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the speech bubble body (rounded rectangle)
    const bubbleWidth = canvas.width - 10;
    const bubbleHeight = canvas.height - 30; // Leave space for pointer
    const cornerRadius = 10;
    
    context.fillStyle = 'rgba(0, 20, 50, 0.7)';
    
    // Draw rounded rectangle
    context.beginPath();
    context.moveTo(5 + cornerRadius, 5);
    context.lineTo(5 + bubbleWidth - cornerRadius, 5);
    context.quadraticCurveTo(5 + bubbleWidth, 5, 5 + bubbleWidth, 5 + cornerRadius);
    context.lineTo(5 + bubbleWidth, 5 + bubbleHeight - cornerRadius);
    context.quadraticCurveTo(5 + bubbleWidth, 5 + bubbleHeight, 5 + bubbleWidth - cornerRadius, 5 + bubbleHeight);
    context.lineTo(5 + cornerRadius, 5 + bubbleHeight);
    context.quadraticCurveTo(5, 5 + bubbleHeight, 5, 5 + bubbleHeight - cornerRadius);
    context.lineTo(5, 5 + cornerRadius);
    context.quadraticCurveTo(5, 5, 5 + cornerRadius, 5);
    context.closePath();
    context.fill();
    
    // Draw pointer triangle
    context.beginPath();
    context.moveTo(canvas.width / 2 - 10, 5 + bubbleHeight);
    context.lineTo(canvas.width / 2, 5 + bubbleHeight + 20);
    context.lineTo(canvas.width / 2 + 10, 5 + bubbleHeight);
    context.closePath();
    context.fill();
    
    // Add border
    context.strokeStyle = '#0088ff';
    context.lineWidth = 2;
    
    // Stroke the rounded rectangle
    context.beginPath();
    context.moveTo(5 + cornerRadius, 5);
    context.lineTo(5 + bubbleWidth - cornerRadius, 5);
    context.quadraticCurveTo(5 + bubbleWidth, 5, 5 + bubbleWidth, 5 + cornerRadius);
    context.lineTo(5 + bubbleWidth, 5 + bubbleHeight - cornerRadius);
    context.quadraticCurveTo(5 + bubbleWidth, 5 + bubbleHeight, 5 + bubbleWidth - cornerRadius, 5 + bubbleHeight);
    context.lineTo(5 + cornerRadius, 5 + bubbleHeight);
    context.quadraticCurveTo(5, 5 + bubbleHeight, 5, 5 + bubbleHeight - cornerRadius);
    context.lineTo(5, 5 + cornerRadius);
    context.quadraticCurveTo(5, 5, 5 + cornerRadius, 5);
    context.closePath();
    context.stroke();
    
    // Stroke the pointer
    context.beginPath();
    context.moveTo(canvas.width / 2 - 10, 5 + bubbleHeight);
    context.lineTo(canvas.width / 2, 5 + bubbleHeight + 20);
    context.lineTo(canvas.width / 2 + 10, 5 + bubbleHeight);
    context.stroke();
    
    // Draw text
    context.font = 'bold 20px Arial'; // Slightly larger font
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = '#ffffff';
    context.fillText(text, canvas.width / 2, 5 + bubbleHeight / 2);
    
    // Create texture and sprite
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);
    
    // Scale and position the sprite
    sprite.scale.set(0.8, 0.5, 1); // Bigger scale
    
    // Add to group
    newLabelGroup.add(sprite);
    
    // Position the label above the target planet
    const targetPlanet = objects[targetPlanetIndex];
    newLabelGroup.position.set(targetPlanet.position.x, yOffset, 0);
    
    // Add to scene
    scene.add(newLabelGroup);
    
    // Make it appear with a fade-in effect
    sprite.material.opacity = 0;
    
    // Animate the opacity
    const fadeIn = function() {
      if (sprite.material.opacity < 1) {
        sprite.material.opacity += 0.02;
        setTimeout(fadeIn, 20);
      }
    };
    
    fadeIn();
    
    // Store in objects array to keep track of all labels
    if (text === 'SKU') {
      labelGroup = newLabelGroup;
    } else {
      // Store second label if needed
      window.secondLabel = newLabelGroup;
    }
  }, delay);
}

// Create starfield background
function createStarfield() {
  // Create regular white stars
  const starsGeometry = new THREE.BufferGeometry();
  const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.15,
    transparent: true,
    opacity: 0.8
  });
  
  const starsVertices = [];
  for (let i = 0; i < 2000; i++) {
    const x = (Math.random() - 0.5) * 100;
    const y = (Math.random() - 0.5) * 100;
    const z = (Math.random() - 0.5) * 100;
    starsVertices.push(x, y, z);
  }
  
  starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
  const starField = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(starField);
  
  // Add some blue-tinted stars
  const blueStarsGeometry = new THREE.BufferGeometry();
  const blueStarsMaterial = new THREE.PointsMaterial({
    color: 0x5588ff,
    size: 0.12,
    transparent: true,
    opacity: 0.7
  });
  
  const blueStarsVertices = [];
  for (let i = 0; i < 500; i++) {
    const x = (Math.random() - 0.5) * 80;
    const y = (Math.random() - 0.5) * 80;
    const z = (Math.random() - 0.5) * 80;
    blueStarsVertices.push(x, y, z);
  }
  
  blueStarsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(blueStarsVertices, 3));
  const blueStarField = new THREE.Points(blueStarsGeometry, blueStarsMaterial);
  scene.add(blueStarField);
}

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initialize the scene
createStarfield();
createPlanetarySystem();

// Schedule the labels to appear
createLabel('SKU', 0, 1.0, 5000); // First label after 5 seconds, positioned higher
createLabel('Köpbar produkt', 4, 1.0, 7000); // Second label after 7 seconds, positioned higher

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  // Rotate planets slightly
  objects.forEach((obj) => {
    obj.rotation.x += 0.005;
    obj.rotation.y += 0.005;
  });
  
  controls.update();
  renderer.render(scene, camera);
}

animate(); 