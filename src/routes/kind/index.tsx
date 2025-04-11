import { useParams } from "@solidjs/router";
import KindViewComponent from "../../components/kind-view";
import { useKindEventLoader } from "../../services/kind-view";

/**
 * Route component for displaying a kind view without specific event
 * Path: /:kind
 */
export default function KindRoute() {
  const params = useParams();
  const kindNumber = parseInt(params.kind);
  
  const { event, loading } = useKindEventLoader(kindNumber);
  
  return (
    <KindViewComponent 
      kindNumber={kindNumber}
      event={event}
      loading={loading}
    />
  );
} 