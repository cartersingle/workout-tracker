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
import { db, type Workout } from "../lib/dexie";

interface WorkoutFormProps {
  title: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  workout?: Workout;
}

const schema = z.object({
  name: z.string().min(1),
});

export const WorkoutForm = ({
  title,
  isOpen,
  onOpenChange,
  workout,
}: WorkoutFormProps) => {
  const [form, onSubmit] = useForm(schema, {
    defaultValues: {
      name: workout?.name ?? "",
    },
    onSubmit: async (data) => {
      if (workout) {
        await db.workouts.update(workout.id, data);
      } else {
        await db.workouts.add(data);
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
                      <Input placeholder="e.g. Upper" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                {workout ? "Update" : "Create"}
              </Button>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
