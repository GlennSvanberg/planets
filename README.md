# Three.js Playground

A simple playground for experimenting with Three.js 3D models and features.

## Features

- Interactive 3D scene with OrbitControls (rotate, zoom, pan)
- Grid and axes helpers for orientation
- Create basic shapes (cube, sphere, torus) with a single click
- Random positioning and rotation of objects
- Clear scene functionality
- Responsive design

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Open your browser to the URL displayed in the terminal (typically http://localhost:5173)

## Controls

- **Left-click + drag**: Rotate the camera
- **Right-click + drag**: Pan the camera
- **Scroll**: Zoom in/out
- **Buttons**:
  - Create Cube: Adds a green cube to the scene
  - Create Sphere: Adds a red sphere to the scene
  - Create Torus: Adds a blue torus to the scene
  - Clear Scene: Removes all objects from the scene

## Expanding the Playground

This is a starting point for your Three.js experiments. Here are some ideas to expand it:

- Add more complex geometries
- Implement different materials (wireframe, texture-mapped, etc.)
- Add physics simulation
- Create interactive objects that respond to mouse events
- Import external 3D models (glTF, OBJ, etc.)
- Add particle systems
- Implement post-processing effects 