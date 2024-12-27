Vue.js Slot Reservation Application

This is a Vue.js application for managing slot reservations and providing basic information about the organization. The application includes a sidebar for navigation and supports features like booking slots, downloading booking confirmation PDFs, and viewing details about the organization.

---

Features:
1. Slot Reservation:
   - View available slots.
   - Book slots with name and civil ID.
   - Download booking confirmation as a PDF.

2. About Us Page:
   - Provides information about the organization.

3. Sidebar Navigation:
   - Expandable and collapsible sidebar with intuitive navigation.

---

Technology Stack:
- Frontend:
  - Vue.js 3
  - Vue Router
  - Vuex
  - Quasar UI Framework
  - Tailwind CSS

- Backend API:
  - This app integrates with a RESTful API.

---

Prerequisites:
Before you begin, ensure you have the following installed on your system:
- Node.js
- npm

---

Installation:
1. Navigate to the project directory:
   cd booking_system

2. Install dependencies:
   npm install

3. Start the development server:
   npm run dev

---

Backend URLs Configuration:
To ensure the frontend communicates with the backend correctly, make sure the following environment variables are correctly configured in your `.env` file located at the root of your project:

VITE_API_BASE_URL=http://127.0.0.1:8000/api/
VITE_API_BASE_QR_URL=http://127.0.0.1:8000
