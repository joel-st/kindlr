import { useParams } from "@solidjs/router";
import KindViewComponent from "../../components/kind-view";
import { useKindEventLoader } from "../../services/kind-view";

/**
 * Route component for displaying a kind view with a specific event
 * Path: /:kind/:eventId
 */
export default function KindEventRoute() {
  const params = useParams();
  const kindNumber = parseInt(params.kind);
  const eventId = params.eventId;
  
  const { event, loading } = useKindEventLoader(kindNumber, eventId);
  
  return (
    <KindViewComponent 
      kindNumber={kindNumber}
      event={event}
      loading={loading}
    />
  );
} 