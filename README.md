# Portfolio Website

A modern, responsive portfolio website built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

- Responsive design that works on all device sizes
- Animated hero section with starry background
- Day/night theme support with automatic detection
- Project showcase section
- Skills and experience display
- Contact form
- Performance optimized animations and transitions

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd portfolio
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Building for Production

To create an optimized production build:

```bash
npm run build
# or
yarn build
```

## Deployment

### Vercel (Recommended)

The easiest way to deploy this website is to use [Vercel](https://vercel.com/), the platform from the creators of Next.js.

1. Sign up for a Vercel account
2. Import your GitHub repository
3. Vercel will automatically detect that you're using Next.js and set up the optimal build settings

### Netlify

You can also deploy on Netlify:

1. Sign up for a Netlify account
2. Import your GitHub repository
3. Use the following build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`

### Custom Server

To deploy on your own server:

1. Build the project
```bash
npm run build
```

2. Start the production server
```bash
npm run start
```

3. For a custom port (e.g., 3005):
```bash
npx next start -p 3005
```

## Customization

- Update personal information in the data files
- Modify theme colors in `tailwind.config.ts`
- Add your own projects to the projects section
- Customize animations in the CSS files

## Known Issues Fixed

- Fixed the "global" attribute warning on style tags
- Enhanced star blinking animation in dark mode
- Added cloud elements to the light mode background
- Fixed hydration warnings with suppressHydrationWarning
- Optimized animations for better performance

## License

This project is licensed under the MIT License.
