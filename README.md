# OSINT Tools Directory

A sleek, fast, and responsive single-page OSINT (Open Source Intelligence) tools directory built with **React** + **TailwindCSS** + **ShadCN/UI**. Inspired by [start.me OSINT collection](https://start.me/p/0Pqbdg/osint-500-tools), this app allows you to explore, search, filter, and manage your favorite OSINT tools in an intuitive way.

---

## ✨ Features

- **🔍 Fast Search** — Instantly search across tool names, descriptions, and tags.
- **📂 Filter by Category** — Organize tools by their purpose.
- **🏷️ Tag Filtering** — Explore tools via powerful tag-based navigation.
- **⭐ Favorites** — Bookmark your go-to tools (persisted in `localStorage`).
- **📊 Trending Score** — Sort tools based on popularity or alphabetical order.
- **🌗 Dark / Light Mode** — Toggle between themes seamlessly.
- **📋 Copy Tool URLs** — One-click copy for easy sharing.
- **📥 Import Tools** — Paste a JSON dataset to add or update tools.
- **⚡ Responsive Design** — Works perfectly on desktop and mobile.
- **🛠 Easy Customization** — Replace the sample data with your dataset or connect a JSON API.

---

## 🖼️ Demo

![App Preview](./screenshot.png)

> *(Add a screenshot of your app UI here)*

---

## 🚀 Getting Started

### 1️⃣ Clone the Repo
```bash
git clone https://github.com/psychoraa/osint-tools-directory.git
cd osint-tools-directory
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Run Development Server
```bash
npm run dev
```
Your app will be live at **http://localhost:5173** (if using Vite).

### 4️⃣ Build for Production
```bash
npm run build
```

---

## 🗂️ Project Structure
```
osint-tools-directory/
├── src/
│   ├── App.jsx          # Main application component
│   ├── components/      # Reusable UI components
│   ├── data/            # Replace SAMPLE_TOOLS.json with your dataset
│   └── styles/          # Tailwind & custom styles
├── public/
│   └── screenshot.png   # App preview
├── package.json
└── README.md
```

---

## 📦 Data Import

You can replace the **SAMPLE_TOOLS** array in `App.jsx` or import tools from a JSON file at runtime.

**Example JSON Structure:**
```json
[
  {
    "id": "shodan",
    "name": "Shodan",
    "url": "https://www.shodan.io/",
    "category": "Infrastructure",
    "description": "Search engine for internet-connected devices and services.",
    "tags": ["ip", "port-scan", "iot", "recon"],
    "trending": 98
  }
]
```

---

## 🎨 Customization

- **Colors & Theme:** Tweak Tailwind config to match your branding.
- **Dataset:** Replace `SAMPLE_TOOLS` with your own OSINT tools.
- **Branding:** Add your logo in the header and customize meta tags.

---

## 🛡️ License

This project is licensed under the **MIT License** — feel free to modify and share.

---

## 🤝 Contributing

1. Fork the repository
2. Create a new branch (`feature/my-feature`)
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---

## 📬 Contact

For suggestions or collaborations, feel free to reach out:
- **Email:** mrravi63bgp@gmail.com
- **GitHub:** [@psychoraa](https://github.com/psychoraa)

---

**Built with ❤️ for OSINT researchers, investigators, and cybersecurity professionals.**
