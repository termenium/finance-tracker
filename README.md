# ExpenseFlow

A modern, beautiful expense tracking application built with Next.js, Supabase, and Tailwind CSS.

## Features

### 🚀 **Core Functionality**
- **Transaction Management**: Add, edit, and delete income/expense transactions
- **Real-time Analytics**: Beautiful charts and visualizations
- **CSV Export**: Export data in multiple formats
- **Smart Filtering**: Search and filter transactions by type, category, and date
- **Responsive Design**: Works perfectly on desktop and mobile

### 🔐 **Authentication & Security**
- **Supabase Auth**: Secure email/password authentication
- **Row Level Security**: Data is protected at the database level
- **Cloud Sync**: Automatic synchronization across devices
- **Local Fallback**: Works offline with local storage

### 📊 **Analytics & Insights**
- **Interactive Charts**: Pie charts, bar charts, line graphs, and area charts
- **Category Breakdown**: Visualize spending by category
- **Trend Analysis**: Track balance changes over time
- **Monthly Comparisons**: Compare income vs expenses by month

### 💾 **Data Management**
- **Cloud Storage**: Powered by Supabase PostgreSQL
- **Local Storage**: Offline capability with localStorage
- **Data Export**: CSV export with advanced filtering options
- **Data Sync**: Seamless sync between local and cloud storage

## Tech Stack

- **Frontend**: Next.js 13, React, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd expenseflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Copy your project URL and anon key
   - Create a `.env.local` file:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Set up the database**
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Run the migration script from `supabase/migrations/create_tables.sql`

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## Database Schema

### Tables

#### `profiles`
- User profile information
- Links to Supabase auth users
- Stores display name and avatar

#### `transactions`
- Financial transaction records
- Linked to user profiles
- Includes amount, category, type, and date

### Security

- **Row Level Security (RLS)** enabled on all tables
- Users can only access their own data
- Policies enforce data isolation between users

## Features in Detail

### Authentication
- Email/password signup and signin
- Password reset functionality
- Automatic profile creation
- Session management

### Transaction Management
- Add income and expense transactions
- Categorize transactions
- Set custom dates
- Real-time validation

### Analytics Dashboard
- Overview charts showing income vs expenses
- Category breakdown with pie charts
- Monthly comparison bar charts
- Balance trend line graphs

### Data Export
- Export all transactions or filtered subsets
- Multiple format options (formatted vs raw)
- Custom date ranges
- Professional CSV output

### Responsive Design
- Mobile-first approach
- Touch-friendly interface
- Adaptive layouts
- Smooth animations

## Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Add environment variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **Deploy**

### Other Platforms

The app is a standard Next.js application and can be deployed to any platform that supports Node.js.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on GitHub or contact the development team.