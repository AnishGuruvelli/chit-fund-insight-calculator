# ChitX - Chit Fund XIRR Calculator

## 🎯 Purpose

ChitX is a modern, user-friendly calculator designed to help users understand and evaluate their chit fund investments. It calculates the XIRR (Extended Internal Rate of Return) based on monthly payments, duration, and final payout, providing clear insights into investment performance.

## ✨ Key Features

### Core Functionality
- XIRR calculation for chit fund investments
- Monthly payment tracking
- Cash flow visualization
- Performance comparison with other investments
- Share results with others

### User Experience
- Beautiful purple theme
- Animated 3-second splash screen
- Smooth transitions and animations
- Responsive design for all devices
- Local/Formal language toggle

### Platform Support
- Web application (React + Tailwind)
- Android app (via Capacitor)
- Progressive Web App capabilities
- Offline support (upcoming)

## 🧮 Calculator Features

### Inputs
- Monthly Payment Amount
- Duration (in months)
- Total Amount Paid
- Received Amount
- Start Date

### Outputs
- Detailed Cash Flow Table
- Calculated XIRR
- Performance Badge
- Investment Comparisons
- Shareable Results

## 📱 Mobile Experience

### Android App
- Native Android experience
- Custom splash screen
- Material Design components
- Share integration
- Responsive UI

### Progressive Features
- Offline capability (planned)
- Push notifications (upcoming)
- Deep linking (planned)
- App shortcuts

## 🎨 Design System

### Theme
- Consistent purple color scheme
- Modern, clean interface
- Smooth animations
- Responsive layouts
- Dark mode support (upcoming)

### Components
- Custom form inputs
- Interactive charts
- Performance badges
- Share cards
- Loading states

## 🔄 Sample Calculation

### Example Input
```typescript
const sampleInput = {
  monthlyPayment: 10000,
  durationMonths: 24,
  totalPaid: 240000,
  receivedAmount: 300000,
  startDate: "2024-01-01"
};
```

### Example Output
```typescript
const sampleOutput = {
  xirr: 22.99,
  performanceBadge: "🔥 Phenomenal Returns!",
  comparison: {
    fixedDeposit: 6.0,
    ppf: 7.1,
    mutualFunds: 12.0
  }
};
```

## 🛠️ Technical Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- React Query for state
- Recharts for visualizations

### Mobile
- Capacitor for Android
- Native Android components
- Custom splash screen
- Platform-specific optimizations

### Build Tools
- Vite for development
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting

## 📈 Performance

### Metrics
- First load < 2s
- Time to interactive < 3s
- Animation FPS > 60
- App size < 5MB

### Optimizations
- Code splitting
- Lazy loading
- Image optimization
- Cache management

## 🔒 Security

### Data Handling
- No sensitive data storage
- Local calculations
- Secure sharing
- Privacy-focused

### Best Practices
- Input validation
- Error handling
- Secure dependencies
- Regular updates

## 🚀 Future Plans

### Short Term
- Dark mode implementation
- Export functionality
- More investment comparisons
- Performance optimizations

### Long Term
- iOS app development
- Advanced analytics
- Community features
- Investment recommendations

## 📚 Resources

### Documentation
- User Guide
- API Reference
- Theme Guide
- Contributing Guide

### Support
- GitHub Issues
- Email Support
- Feature Requests
- Bug Reports 