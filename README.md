# 🏴‍☠️ Pirate Treasure Hunt Website

A highly immersive pirate-themed treasure hunt registration website built with React, Vite, and Tailwind CSS.

## Features

- **Cinematic Boot Screen**: Terminal-style system initialization with typing animations
- **Story Narration Page**: Parchment-styled story page with fade-in animations
- **Registration System**: Beautiful registration form with Firebase integration
- **Responsive Design**: Mobile-friendly interface with smooth animations
- **Firebase Integration**: Stores participant registrations in Firestore

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Backend**: Firebase Firestore
- **Configuration**: PostCSS + Autoprefixer

## Project Structure

```
pirate-hunt/
├── src/
│   ├── components/
│   │   ├── BootScreen.jsx
│   │   ├── StoryPage.jsx
│   │   └── RegistrationPage.jsx
│   ├── firebase/
│   │   └── firebaseConfig.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Configure Firebase**
   - Replace the placeholder values in `src/firebase/firebaseConfig.js` with your Firebase project credentials
   - Get your credentials from [Firebase Console](https://console.firebase.google.com/)

3. **Start Development Server**
```bash
npm run dev
```

4. **Build for Production**
```bash
npm run build
```

5. **Preview Build**
```bash
npm run preview
```

## Firebase Setup

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com/)
2. Enable Firestore Database
3. Create a collection named `treasure_hunt_participants`
4. Go to Project Settings and copy your Firebase config
5. Paste the config into `src/firebase/firebaseConfig.js`

### Firestore Collection Structure

Collection: `treasure_hunt_participants`

Document fields:
- `id`: Auto-generated participant ID
- `name`: Participant's full name
- `email`: Participant's email
- `phone`: Participant's phone number
- `college`: Participant's college/department
- `teamName`: Team name (optional, defaults to "Solo Explorer")
- `participantID`: Unique pirate-themed ID (format: PIRATE-XXXXX-XXXXXX)
- `timestamp`: Server timestamp of registration

## Features Overview

### Page 1: Boot Screen
- Cinematic terminal-style loading screen
- Sequential boot messages with typing animation
- Compass animation effects
- Auto-transitions to Story Page after 4 seconds

### Page 2: Story Page
- Parchment textured background
- Engaging treasure hunt story with fade-in animations
- Decorative pirate elements (compass, anchor, sword)
- "START THE HUNT" button to proceed to registration

### Page 3: Registration
- Beautiful parchment-styled form
- Form validation (email, phone number)
- Auto-generated participant IDs
- Firebase Firestore integration
- Success confirmation screen with participant ID
- Mobile responsive design

## Design Features

- **Pirate Theme**: Dark cinematic colors, gold accents, parchment textures
- **Animations**: Smooth transitions using Framer Motion
- **Typography**: Serif fonts for authentic pirate aesthetics
- **Responsive**: Fully mobile-responsive with Tailwind CSS
- **Accessibility**: Proper contrast and readable text

## Color Palette

- Dark: `#0a0e27`
- Navy: `#1a2847`
- Gold: `#d4af37`
- Parchment: `#deb887`
- Accent Red: `#c41e3a`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - Feel free to use for your projects!

## Support

For issues or questions, please check the Firebase documentation or React/Vite official docs.

---

*May fortune favor the bold! ⚓🏴‍☠️*
