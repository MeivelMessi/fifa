# FIFA 24 Match Tracker - Ziva vs Anirudh

A premium Apple-style React dashboard for tracking FIFA 24 matches between Ziva and Anirudh with beautiful charts, analytics, and weekly winner tracking.

## 🎯 Features

- **Match Entry Form**: Clean form to add match results with date picker
- **Head-to-Head Statistics**: Comprehensive stats for both players
- **Interactive Charts**: Bar chart, line chart, and pie chart with Recharts
- **Weekly Winner Tracking**: Automatic weekly grouping with champion highlights
- **Match History**: Complete history with winner highlighting
- **Apple-Style Design**: Premium UI with TailwindCSS and smooth animations
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Data Persistence**: Local storage saves all match data

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation

1. **Extract the zip file**
```bash
unzip ziva-anirudh-fifa-react.zip
cd ziva-anirudh-fifa
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm start
```

4. **Open your browser**
Navigate to `http://localhost:3000`

## 📁 Project Structure

```
ziva-anirudh-fifa/
├── public/
│   └── index.html
├── src/
│   ├── App.js          # Main React component
│   ├── index.js        # React entry point
│   └── index.css       # TailwindCSS styles
├── package.json        # Dependencies
├── tailwind.config.js  # TailwindCSS configuration
└── postcss.config.js   # PostCSS configuration
```

## 🎨 Design Features

### Apple-Style Design Elements
- **Typography**: SF Pro Display font family
- **Colors**: Apple blue (#007AFF), Apple green (#34C759)
- **Shadows**: Subtle shadows with hover effects
- **Animations**: Smooth transitions and fade-in effects
- **Cards**: Rounded corners with premium glassmorphism feel

### Responsive Design
- **Desktop**: Multi-column grid layouts
- **Tablet**: Responsive 2-column layouts  
- **Mobile**: Single-column stacked design
- **Smooth Breakpoints**: Seamless transitions between screen sizes

## 📊 Charts & Analytics

### Interactive Charts (Recharts)
1. **Bar Chart**: Goals scored by each player per match
2. **Line Chart**: Win rate trends over time
3. **Pie Chart**: Overall win/draw/loss distribution

### Analytics Dashboard
- Total matches played
- Goals per match average
- Current leader tracking
- Win percentages
- Weekly champion highlights

## 📱 Usage

1. **Add Matches**: Use the form to enter match results
2. **View Stats**: Real-time statistics update automatically  
3. **Analyze Performance**: Interactive charts show trends
4. **Weekly Champions**: See weekly winners with trophy highlights
5. **Match History**: Browse complete match history

## 🛠️ Customization

### Colors
Modify colors in `tailwind.config.js`:
```javascript
colors: {
  'apple-blue': '#007AFF',
  'apple-green': '#34C759',
  // Add your custom colors
}
```

### Sample Data
The app includes 8 sample matches. Modify `sampleMatches` in `App.js` to customize initial data.

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Netlify**: Drag & drop the `build` folder
- **Vercel**: Connect GitHub repository  
- **GitHub Pages**: Use `gh-pages` package
- **Firebase Hosting**: Use Firebase CLI

## 📋 Technologies

- **React 18**: Latest React with hooks
- **TailwindCSS**: Utility-first CSS framework
- **Recharts**: React charting library
- **Local Storage**: Data persistence
- **Apple Design**: Premium UI/UX principles

## 🎯 Perfect For

- FIFA gaming enthusiasts
- Friends tracking match results
- Learning React with real-world project
- Showcasing Apple-style design skills
- Portfolio projects

---

**Enjoy tracking your FIFA matches with this beautiful Apple-style dashboard!** ⚽🏆