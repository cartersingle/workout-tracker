import { Header } from "@/components/header";
import { db, type Exercise, type Set } from "@/lib/dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { DumbbellIcon, PencilIcon, PlusIcon, TargetIcon } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";
import { SetForm } from "@/components/set-form";
import { isToday } from "date-fns";
import { ExerciseForm } from "@/components/excercise-form";

const ExercisePage = () => {
  const [isAddSetOpen, setIsAddSetOpen] = useState(false);
  const [isEditExerciseOpen, setIsEditExerciseOpen] = useState(false);

  const { exerciseId, workoutId } = useParams<{
    exerciseId: string;
    workoutId: string;
  }>();

  const exercise = useLiveQuery(() => db.exercises.get(Number(exerciseId)));

  const sets = useLiveQuery(() =>
    db.sets
      .where({ exerciseId: Number(exerciseId) })
      .reverse()
      .sortBy("completedAt")
  );

  if (!exercise || !sets) {
    return null;
  }

  const { today, rest } = sets.reduce<{ today: Set[]; rest: Set[] }>(
    (acc, set) => {
      if (isToday(set.completedAt)) {
        acc.today.push(set);
      } else {
        acc.rest.push(set);
      }
      return acc;
    },
    {
      today: [],
      rest: [],
    }
  );

  const hightestWeight = sets.reduce((acc, set) => {
    if (set.weight > acc) {
      return set.weight;
    }
    return acc;
  }, 0);

  return (
    <>
      <Header
        title={exercise.name}
        action={
          <button onClick={() => setIsEditExerciseOpen(true)}>
            <PencilIcon className="size-4 text-muted-foreground" />
          </button>
        }
        backButton={`/workouts/${workoutId}`}
      />
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-2 border rounded-md">
            <div>
              <h2 className="text-sm">Target Reps</h2>
              <p className="text-2xl font-semibold">
                {exercise.targetReps} reps
              </p>
            </div>
            <TargetIcon className="size-9" />
          </div>
          <div className="flex items-center justify-between p-2 border rounded-md">
            <div>
              <h2 className="text-sm">Highest Weight</h2>
              <p className="text-2xl font-semibold">{hightestWeight} lbs</p>
            </div>
            <DumbbellIcon className="size-9" />
          </div>
        </div>
        <h2 className="text-lg font-semibold mb-3">Today</h2>
        <div className="space-y-2">
          <div
            role="button"
            onClick={() => setIsAddSetOpen(true)}
            className="p-2 border rounded-md flex items-center text-muted-foreground gap-1"
          >
            <PlusIcon className="size-5" />
            <p>Add Set</p>
          </div>
          {today?.map((set) => (
            <ExerciseCard key={set.id} set={set} exercise={exercise} />
          ))}
        </div>
        <h2 className="text-lg font-semibold mb-3">Previous</h2>
        <div className="space-y-2">
          {rest?.map((set) => (
            <ExerciseCard key={set.id} set={set} exercise={exercise} />
          ))}
          {rest?.length === 0 && (
            <p className="text-muted-foreground text-sm">No previous sets</p>
          )}
        </div>
      </div>
      <SetForm
        title="Add Set"
        isOpen={isAddSetOpen}
        onOpenChange={setIsAddSetOpen}
        exercise={exercise}
        lastSet={today?.[0]}
      />
      <ExerciseForm
        title="Edit Exercise"
        isOpen={isEditExerciseOpen}
        onOpenChange={setIsEditExerciseOpen}
        workoutId={Number(workoutId)}
        exercise={exercise}
        showDelete
      />
    </>
  );
};

interface ExerciseCardProps {
  set: Set;
  exercise: Exercise;
}

export const ExerciseCard = ({ set, exercise }: ExerciseCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-2 border rounded-md flex items-center justify-between">
      <p>
        {set.reps} reps at {set.weight} lbs
      </p>
      <button onClick={() => setIsOpen(true)}>
        <PencilIcon className="size-4 text-muted-foreground" />
      </button>
      <SetForm
        title="Edit Set"
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        exercise={exercise}
        set={set}
        showDelete
      />
    </div>
  );
};

export default ExercisePage;
