import { z } from "zod";
import { useForm as useHookForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface Options<T extends z.ZodSchema> {
  defaultValues: z.infer<T>;
  onSubmit: (data: z.infer<T>) => Promise<void>;
}

export const useForm = <T extends z.ZodSchema>(
  schema: T,
  options: Options<T>
) => {
  const form = useHookForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues: options.defaultValues,
  });

  return [form, form.handleSubmit((data) => options.onSubmit(data))] as const;
};
