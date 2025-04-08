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

// Add a point light for additional planet illumination with warm color
const pointLight = new THREE.PointLight(0xff7700, 1.5, 100); // Orange light
pointLight.position.set(3, 2, 3);
scene.add(pointLight);

// Add a second red-orange point light from another angle
const pointLight2 = new THREE.PointLight(0xff3300, 1, 100); // Red-orange light
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

// Schedule the labels to appear
createLabel('SKU', 0, 1.0, 5000); // First label after 5 seconds, positioned higher
createLabel('köpbar produkt', 4, 1.0, 7000); // Second label after 7 seconds, positioned higher

// Schedule the transition to circular arrangement after both labels appear
setTimeout(transitionToCircle, 9000); // Start transition 2 seconds after last label

// Variables to track animation state
let isTransitioning = false;
let transitionStartTime = 0;
let transitionDuration = 3.0; // seconds
let arrangementType = 'line'; // 'line' or 'circle'

// Function to transition planets from line to circle
function transitionToCircle() {
  // Store original line positions for smooth transition
  objects.forEach(planet => {
    planet.userData = {
      originalPosition: planet.position.clone()
    };
  });
  
  // Set animation state
  isTransitioning = true;
  transitionStartTime = Date.now();
  arrangementType = 'circle';
}

// Function to calculate circle positions
function updatePlanetPositions() {
  if (!isTransitioning && arrangementType === 'line') return;
  
  const circleRadius = 2.5; // Radius of the circle
  const centerX = 0;
  const centerY = 0;
  
  if (isTransitioning) {
    // Calculate transition progress (0 to 1)
    const elapsedTime = (Date.now() - transitionStartTime) / 1000;
    const progress = Math.min(elapsedTime / transitionDuration, 1.0);
    
    // Apply easing for smoother animation
    const easedProgress = smootherstep(progress);
    
    // Update positions based on transition progress
    objects.forEach((planet, index) => {
      // Original line position
      const originalPosition = planet.userData.originalPosition;
      
      // Target circle position
      const angle = (index / objects.length) * Math.PI * 2;
      const targetX = centerX + Math.cos(angle) * circleRadius;
      const targetY = centerY + Math.sin(angle) * circleRadius;
      
      // Interpolate between line and circle positions
      planet.position.x = originalPosition.x * (1 - easedProgress) + targetX * easedProgress;
      planet.position.y = originalPosition.y * (1 - easedProgress) + targetY * easedProgress;
    });
    
    // End transition when complete
    if (progress >= 1.0) {
      isTransitioning = false;
    }
  } else if (arrangementType === 'circle') {
    // Maintain circle position with a slight rotation effect
    const rotationSpeed = 0.05; // How fast the entire configuration rotates
    const currentTime = Date.now() * 0.001;
    const baseRotation = currentTime * rotationSpeed;
    
    objects.forEach((planet, index) => {
      const angle = baseRotation + (index / objects.length) * Math.PI * 2;
      planet.position.x = centerX + Math.cos(angle) * circleRadius;
      planet.position.y = centerY + Math.sin(angle) * circleRadius;
    });
  }
}

// Create energy flow particles
function createEnergyFlow() {
  // Create a particle system for the energy flow
  const particleCount = 2000; // Much higher resolution
  const energyParticles = new THREE.BufferGeometry();
  
  // Create arrays for particle properties
  const positions = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  const colors = new Float32Array(particleCount * 3);
  const phases = new Float32Array(particleCount);
  const speeds = new Float32Array(particleCount); // Different speeds for particles
  
  // Position particles initially at the first planet
  const firstPlanet = objects[0];
  const lastPlanet = objects[objects.length - 1];
  const totalDistance = lastPlanet.position.x - firstPlanet.position.x;
  
  for (let i = 0; i < particleCount; i++) {
    // Distribute particles along the entire path evenly
    const progress = Math.random(); // Full path distribution
    
    // Calculate position along the path between planets
    positions[i * 3] = firstPlanet.position.x + progress * totalDistance;
    
    // Add some vertical variation
    positions[i * 3 + 1] = (Math.random() - 0.5) * 0.15;
    
    // Add some depth variation
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
    
    // Random size for each particle with more small particles
    sizes[i] = Math.pow(Math.random(), 2) * 0.03 + 0.01;
    
    // Warm fire/sun colors with variation
    const colorVar = Math.random();
    if (colorVar < 0.5) {
      // Yellow-orange core
      colors[i * 3] = 0.9 + Math.random() * 0.1;     // R: bright red
      colors[i * 3 + 1] = 0.6 + Math.random() * 0.3; // G: medium-high green for yellow
      colors[i * 3 + 2] = 0.1 + Math.random() * 0.2; // B: low blue
    } else if (colorVar < 0.8) {
      // Orange-red parts
      colors[i * 3] = 0.8 + Math.random() * 0.2;     // R: bright red
      colors[i * 3 + 1] = 0.3 + Math.random() * 0.3; // G: medium green for orange
      colors[i * 3 + 2] = 0.0 + Math.random() * 0.1; // B: very low blue
    } else {
      // Red edges
      colors[i * 3] = 0.7 + Math.random() * 0.3;     // R: bright red
      colors[i * 3 + 1] = 0.1 + Math.random() * 0.2; // G: low green
      colors[i * 3 + 2] = 0.0 + Math.random() * 0.05; // B: almost no blue
    }
    
    // Random phase offset for animation
    phases[i] = Math.random() * Math.PI * 2;
    
    // Random speed variation for more natural flow
    speeds[i] = 0.7 + Math.random() * 0.6; // 0.7-1.3 speed multiplier
  }
  
  // Add attributes to the geometry
  energyParticles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  energyParticles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  energyParticles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  // Store phases and speeds for animation
  energyParticles.userData = { 
    phases: phases,
    speeds: speeds,
    flowStartTime: Date.now()
  };
  
  // Create shader material for particles
  const particleMaterial = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });
  
  // Create the particle system
  const energyFlowSystem = new THREE.Points(energyParticles, particleMaterial);
  scene.add(energyFlowSystem);
  
  // Store for animation
  window.energyFlowSystem = energyFlowSystem;
}

// Initialize the scene
createStarfield();
createPlanetarySystem();
createEnergyFlow();

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  const currentTime = Date.now() * 0.001; // Current time in seconds
  
  // Update planet positions for circular arrangement
  updatePlanetPositions();
  
  // Update speech bubble positions to follow their planets
  if (labelGroup) {
    const firstPlanet = objects[0];
    labelGroup.position.x = firstPlanet.position.x;
    labelGroup.position.y = firstPlanet.position.y + 1.0;
  }
  
  if (window.secondLabel) {
    const lastPlanet = objects[objects.length - 1];
    window.secondLabel.position.x = lastPlanet.position.x;
    window.secondLabel.position.y = lastPlanet.position.y + 1.0;
  }
  
  // Rotate planets on their own axes
  objects.forEach((obj) => {
    obj.rotation.x += 0.005;
    obj.rotation.y += 0.005;
  });
  
  // Animate energy flow particles
  if (window.energyFlowSystem) {
    const geometry = window.energyFlowSystem.geometry;
    const positions = geometry.attributes.position.array;
    const sizes = geometry.attributes.size.array;
    const colors = geometry.attributes.color.array;
    const phases = geometry.userData.phases;
    const speeds = geometry.userData.speeds;
    
    // Get positions of all planets
    const planetPositions = objects.map(planet => planet.position);
    
    const particleCount = phases.length;
    const flowDuration = 10.0;
    
    const elapsedTime = (Date.now() - geometry.userData.flowStartTime) / 1000;
    
    for (let i = 0; i < particleCount; i++) {
      const particleSpeed = speeds[i];
      const particleUniqueOffset = (i % 100) / 100;
      const particleTime = (elapsedTime * particleSpeed * 0.1 + particleUniqueOffset) % 1.0;
      
      // Apply different easing to different particles for variation
      let particleProgress;
      if (i % 3 === 0) {
        particleProgress = smootherstep(particleTime);
      } else if (i % 3 === 1) {
        particleProgress = smoothstep(particleTime);
      } else {
        particleProgress = particleTime;
      }
      
      // Position particles based on current arrangement (line or circle)
      if (arrangementType === 'line' && !isTransitioning) {
        // Linear flow along x-axis as before
        const firstPlanetX = planetPositions[0].x;
        const lastPlanetX = planetPositions[planetPositions.length - 1].x;
        const totalDistance = lastPlanetX - firstPlanetX;
        
        // Position along path with wrap-around
        positions[i * 3] = firstPlanetX + (particleProgress * totalDistance);
        
        // Calculate which segment the particle is in (between which planets)
        const segmentCount = planetPositions.length - 1;
        const segmentLength = totalDistance / segmentCount;
        const particleDistance = positions[i * 3] - firstPlanetX;
        const segmentIndex = Math.min(Math.floor(particleDistance / segmentLength), segmentCount - 1);
        
        // Calculate the exact position between the two planets (0-1)
        const segmentProgress = (particleDistance % segmentLength) / segmentLength;
        
        // Calculate planetary influence - more turbulence near planets, smoother flow in-between
        const distanceFromCenter = Math.abs(segmentProgress - 0.5) * 2; // 0 at center, 1 at planets
        const planetInfluence = Math.pow(distanceFromCenter, 1.5); // More pronounced influence curve
        
        // Wave patterns and vertical movement
        const baseWave = Math.sin(currentTime * 2 + phases[i] + particleProgress * 10) * 0.05;
        const detailWave1 = Math.sin(currentTime * 4 + phases[i] * 3 + particleProgress * 25) * 0.02;
        const detailWave2 = Math.sin(currentTime * 7 + phases[i] * 2 + particleProgress * 40) * 0.01;
        
        positions[i * 3 + 1] = (baseWave + detailWave1 + detailWave2) * (1 + planetInfluence * 1.2);
        
        // Z-position variation
        const zBaseWave = Math.cos(currentTime * 1.5 + phases[i] * 0.8 + particleProgress * 12) * 0.04;
        const zDetailWave = Math.cos(currentTime * 5 + phases[i] * 1.2 + particleProgress * 30) * 0.02;
        positions[i * 3 + 2] = (zBaseWave + zDetailWave) * (1 + planetInfluence * 0.7);
      } else {
        // Circular flow around planets
        // Calculate position along the circle
        const circleProgress = particleProgress;
        const angle = circleProgress * Math.PI * 2;
        const circleRadius = 2.5; // Match the planet circle radius
        
        // Add slight radial variation for fire effect
        const radiusVar = 1.0 + (Math.sin(currentTime * 3 + phases[i] * 2) * 0.1);
        
        // Calculate base position on circle
        positions[i * 3] = Math.cos(angle) * circleRadius * radiusVar;
        positions[i * 3 + 1] = Math.sin(angle) * circleRadius * radiusVar;
        
        // Find the closest planet to calculate influence
        let closestDistance = Number.MAX_VALUE;
        let closestPlanetIndex = 0;
        
        for (let p = 0; p < planetPositions.length; p++) {
          const dx = positions[i * 3] - planetPositions[p].x;
          const dy = positions[i * 3 + 1] - planetPositions[p].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < closestDistance) {
            closestDistance = distance;
            closestPlanetIndex = p;
          }
        }
        
        // Planetary influence based on proximity
        let planetInfluence = 1.0 - Math.min(closestDistance / 0.8, 1.0);
        planetInfluence = Math.pow(planetInfluence, 2); // Stronger influence near planets
        
        // Add z-variation for 3D effect
        const zVar = (Math.sin(currentTime * 2 + phases[i] + angle * 3) * 0.05) * (1 + planetInfluence * 0.5);
        positions[i * 3 + 2] = zVar;
      }
      
      // Size fluctuation - fire particles vary more in size
      const sizeWave = Math.sin(currentTime * 3 + phases[i] + particleProgress * 15) * 0.3 + 0.7;
      const flameFactor = Math.sin(currentTime * 6 + phases[i] * 2) * 0.2 + 1; // Additional flame pulsing
      const baseSize = 0.01 + Math.pow(Math.random(), 1.5) * 0.025; // Base size with variation
      
      // Get planetary influence based on current arrangement
      let planetInfluence = 0;
      if (arrangementType === 'line' && !isTransitioning) {
        // For linear arrangement - already calculated above
        const firstPlanetX = planetPositions[0].x;
        const particleDistanceFromFirst = positions[i * 3] - firstPlanetX;
        const totalDistance = planetPositions[planetPositions.length - 1].x - firstPlanetX;
        const segmentLength = totalDistance / (planetPositions.length - 1);
        const segmentIndex = Math.min(Math.floor(particleDistanceFromFirst / segmentLength), planetPositions.length - 2);
        const segmentProgress = (particleDistanceFromFirst % segmentLength) / segmentLength;
        const distanceFromCenter = Math.abs(segmentProgress - 0.5) * 2;
        planetInfluence = Math.pow(distanceFromCenter, 1.5);
      } else {
        // For circular arrangement - calculate based on closest planet
        let minDist = Number.MAX_VALUE;
        for (let p = 0; p < planetPositions.length; p++) {
          const dx = positions[i * 3] - planetPositions[p].x;
          const dy = positions[i * 3 + 1] - planetPositions[p].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          minDist = Math.min(minDist, distance);
        }
        // Normalize distance (0 = at planet, 1 = far away)
        const normalizedDist = Math.min(minDist / 0.7, 1.0);
        planetInfluence = 1.0 - normalizedDist;
        planetInfluence = Math.pow(planetInfluence, 2); // More pronounced effect
      }
      
      sizes[i] = baseSize * (1 + planetInfluence * 0.8) * sizeWave * flameFactor;
      
      // Color variation - more intense and shifting colors for fire effect
      const colorIntensity = 0.7 + planetInfluence * 0.3;
      const timeVariation = Math.sin(currentTime * 2 + phases[i]) * 0.15 + 0.85;
      
      // Apply flame color variation based on position and time
      const flamePhase = (Math.sin(currentTime * 3 + phases[i] + particleProgress * 5) + 1) / 2; // 0-1
      
      if (flamePhase < 0.33) {
        // Yellow-orange core (brightest part)
        colors[i * 3] = (0.9 + planetInfluence * 0.1) * colorIntensity * timeVariation; // R: bright red
        colors[i * 3 + 1] = (0.7 - planetInfluence * 0.2) * colorIntensity * timeVariation; // G: high green for yellow
        colors[i * 3 + 2] = (0.1 + planetInfluence * 0.05) * colorIntensity * timeVariation; // B: low blue
      } else if (flamePhase < 0.66) {
        // Orange-red mid zones
        colors[i * 3] = (0.9 + planetInfluence * 0.1) * colorIntensity * timeVariation; // R: bright red
        colors[i * 3 + 1] = (0.4 - planetInfluence * 0.1) * colorIntensity * timeVariation; // G: medium green for orange
        colors[i * 3 + 2] = (0.05 + planetInfluence * 0.05) * colorIntensity * timeVariation; // B: very low blue
      } else {
        // Red edges (cooler part)
        colors[i * 3] = (0.8 + planetInfluence * 0.1) * colorIntensity * timeVariation; // R: bright red
        colors[i * 3 + 1] = (0.2 - planetInfluence * 0.05) * colorIntensity * timeVariation; // G: low green
        colors[i * 3 + 2] = (0.0 + planetInfluence * 0.05) * colorIntensity * timeVariation; // B: almost no blue
      }
    }
    
    // Update geometry attributes
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.size.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
  }
  
  controls.update();
  renderer.render(scene, camera);
}

// Smooth step functions for fluid animation
function smoothstep(x) {
  return x * x * (3 - 2 * x);
}

function smootherstep(x) {
  return x * x * x * (x * (x * 6 - 15) + 10);
}

animate(); 