# 🔥 Refiners Media — Creative Design Agency Landing Page

A full-stack, responsive landing page for **Refiners Media** — a creative design agency specializing in graphic design, branding, social media design, and marketing creatives.

---

## 📁 Project Structure

```
refiners-media/
├── frontend/
│   ├── index.html          ← Main landing page (all sections)
│   ├── css/
│   │   └── styles.css      ← Custom CSS (CSS variables, animations, components)
│   └── js/
│       └── main.js         ← All frontend JS (API calls, animations, slider, etc.)
│
├── backend/
│   ├── server.js           ← Express.js backend server
│   └── data/
│       ├── projects.json   ← Projects database (JSON)
│       ├── testimonials.json ← Testimonials database (JSON)
│       └── contacts.json   ← Contact form submissions (auto-populated)
│
├── package.json
└── README.md
```

---

## 🚀 Running Locally

### Prerequisites
- **Node.js** v16+ — [Download here](https://nodejs.org)
- **npm** (comes with Node)

### Step 1 — Install dependencies
```bash
cd refiners-media
npm install
```

### Step 2 — Start the backend server
```bash
npm start
```
Or for live-reload during development:
```bash
npm run dev
```

### Step 3 — Open the site
The server serves both frontend and backend at:
```
http://localhost:3001
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

---

## 🔌 API Endpoints

| Method | Endpoint           | Description                              |
|--------|--------------------|------------------------------------------|
| GET    | `/api/projects`    | Fetch all projects (supports `?category=`)  |
| GET    | `/api/testimonials`| Fetch all testimonials                   |
| POST   | `/api/contact`     | Submit a contact/booking form            |
| GET    | `/api/contacts`    | View all contact submissions (admin)     |

### POST `/api/contact` — Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+234 800 000 0000",
  "designNeeded": "Brand Identity",
  "message": "I need a full rebrand for my business."
}
```

---

## 🌐 Deployment

### Frontend — Netlify

If you want to deploy just the frontend as a static site:

1. Go to [netlify.com](https://netlify.com) and create an account
2. Drag and drop the `/frontend` folder onto the Netlify dashboard
3. Your site will be live instantly!

Or via Netlify CLI:
```bash
npm install -g netlify-cli
netlify deploy --dir ./frontend --prod
```

**Note:** For the API calls to work on Netlify, update `API_BASE` in `frontend/js/main.js` to point to your deployed backend URL.

### Backend — Render

1. Push the full project to a GitHub repository
2. Go to [render.com](https://render.com) and create a new **Web Service**
3. Connect your GitHub repo
4. Set the following:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
5. Click **Deploy**

**After deploying on Render:**
- Copy your Render URL (e.g., `https://refiners-media-api.onrender.com`)
- Update `API_BASE` in `frontend/js/main.js`:
  ```js
  const API_BASE = 'https://refiners-media-api.onrender.com';
  ```

### Backend — Railway

1. Install Railway CLI: `npm install -g railway`
2. Login: `railway login`
3. Initialize: `railway init`
4. Deploy: `railway up`

---

## 🎨 Design Features

- **Dark theme** with vibrant fire-orange + gold accent palette
- **Bebas Neue** display font for bold headlines
- **Syne** for headings, **DM Sans** for body text
- Animated counter numbers
- Scroll-triggered reveal animations
- Marquee ticker with brand services
- Interactive project grid with filter + lightbox
- Auto-playing testimonials carousel
- Full-featured contact/booking form with validation
- WhatsApp floating button
- Page loader animation
- Fully responsive (mobile, tablet, desktop)

---

## 📞 Contact Details (Configured)

| Channel    | Detail                                          |
|------------|-------------------------------------------------|
| Email      | refinersmedia1@gmail.com                        |
| WhatsApp   | +234 907 557 6981                               |
| Pinterest  | https://www.pinterest.com/RefinersMedia/        |

---

## 🛠 Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | HTML5, CSS3, TailwindCSS (CDN), Vanilla JS |
| Backend  | Node.js, Express.js               |
| Database | JSON flat-file storage            |
| Fonts    | Google Fonts (Bebas Neue, Syne, DM Sans) |
| Images   | Unsplash (production: replace with real photos) |

---

## 📝 Customization Guide

### Changing Brand Colors
Edit CSS variables in `frontend/css/styles.css`:
```css
:root {
  --accent-fire: #FF4500;  /* Primary accent */
  --accent-gold: #FFB800;  /* Secondary accent */
}
```

### Adding Projects
Edit `backend/data/projects.json` to add/update projects.

### Adding Testimonials
Edit `backend/data/testimonials.json` to add/update testimonials.

### Updating Contact Details
Search and replace in `frontend/index.html`:
- `refinersmedia1@gmail.com`
- `2349075576981`
- `https://www.pinterest.com/RefinersMedia/`
