# PrintFlow | Premium 3D Printing Marketplace

PrintFlow is a modern, interactive web application that allows users to upload custom 3D models (`.stl` files), preview them in a real-time 3D canvas, and order them for printing. It also features a curated marketplace for premium 3D-printed products with a fully functional shopping cart.

![PrintFlow Preview](images/hero-printer.jpg)

## ✨ Features

* **Interactive 3D Viewer:** Built with Three.js, allowing users to rotate, pan, and zoom around their uploaded `.stl` files.
* **Auto-Scaling & Centering:** The viewer automatically detects the bounding box of uploaded models to perfectly center and scale them within the viewport.
* **Dynamic Shopping Cart:** Add custom prints or marketplace items to the cart. It automatically calculates subtotals and shipping costs (in Rupees) and allows item removal.
* **Modern UI/UX:** A responsive, Dribbble-inspired design with colorful gradients, soft shadows, bouncy hover animations, and a premium tech startup feel.
* **Zero Backend Required:** Fully functional frontend using Vanilla JavaScript and ES Module imports.

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3, Vanilla JavaScript
* **3D Rendering:** Three.js (Loaded via ES modules & import maps)
* **Icons & Typography:** Google Fonts (Poppins)

## 🚀 How to Run Locally

Because this project uses modern JavaScript ES modules (to load Three.js), it must be run on a local server. Opening the `index.html` file directly from your file system will result in CORS errors.

**Prerequisites:** You need Python installed on your computer.

### Step 1: Clone the repository
```bash
git clone [https://github.com/amithosamani/3dstore.git](https://github.com/amithosamani/3dstore.git)
cd 3dstore

Step 2: Start a local Python HTTP server
  python -m http.server 8000

  Step 3: Open your browser
    Navigate to the following address in your web browser:
    http://localhost:8000