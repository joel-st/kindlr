/**
 * Home page view.
 * Main landing page for authenticated users showing their primary content.
 * Displays Nostr events for different kinds in a filterable grid layout.
 */

import Header from "../components/header";
import { EVENT_KINDS } from "../const";
import KindFilterContainer from "../components/search/kind-filter-container";

/**
 * Home view component that serves as the main landing page.
 * Displays the latest events for various Nostr kinds with search and filter capabilities.
 * 
 * @returns The home page component
 */
function HomeView() {
  return (
    <>
      <Header />
      <main class="max-w-screen-2xl mx-auto p-4 flex flex-col gap-4">
        <KindFilterContainer kinds={EVENT_KINDS} />
      </main>
    </>
  );
}

export default HomeView;
