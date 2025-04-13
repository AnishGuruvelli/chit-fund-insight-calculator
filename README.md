
# Chit Fund IRR Calculator - Android App

This project is a Chit Fund IRR (XIRR) Calculator that can be run as a web app or as a native Android application using Capacitor.

## Features

- Calculate Extended Internal Rate of Return (XIRR) for chit fund investments
- Visualize cash flows with interactive charts
- Export calculation results
- Responsive design that works well on mobile devices

## Running the Android App

To run this project as an Android app:

1. Export the project to your own Github repository via the "Export to Github" button
2. Git pull the project from your own Github repository
3. Run `npm install` to install the dependencies
4. Add Android platform by running:
   ```
   npx cap add android
   ```
5. Run `npm run build` to build the project
6. Run `npx cap sync` to sync the project to the Android platform
7. Run `npx cap open android` to open the project in Android Studio
8. Run the app on an emulator or physical device from Android Studio

## Web Development

To run the project locally for web development:

```
npm run dev
```

## Building for Production

```
npm run build
```

## Technology Stack

- React
- Tailwind CSS
- Capacitor for mobile app functionality
- Recharts for data visualization

