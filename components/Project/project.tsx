import React, { ReactNode } from "react";

interface ProjectProps {
  // Expect exactly two children: one for the left column and one for the right column.
  children: ReactNode;
}

const Project: React.FC<ProjectProps> = ({ children }) => {
  return (
    <div className="flex flex-col px-3 py-2 w-full rounded-lg hover:bg-white/10 transition ease-in-out">
      {children}
    </div>
  );
};

export default Project;
