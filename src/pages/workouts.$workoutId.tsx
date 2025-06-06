import { ExerciseForm } from "@/components/excercise-form";
import { Header } from "@/components/header";
import { db } from "@/lib/dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { ChevronRightIcon, GripVerticalIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router";
import { arrayMove, List } from "react-movable";
import { cn } from "@/lib/utils";

const WorkoutPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { workoutId } = useParams<{ workoutId: string }>();

  const workout = useLiveQuery(() => db.workouts.get(Number(workoutId)));
  const exercises = useLiveQuery(() =>
    db.exercises.where({ workoutId: Number(workoutId) }).sortBy("order")
  );

  if (!workout || !exercises) {
    return null;
  }

  return (
    <>
      <Header title={workout.name} backButton="/" />
      <div className="p-4 space-y-2">
        <List
          lockVertically
          values={exercises}
          onChange={async ({ newIndex, oldIndex }) => {
            const newOrder = arrayMove(exercises, oldIndex, newIndex);

            await db.transaction("rw", db.exercises, () => {
              db.exercises.bulkPut(
                newOrder.map((exercise, index) => ({
                  ...exercise,
                  order: index + 1,
                }))
              );
            });
          }}
          renderList={({ children, props }) => (
            <div {...props} className="space-y-2">
              {children}
            </div>
          )}
          renderItem={({ props: { key, ...props }, value, isDragged }) => (
            <Link
              to={`/workouts/${workoutId}/exercises/${value.id}`}
              key={key}
              {...props}
              className="p-2 border rounded flex items-center justify-between bg-background"
            >
              <div className="flex items-center gap-2">
                <GripVerticalIcon
                  data-movable-handle
                  className={cn(
                    "size-5 text-muted-foreground",
                    isDragged ? "cursor-grabbing" : "cursor-grab"
                  )}
                />
                <p>{value.name}</p>
              </div>
              <ChevronRightIcon className="size-5" />
            </Link>
          )}
        />
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-muted-foreground border rounded flex items-center gap-1 w-full"
        >
          <PlusIcon className="size-5" />
          Add Exercise
        </button>
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
