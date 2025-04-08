/**
 * Main application entry point.
 * Sets up the SolidJS application with routing, toast notifications,
 * and renders the application to the DOM.
 */
import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";
import "solid-devtools";

// styles 
import "./index.css";

// theme
import { setupThemeSwitcher } from "./helpers/theme";
setupThemeSwitcher();

// services
import "./services/lifecycle";

// routes
import HomeView from "./routes/home";
import NotFoundView from "./routes/404";

const root = document.getElementById("root");

/**
 * Renders the application to the DOM.
 * Sets up the Router with routes for the home page and a 404 page.
 */
render(
  () => (
    <>
      <Router base="">
        <Route path="/" component={HomeView} />
        <Route path="*" component={NotFoundView} />
      </Router>
    </>
  ),
  root!,
);
