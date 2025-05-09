# CheckGate - Online Checkers Game

CheckGate is a fully-featured checkers game with both local and online multiplayer capabilities. Play against a friend locally, challenge the AI, or compete with players online.

## Features

- **Multiple Game Modes**: Play offline, against AI, or online with other players
- **AI Opponents**: Three difficulty levels - Easy, Medium, and Hard
- **User Accounts**: Register and login to track your games and statistics
- **Real-time Gameplay**: Powered by Socket.io for instant moves and updates
- **Responsive Design**: Play on any device with a beautiful, animated interface

## Technologies Used

### Frontend
- React.js with Vite
- Tailwind CSS for styling
- Socket.io client for real-time communication
- Framer Motion for animations

### Backend
- Node.js with Express
- MongoDB Atlas for database
- Socket.io for real-time game updates
- JWT authentication

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jigyash-argh/Checkers.git
cd Checkers
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following:
```
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
```

4. Start the development server:
```bash
npm run dev:full
```

5. Open your browser and navigate to `http://localhost:5173`

## Running in Production

1. Build the frontend:
```bash
npm run build
```

2. Start the server:
```bash
npm run server
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
 
 