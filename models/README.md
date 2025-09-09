# MH Construction 3D Models Directory

This directory contains 3D models and assets for the interactive project viewer and sandbox tools.

## Directory Structure

```
models/
├── jobsites/           # Actual project 3D models
│   ├── summers-hub/
│   ├── fire-station/
│   └── luxury-home/
├── components/         # Sandbox building components
│   ├── structural/
│   ├── openings/
│   ├── finishes/
│   └── fixtures/
└── environments/       # Environmental assets
    ├── landscapes/
    ├── backgrounds/
    └── lighting/
```

## 3D Model Requirements

### File Formats
- **Primary**: glTF 2.0 (.gltf/.glb) for web optimization
- **Backup**: OBJ/MTL for simple geometry
- **Development**: FBX for complex models with animations

### Quality Standards
- Optimized for web performance (<50MB per complete scene)
- Appropriate level of detail (LOD) for web viewing
- Compressed textures (preferably WebP or compressed JPEG)
- Efficient polygon count (under 100k polygons per major component)

### Jobsite Models
3D scans of actual MH Construction projects for virtual tours:

#### Summer's Hub (Available October 2024)
- Complete building interior and exterior
- Clickable elements for material information
- Multiple viewing angles and rooms
- "Thoughts from Builder" hotspots

#### Fire Station #10 (Available December 2024)
- Progressive construction phases
- Equipment and facility details
- Safety feature highlights

### Sandbox Components
Interactive building components for the project sandbox:

#### Structural Elements
- Walls (various materials and finishes)
- Beams and columns
- Foundation elements
- Roof components

#### Openings
- Doors (interior/exterior, various styles)
- Windows (different sizes and types)
- Sliding doors and large openings

#### Finishes
- Flooring materials and patterns
- Countertop materials and configurations
- Cabinet styles and arrangements
- Paint and wall finishes

#### Fixtures
- Lighting fixtures and chandeliers
- Plumbing fixtures
- Electrical components
- Hardware elements

## Technical Specifications

### glTF Requirements
- Use Draco compression for geometry
- Optimize texture sizes (max 2048x2048 for most textures)
- Include PBR materials with metallic-roughness workflow
- Implement proper UV mapping for texture efficiency

### Performance Optimization
- Use texture atlases where possible
- Implement proper LOD (Level of Detail) systems
- Optimize draw calls through proper grouping
- Use instancing for repeated elements

### Interactive Features
- Clickable hotspots for detailed information
- Smooth camera transitions between viewpoints
- Touch-friendly controls for mobile devices
- VR/WebXR compatibility for future expansion

## Integration with Three.js

### Loading System
- Asynchronous model loading with progress indicators
- Fallback models for slow connections
- Error handling for failed loads
- Caching system for repeated visits

### Material System
- Dynamic material swapping in sandbox
- Cost calculation integration
- Real-time material preview
- Material library management

### Animation System
- Camera path animations for tours
- Object highlight animations
- Transition effects between views
- User interaction feedback

## Content Creation Guidelines

### Photography for Texture Creation
- High-resolution material samples
- Consistent lighting conditions
- Multiple angles for complex materials
- Color-corrected and calibrated images

### 3D Scanning Requirements
- Millimeter accuracy for construction details
- Complete coverage of all surfaces
- Proper mesh cleanup and optimization
- Texture quality suitable for close inspection

### Modeling Standards
- Consistent scale and units (metric preferred)
- Proper naming conventions for materials and objects
- Organized hierarchy for easy navigation
- Clean topology for efficient rendering

## Implementation Timeline

### Phase 1: Mock Models (Immediate)
- Simple placeholder models for development
- Basic component library for sandbox
- Test environment setup

### Phase 2: Summer's Hub Integration (October 2024)
- Professional 3D scan integration
- Interactive hotspot development
- "Thoughts from Builder" content

### Phase 3: Fire Station Integration (December 2024)
- Second real project integration
- Enhanced interaction features
- Performance optimization

### Phase 4: Expanded Library (Ongoing)
- Additional project integrations
- Expanded component library
- Advanced VR features

## Tools and Software

### Recommended 3D Software
- Blender (open source, excellent glTF export)
- 3ds Max (professional modeling)
- Maya (complex animations)
- Reality Capture (photogrammetry)

### Optimization Tools
- glTF Transform (command-line optimization)
- Draco Encoder (geometry compression)
- Basis Universal (texture compression)
- Three.js Editor (testing and preview)

### Quality Assurance
- Three.js model viewer for testing
- Performance profiling tools
- Cross-browser compatibility testing
- Mobile device performance validation