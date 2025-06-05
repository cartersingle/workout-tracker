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

interface ExcerciseFormProps {
  title: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  exercise?: Exercise;
  workoutId: number;
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
}: ExcerciseFormProps) => {
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
                      <Input placeholder="e.g. Deadlift" {...field} />
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
              <Button type="submit" className="w-full">
                {exercise ? "Update" : "Create"}
              </Button>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
