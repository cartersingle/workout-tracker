import { Header } from "@/components/header";
import { db, type Set } from "@/lib/dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { SetForm } from "@/components/set-form";
import { isToday } from "date-fns";

const ExercisePage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { exerciseId } = useParams<{ exerciseId: string }>();

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

  return (
    <>
      <Header
        title={exercise.name}
        action={
          <Button size="sm" onClick={() => setIsOpen(true)}>
            <PlusIcon className="size-5" />
            Add Set
          </Button>
        }
      />
      <div className="p-4 space-y-4">
        <h2 className="text-lg font-semibold mb-3">Today</h2>
        <div className="space-y-2">
          {today?.map((set) => (
            <div key={set.id} className="p-2 border rounded">
              {set.reps} reps at {set.weight} lbs
            </div>
          ))}
          {today?.length === 0 && (
            <p className="text-muted-foreground text-sm">No previous sets</p>
          )}
        </div>
        <h2 className="text-lg font-semibold mb-3">Previous</h2>
        <div className="space-y-2">
          {rest?.map((set) => (
            <div key={set.id} className="p-2 border rounded">
              {set.reps} reps at {set.weight} lbs
            </div>
          ))}
          {rest?.length === 0 && (
            <p className="text-muted-foreground text-sm">No previous sets</p>
          )}
        </div>
      </div>
      <SetForm
        title="Add Set"
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        exercise={exercise}
        lastSet={today?.[0]}
      />
    </>
  );
};

export default ExercisePage;
