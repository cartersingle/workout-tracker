import { z } from "zod";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./ui/drawer";
import { useForm } from "../hooks/use-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { db, type Exercise } from "../lib/dexie";
import { useEffect } from "react";
import { useNavigate } from "react-router";

interface ExcerciseFormProps {
  title: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  exercise?: Exercise;
  workoutId: number;
  showDelete?: boolean;
}

const schema = z.object({
  name: z.string().min(1),
  targetReps: z.coerce.number().min(1),
});

export const ExerciseForm = ({
  title,
  isOpen,
  onOpenChange,
  exercise,
  workoutId,
  showDelete = false,
}: ExcerciseFormProps) => {
  const navigate = useNavigate();
  const [form, onSubmit] = useForm(schema, {
    defaultValues: {
      name: exercise?.name ?? "",
      targetReps: exercise?.targetReps ?? 1,
    },
    onSubmit: async (data) => {
      if (exercise) {
        await db.exercises.update(exercise.id, data);
      } else {
        const order = await db.exercises.where({ workoutId }).count();

        await db.exercises.add({
          ...data,
          order: order + 1,
          workoutId,
        });
      }
      form.reset();
      onOpenChange(false);
    },
  });

  useEffect(() => {
    if (exercise) {
      form.reset({
        name: exercise.name,
        targetReps: exercise.targetReps,
      });
    }
  }, [exercise, form]);

  async function deleteExercise() {
    if (exercise) {
      await db.transaction("rw", db.exercises, db.sets, async () => {
        const sets = await db.sets.where({ exerciseId: exercise.id }).toArray();

        db.exercises.delete(exercise.id);
        db.sets.bulkDelete(sets.map((e) => e.id));
      });
      onOpenChange(false);
      navigate(`/workouts/${workoutId}`);
    }
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4 px-4 pb-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Deadlift" {...field} autoFocus />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetReps"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Reps</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="10"
                        {...field}
                        min={1}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col w-full gap-2">
                <Button type="submit" className="w-full">
                  {exercise ? "Update" : "Create"}
                </Button>
                {showDelete && (
                  <Button
                    variant="destructive"
                    onClick={deleteExercise}
                    className="w-full"
                  >
                    Delete
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
