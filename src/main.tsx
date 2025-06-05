import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import WorkoutPage from "./pages/workouts.$workoutId";
import IndexPage from "./pages/index";
import ExercisePage from "./pages/exercises.$exerciseId";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/workouts/:workoutId" element={<WorkoutPage />} />
        <Route
          path="/workouts/:workoutId/exercises/:exerciseId"
          element={<ExercisePage />}
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
