# LeadCRM

A lightweight CRM built for small businesses that don't need the complexity of enterprise tools. Manage leads, visualize your sales pipeline, and send bulk WhatsApp messages — all in one place.



---

## Features

### Lead Management
- Add, edit, and delete leads with a clean modal-based UI
- Status tagging — `New`, `In Progress`, `Closed`
- Searchable and filterable lead list

### Kanban Pipeline Board
- Drag-and-drop leads across sales stages
- Visual overview of your entire funnel at a glance

### Bulk WhatsApp Messaging
- Queue-based messaging system for sending messages to multiple leads
- Customizable message templates with placeholder support
- Live preview before sending

### Analytics Dashboard (Admin)
- Lead conversion stats and status breakdown
- Team-level overview for managers
- Clean charts and summary cards

### Responsive Design
- Mobile-first layout with slide-in sidebar navigation
- Bottom-sheet modals on small screens
- Consistent design system using Tailwind + shadcn/ui

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Tailwind CSS, shadcn/ui |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| HTTP | Axios, Fetch API |

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)

### Installation

```bash
# Clone the repo
git clone https://github.com/your-username/leadcrm.git
cd leadcrm
```

```bash
# Install server dependencies
cd server
npm install
```

```bash
# Install client dependencies
cd ../client
npm install
```

### Environment Variables

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

### Run Locally

```bash
# Start the backend
cd server
npm run dev

# Start the frontend (in a new terminal)
cd client
npm run dev
```

App runs at `http://localhost:5173` by default.


---

## Author

**Vikas** — Full Stack Developer  


