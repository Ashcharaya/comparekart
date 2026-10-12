# CompareKart 🛒⚡
### Flipkart-Style Smart Product Comparison & Recommendation Engine (MERN Stack)

**CompareKart** is a production-quality e-commerce platform built on the MERN stack that helps users make smart, data-driven buying decisions. Users choose a category, specify their **budget**, pick their **must-have features**, and the recommendation algorithm calculates the highest-scoring products. Users can evaluate 2 to 4 items side-by-side with auto-generated comparison summaries, interactive Recharts price/rating analytics, track price drops across stores, and place demo orders with budget-limit warnings.

---

## 🌟 Key Features

1. **Smart Budget Finder (4-Step Wizard)**:
   - **Step 1**: Category selection (Clothes, Mobiles & Electronics, Sports & Toys, Beauty Products).
   - **Step 2**: Interactive budget slider & quick budget presets (₹1,000 to ₹75,000+).
   - **Step 3**: Dynamic category-specific must-have specifications checklist (e.g. 5G, 8GB RAM, 5000mAh battery, Pure Cotton, SPF 50).
   - **Step 4**: Ranked recommendation results featuring **"BEST MATCH"** (composite score) and **"BEST VALUE"** (rating per rupee) badges, along with explicit ticks and crosses for matched/missed features (e.g. *"Matches 4 of 5 features"*).

2. **Side-by-Side Product Comparison**:
   - Compare 2 to 4 products simultaneously.
   - Highlights the lowest price, highest rating, and feature differences in green.
   - **Recharts Analytics Bar Chart**: Dual-axis visualization comparing price vs. customer rating.
   - **Price vs. Budget Indicator**: Highlights whether items fit into the target budget and how much money is saved.
   - **Auto-Generated Natural Language Summary**: e.g., *"Product A is the best choice within your Rs. 20,000 budget because..."*
   - **Share Comparison via URL**: One-click link copying to preserve and share side-by-side matrices.

3. **Sticky Compare Tray**:
   - Fixed bottom tray with expandable slots, quick-removal buttons, and instant counter.

4. **Catalog & Multi-Facet Filtering**:
   - Filter by Category, Price range slider, Brand checklist, Minimum rating, and Color swatches (for Apparel).
   - Sorting by Price (Low to High / High to Low), Customer Rating, and Popularity.
   - Responsive grid with pagination and skeleton loaders.

5. **Flipkart-Style Product Detail Page**:
   - Image gallery with thumbnail selectors.
   - Specs matrix with organized feature breakdowns.
   - Multi-store price comparison (*"Available at"* stores with the lowest price highlighted).
   - Color swatch picker and size variant selection.
   - Add to Compare, Wishlist, Add to Cart, and Buy Now buttons.

6. **Cart with Budget Warning & Demo Checkout**:
   - Real-time cart calculations (subtotal, savings, delivery fee, total).
   - **Budget Limit Warning**: Alerts the user when cart total exceeds their target spending threshold.
   - Complete Demo Checkout with form validation (Name, 10-digit Phone, 6-digit Pincode, City, State, Address).
   - Payment method UI (UPI, Card, COD) clearly running in demo simulation mode.
   - Order confirmation with generated Order ID, delivery date estimate, and persistent order history.

7. **Auth & Wishlist Persistence**:
   - JWT authentication with secure password hashing (`bcryptjs`).
   - Wishlist toggle and local/cloud cart synchronization.
   - 1-Click Demo Account Login button (`demo@comparekart.com` / `password123`) for effortless grading and testing.

8. **Theme & Responsiveness**:
   - Dark mode & Light mode toggle with state persistence.
   - Fully responsive mobile-first UI with accessible keyboard navigation and semantic HTML5.

---

## 🏗️ Folder Structure

```
CompareKart/
├── client/
│   ├── public/assets/
│   └── src/
│       ├── components/
│       │   ├── BudgetSlider.jsx
│       │   ├── CartItem.jsx
│       │   ├── ColorSwatch.jsx
│       │   ├── CompareTable.jsx
│       │   ├── CompareTray.jsx
│       │   ├── FeatureSelector.jsx
│       │   ├── FilterSidebar.jsx
│       │   ├── Footer.jsx
│       │   ├── Loader.jsx
│       │   ├── Navbar.jsx
│       │   ├── ProductCard.jsx
│       │   ├── RatingStars.jsx
│       │   └── Toast.jsx
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   ├── CartContext.jsx
│       │   ├── CompareContext.jsx
│       │   └── ThemeContext.jsx
│       ├── hooks/
│       │   ├── useCart.js
│       │   ├── useCompare.js
│       │   └── useDebounce.js
│       ├── pages/
│       │   ├── About.jsx
│       │   ├── BudgetFinder.jsx
│       │   ├── Cart.jsx
│       │   ├── Checkout.jsx
│       │   ├── Compare.jsx
│       │   ├── Contact.jsx
│       │   ├── Home.jsx
│       │   ├── Listing.jsx
│       │   ├── Login.jsx
│       │   ├── MyOrders.jsx
│       │   ├── NotFound.jsx
│       │   ├── OrderSuccess.jsx
│       │   ├── ProductDetail.jsx
│       │   ├── Signup.jsx
│       │   └── Wishlist.jsx
│       ├── services/
│       │   ├── api.js
│       │   ├── orderService.js
│       │   └── productService.js
│       ├── utils/
│       │   ├── formatPrice.js
│       │   └── matchScore.js
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── cartController.js
│   │   ├── compareController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   └── recommendController.js
│   ├── data/
│   │   └── seed.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── compareRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   └── recommendRoutes.js
│   ├── server.js
│   └── package.json
├── .gitignore
├── README.md
└── package.json
```

---

## ⚙️ Recommendation & Value Formula

The recommendation engine evaluates all candidate products in the chosen category:

$$\text{Composite Score} = (\text{Feature Match } \% \times 0.5) + (\text{Normalized Rating } \% \times 0.3) + (\text{Budget Saving } \% \times 0.2)$$

- **Feature Match % (50%)**: Proportion of must-have specifications fulfilled (RAM, battery, 5G, fabric, ingredients, etc.).
- **Normalized Rating (30%)**: $(\text{rating} / 5.0) \times 100$.
- **Budget Saving % (20%)**: $((\text{budget} - \text{price}) / \text{budget}) \times 100$.
- **Best Value Metric**: Measures rating returned per rupee spent: $\frac{\text{rating}}{\text{price}} \times 10000$.

---

## 🚀 Getting Started & How to Run

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)
- *(Optional for local development)* Local **MongoDB** on `mongodb://127.0.0.1:27017`. If unavailable, the server uses an in-memory database for local development.

---

### Step 1: Install Dependencies

From the root `CompareKart/` directory:

```bash
# Install root, server, and client dependencies
npm run install:all
```

Or manually:

```bash
# In server/
cd server
npm install

# In client/
cd ../client
npm install
```

---

### Step 2: Configure Environment Variables

**Server Configuration (`server/.env`)**:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/comparekart
JWT_SECRET=comparekart_super_secret_jwt_key_2025
CLIENT_URL=http://localhost:5173
```

**Client Configuration (`client/.env`)**:
```env
# Optional. Leave unset to use /api (proxied to localhost:5000 by Vite).
VITE_API_URL=
```

### Public deployment (Render)

The included `render.yaml` deploys the client and API together as one public web service. Push this `CompareKart/` directory to a GitHub repository, then create a Render Blueprint from that repository. When Render prompts for `MONGO_URI`, provide a MongoDB Atlas connection string and allow the service to connect to that database. Render generates `JWT_SECRET` for the service. The app seeds missing catalog entries and creates the demo account on startup.

Production requires a persistent MongoDB connection. The in-memory database fallback is only used for local development, since public-host ephemeral storage would otherwise lose accounts and catalog data after restarts.

---

### Step 3: Seed Database (Optional)

The server automatically seeds itself on first launch if empty, but you can also seed manually:

```bash
npm run seed
# or inside server/:
node data/seed.js
```

**Seeded Demo Credentials**:
- **Email**: `demo@comparekart.com`
- **Password**: `password123`

---

### Step 4: Run the Application

#### Option A: Running Both Simultaneously
```bash
# From root directory:
npm run server    # Terminal 1: runs server on http://localhost:5000
npm run client    # Terminal 2: runs Vite client on http://localhost:5173
```

#### Option B: Running Individually

**Start Backend**:
```bash
cd server
npm start
```
*Output:* `🚀 CompareKart server running on port 5000 in development mode`

**Start Frontend**:
```bash
cd client
npm run dev
```
*Output:* `Local: http://localhost:5173/`

Open your browser at **`http://localhost:5173`**.

---

## 🧪 Testing the Core Flows

1. **Test Budget Finder**:
   - Click **"Budget Finder"** in the top navigation.
   - Pick **"Mobiles & Electronics Appliances"**.
   - Set budget to **₹30,000**.
   - Check **5G Connectivity**, **8GB+ RAM**, and **5000mAh+ Battery**.
   - Click **"Calculate Recommendations"** and inspect the **Best Match** badge, feature ticks/crosses, and savings calculations.

2. **Test Side-by-Side Comparison**:
   - Check the **"Compare"** checkbox on 2 to 4 products in the catalog.
   - The sticky compare tray pops up at the bottom.
   - Click **"Compare Now"** to view side-by-side spec differences, the **Recharts** bar chart, and the smart natural language summary.
   - Click **"Share Comparison"** to copy the permalink.

3. **Test Cart & Budget Exceeded Warning**:
   - Set your budget to ₹1,000 in the Budget Finder or Compare page.
   - Add a product priced at ₹24,999 to your cart.
   - Go to `/cart` and observe the **Budget Alert banner**: *"Warning: Your cart total (₹24,999) is ₹23,999 over your set budget limit of ₹1,000!"*

4. **Test Demo Checkout & Orders**:
   - Click **"Proceed to Checkout"**.
   - Log in using 1-click **"Auto Fill"** demo credentials (`demo@comparekart.com`).
   - Fill the address, choose UPI / Card / COD, and click **"Place Order"**.
   - View your order receipt on `/order-success` and review past fulfillment status under `/my-orders`.

---

## 🛠️ Common Errors & Fixes

1. **PowerShell `npm.ps1 cannot be loaded` execution policy error**:
   - *Cause*: Windows execution policy blocks unsigned PowerShell script execution.
   - *Fix*: Run commands using `npm.cmd` instead of `npm`, e.g., `npm.cmd start` or `npm.cmd run dev`.

2. **`ECONNREFUSED 127.0.0.1:27017`**:
   - *Cause*: MongoDB service is not started on the local machine.
   - *Fix*: For local development, CompareKart can switch to embedded `mongodb-memory-server`. Public deployments require a MongoDB Atlas connection string in `MONGO_URI`.

3. **CORS Error**:
   - *Cause*: Frontend calling a backend port not permitted by CORS headers.
   - *Fix*: Local Vite development proxies `/api` to `http://localhost:5000`. Production serves the client and API from the same public origin, so leave `VITE_API_URL` unset.

---

## 🔮 Future Improvements
- **Real-Time Price Drop Alerts**: Browser Push notifications when a wishlisted product drops below target price across any monitored store.
- **AI Spec Parsing**: OCR ingestion of product specification sheets directly via Gemini API.
- **User Reviews & Photo Uploads**: Community photo uploads and verified buyer badges.
- **Payment Gateway Integration**: Production Razorpay / Cashfree webhook integration for real INR payments.
