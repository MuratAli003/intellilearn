# IntelliLearn Frontend

A minimal, clean React frontend application for uploading PDFs and viewing AI-generated summaries, quiz questions, and flashcards.

## Tech Stack

- **React 18** (with Hooks)
- **Vite** (Build tool and dev server)
- **TailwindCSS** (Utility-first CSS)
- **Axios** (HTTP client)
- **React Router** (Navigation)

## Project Structure

```
donem_proje_react/
├── src/
│   ├── components/
│   │   └── Header.jsx          # Reusable header with navigation
│   ├── pages/
│   │   ├── UploadPage.jsx      # PDF upload form
│   │   ├── NotesPage.jsx       # Notes history list
│   │   └── NoteDetailPage.jsx  # Note details (summary, quiz, flashcards)
│   ├── services/
│   │   └── api.js              # Axios API service layer
│   ├── App.jsx                 # Main app with routing
│   ├── main.jsx                # React entry point
│   └── main.css                # TailwindCSS imports
├── index.html                  # HTML template
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # TailwindCSS configuration
└── postcss.config.js           # PostCSS configuration
```

## Installation

1. Install dependencies:
```bash
npm install
```

## Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## API Configuration

The app expects a Spring Boot backend running on `http://localhost:8080`.

The Vite dev server includes a proxy configuration in `vite.config.js` that forwards `/api/*` requests to the backend. You can adjust the proxy target if your backend runs on a different port.

### Backend Endpoints

- `POST /notes/upload` - Upload PDF file
- `GET /notes` - Get list of all notes
- `GET /notes/{id}` - Get note details by ID

## Component Responsibilities

### Header Component
- Displays application title "IntelliLearn"
- Navigation links to Upload and History pages

### UploadPage Component
- PDF file input with validation (PDF only)
- Upload button with loading state
- Error handling and display
- Redirects to note detail page on success

### NotesPage Component
- Displays table/list of all uploaded notes
- Shows file name and upload date
- Clickable items navigate to note details
- Loading and error states

### NoteDetailPage Component
- **Summary Section**: Displays document summary as readable text
- **Quiz Questions Section**: Renders questions with options and answers from JSON
- **Flashcards Section**: Interactive flashcard grid with click-to-flip functionality
- Handles JSON parsing for quiz and flashcard data
- Back navigation to notes list

### API Service (api.js)
- Centralized Axios configuration
- Functions for all API endpoints:
  - `uploadPDF(file)` - Upload PDF with FormData
  - `getNotes()` - Fetch all notes
  - `getNoteById(id)` - Fetch single note by ID

## Features

- ✅ Responsive design (desktop-first)
- ✅ Clean, academic-style UI
- ✅ PDF upload with validation
- ✅ Notes history with table view
- ✅ Detailed note view with sections
- ✅ Interactive flashcards (click to flip)
- ✅ Error handling
- ✅ Loading states
- ✅ React Router navigation

## Notes

- All components use functional components with hooks
- No global state management (uses local state only)
- TailwindCSS utility classes only (no custom CSS)
- Simple and minimal design as per requirements

