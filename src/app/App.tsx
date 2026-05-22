import { RouterProvider } from "react-router";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { router } from "./routes";
import { AuthProvider } from "./providers/AuthProvider";
import { AudioProvider } from "./providers/AudioProvider";

function getBackend() {
  if (typeof window !== 'undefined' && 'ontouchstart' in window) {
    return TouchBackend;
  }
  return HTML5Backend;
}

export default function App() {
  return (
    <DndProvider backend={getBackend()}>
      <AuthProvider>
        <AudioProvider>
          <RouterProvider router={router} />
        </AudioProvider>
      </AuthProvider>
    </DndProvider>
  );
}
