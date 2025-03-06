# SHENSTACK App Template

This project was generated with the SHENSTACK generator.

## SHENSTACK Tech Stack

- **Runtime**: [Bun](https://bun.sh/) - Ultra-fast JavaScript runtime
- **Frontend** (`/web`):
  - [Next.js](https://nextjs.org/) - React framework with App Router
  - [ShadCN](https://ui.shadcn.com/) - Beautifully designed components
  - [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS
  - [Framer Motion](https://www.framer.com/motion/) - Fluid animations
  - [Zustand](https://github.com/pmndrs/zustand) - Lightweight state management
  - [React Query](https://tanstack.com/query) - Data synchronization
  - [React Hook Form](https://react-hook-form.com/) - Form validation
  - [Zod](https://zod.dev/) - Schema validation
- **Backend** (`/api`):
  - [ElysiaJS](https://elysiajs.com/) - TypeScript HTTP framework
  - [DrizzleORM](https://orm.drizzle.team/) - Type-safe ORM
  - [Neon](https://neon.tech/) - Serverless Postgres

## Project Structure

This is a monorepo containing both the frontend and backend applications:

```
/
├── api/               # ElysiaJS API server
│   ├── src/
│   │   ├── db/       # Database setup and models
│   │   ├── routes/   # API routes
│   │   └── index.ts  # Server entry point
│   └── package.json
│
├── web/              # Next.js frontend
│   ├── src/
│   │   ├── app/      # Next.js App Router
│   │   ├── components/
│   │   │   ├── ui/   # ShadCN UI components
│   │   │   └── custom/
│   │   └── lib/      # Utilities and API client
│   └── package.json
│
└── package.json      # Monorepo root
```

## Getting Started

1. Install dependencies:

```bash
bun install
```

2. Create a `.env.local` file in the `/api` directory:

```env
# Database configuration
DATABASE_URL="postgres://user:password@localhost:5432/your_database"
```

3. Create a `.env.local` file in the `/web` directory:

```env
# API configuration
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

4. Run both applications in development:

```bash
bun dev
```

Or run them separately:

```bash
# Run API server
bun dev:api

# Run web application
bun dev:web
```

The API will be available at [http://localhost:3001](http://localhost:3001)
The web app will be available at [http://localhost:3000](http://localhost:3000)

## API Documentation

The API includes Swagger documentation at [http://localhost:3001/swagger](http://localhost:3001/swagger)

### Available Endpoints

- `GET /api/users` - List all users
- `POST /api/users` - Create a user
- `GET /api/users/:id` - Get a user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

## Database Management

Database operations are handled in the `/api` directory:

```bash
# Run database migrations
bun --cwd api db:push

# View database schema
bun --cwd api db:studio
```

## Learn More

To learn more about the SHENSTACK, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Bun Documentation](https://bun.sh/docs)
- [ElysiaJS Documentation](https://elysiajs.com/quick-start.html)
- [DrizzleORM Documentation](https://orm.drizzle.team/docs/overview)
- [ShadCN UI](https://ui.shadcn.com/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
