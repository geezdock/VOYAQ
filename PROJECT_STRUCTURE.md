# Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (dashboard)/              # Dashboard route group
│   │   ├── dashboard/            # Dashboard page
│   │   ├── notifications/        # Notifications page
│   │   ├── profile/              # Profile page
│   │   └── layout.tsx            # Dashboard layout
│   ├── api/                      # API route handlers
│   │   ├── ai/suggest/
│   │   ├── budget/
│   │   ├── events/
│   │   ├── overview/
│   │   ├── places/
│   │   ├── safety/
│   │   ├── transport/
│   │   └── weather/
│   ├── auth/callback/
│   ├── consent/
│   ├── create/
│   ├── how-it-works/
│   ├── join/[code]/
│   ├── safety/
│   ├── settings/
│   ├── trip/[id]/hub/
│   ├── workspace/[id]/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── constants/          # App-wide constants
├── features/           # Feature-first modules
│   ├── auth/
│   ├── dashboard/
│   ├── demo/
│   ├── destination/
│   ├── how-it-works/
│   ├── landing/
│   ├── safety/
│   ├── trip/
│   └── workspace/
├── services/           # Backend service layer
│   └── supabase/
├── shared/             # Shared components, hooks, providers, mock
├── types/              # TypeScript type definitions
└── utils/              # Utility functions