import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';

// --- 1. Three.js Setup ---
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf4f5f7);

const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(100, 100, 100);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(50, 50, 50);
scene.add(dirLight);

const gridHelper = new THREE.GridHelper(200, 50, 0xa259ff, 0xdddddd);
gridHelper.position.y = -1;
scene.add(gridHelper);

let currentMesh = null;

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    if(!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});

// --- 2. STL Upload Logic ---
let uploadedFileName = "Custom Print";

document.getElementById('stl-upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    uploadedFileName = file.name;

    const reader = new FileReader();
    reader.onload = function(e) {
        const contents = e.target.result;
        loadSTL(contents);
        document.getElementById('product-actions').style.display = 'flex';
    };
    reader.readAsArrayBuffer(file);
});

function loadSTL(data) {
    if (currentMesh) {
        scene.remove(currentMesh);
        currentMesh.geometry.dispose();
        currentMesh.material.dispose();
    }

    const loader = new STLLoader();
    const geometry = loader.parse(data);

    geometry.computeBoundingBox();
    const boundingBox = geometry.boundingBox;
    const center = new THREE.Vector3();
    boundingBox.getCenter(center);
    geometry.translate(-center.x, -center.y, -center.z);

    const size = new THREE.Vector3();
    boundingBox.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetSize = 60;
    const scale = targetSize / maxDim;
    
    const material = new THREE.MeshStandardMaterial({ 
        color: 0x8e44ad, 
        roughness: 0.3,
        metalness: 0.2
    });

    currentMesh = new THREE.Mesh(geometry, material);
    currentMesh.scale.set(scale, scale, scale);
    currentMesh.position.y = (size.y * scale) / 2;

    scene.add(currentMesh);
    
    camera.position.set(targetSize * 1.5, targetSize * 1.2, targetSize * 1.5);
    controls.target.set(0, currentMesh.position.y, 0);
}

// --- 3. Dynamic Cart System (Rupees) ---
let cart = [];
const shippingCost = 50.00; // Flat 50 Rs delivery

// Button to add Custom STL to Cart
document.getElementById('add-to-cart-btn').addEventListener('click', () => {
    addToCart(uploadedFileName, 499.00); 
});

// Buttons to add Marketplace Items to Cart
const marketButtons = document.querySelectorAll('.add-marketplace-item');
marketButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const name = e.target.getAttribute('data-name');
        const price = parseFloat(e.target.getAttribute('data-price'));
        addToCart(name, price);
    });
});

function addToCart(name, price) {
    cart.push({ id: Date.now(), name: name, price: price });
    updateCartUI();
    
    // Briefly change button text to show success
    const buttons = document.querySelectorAll(`button[data-name="${name}"]`);
    buttons.forEach(btn => {
        const originalText = btn.innerText;
        btn.innerText = "Added!";
        btn.style.background = "#2ed573";
        btn.style.color = "#fff";
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = "";
            btn.style.color = "";
        }, 1500);
    });
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function updateCartUI() {
    const container = document.getElementById('cart-items-container');
    const countDisplay = document.getElementById('cart-count');
    const subtotalDisplay = document.getElementById('cart-subtotal');
    const totalDisplay = document.getElementById('cart-total');

    // Update the notification number in the navbar
    countDisplay.textContent = cart.length;

    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart-msg">Your cart is currently empty. Add some items to get started!</p>';
        subtotalDisplay.textContent = 'Rs. 0';
        totalDisplay.textContent = 'Rs. 0';
        return;
    }

    // Clear and re-render cart list
    container.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
        subtotal += item.price;
        
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <span class="cart-item-price">Rs. ${item.price.toFixed(2)}</span>
            </div>
            <button class="remove-btn" data-id="${item.id}">Remove</button>
        `;
        container.appendChild(itemEl);
    });

    // Attach functionality to the new "Remove" buttons
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            removeFromCart(id);
        });
    });

    // Final Price Calculations
    subtotalDisplay.textContent = `Rs. ${subtotal.toFixed(2)}`;
    const total = subtotal + shippingCost;
    totalDisplay.textContent = `Rs. ${total.toFixed(2)}`;
}