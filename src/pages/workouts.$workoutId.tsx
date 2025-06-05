import { ExerciseForm } from "@/components/excercise-form";
import { Header } from "@/components/header";
import { db } from "@/lib/dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router";

const WorkoutPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { workoutId } = useParams<{ workoutId: string }>();

  const workout = useLiveQuery(() => db.workouts.get(Number(workoutId)));
  const exercises = useLiveQuery(() =>
    db.exercises.where({ workoutId: Number(workoutId) }).sortBy("order")
  );

  if (!workout) {
    return null;
  }

  return (
    <>
      <Header title={workout.name} />
      <div className="p-4 space-y-2">
        {exercises?.map((exercise) => (
          <Link
            to={`/workouts/${workoutId}/exercises/${exercise.id}`}
            key={exercise.id}
            className="p-2 border rounded flex items-center gap-2"
          >
            {exercise.name}
          </Link>
        ))}
        <div
          role="button"
          onClick={() => setIsOpen(true)}
          className="p-2 text-muted-foreground border rounded flex items-center gap-1"
        >
          <PlusIcon className="size-5" />
          Add Exercise
        </div>
      </div>
      <ExerciseForm
        title="Add Exercise"
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        workoutId={Number(workoutId)}
      />
    </>
  );
};

export default WorkoutPage;
