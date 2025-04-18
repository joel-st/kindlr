/**
 * Main application entry point.
 * Sets up the SolidJS application with routing
 * and renders the application to the DOM.
 */
import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";
import "solid-devtools";

// styles 
import "./index.css";

// services
import "./services/lifecycle";

// routes
import HomeView from "./routes/home";
import NotFoundView from "./routes/404";
import KindView from "./routes/kind/index";
import KindEventView from "./routes/kind/[event-id]";
import KindComponentEventView from "./routes/kind/[component-key]/[event-id]";

const root = document.getElementById("root");
// Determine the base path for router (for GitHub Pages support)
// Use a more robust way to detect if we're running on GitHub Pages
const isGitHubPages = location.hostname.includes('github.io') || location.pathname.includes('/kindlr');
// Make sure base path has trailing slash for GitHub Pages
const basePath = isGitHubPages ? '/kindlr/' : '/';

/**
 * Renders the application to the DOM.
 * Sets up the Router with routes for the home page and a 404 page.
 */
render(
  () => (
    <>
      <Router base={basePath}>
        <Route path="/" component={HomeView} />
        <Route path="/:kind" component={KindView} />
        <Route path="/:kind/:eventId" component={KindEventView} />
        <Route path="/:kind/:componentKey/:eventId" component={KindComponentEventView} />
        <Route path="*" component={NotFoundView} />
      </Router>
    </>
  ),
  root!,
);
