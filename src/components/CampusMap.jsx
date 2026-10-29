// Backward compatibility shim: CampusMap forwards directly to the clean Main Block interactive floor plan.
import MainBlockView from './MainBlockView';

export default function CampusMap() {
  return <MainBlockView />;
}
