# Reservation Booking System

This is a Vue.js application for managing slot reservations and providing basic information about the organization. The application includes a sidebar for navigation and supports features like booking slots, downloading booking confirmation PDFs, and viewing details about the organization.

---

## Features

- **Slot Reservation:**
  - View available slots.
  - Book slots with name and civil ID.
  - Download booking confirmation as a PDF.

- **About Us Page:**
  - Provides information about the organization.

- **Sidebar Navigation:**
  - Expandable and collapsible sidebar with intuitive navigation.

---

## Technology Stack

- **Frontend:**
  - Vue.js 3
  - Vue Router
  - Vuex
  - Quasar UI Framework
  - Tailwind CSS

- **Backend API:**
  - This app integrates with a RESTful API

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- Node.js
- npm

---

## Installation

1. cd booking_system
2. npm install
3. npm run dev

## Backend URLs Configuration

To ensure the frontend communicates with the backend correctly, make sure the following environment variables are correctly configured in your `.env` file located at the root of your project:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/
VITE_API_BASE_QR_URL=http://127.0.0.1:8000
```

---

## Assumptions

1. Reservation Slot Duration: Each reservation slot is fixed at 60 minutes.
2. Slot Availability: Slots are available daily between 9:00 AM and 4:00 PM.
3. Weekly Calendar Scope: The booking system is designed to manage reservations on a weekly basis, focusing on short-term planning rather than long-term or yearly reservations.
