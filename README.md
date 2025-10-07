# Poultry360 Admin Dashboard

Modern Next.js 14 admin dashboard for the Poultry360 farm management platform. This dashboard provides comprehensive tools for managing farms, flocks, production records, and analytics.

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4
- **State Management**: Zustand 5.0
- **Charts**: Recharts 3.2
- **HTTP Client**: Axios 1.12
- **Date Handling**: date-fns 4.1
- **Testing**: Jest 30 + React Testing Library 16

## Features

- Dashboard analytics with real-time metrics
- Farm management (CRUD operations)
- Flock/batch tracking and monitoring
- Production record management (eggs, feed, mortality)
- Health records and medication tracking
- Sales and expense management
- User and organization management
- Analytics and reporting
- Responsive design for all devices
- TypeScript for type safety
- Comprehensive test coverage

## Prerequisites

Before running the admin dashboard, ensure you have:

- Node.js 20+ installed
- npm or yarn package manager
- Backend API running (default: http://localhost:3006/api)

## Installation

1. Clone the repository and navigate to the admin directory:
   ```bash
   cd admin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and update:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3006/api
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm run lint` - Run ESLint code quality checks
- `npm test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report

## Project Structure

```
admin/
├── app/                      # Next.js App Router pages
│   ├── dashboard/           # Dashboard page and layout
│   ├── farms/               # Farms management pages
│   ├── flocks/              # Flocks management pages
│   ├── records/             # Production records pages
│   ├── login/               # Authentication pages
│   ├── register/            # Registration page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home/landing page
│   ├── error.tsx            # Error boundary
│   └── loading.tsx          # Loading state
├── components/              # Reusable React components
│   ├── Sidebar.tsx          # Navigation sidebar
│   ├── Header.tsx           # Page header
│   └── __tests__/           # Component tests
├── lib/                     # Utility libraries
│   ├── api.ts               # API client
│   ├── logger.ts            # Logging service
│   ├── utils.ts             # Utility functions
│   └── __tests__/           # Library tests
├── stores/                  # Zustand state stores
│   ├── authStore.ts         # Authentication state
│   ├── farmStore.ts         # Farm state
│   ├── batchStore.ts        # Batch state
│   └── __tests__/           # Store tests
├── providers/               # React context providers
│   ├── AuthProvider.tsx     # Auth context
│   └── ToastProvider.tsx    # Toast notifications
├── types/                   # TypeScript type definitions
│   └── index.ts             # Shared types
├── constants/               # Application constants
├── public/                  # Static assets
├── .env.example             # Environment variables template
├── jest.config.js           # Jest configuration
├── jest.setup.js            # Jest setup file
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── next.config.mjs          # Next.js configuration
```

## Environment Variables

All environment variables must be prefixed with `NEXT_PUBLIC_` to be accessible in the browser.

Required variables (see `.env.example`):
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_APP_NAME` - Application name
- `NEXT_PUBLIC_APP_VERSION` - Application version

## API Integration

The dashboard communicates with the Poultry360 backend API through the centralized API client (`lib/api.ts`).

### Authentication

The application uses JWT token-based authentication:
1. User logs in with username/password
2. Backend returns JWT token
3. Token is stored in localStorage as `adminToken`
4. Token is automatically added to all API requests via Axios interceptor
5. If token expires (401 response), user is redirected to login

### API Client Usage

```typescript
import api from '@/lib/api';

// Login
const response = await api.login('user@example.com', 'password');

// Fetch farms
const farms = await api.getFarms(page, limit);

// Create farm
const newFarm = await api.createFarm({
  name: 'My Farm',
  location: 'Nairobi',
  capacity: 1000,
  farm_type: 'layer',
});
```

## State Management

The application uses Zustand for state management. Each domain has its own store:

```typescript
import { useAuthStore } from '@/stores/authStore';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuthStore();

  // Use state and actions
}
```

## Testing

The application uses Jest and React Testing Library for testing.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Writing Tests

Tests are co-located with the code in `__tests__` directories:

```typescript
import { render, screen } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## Logging

The application includes a centralized logging service (`lib/logger.ts`):

```typescript
import { logger } from '@/lib/logger';

// Log messages
logger.info('User logged in', { userId: 123 });
logger.error('Failed to fetch data', error);
logger.warn('Deprecated feature used');
logger.debug('Debug information');

// Get recent logs (useful for debugging)
const recentLogs = logger.getRecentLogs(50);
```

## Styling

The application uses Tailwind CSS for styling:

```tsx
<div className="bg-white rounded-lg shadow-md p-4">
  <h2 className="text-2xl font-bold text-gray-800">Title</h2>
</div>
```

Utility functions for conditional classes:

```typescript
import { cn } from '@/lib/utils';

<button className={cn(
  'px-4 py-2 rounded',
  isActive ? 'bg-blue-500' : 'bg-gray-300'
)}>
  Button
</button>
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Common Issues

### API Connection Issues

If the dashboard cannot connect to the backend:
1. Verify the backend is running on the correct port
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Ensure CORS is properly configured on the backend

### Authentication Issues

If login fails or redirects occur unexpectedly:
1. Check browser console for errors
2. Verify token in localStorage (`adminToken`)
3. Check backend authentication endpoint

### Build Errors

If build fails:
1. Delete `.next` folder and `node_modules`
2. Run `npm install`
3. Run `npm run build`

## Browser Support

The dashboard supports:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create a feature branch
2. Make your changes
3. Write tests for new features
4. Ensure all tests pass
5. Submit a pull request

## License

Copyright 2024 Poultry360. All rights reserved.

## Support

For issues or questions:
- Email: support@poultry360.com
- Documentation: https://docs.poultry360.com
- Backend Repository: ../backend/api/