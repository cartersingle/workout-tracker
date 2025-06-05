import type { ReactNode } from "react";

interface HeaderProps {
  title: string;
  action?: ReactNode;
}

export const Header = ({ title, action }: HeaderProps) => {
  return (
    <div className="flex items-center justify-between py-1 pt-1 m-4 border-b">
      <h1 className="text-3xl font-medium tracking-tight">{title}</h1>
      {action}
    </div>
  );
};
