# Kindlr - A Nostr Kind Explorer

Kindlr is a modern, user-friendly Nostr client built with SolidJS that allows users to explore the various event kinds in the Nostr protocol. It's designed to help developers, users, and enthusiasts understand the different types of Nostr events and how they're structured.

## What is Kindlr?

Kindlr serves as both:

1. **A Nostr Event Explorer** - Visualize and explore different kinds of Nostr events in real-time
2. **A Learning Tool** - Understand the structure and purpose of various Nostr event kinds
3. **A Development Reference** - See how events are constructed and displayed for building your own Nostr applications

Key features:
- Real-time display of Nostr events from connected relays
- Detailed information about each Nostr event kind (based on NIPs)
- Different visualization modes: specialized components, fallback view, and raw JSON
- Dark/light theme support
- Responsive design for desktop and mobile

## Getting Started

```bash
# Install dependencies
$ npm install # or pnpm install or yarn install or bun install

# Start development server
$ npm run dev # or pnpm run dev or yarn run dev or bun run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

## Production Build

```bash
$ npm run build # or pnpm run build or yarn run build or bun run build
```

This creates an optimized production build in the `dist` folder.

## How to Contribute

Kindlr is an open-source project and welcomes contributions. Here's how you can help:

### Adding Support for New Event Kinds

1. Create a specialized component for the event kind:
   - Add a new component in `src/components/kind{NUMBER}/`
   - Implement the component to render the specific event kind
   - Register your component in `src/helpers/kinds.ts`

2. Enhance the fallback component:
   - Improve the generic event view in `src/components/kindFallback/`
   - Add better visualization for event fields

### Code Organization

Kindlr follows a modular structure:

- **`src/assets/`** - Static assets like images and icons
- **`src/components/`** - UI components
- **`src/helpers/`** - Utility functions and helpers
- **`src/routes/`** - Page definitions
- **`src/services/`** - Core services for Nostr functionality
- **`src/types/`** - TypeScript type definitions
- **`src/const.ts`** - Constants including event kind definitions

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Test thoroughly
5. Submit a pull request with a clear description of the changes

## Key Implementations

Kindlr is built on several important technologies and architectural patterns:

### 1. Applesauce Architecture

The application uses the [applesauce](https://hzrd149.github.io/applesauce/) library for Nostr event management:

- **EventStore** - Acts as a reactive in-memory database for Nostr events
- **QueryStore** - Wraps the EventStore to allow for computed state queries
- **RxNostr** - Provides reactive communication with Nostr relays
- **Loaders** - Specialized components for loading different types of Nostr events

### 2. SolidJS Framework

Kindlr leverages SolidJS for its reactivity system and performance benefits:

- Fine-grained reactivity
- Signal-based state management
- Efficient DOM updates
- Component model with JSX syntax

### 3. Helper System

The application includes a comprehensive helper system:

- **Event Content** - Utilities for working with event content
- **Event Tags** - Functions for processing Nostr event tags
- **JSON** - Tools for JSON processing and validation
- **Theme** - Dark/light theme management
- **Toast** - Toast notification system
- **Date** - Date formatting and manipulation helpers

### 4. Type System

Kindlr uses a centralized type system in `src/types/` to maintain code consistency:

- **Event Types** - Definitions for various Nostr event structures
- **UI Types** - Types for UI component props
- **Service Types** - Types for service interfaces

## Additional Resources

- [Applesauce Documentation](https://hzrd149.github.io/applesauce/)
- [SolidJS Documentation](https://www.solidjs.com/docs/latest/api)
- [Nostr Protocol](https://github.com/nostr-protocol/nips)
- [NIPs Documentation](https://github.com/nostr-protocol/nips)

## Deployment

The application is set up to deploy automatically to GitHub Pages when a new version is tagged with a version tag (e.g., `v1.0.0`). The deployment is handled by a GitHub Actions workflow defined in `.github/workflows/deploy.yml`.

### Creating a Release

To create a new release and deploy to GitHub Pages:

1. Tag your release:
   ```bash
   git tag v1.0.0  # Replace with the appropriate version
   git push origin v1.0.0
   ```

2. The GitHub Actions workflow will automatically build and deploy the tagged version.

3. Alternatively, you can manually trigger the workflow from the Actions tab in your GitHub repository.

Learn more about deploying your application with the [Vite documentation](https://vitejs.dev/guide/static-deploy.html)
