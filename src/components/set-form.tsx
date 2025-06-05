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
import { db, type Exercise, type Set } from "../lib/dexie";
import { useEffect } from "react";

interface SetFormProps {
  title: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  exercise: Exercise;
  lastSet?: Set;
}

const schema = z.object({
  reps: z.coerce.number().min(0),
  weight: z.coerce.number().min(0),
});

export const SetForm = ({
  title,
  isOpen,
  onOpenChange,
  exercise,
  lastSet,
}: SetFormProps) => {
  const [form, onSubmit] = useForm(schema, {
    defaultValues: {
      reps: lastSet?.reps ?? exercise.targetReps,
      weight: lastSet?.weight ?? 0,
    },
    onSubmit: async (data) => {
      await db.sets.add({
        ...data,
        exerciseId: exercise.id,
        completedAt: Date.now(),
      });
      form.reset();
      onOpenChange(false);
    },
  });

  useEffect(() => {
    if (lastSet) {
      form.reset({
        reps: lastSet.reps,
        weight: lastSet.weight,
      });
    }
  }, [lastSet, form]);

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
                name="reps"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reps</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} min={0} autoFocus />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} min={0} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Add
              </Button>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
