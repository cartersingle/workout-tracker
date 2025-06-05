import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { WorkoutForm } from "@/components/workout-form";
import { db } from "@/lib/dexie";
import { ChevronRightIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Link } from "react-router";

const IndexPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const workouts = useLiveQuery(() => db.workouts.reverse().toArray());

  if (!workouts) {
    return null;
  }

  return (
    <>
      <Header
        title="Workouts"
        action={
          <Button size="sm" onClick={() => setIsOpen(true)}>
            <PlusIcon />
            Create
          </Button>
        }
      />
      <div className="p-4 space-y-2">
        {workouts.map((workout) => (
          <Link
            to={`/workouts/${workout.id}`}
            key={workout.id}
            className="p-2 border rounded flex items-center justify-between"
          >
            <h2 className="text-lg">{workout.name}</h2>
            <ChevronRightIcon className="size-5" />
          </Link>
        ))}
      </div>
      <WorkoutForm
        title="Create Workout"
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      />
    </>
  );
};

export default IndexPage;
