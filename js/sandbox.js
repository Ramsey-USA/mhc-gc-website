// Sandbox Interactive Builder JavaScript
class SandboxBuilder {
    constructor() {
        this.canvas = document.getElementById('design-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.currentTool = 'select';
        this.currentView = '2d';
        this.selectedComponent = null;
        this.placedComponents = [];
        this.costs = {
            structural: 0,
            openings: 0,
            finishes: 0,
            fixtures: 0
        };
        this.draggedComponent = null;
        this.gridSize = 20;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupDragAndDrop();
        this.setupCategoryToggles();
        this.setupModalHandlers();
        this.updateCostDisplay();
        this.resizeCanvas();
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    setupEventListeners() {
        // View switching
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchView(e.target.dataset.view);
            });
        });

        // Tool selection
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectTool(e.target.id.replace('-tool', ''));
            });
        });

        // Canvas interactions
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleCanvasMouseMove(e));

        // Action buttons
        document.getElementById('undo-btn').addEventListener('click', () => this.undo());
        document.getElementById('redo-btn').addEventListener('click', () => this.redo());
        document.getElementById('clear-all').addEventListener('click', () => this.clearAll());

        // Save and quote buttons
        document.getElementById('save-project').addEventListener('click', () => this.showLeadCaptureModal('save'));
        document.getElementById('get-quote').addEventListener('click', () => this.showLeadCaptureModal('quote'));
        document.getElementById('save-and-continue').addEventListener('click', () => this.showLeadCaptureModal('save'));
    }

    setupDragAndDrop() {
        const componentItems = document.querySelectorAll('.component-item');
        
        componentItems.forEach(item => {
            item.draggable = true;
            
            item.addEventListener('dragstart', (e) => {
                this.draggedComponent = {
                    type: item.dataset.component,
                    cost: parseInt(item.dataset.cost)
                };
                item.classList.add('dragging');
            });
            
            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
            });
        });

        // Canvas drop zone
        this.canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.canvas.parentElement.classList.add('drag-over');
        });

        this.canvas.addEventListener('dragleave', () => {
            this.canvas.parentElement.classList.remove('drag-over');
        });

        this.canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            this.canvas.parentElement.classList.remove('drag-over');
            
            if (this.draggedComponent) {
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                this.placeComponent(this.draggedComponent, x, y);
                this.draggedComponent = null;
            }
        });
    }

    setupCategoryToggles() {
        document.querySelectorAll('.category-header').forEach(header => {
            header.addEventListener('click', () => {
                const category = header.parentElement;
                category.classList.toggle('active');
            });
        });
    }

    setupModalHandlers() {
        const modal = document.getElementById('lead-capture-modal');
        const closeBtn = document.getElementById('modal-close');
        
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Form submissions
        document.getElementById('basic-info-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.showLeadStep(2);
        });

        document.getElementById('detailed-info-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitLead();
        });

        document.getElementById('continue-designing').addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    switchView(view) {
        document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-view="${view}"]`).classList.add('active');
        
        this.currentView = view;
        
        if (view === '2d') {
            document.getElementById('canvas-2d').style.display = 'block';
            document.getElementById('canvas-3d').style.display = 'none';
        } else if (view === '3d') {
            document.getElementById('canvas-2d').style.display = 'none';
            document.getElementById('canvas-3d').style.display = 'block';
            this.init3DView();
        }
    }

    selectTool(tool) {
        document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`${tool}-tool`).classList.add('active');
        
        this.currentTool = tool;
        this.updateCursor();
    }

    updateCursor() {
        const cursors = {
            select: 'default',
            move: 'move',
            rotate: 'grab',
            delete: 'crosshair',
            measure: 'crosshair'
        };
        
        this.canvas.style.cursor = cursors[this.currentTool] || 'default';
    }

    placeComponent(component, x, y) {
        // Snap to grid
        const snappedX = Math.round(x / this.gridSize) * this.gridSize;
        const snappedY = Math.round(y / this.gridSize) * this.gridSize;
        
        const placedComponent = {
            id: Date.now(),
            type: component.type,
            cost: component.cost,
            x: snappedX,
            y: snappedY,
            width: this.getComponentWidth(component.type),
            height: this.getComponentHeight(component.type),
            rotation: 0
        };
        
        this.placedComponents.push(placedComponent);
        this.updateCosts(component);
        this.redrawCanvas();
        
        // Update 3D view if active
        if (this.currentView === '3d' && this.threeRenderer) {
            this.threeRenderer.addComponent(placedComponent);
        }
    }

    getComponentWidth(type) {
        const widths = {
            wall: 100,
            beam: 80,
            column: 20,
            door: 30,
            window: 40,
            'sliding-door': 50,
            flooring: 80,
            countertop: 60,
            cabinet: 40,
            lighting: 20,
            plumbing: 20,
            sofa: 80,
            table: 60
        };
        return widths[type] || 40;
    }

    getComponentHeight(type) {
        const heights = {
            wall: 20,
            beam: 20,
            column: 80,
            door: 60,
            window: 40,
            'sliding-door': 60,
            flooring: 80,
            countertop: 20,
            cabinet: 60,
            lighting: 20,
            plumbing: 20,
            sofa: 40,
            table: 60
        };
        return heights[type] || 40;
    }

    updateCosts(component) {
        const categoryMap = {
            wall: 'structural',
            beam: 'structural',
            column: 'structural',
            door: 'openings',
            window: 'openings',
            'sliding-door': 'openings',
            flooring: 'finishes',
            countertop: 'finishes',
            cabinet: 'finishes',
            lighting: 'fixtures',
            plumbing: 'fixtures'
        };
        
        const category = categoryMap[component.type];
        if (category && component.cost > 0) {
            this.costs[category] += component.cost;
        }
        
        this.updateCostDisplay();
    }

    updateCostDisplay() {
        document.getElementById('structural-cost').textContent = `$${this.costs.structural.toLocaleString()}`;
        document.getElementById('openings-cost').textContent = `$${this.costs.openings.toLocaleString()}`;
        document.getElementById('finishes-cost').textContent = `$${this.costs.finishes.toLocaleString()}`;
        document.getElementById('fixtures-cost').textContent = `$${this.costs.fixtures.toLocaleString()}`;
        
        const subtotal = Object.values(this.costs).reduce((sum, cost) => sum + cost, 0);
        const total = Math.round(subtotal * 2.5); // Estimate with labor and overhead
        
        document.getElementById('subtotal-cost').textContent = `$${subtotal.toLocaleString()}`;
        document.getElementById('total-cost').textContent = `$${total.toLocaleString()}`;
    }

    redrawCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw placed components
        this.placedComponents.forEach(component => {
            this.drawComponent(component);
        });
        
        // Highlight selected component
        if (this.selectedComponent) {
            this.drawSelectionHighlight(this.selectedComponent);
        }
    }

    drawComponent(component) {
        this.ctx.save();
        this.ctx.translate(component.x + component.width/2, component.y + component.height/2);
        this.ctx.rotate(component.rotation * Math.PI / 180);
        this.ctx.translate(-component.width/2, -component.height/2);
        
        const colors = {
            wall: '#396851',
            beam: '#2B2B2B',
            column: '#BD9264',
            door: '#C19A6B',
            window: '#396851',
            'sliding-door': '#C19A6B',
            flooring: '#BD9264',
            countertop: '#8B8680',
            cabinet: '#BD9264',
            lighting: '#FFD700',
            plumbing: '#396851',
            sofa: '#6C757D',
            table: '#C19A6B'
        };
        
        this.ctx.fillStyle = colors[component.type] || '#6C757D';
        this.ctx.fillRect(0, 0, component.width, component.height);
        
        // Draw component label
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '12px Saira';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(component.type, component.width/2, component.height/2 + 4);
        
        this.ctx.restore();
    }

    drawSelectionHighlight(component) {
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.strokeRect(component.x - 2, component.y - 2, component.width + 4, component.height + 4);
        this.ctx.setLineDash([]);
    }

    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (this.currentTool === 'select') {
            this.selectComponentAt(x, y);
        } else if (this.currentTool === 'delete') {
            this.deleteComponentAt(x, y);
        }
    }

    handleCanvasMouseMove(e) {
        // Handle component moving, rotation, etc.
        if (this.currentTool === 'move' && this.selectedComponent) {
            // Implementation for moving components
        }
    }

    selectComponentAt(x, y) {
        const component = this.placedComponents.find(comp => 
            x >= comp.x && x <= comp.x + comp.width &&
            y >= comp.y && y <= comp.y + comp.height
        );
        
        this.selectedComponent = component;
        this.updatePropertiesPanel();
        this.redrawCanvas();
    }

    deleteComponentAt(x, y) {
        const componentIndex = this.placedComponents.findIndex(comp => 
            x >= comp.x && x <= comp.x + comp.width &&
            y >= comp.y && y <= comp.y + comp.height
        );
        
        if (componentIndex !== -1) {
            const component = this.placedComponents[componentIndex];
            this.removeCost(component);
            this.placedComponents.splice(componentIndex, 1);
            this.selectedComponent = null;
            this.updatePropertiesPanel();
            this.redrawCanvas();
            
            // Update 3D view if active
            if (this.currentView === '3d' && this.threeRenderer) {
                this.threeRenderer.removeComponent(component.id);
            }
        }
    }

    removeCost(component) {
        const categoryMap = {
            wall: 'structural',
            beam: 'structural',
            column: 'structural',
            door: 'openings',
            window: 'openings',
            'sliding-door': 'openings',
            flooring: 'finishes',
            countertop: 'finishes',
            cabinet: 'finishes',
            lighting: 'fixtures',
            plumbing: 'fixtures'
        };
        
        const category = categoryMap[component.type];
        if (category && component.cost > 0) {
            this.costs[category] = Math.max(0, this.costs[category] - component.cost);
        }
        
        this.updateCostDisplay();
    }

    updatePropertiesPanel() {
        const content = document.getElementById('properties-content');
        
        if (this.selectedComponent) {
            content.innerHTML = `
                <div class="property-group">
                    <label>Type: ${this.selectedComponent.type}</label>
                    <label>Position: (${this.selectedComponent.x}, ${this.selectedComponent.y})</label>
                    <label>Size: ${this.selectedComponent.width} x ${this.selectedComponent.height}</label>
                    <label>Rotation: ${this.selectedComponent.rotation}°</label>
                </div>
            `;
        } else {
            content.innerHTML = '<div class="no-selection"><p>Select an item to edit properties</p></div>';
        }
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        this.redrawCanvas();
    }

    init3DView() {
        if (typeof initThreeJS === 'function') {
            this.threeRenderer = initThreeJS();
            this.threeRenderer.updateFromCanvas(this.placedComponents);
        } else {
            console.log('Three.js not available');
        }
    }

    showLeadCaptureModal(type) {
        const modal = document.getElementById('lead-capture-modal');
        const title = document.getElementById('modal-title');
        
        title.textContent = type === 'save' ? 'Save Your Project' : 'Get Your Quote';
        modal.style.display = 'flex';
        this.showLeadStep(1);
    }

    showLeadStep(step) {
        document.querySelectorAll('.lead-step').forEach(stepEl => {
            stepEl.style.display = 'none';
        });
        document.getElementById(`lead-step-${step}`).style.display = 'block';
    }

    submitLead() {
        document.getElementById('loading-overlay').style.display = 'flex';
        
        // Simulate API call
        setTimeout(() => {
            document.getElementById('loading-overlay').style.display = 'none';
            this.showLeadStep(3);
        }, 2000);
    }

    undo() {
        // Implementation for undo functionality
        console.log('Undo action');
    }

    redo() {
        // Implementation for redo functionality
        console.log('Redo action');
    }

    clearAll() {
        if (confirm('Are you sure you want to clear all components?')) {
            this.placedComponents = [];
            this.selectedComponent = null;
            this.costs = { structural: 0, openings: 0, finishes: 0, fixtures: 0 };
            this.updateCostDisplay();
            this.updatePropertiesPanel();
            this.redrawCanvas();
            
            // Clear 3D view if active
            if (this.threeRenderer) {
                this.threeRenderer.clearAll();
            }
        }
    }
}

// Initialize sandbox when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.sandbox = new SandboxBuilder();
});