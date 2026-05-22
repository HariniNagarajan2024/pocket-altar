import { RouterProvider } from "react-router";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { router } from "./routes";
import { AuthProvider } from "./providers/AuthProvider";
import { AudioProvider } from "./providers/AudioProvider";

export default function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <AuthProvider>
        <AudioProvider>
          <RouterProvider router={router} />
        </AudioProvider>
      </AuthProvider>
    </DndProvider>
  );
}
