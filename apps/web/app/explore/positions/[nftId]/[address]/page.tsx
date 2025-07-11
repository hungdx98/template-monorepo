import { PoolDetailProvider } from "@/context/positionDetail";
import PositionDetailScreen from "@/views/PostionDetailScreen";

export default async function CreatePositionPage() {
  return (
    <PoolDetailProvider>
      <PositionDetailScreen />
    </PoolDetailProvider>
  );
} 