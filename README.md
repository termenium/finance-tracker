# ExpenseFlow

A modern, beautiful expense tracking application built with Next.js and Tailwind CSS.

## 🚀 Features

### 💰 **Core Functionality**
- **Transaction Management**: Add, edit, and delete income/expense transactions
- **Real-time Analytics**: Beautiful charts and visualizations
- **CSV Import/Export**: Import existing data and export for backup
- **Smart Filtering**: Search and filter transactions by type, category, and date
- **Responsive Design**: Works perfectly on desktop and mobile

### 📊 **Analytics & Insights**
- **Interactive Charts**: Pie charts, bar charts, line graphs, and area charts
- **Category Breakdown**: Visualize spending by category
- **Trend Analysis**: Track balance changes over time
- **Monthly Comparisons**: Compare income vs expenses by month
- **Advanced Statistics**: Monthly trends, averages, and insights

### 💾 **Data Management**
- **Local Storage**: All data stored locally in your browser
- **Privacy First**: No servers, no tracking, your data stays with you
- **Data Export**: CSV export with advanced filtering options
- **Import Support**: Import transactions from CSV files

## 🛠 Tech Stack

- **Frontend**: Next.js 13, React, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

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

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Deploy with default settings

3. **Custom Domain (Optional)**
   - Add your custom domain in Vercel dashboard
   - Update `NEXT_PUBLIC_APP_URL` in environment variables

### Manual Deployment

```bash
npm run build
npm run export
```

The static files will be in the `out` directory.

## 🎨 Features in Detail

### Transaction Management
- Add income and expense transactions
- Categorize transactions with predefined categories
- Set custom dates and amounts
- Edit existing transactions
- Real-time validation and error handling

### Analytics Dashboard
- Overview charts showing income vs expenses
- Category breakdown with interactive pie charts
- Monthly comparison bar charts
- Balance trend line graphs
- Advanced filtering and date range selection

### Data Import/Export
- Import transactions from CSV files
- Export all transactions or filtered subsets
- Multiple format options (formatted vs raw)
- Sample CSV template download
- Error handling and validation during import

### Responsive Design
- Mobile-first approach
- Touch-friendly interface
- Adaptive layouts for all screen sizes
- Smooth animations and micro-interactions
- Optimized for performance

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🔒 Privacy & Security

- **Local Storage Only**: All data stays in your browser
- **No Tracking**: No analytics, no cookies, no data collection
- **Open Source**: Full transparency in code
- **Offline Capable**: Works without internet connection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Charts powered by [Recharts](https://recharts.org/)
- Icons from [Lucide](https://lucide.dev/)

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

---

**ExpenseFlow** - Modern expense tracking for the next generation 🚀