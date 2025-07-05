# Papyrus Admin Dashboard

A modern, responsive admin dashboard for managing the Papyrus book platform. Built with Next.js 15, TypeScript, Tailwind CSS, and Shadcn UI components.

## Features

### 🎯 Core Functionality
- **Dashboard Overview**: Comprehensive analytics with charts and statistics
- **Trending Books**: Monitor popular books and their performance metrics
- **User Management**: Complete user administration with search and filtering
- **Settings**: Comprehensive configuration options for the platform

### 📊 Analytics & Charts
- User growth trends over time
- Books added monthly statistics
- Trending keywords and categories
- Interactive charts using Recharts
- Real-time statistics cards

### 🎨 Modern UI/UX
- Responsive design that works on all devices
- Dark/light theme support
- Modern Shadcn UI components
- Smooth animations and transitions
- Intuitive navigation with sidebar

### 🔐 Authentication
- Secure login and signup pages
- Password visibility toggle
- Social authentication options (Google, Twitter)
- Remember me functionality
- Forgot password flow

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Charts**: Recharts
- **Icons**: Lucide React
- **State Management**: React Hooks

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd papyrus_admin
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
papyrus_admin/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── components/          # Reusable components
│   │   ├── ui/             # Shadcn UI components
│   │   └── dashboard-layout.tsx
│   ├── dashboard/          # Dashboard pages
│   │   ├── page.tsx        # Main dashboard
│   │   ├── trending/       # Trending books
│   │   ├── users/          # User management
│   │   └── settings/       # Settings page
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page (redirects to dashboard)
├── lib/
│   └── utils.ts            # Utility functions
└── public/                 # Static assets
```

## Pages Overview

### Dashboard (`/dashboard`)
- Overview statistics cards
- Interactive charts for user growth and book analytics
- Trending keywords and categories visualization
- Tabbed interface for different metrics

### Trending Books (`/dashboard/trending`)
- Table of trending books with engagement metrics
- View counts, likes, and ratings
- Trend indicators and growth percentages
- Action buttons for book management

### User Management (`/dashboard/users`)
- Comprehensive user table with search and filtering
- User status management (Active, Inactive, Suspended)
- Role-based user categorization
- User activity tracking

### Settings (`/dashboard/settings`)
- Profile information management
- Notification preferences
- Security settings and 2FA
- Appearance customization
- Third-party integrations
- API key management

### Authentication
- **Login** (`/login`): Secure authentication with social login options
- **Signup** (`/signup`): User registration with validation

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Customization

### Adding New Pages
1. Create a new directory in `app/dashboard/`
2. Add a `page.tsx` file with your component
3. Update the navigation in `dashboard-layout.tsx`

### Styling
- Global styles are in `app/globals.css`
- Component-specific styles use Tailwind CSS classes
- Shadcn UI components can be customized in their respective files

### Charts
- Charts are built using Recharts
- Data is currently mocked but can be easily connected to real APIs
- Chart configurations can be modified in the dashboard components

## API Integration

The dashboard is currently using mock data. To integrate with real APIs:

1. Create API service functions in a new `services/` directory
2. Replace mock data in components with API calls
3. Add proper error handling and loading states
4. Implement authentication middleware

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
