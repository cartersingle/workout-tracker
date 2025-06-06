import { ChevronLeftIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";
import { Button } from "./ui/button";

interface HeaderProps {
  title: string;
  action?: ReactNode;
  backButton?: string;
}

export const Header = ({ title, action, backButton }: HeaderProps) => {
  return (
    <div className="flex items-center justify-between py-1 pt-1 m-4 border-b">
      <div className="flex items-center gap-1">
        {!!backButton && (
          <Button size="icon" variant="ghost" className="size-8" asChild>
            <Link to={backButton}>
              <ChevronLeftIcon className="size-6" />
            </Link>
          </Button>
        )}
        <h1 className="text-3xl font-medium tracking-tight capitalize">
          {title}
        </h1>
      </div>
      {action}
    </div>
  );
};
