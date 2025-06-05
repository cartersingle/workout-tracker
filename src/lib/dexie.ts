import Dexie, { type EntityTable } from "dexie";

interface Workout {
  id: number;
  name: string;
}

interface Exercise {
  id: number;
  name: string;
  targetReps: number;
  order: number;
  workoutId: number;
}

interface Set {
  id: number;
  reps: number;
  weight: number;
  exerciseId: number;
  completedAt: number;
}

const db = new Dexie("WorkoutsDatabase") as Dexie & {
  workouts: EntityTable<Workout, "id">;
  exercises: EntityTable<Exercise, "id">;
  sets: EntityTable<Set, "id">;
};

db.version(1).stores({
  workouts: "++id, name",
  exercises: "++id, name, targetReps, order, workoutId",
  sets: "++id, reps, weight, exerciseId, completedAt",
});

export type { Workout, Exercise, Set };
export { db };
