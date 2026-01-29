# Memorial Bridge Frontend

**React 18 + TypeScript + Vite Frontend Application**

## Overview

This is the frontend application for Memorial Bridge, a platform for creating and sharing memorials while supporting charitable causes.

## Tech Stack

- **Framework:** React 18+
- **Language:** TypeScript 5+
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** Redux Toolkit
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Axios
- **Routing:** React Router v6
- **Notifications:** React Toastify
- **Date Handling:** Date-fns
- **Code Quality:** ESLint + Prettier

## Project Structure

```
src/
├── api/              # API client and endpoints
├── components/       # React components
│   ├── common/      # Reusable components
│   ├── layout/      # Layout components (Header, Footer)
│   └── features/    # Feature-specific components
├── pages/           # Page components
├── hooks/           # Custom React hooks
├── services/        # Business logic services
├── store/           # Redux state management
├── types/           # TypeScript interfaces
├── utils/           # Utility functions
├── styles/          # Global styles
├── App.tsx          # Main app component
└── main.tsx         # Entry point
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create .env file from template
cp .env.example .env

# Update VITE_API_BASE_URL if backend is on different port
```

### Development

```bash
# Start development server
npm run dev

# App will be available at http://localhost:5173
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Quality

```bash
# Format code
npm run format

# Lint code
npm run lint

# Lint and fix
npm run lint:fix
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Backend API
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_API_TIMEOUT=30000

# Stripe
VITE_STRIPE_PUBLIC_KEY=pk_test_YOUR_KEY

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_SENTRY=false
```

## API Integration

The API client is configured in `src/api/client.ts` with:
- Automatic JWT token injection
- Axios interceptors for request/response handling
- Error handling with redirect to login on 401
- Configurable timeout

### Usage

```typescript
import apiClient from '@api/client';

// Simple GET request
const response = await apiClient.get('/memorials');

// POST request with data
const response = await apiClient.post('/memorials', {
  name: 'John Doe',
  birth_date: '1950-05-15',
});
```

## State Management

Redux store with auth slice for authentication state. Access auth state with:

```typescript
import { useAuth } from '@hooks/index';

const { user, token, isAuthenticated } = useAuth();
```

## Custom Hooks

Available custom hooks:

- `useAuth()` - Get auth state and dispatch
- `useApi(url)` - Data fetching hook
- `useLocalStorage(key, initialValue)` - Local storage hook
- `useDebounce(value, delay)` - Debounce hook

## Forms

Using React Hook Form with Zod validation:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});
```

## Components

### Common Components

- `ErrorBoundary` - Error boundary for React errors
- `ProtectedRoute` - Route wrapper for authenticated routes
- `Button` - Reusable button component (to be created)
- `Input` - Reusable input component (to be created)
- `Modal` - Reusable modal component (to be created)

### Layout Components

- `Header` - Top navigation
- `Footer` - Footer

## Styling

Using Tailwind CSS utility-first CSS framework. Responsive breakpoints:

- `xs`: 0px (mobile)
- `sm`: 640px (small phone)
- `md`: 768px (tablet)
- `lg`: 1024px (desktop)
- `xl`: 1280px (large desktop)
- `2xl`: 1536px (extra large)

## Error Handling

Errors are handled at multiple levels:

1. **API Errors** - Caught by Axios interceptor
2. **Component Errors** - Caught by ErrorBoundary
3. **User Feedback** - Toast notifications via React Toastify

## Testing

Testing infrastructure will be set up in Epic 2.12:

- Jest for unit tests
- React Testing Library for component tests
- Cypress/Playwright for E2E tests
- Target: 80%+ coverage

## Performance

Optimization techniques:

- Code splitting with React.lazy
- Image optimization
- Lazy loading routes
- Memoization with useMemo/useCallback
- Virtual scrolling for large lists

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Port 5173 already in use

```bash
# Use different port
npm run dev -- --port 3000
```

### API connection errors

- Ensure backend is running on `http://localhost:8000`
- Check `VITE_API_BASE_URL` in `.env`
- Check browser console for CORS errors

### Build errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Contributing

1. Create feature branch: `git checkout -b feature/description`
2. Make changes following project guidelines
3. Write/update tests
4. Format code: `npm run format`
5. Lint code: `npm run lint:fix`
6. Create pull request

## Documentation

- [API Integration Guide](./docs/API.md) - Coming soon
- [Component Library](./docs/COMPONENTS.md) - Coming soon
- [State Management](./docs/STATE.md) - Coming soon

## Roadmap

- Epic 2.2: Authentication & Account Management
- Epic 2.3: Memorial Management UI
- Epic 2.4: Comments & Community
- Epic 2.5: Charity Management
- Epic 2.6: Admin Dashboard
- Epic 2.7: Pro Plan & Subscription
- Epic 2.8: Payment Integration
- Epic 2.9: Advanced Search
- Epic 2.10: Mobile Responsiveness
- Epic 2.11: Notifications
- Epic 2.12: Testing & QA
- Epic 2.13: Documentation & Deployment

## License

© 2026 Memorial Bridge. All rights reserved.

## Support

For issues or questions, please refer to the main project README or contact the team.
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
