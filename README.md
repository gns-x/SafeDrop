# SafeDrop - School Pickup Management System

A comprehensive, real-time school pickup management system built with React, TypeScript, and modern web technologies. SafeDrop streamlines the student pickup process while ensuring maximum security and efficiency.

## 🚀 Features

### For Parents
- Real-time student status tracking
- Location-based pickup requests
- Push notifications for pickup status changes
- Secure access code authentication
- Multi-student management
- Search and filter capabilities

### For Teachers
- Live dashboard of student statuses
- Quick status updates
- Pickup request management
- Grade-specific student filtering
- Real-time notifications
- Comprehensive student information

### For Administrators
- Complete system oversight
- Analytics and reporting
- User management
- Security controls
- Pickup location management

## 🛠 Technology Stack

- **Frontend**: React 18.3.1
- **State Management**: React Query
- **Real-time Updates**: Pusher.js
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Type Safety**: TypeScript
- **API Client**: Axios
- **Notifications**: React Hot Toast
- **Charts**: Recharts
- **Build Tool**: Vite

## 🔒 Security Features

- Role-based access control (Parent/Teacher/Admin)
- Secure access code authentication
- Location verification for pickup requests
- Real-time status tracking
- Audit trail for all actions

## 📱 Key Components

### Authentication
- Separate login flows for parents, teachers, and administrators
- Secure token-based authentication
- Session management
- Access code validation

### Dashboard
- Role-specific dashboards
- Real-time status updates
- Interactive student cards
- Search and filtering capabilities
- Analytics visualization

### Pickup Management
- Location-based verification
- Status tracking system
- Push notifications
- Parent-teacher communication
- Audit logging

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/your-username/safedrop.git
```

2. Install dependencies:
```bash
cd safedrop
npm install
```

3. Set up environment variables:
```env
VITE_API_URL=your_api_url
VITE_PUSHER_KEY=your_pusher_key
VITE_PUSHER_CLUSTER=your_pusher_cluster
```

4. Start the development server:
```bash
npm run dev
```

## 📦 Build & Deployment

1. Create a production build:
```bash
npm run build
```

2. Deploy to your preferred hosting platform:
```bash
npm run deploy
```

## 🔧 Configuration

### Pusher Setup
Configure real-time messaging in `src/services/pusher.service.ts`:
```typescript
const pusher = new Pusher({
  key: import.meta.env.VITE_PUSHER_KEY,
  cluster: import.meta.env.VITE_PUSHER_CLUSTER,
});
```

### API Configuration
Set up API endpoints in `src/config/constants.ts`:
```typescript
export const API_URL = import.meta.env.VITE_API_URL;
```

## 🌟 Best Practices

- Type safety with TypeScript
- Component-based architecture
- Real-time data synchronization
- Responsive design
- Error handling and logging
- Performance optimization
- Security best practices

## 📚 Documentation

Detailed documentation for each component and service is available in their respective directories:

- `/src/components` - UI components
- `/src/services` - API and business logic
- `/src/types` - TypeScript interfaces and types
- `/src/pages` - Page components
- `/src/hooks` - Custom React hooks

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React Team
- Vite Team
- Tailwind CSS Team
- All contributors and maintainers

For more information, please contact the development team or refer to the internal documentation.