// Three.js 3D View Setup for Sandbox
class ThreeJSRenderer {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.container = document.getElementById('three-canvas');
        this.meshes = [];
        
        this.init();
    }

    init() {
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupControls();
        this.setupLighting();
        this.setupEventListeners();
        this.animate();
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf8f9fa);
        
        // Add grid helper
        const gridHelper = new THREE.GridHelper(20, 20, 0x396851, 0xe9ecef);
        this.scene.add(gridHelper);
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(10, 10, 10);
        this.camera.lookAt(0, 0, 0);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);
    }

    setupControls() {
        if (THREE.OrbitControls) {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.25;
            this.controls.enableZoom = true;
        }
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);

        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
    }

    setupEventListeners() {
        // Camera control buttons
        const cameraControls = {
            'front-view': () => this.setCameraView(0, 0, 10),
            'side-view': () => this.setCameraView(10, 0, 0),
            'top-view': () => this.setCameraView(0, 15, 0),
            'iso-view': () => this.setCameraView(10, 10, 10)
        };

        Object.entries(cameraControls).forEach(([id, callback]) => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', callback);
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    setCameraView(x, y, z) {
        if (this.controls) {
            this.camera.position.set(x, y, z);
            this.camera.lookAt(0, 0, 0);
            this.controls.update();
        }
    }

    addComponent(component) {
        const geometry = this.getComponentGeometry(component.type);
        const material = this.getComponentMaterial(component.type);
        const mesh = new THREE.Mesh(geometry, material);
        
        // Position the mesh
        mesh.position.set(
            (component.x - 600) / 30, // Convert canvas coords to 3D coords
            0,
            (component.y - 400) / 30
        );
        
        // Scale based on component size
        mesh.scale.set(
            component.width / 30,
            this.getComponentHeight3D(component.type),
            component.height / 30
        );
        
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData = { componentId: component.id };
        
        this.scene.add(mesh);
        this.meshes.push(mesh);
        
        return mesh;
    }

    getComponentGeometry(type) {
        const geometries = {
            wall: new THREE.BoxGeometry(1, 1, 0.1),
            beam: new THREE.BoxGeometry(1, 0.3, 0.3),
            column: new THREE.CylinderGeometry(0.2, 0.2, 3, 8),
            door: new THREE.BoxGeometry(1, 2, 0.1),
            window: new THREE.BoxGeometry(1, 1, 0.1),
            'sliding-door': new THREE.BoxGeometry(1, 2, 0.1),
            flooring: new THREE.BoxGeometry(1, 0.05, 1),
            countertop: new THREE.BoxGeometry(1, 0.1, 0.6),
            cabinet: new THREE.BoxGeometry(0.6, 1, 0.6),
            lighting: new THREE.SphereGeometry(0.2, 16, 8),
            plumbing: new THREE.CylinderGeometry(0.1, 0.1, 0.5, 8),
            sofa: new THREE.BoxGeometry(2, 0.8, 0.8),
            table: new THREE.BoxGeometry(1.5, 0.05, 1)
        };
        
        return geometries[type] || new THREE.BoxGeometry(1, 1, 1);
    }

    getComponentMaterial(type) {
        const colors = {
            wall: 0x396851,
            beam: 0x2B2B2B,
            column: 0xBD9264,
            door: 0xC19A6B,
            window: 0x87CEEB,
            'sliding-door': 0xC19A6B,
            flooring: 0xBD9264,
            countertop: 0x8B8680,
            cabinet: 0xBD9264,
            lighting: 0xFFD700,
            plumbing: 0x396851,
            sofa: 0x6C757D,
            table: 0xC19A6B
        };
        
        const color = colors[type] || 0x6C757D;
        return new THREE.MeshLambertMaterial({ color });
    }

    getComponentHeight3D(type) {
        const heights = {
            wall: 3,
            beam: 1,
            column: 1,
            door: 1,
            window: 1,
            'sliding-door': 1,
            flooring: 1,
            countertop: 1,
            cabinet: 1,
            lighting: 1,
            plumbing: 1,
            sofa: 1,
            table: 1
        };
        
        return heights[type] || 1;
    }

    removeComponent(componentId) {
        const meshIndex = this.meshes.findIndex(mesh => 
            mesh.userData.componentId === componentId
        );
        
        if (meshIndex !== -1) {
            const mesh = this.meshes[meshIndex];
            this.scene.remove(mesh);
            mesh.geometry.dispose();
            mesh.material.dispose();
            this.meshes.splice(meshIndex, 1);
        }
    }

    clearAll() {
        this.meshes.forEach(mesh => {
            this.scene.remove(mesh);
            mesh.geometry.dispose();
            mesh.material.dispose();
        });
        this.meshes = [];
    }

    updateFromCanvas(components) {
        this.clearAll();
        components.forEach(component => {
            this.addComponent(component);
        });
    }

    onWindowResize() {
        if (!this.container.clientWidth || !this.container.clientHeight) return;
        
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.controls) {
            this.controls.update();
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize Three.js when needed
window.initThreeJS = () => {
    if (!window.threeRenderer) {
        window.threeRenderer = new ThreeJSRenderer();
    }
    return window.threeRenderer;
};