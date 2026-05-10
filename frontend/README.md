# Frontend for LegalIntel AI

Modern dark-themed Next.js + Tailwind CSS frontend for AI legal investigation platform.

## Setup

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Configure Environment

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

```bash
npm run build
npm start
```

## Features

### UI Components

- 🎨 Dark theme with glassmorphism design
- ✨ Smooth animations and transitions
- 📱 Fully responsive layout
- 🎯 Modern component architecture

### Sections

1. **Upload Section**
   - Drag-and-drop file upload
   - PDF validation
   - File size limits
   - Progress indication

2. **Workflow Section**
   - Animated agent workflow
   - Step-by-step processing visualization
   - Real-time status updates
   - Progress tracking

3. **Report Dashboard**
   - Key metrics display
   - Risk analysis visualization
   - Finding summary cards
   - Export functionality

4. **Timeline Section**
   - Document event timeline
   - Chronological event display
   - Amendment tracking
   - Status indicators

## Technologies

- **Next.js 14** - React framework
- **Tailwind CSS 3** - Utility-first CSS
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **TypeScript** - Type safety
- **Lucide Icons** - Icon library

## Directory Structure

```
frontend/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── favicon.ico
├── components/
│   ├── Header.tsx
│   ├── UploadSection.tsx
│   ├── WorkflowSection.tsx
│   ├── ReportDashboard.tsx
│   ├── TimelineSection.tsx
│   └── Footer.tsx
├── lib/
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```
