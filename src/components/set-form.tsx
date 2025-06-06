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
  set?: Set;
  showDelete?: boolean;
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
  set,
  lastSet,
  showDelete = false,
}: SetFormProps) => {
  const [form, onSubmit] = useForm(schema, {
    defaultValues: {
      reps: set?.reps ?? lastSet?.reps ?? exercise.targetReps,
      weight: set?.weight ?? lastSet?.weight ?? 0,
    },
    onSubmit: async (data) => {
      if (set) {
        await db.sets.update(set.id, data);
      } else {
        await db.sets.add({
          ...data,
          exerciseId: exercise.id,
          completedAt: Date.now(),
        });
      }
      form.reset();
      onOpenChange(false);
    },
  });

  useEffect(() => {
    if (lastSet && !set) {
      form.reset({
        reps: lastSet.reps,
        weight: lastSet.weight,
      });
    }
    if (set) {
      form.reset({
        reps: set.reps,
        weight: set.weight,
      });
    }
  }, [lastSet, form, set]);

  async function onDelete() {
    if (set) {
      await db.sets.delete(set.id);
      onOpenChange(false);
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
              <div className="flex flex-col gap-2">
                <Button type="submit" className="w-full">
                  {set ? "Update" : "Add"}
                </Button>
                {showDelete && (
                  <Button
                    type="button"
                    className="w-full"
                    variant="destructive"
                    onClick={onDelete}
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
