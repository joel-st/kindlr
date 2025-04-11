import { useParams } from "@solidjs/router";
import KindViewComponent from "../../../components/kind-view";
import { useKindEventLoader } from "../../../services/kind-view";

/**
 * Route component for displaying a kind view with a specific event and component variant
 * Path: /:kind/:componentKey/:eventId
 */
export default function KindComponentEventRoute() {
  const params = useParams();
  const kindNumber = parseInt(params.kind);
  const eventId = params.eventId;
  const componentKey = params.componentKey;
  
  const { event, loading } = useKindEventLoader(kindNumber, eventId);
  
  return (
    <KindViewComponent 
      kindNumber={kindNumber}
      event={event}
      loading={loading}
      componentKey={componentKey}
    />
  );
} 