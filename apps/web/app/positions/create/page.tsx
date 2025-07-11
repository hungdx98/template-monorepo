import { PositionProvider } from "@/context";
import CreatePositionSreen from "@/views/CreatePositionScreen";

export default async function CreatePositionPage() {
  return (
    <PositionProvider>
      <CreatePositionSreen />
    </PositionProvider>
  );
} 