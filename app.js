// Fleet Resource Optimization Application
class FleetOptimizationApp {
    constructor() {
        this.map = null;
        this.vehicles = new Map();
        this.demandZones = [];
        this.weatherData = {};
        this.trafficData = [];
        this.isRunning = false;
        this.isPaused = false;
        this.simulationSpeed = 1.0;
        this.updateInterval = 3000;
        this.intervalId = null;
        this.fleetSize = 25;
        
        // Charts
        this.utilizationChart = null;
        this.demandChart = null;
        
        // AI Agent
        this.aiAgent = new AIAgent();
        
        // Performance metrics
        this.metrics = {
            fleetUtilization: 78,
            avgResponseTime: 4.2,
            customerSatisfaction: 87,
            fuelEfficiency: 12.5,
            revenuePerHour: 850
        };
        
        this.init();
    }
    
    init() {
        this.initializeMap();
        this.loadInitialData();
        this.setupEventListeners();
        this.initializeCharts();
        this.updateDateTime();
        this.startDataSimulation();
        
        // Start datetime updates
        setInterval(() => this.updateDateTime(), 1000);
    }
    
    initializeMap() {
        // Chennai coordinates
        const chennaiCenter = [13.0878, 80.2785];
        
        this.map = L.map('map').setView(chennaiCenter, 11);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);
        
        // Add Chennai landmarks
        this.addLandmarks();
    }
    
    addLandmarks() {
        const landmarks = [
            {name: "T.Nagar", lat: 13.0418, lng: 80.2341},
            {name: "Anna Nagar", lat: 13.0850, lng: 80.2101},
            {name: "OMR", lat: 12.9279, lng: 80.2397},
            {name: "Marina Beach", lat: 13.0827, lng: 80.2707},
            {name: "Central Station", lat: 13.0836, lng: 80.2753},
            {name: "Airport", lat: 13.0067, lng: 80.1648},
            {name: "Guindy", lat: 13.0067, lng: 80.2206},
            {name: "Velachery", lat: 12.9750, lng: 80.2200}
        ];
        
        landmarks.forEach(landmark => {
            L.marker([landmark.lat, landmark.lng])
                .addTo(this.map)
                .bindPopup(`<b>${landmark.name}</b><br>Chennai Landmark`)
                .openPopup();
        });
    }
    
    loadInitialData() {
        // Load initial fleet
        const initialFleet = [
            {id: "FL001", lat: 13.0850, lng: 80.2101, status: "available", fuel: 85},
            {id: "FL002", lat: 13.0418, lng: 80.2341, status: "occupied", fuel: 72},
            {id: "FL003", lat: 12.9750, lng: 80.2200, status: "enroute", fuel: 94},
            {id: "FL004", lat: 13.0067, lng: 80.1648, status: "idle", fuel: 45},
            {id: "FL005", lat: 13.0827, lng: 80.2707, status: "available", fuel: 78}
        ];
        
        // Generate additional vehicles to match fleet size
        this.generateFleet(initialFleet);
        
        // Load demand zones
        this.demandZones = [
            {lat: 13.0418, lng: 80.2341, demand: "high", requests: 12},
            {lat: 13.0850, lng: 80.2101, demand: "medium", requests: 7},
            {lat: 12.9279, lng: 80.2397, demand: "high", requests: 15},
            {lat: 13.0836, lng: 80.2753, demand: "medium", requests: 8}
        ];
        
        // Load weather data
        this.weatherData = {
            temperature: 32,
            condition: "Partly Cloudy",
            humidity: 78,
            windSpeed: 12,
            precipitation: 0
        };
        
        // Load traffic data
        this.trafficData = [
            {area: "T.Nagar", congestion: "high", incidents: 2},
            {area: "OMR", congestion: "medium", incidents: 0},
            {area: "Anna Nagar", congestion: "low", incidents: 0},
            {area: "Marina Beach", congestion: "medium", incidents: 1}
        ];
        
        this.renderVehicles();
        this.renderDemandZones();
        this.updateWeatherDisplay();
        this.updateTrafficDisplay();
        this.updateMetrics();
        this.updateVehicleTable();
    }
    
    generateFleet(initialFleet) {
        // Chennai bounds for random vehicle placement
        const bounds = {
            north: 13.4,
            south: 12.8,
            east: 80.6,
            west: 80.0
        };
        
        // Add initial vehicles
        initialFleet.forEach(vehicle => {
            this.vehicles.set(vehicle.id, {
                ...vehicle,
                marker: null,
                route: this.generateRandomRoute(),
                eta: this.calculateETA(),
                lastUpdate: Date.now()
            });
        });
        
        // Generate additional vehicles
        for (let i = initialFleet.length; i < this.fleetSize; i++) {
            const vehicleId = `FL${String(i + 1).padStart(3, '0')}`;
            const lat = bounds.south + Math.random() * (bounds.north - bounds.south);
            const lng = bounds.west + Math.random() * (bounds.east - bounds.west);
            
            this.vehicles.set(vehicleId, {
                id: vehicleId,
                lat: lat,
                lng: lng,
                status: this.getRandomStatus(),
                fuel: Math.floor(Math.random() * 60) + 40, // 40-100%
                marker: null,
                route: this.generateRandomRoute(),
                eta: this.calculateETA(),
                lastUpdate: Date.now()
            });
        }
    }
    
    getRandomStatus() {
        const statuses = ['available', 'occupied', 'enroute', 'idle'];
        const weights = [0.4, 0.3, 0.2, 0.1]; // Probability weights
        const random = Math.random();
        let sum = 0;
        
        for (let i = 0; i < statuses.length; i++) {
            sum += weights[i];
            if (random <= sum) return statuses[i];
        }
        return 'available';
    }
    
    generateRandomRoute() {
        const landmarks = ["T.Nagar", "Anna Nagar", "OMR", "Marina Beach", "Central Station"];
        const from = landmarks[Math.floor(Math.random() * landmarks.length)];
        let to = landmarks[Math.floor(Math.random() * landmarks.length)];
        while (to === from) {
            to = landmarks[Math.floor(Math.random() * landmarks.length)];
        }
        return `${from} → ${to}`;
    }
    
    calculateETA() {
        return Math.floor(Math.random() * 20) + 5; // 5-25 minutes
    }
    
    renderVehicles() {
        this.vehicles.forEach((vehicle, id) => {
            if (vehicle.marker) {
                this.map.removeLayer(vehicle.marker);
            }
            
            const color = this.getVehicleColor(vehicle.status);
            const icon = L.divIcon({
                className: 'vehicle-marker',
                html: `<div style="
                    width: 12px;
                    height: 12px;
                    background-color: ${color};
                    border: 2px solid white;
                    border-radius: 50%;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                "></div>`,
                iconSize: [16, 16],
                iconAnchor: [8, 8]
            });
            
            vehicle.marker = L.marker([vehicle.lat, vehicle.lng], {icon})
                .addTo(this.map)
                .bindPopup(`
                    <div style="min-width: 200px;">
                        <h3 style="margin: 0 0 8px 0; color: #1f2937;">${vehicle.id}</h3>
                        <div style="margin-bottom: 4px;"><strong>Status:</strong> ${vehicle.status}</div>
                        <div style="margin-bottom: 4px;"><strong>Fuel:</strong> ${vehicle.fuel}%</div>
                        <div style="margin-bottom: 4px;"><strong>Route:</strong> ${vehicle.route}</div>
                        <div style="margin-bottom: 8px;"><strong>ETA:</strong> ${vehicle.eta} min</div>
                        <button onclick="app.showVehicleDetails('${vehicle.id}')" style="
                            background: #0ea5e9;
                            color: white;
                            border: none;
                            padding: 4px 8px;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 12px;
                        ">View Details</button>
                    </div>
                `);
        });
    }
    
    renderDemandZones() {
        this.demandZones.forEach(zone => {
            const radius = zone.demand === 'high' ? 1500 : zone.demand === 'medium' ? 1000 : 500;
            const color = zone.demand === 'high' ? '#ef4444' : zone.demand === 'medium' ? '#f59e0b' : '#22c55e';
            
            L.circle([zone.lat, zone.lng], {
                color: color,
                fillColor: color,
                fillOpacity: 0.2,
                radius: radius
            }).addTo(this.map).bindPopup(`
                <div>
                    <h3 style="margin: 0 0 8px 0;">${zone.demand.toUpperCase()} Demand Zone</h3>
                    <div><strong>Active Requests:</strong> ${zone.requests}</div>
                    <div><strong>Demand Level:</strong> ${zone.demand}</div>
                </div>
            `);
        });
    }
    
    getVehicleColor(status) {
        const colors = {
            available: '#22c55e',
            occupied: '#ef4444',
            enroute: '#3b82f6',
            idle: '#f59e0b'
        };
        return colors[status] || '#6b7280';
    }
    
    setupEventListeners() {
        // Control buttons
        document.getElementById('playBtn').addEventListener('click', () => this.startSimulation());
        document.getElementById('pauseBtn').addEventListener('click', () => this.pauseSimulation());
        document.getElementById('restartBtn').addEventListener('click', () => this.restartSimulation());
        
        // Sliders
        document.getElementById('fleetSize').addEventListener('input', (e) => this.updateFleetSize(e.target.value));
        document.getElementById('simSpeed').addEventListener('input', (e) => this.updateSimulationSpeed(e.target.value));
        document.getElementById('updateInterval').addEventListener('input', (e) => this.updateInterval = e.target.value * 1000);
        
        // Map controls
        document.getElementById('toggleDemand').addEventListener('click', () => this.toggleDemandZones());
        document.getElementById('toggleTraffic').addEventListener('click', () => this.toggleTraffic());
        document.getElementById('centerMap').addEventListener('click', () => this.centerMap());
        
        // Modal
        document.getElementById('closeModal').addEventListener('click', () => this.closeModal());
        
        // Update slider displays
        document.getElementById('fleetSize').addEventListener('input', (e) => {
            document.getElementById('fleetSizeValue').textContent = e.target.value;
        });
        
        document.getElementById('simSpeed').addEventListener('input', (e) => {
            document.getElementById('simSpeedValue').textContent = e.target.value + 'x';
            document.getElementById('speedDisplay').textContent = e.target.value + 'x';
        });
        
        document.getElementById('updateInterval').addEventListener('input', (e) => {
            document.getElementById('updateIntervalValue').textContent = e.target.value + 's';
        });
    }
    
    startSimulation() {
        if (this.isRunning && !this.isPaused) return;
        
        this.isRunning = true;
        this.isPaused = false;
        
        this.updateStatus('Running', 'active');
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        
        this.intervalId = setInterval(() => {
            this.updateSimulation();
        }, this.updateInterval / this.simulationSpeed);
        
        this.aiAgent.start();
    }
    
    pauseSimulation() {
        if (!this.isRunning) return;
        
        this.isPaused = true;
        this.updateStatus('Paused', 'paused');
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        
        this.aiAgent.pause();
    }
    
    restartSimulation() {
        this.isRunning = false;
        this.isPaused = false;
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        
        this.updateStatus('Stopped', '');
        
        // Clear existing vehicles
        this.vehicles.forEach(vehicle => {
            if (vehicle.marker) {
                this.map.removeLayer(vehicle.marker);
            }
        });
        this.vehicles.clear();
        
        // Reload initial data
        this.loadInitialData();
        this.aiAgent.reset();
    }
    
    updateSimulation() {
        this.moveVehicles();
        this.updateDemand();
        this.simulateTrafficChanges();
        this.updateMetrics();
        this.updateVehicleTable();
        this.aiAgent.makeDecision(this.vehicles, this.demandZones, this.trafficData);
    }
    
    moveVehicles() {
        this.vehicles.forEach((vehicle, id) => {
            if (vehicle.status === 'enroute' || vehicle.status === 'occupied') {
                // Simulate movement
                const moveDistance = 0.001; // Small movement for realistic animation
                const randomAngle = Math.random() * 2 * Math.PI;
                
                vehicle.lat += Math.cos(randomAngle) * moveDistance;
                vehicle.lng += Math.sin(randomAngle) * moveDistance;
                
                // Update marker position
                if (vehicle.marker) {
                    vehicle.marker.setLatLng([vehicle.lat, vehicle.lng]);
                }
                
                // Decrease ETA
                vehicle.eta = Math.max(0, vehicle.eta - 1);
                
                // Change status when ETA reaches 0
                if (vehicle.eta === 0) {
                    vehicle.status = 'available';
                    vehicle.eta = this.calculateETA();
                    this.updateVehicleMarker(vehicle);
                }
            }
            
            // Random status changes
            if (Math.random() < 0.02) { // 2% chance per update
                const newStatus = this.getRandomStatus();
                if (newStatus !== vehicle.status) {
                    vehicle.status = newStatus;
                    vehicle.eta = this.calculateETA();
                    vehicle.route = this.generateRandomRoute();
                    this.updateVehicleMarker(vehicle);
                }
            }
        });
    }
    
    updateVehicleMarker(vehicle) {
        if (vehicle.marker) {
            const color = this.getVehicleColor(vehicle.status);
            const icon = L.divIcon({
                className: 'vehicle-marker',
                html: `<div style="
                    width: 12px;
                    height: 12px;
                    background-color: ${color};
                    border: 2px solid white;
                    border-radius: 50%;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                "></div>`,
                iconSize: [16, 16],
                iconAnchor: [8, 8]
            });
            vehicle.marker.setIcon(icon);
        }
    }
    
    updateDemand() {
        // Simulate demand changes based on time of day
        const hour = new Date().getHours();
        const isRushHour = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 19);
        
        this.demandZones.forEach(zone => {
            if (isRushHour) {
                zone.requests += Math.floor(Math.random() * 3);
            } else {
                zone.requests = Math.max(0, zone.requests - Math.floor(Math.random() * 2));
            }
            
            // Update demand level based on requests
            if (zone.requests > 12) {
                zone.demand = 'high';
            } else if (zone.requests > 6) {
                zone.demand = 'medium';
            } else {
                zone.demand = 'low';
            }
        });
    }
    
    simulateTrafficChanges() {
        // Random traffic changes
        this.trafficData.forEach(traffic => {
            if (Math.random() < 0.05) { // 5% chance
                const levels = ['low', 'medium', 'high'];
                traffic.congestion = levels[Math.floor(Math.random() * levels.length)];
            }
        });
        
        this.updateTrafficDisplay();
    }
    
    updateFleetSize(newSize) {
        this.fleetSize = parseInt(newSize);
        
        // Add or remove vehicles as needed
        const currentSize = this.vehicles.size;
        
        if (newSize > currentSize) {
            // Add vehicles
            for (let i = currentSize; i < newSize; i++) {
                const vehicleId = `FL${String(i + 1).padStart(3, '0')}`;
                const bounds = {north: 13.4, south: 12.8, east: 80.6, west: 80.0};
                const lat = bounds.south + Math.random() * (bounds.north - bounds.south);
                const lng = bounds.west + Math.random() * (bounds.east - bounds.west);
                
                const newVehicle = {
                    id: vehicleId,
                    lat: lat,
                    lng: lng,
                    status: this.getRandomStatus(),
                    fuel: Math.floor(Math.random() * 60) + 40,
                    marker: null,
                    route: this.generateRandomRoute(),
                    eta: this.calculateETA(),
                    lastUpdate: Date.now()
                };
                
                this.vehicles.set(vehicleId, newVehicle);
            }
        } else if (newSize < currentSize) {
            // Remove vehicles
            const vehicleIds = Array.from(this.vehicles.keys());
            for (let i = newSize; i < currentSize; i++) {
                const vehicleId = vehicleIds[i];
                const vehicle = this.vehicles.get(vehicleId);
                if (vehicle && vehicle.marker) {
                    this.map.removeLayer(vehicle.marker);
                }
                this.vehicles.delete(vehicleId);
            }
        }
        
        this.renderVehicles();
        this.updateVehicleTable();
    }
    
    updateSimulationSpeed(newSpeed) {
        this.simulationSpeed = parseFloat(newSpeed);
        
        if (this.isRunning && !this.isPaused) {
            // Restart with new speed
            if (this.intervalId) {
                clearInterval(this.intervalId);
            }
            
            this.intervalId = setInterval(() => {
                this.updateSimulation();
            }, this.updateInterval / this.simulationSpeed);
        }
    }
    
    updateStatus(status, statusClass) {
        const statusElement = document.getElementById('simulationStatus');
        const statusDot = document.getElementById('statusDot');
        
        statusElement.textContent = status;
        statusDot.className = 'status-dot';
        if (statusClass) {
            statusDot.classList.add(statusClass);
        }
    }
    
    updateDateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour12: false
        });
        document.getElementById('currentTime').textContent = timeString;
    }
    
    updateWeatherDisplay() {
        document.getElementById('temperature').textContent = `${this.weatherData.temperature}°C`;
        document.getElementById('weatherCondition').textContent = this.weatherData.condition;
        document.getElementById('humidity').textContent = `${this.weatherData.humidity}%`;
        document.getElementById('windSpeed').textContent = `${this.weatherData.windSpeed} km/h`;
    }
    
    updateTrafficDisplay() {
        const avgCongestion = this.getAverageTrafficLevel();
        const trafficElement = document.getElementById('trafficLevel');
        
        trafficElement.textContent = avgCongestion.charAt(0).toUpperCase() + avgCongestion.slice(1);
        trafficElement.className = `status status--${avgCongestion === 'high' ? 'error' : avgCongestion === 'medium' ? 'warning' : 'success'}`;
        
        // Update peak hours
        const hour = new Date().getHours();
        let peakStatus = 'Off Peak';
        if (hour >= 8 && hour <= 10) peakStatus = 'Morning Rush';
        else if (hour >= 17 && hour <= 19) peakStatus = 'Evening Rush';
        
        document.getElementById('peakHours').textContent = peakStatus;
    }
    
    getAverageTrafficLevel() {
        const levels = {'low': 1, 'medium': 2, 'high': 3};
        const avg = this.trafficData.reduce((sum, traffic) => sum + levels[traffic.congestion], 0) / this.trafficData.length;
        
        if (avg <= 1.5) return 'low';
        if (avg <= 2.5) return 'medium';
        return 'high';
    }
    
    updateMetrics() {
        // Simulate realistic metric changes
        const availableVehicles = Array.from(this.vehicles.values()).filter(v => v.status === 'available').length;
        const occupiedVehicles = Array.from(this.vehicles.values()).filter(v => v.status === 'occupied').length;
        
        this.metrics.fleetUtilization = Math.round((occupiedVehicles / this.vehicles.size) * 100);
        this.metrics.avgResponseTime = Math.round((4.2 + Math.random() * 2 - 1) * 10) / 10;
        this.metrics.customerSatisfaction = Math.max(70, Math.min(98, this.metrics.customerSatisfaction + Math.random() * 4 - 2));
        this.metrics.fuelEfficiency = Math.round((12.5 + Math.random() * 2 - 1) * 10) / 10;
        this.metrics.revenuePerHour = Math.round(800 + Math.random() * 200);
        
        // Update display
        document.getElementById('fleetUtilization').textContent = `${this.metrics.fleetUtilization}%`;
        document.getElementById('avgResponseTime').textContent = `${this.metrics.avgResponseTime}min`;
        document.getElementById('customerSatisfaction').textContent = `${Math.round(this.metrics.customerSatisfaction)}%`;
        document.getElementById('fuelEfficiency').textContent = `${this.metrics.fuelEfficiency}km/L`;
        document.getElementById('revenuePerHour').textContent = `₹${this.metrics.revenuePerHour}`;
        
        // Update performance score
        const performanceScore = Math.round((this.metrics.fleetUtilization + this.metrics.customerSatisfaction) / 2);
        document.getElementById('performanceScore').textContent = `${performanceScore}%`;
        
        // Update charts
        this.updateCharts();
    }
    
    updateVehicleTable() {
        const tableBody = document.querySelector('#vehicleTable tbody');
        tableBody.innerHTML = '';
        
        Array.from(this.vehicles.values()).slice(0, 10).forEach(vehicle => {
            const row = tableBody.insertRow();
            row.innerHTML = `
                <td>${vehicle.id}</td>
                <td><span class="status status--${this.getStatusClass(vehicle.status)}">${vehicle.status}</span></td>
                <td>${vehicle.route}</td>
                <td>${vehicle.fuel}%</td>
                <td>${vehicle.eta} min</td>
            `;
        });
        
        // Update optimization table
        this.updateOptimizationTable();
    }
    
    updateOptimizationTable() {
        const tableBody = document.querySelector('#optimizationTable tbody');
        const decisions = this.aiAgent.getRecentDecisions();
        
        tableBody.innerHTML = '';
        decisions.slice(0, 5).forEach(decision => {
            const row = tableBody.insertRow();
            row.innerHTML = `
                <td>${decision.time}</td>
                <td>${decision.action}</td>
                <td>${decision.reason}</td>
                <td><span class="status status--${decision.impact === 'positive' ? 'success' : decision.impact === 'negative' ? 'error' : 'info'}">${decision.impact}</span></td>
            `;
        });
    }
    
    getStatusClass(status) {
        const classes = {
            available: 'success',
            occupied: 'error',
            enroute: 'info',
            idle: 'warning'
        };
        return classes[status] || 'info';
    }
    
    initializeCharts() {
        // Utilization Chart
        const utilizationCtx = document.getElementById('utilizationChart').getContext('2d');
        this.utilizationChart = new Chart(utilizationCtx, {
            type: 'line',
            data: {
                labels: ['6h ago', '5h ago', '4h ago', '3h ago', '2h ago', '1h ago', 'Now'],
                datasets: [{
                    label: 'Fleet Utilization %',
                    data: [65, 72, 78, 85, 79, 82, 78],
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
        
        // Demand Chart
        const demandCtx = document.getElementById('demandChart').getContext('2d');
        this.demandChart = new Chart(demandCtx, {
            type: 'doughnut',
            data: {
                labels: ['High Demand', 'Medium Demand', 'Low Demand'],
                datasets: [{
                    data: [35, 45, 20],
                    backgroundColor: ['#B4413C', '#FFC185', '#1FB8CD']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    updateCharts() {
        if (this.utilizationChart) {
            // Add new data point
            this.utilizationChart.data.datasets[0].data.push(this.metrics.fleetUtilization);
            this.utilizationChart.data.datasets[0].data.shift();
            this.utilizationChart.update('none');
        }
        
        if (this.demandChart) {
            const highDemand = this.demandZones.filter(z => z.demand === 'high').length;
            const mediumDemand = this.demandZones.filter(z => z.demand === 'medium').length;
            const lowDemand = this.demandZones.filter(z => z.demand === 'low').length;
            
            this.demandChart.data.datasets[0].data = [highDemand * 35, mediumDemand * 30, lowDemand * 25];
            this.demandChart.update('none');
        }
    }
    
    showVehicleDetails(vehicleId) {
        const vehicle = this.vehicles.get(vehicleId);
        if (!vehicle) return;
        
        const modal = document.getElementById('vehicleModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        modalTitle.textContent = `Vehicle ${vehicle.id} Details`;
        modalBody.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div><strong>Status:</strong> ${vehicle.status}</div>
                <div><strong>Fuel Level:</strong> ${vehicle.fuel}%</div>
                <div><strong>Current Route:</strong> ${vehicle.route}</div>
                <div><strong>ETA:</strong> ${vehicle.eta} min</div>
                <div><strong>Last Update:</strong> ${new Date(vehicle.lastUpdate).toLocaleTimeString()}</div>
                <div><strong>Location:</strong> ${vehicle.lat.toFixed(4)}, ${vehicle.lng.toFixed(4)}</div>
            </div>
            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--color-border);">
                <h4 style="margin: 0 0 8px 0;">Recent Activity</h4>
                <div style="font-size: 14px; color: var(--color-text-secondary);">
                    • Status changed to ${vehicle.status}<br>
                    • Route assigned: ${vehicle.route}<br>
                    • Fuel level: ${vehicle.fuel}%
                </div>
            </div>
        `;
        
        modal.classList.remove('hidden');
    }
    
    closeModal() {
        document.getElementById('vehicleModal').classList.add('hidden');
    }
    
    toggleDemandZones() {
        // Implementation for toggling demand zones visibility
        const button = document.getElementById('toggleDemand');
        button.classList.toggle('active');
    }
    
    toggleTraffic() {
        // Implementation for toggling traffic overlay
        const button = document.getElementById('toggleTraffic');
        button.classList.toggle('active');
    }
    
    centerMap() {
        this.map.setView([13.0878, 80.2785], 11);
    }
    
    startDataSimulation() {
        // Simulate continuous data updates even when paused
        setInterval(() => {
            // Update weather occasionally
            if (Math.random() < 0.02) { // 2% chance
                this.weatherData.temperature += Math.random() * 4 - 2;
                this.weatherData.temperature = Math.max(20, Math.min(40, this.weatherData.temperature));
                this.weatherData.windSpeed += Math.random() * 6 - 3;
                this.weatherData.windSpeed = Math.max(0, Math.min(30, this.weatherData.windSpeed));
                this.updateWeatherDisplay();
            }
        }, 5000);
    }
}

// AI Agent Simulation
class AIAgent {
    constructor() {
        this.isActive = false;
        this.decisions = [];
        this.decisionInterval = null;
        this.strategies = ['efficiency', 'coverage', 'demand-response', 'fuel-optimization'];
        this.currentStrategy = 'efficiency';
    }
    
    start() {
        this.isActive = true;
        this.decisionInterval = setInterval(() => {
            this.updateDecisionLog();
        }, 15000); // Make decision every 15 seconds
    }
    
    pause() {
        this.isActive = false;
        if (this.decisionInterval) {
            clearInterval(this.decisionInterval);
            this.decisionInterval = null;
        }
    }
    
    reset() {
        this.decisions = [];
        this.pause();
    }
    
    makeDecision(vehicles, demandZones, trafficData) {
        if (!this.isActive) return;
        
        // Analyze current situation
        const availableVehicles = Array.from(vehicles.values()).filter(v => v.status === 'available').length;
        const highDemandZones = demandZones.filter(z => z.demand === 'high').length;
        const trafficCongestion = trafficData.filter(t => t.congestion === 'high').length;
        
        let decision = null;
        
        if (highDemandZones > 2 && availableVehicles < 5) {
            decision = {
                action: 'Reallocate vehicles to high-demand areas',
                reason: 'High demand detected with low availability',
                impact: 'positive'
            };
        } else if (trafficCongestion > 1) {
            decision = {
                action: 'Reroute vehicles to avoid congestion',
                reason: 'Traffic congestion affecting multiple areas',
                impact: 'positive'
            };
        } else if (availableVehicles > vehicles.size * 0.6) {
            decision = {
                action: 'Optimize vehicle distribution',
                reason: 'Excess vehicle availability detected',
                impact: 'neutral'
            };
        }
        
        if (decision) {
            this.addDecision(decision);
        }
    }
    
    addDecision(decision) {
        const timestamp = new Date().toLocaleTimeString();
        this.decisions.unshift({
            ...decision,
            time: timestamp,
            id: Date.now()
        });
        
        // Keep only last 10 decisions
        if (this.decisions.length > 10) {
            this.decisions = this.decisions.slice(0, 10);
        }
        
        this.updateDecisionLog();
    }
    
    updateDecisionLog() {
        const logContainer = document.getElementById('decisionLog');
        const logEntries = logContainer.querySelectorAll('.log-entry');
        
        // Add random decision if none made recently
        if (Math.random() < 0.3) {
            const randomDecisions = [
                {
                    action: 'Adjusted fleet coverage based on weather',
                    reason: 'Weather conditions optimal for increased service',
                    impact: 'positive'
                },
                {
                    action: 'Fuel optimization protocol activated',
                    reason: 'Multiple vehicles approaching low fuel threshold',
                    impact: 'neutral'
                },
                {
                    action: 'Predictive demand analysis updated',
                    reason: 'Historical patterns indicate peak demand incoming',
                    impact: 'positive'
                }
            ];
            
            const randomDecision = randomDecisions[Math.floor(Math.random() * randomDecisions.length)];
            this.addDecision(randomDecision);
        }
        
        // Update display
        logContainer.innerHTML = '<h4>Recent Decisions</h4><div class="log-entries" id="decisionLogEntries"></div>';
        const entriesContainer = document.getElementById('decisionLogEntries');
        
        this.decisions.slice(0, 3).forEach(decision => {
            const entry = document.createElement('div');
            entry.className = 'log-entry fade-in';
            entry.textContent = decision.action;
            entriesContainer.appendChild(entry);
        });
    }
    
    getRecentDecisions() {
        return this.decisions;
    }
}

// Initialize the application
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new FleetOptimizationApp();
});

// Global functions for modal interaction
window.app = null;
document.addEventListener('DOMContentLoaded', () => {
    window.app = new FleetOptimizationApp();
});