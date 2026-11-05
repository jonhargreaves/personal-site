import Link from "next/link";

import Project from "@/components/Project/project";

interface ProjectListItem {
  title: string;
  details: string;
  href: string;
}

export default function ProjectList({ items }: { items: readonly ProjectListItem[] }) {
  return (
    <ul className="-mx-3 flex flex-col items-center gap-2 pt-4">
      {items.map((item) => {
        const className =
          "group flex w-full rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";
        const content = <Project title={item.title} details={item.details} />;

        return (
          <li key={item.href} className="w-full">
            {item.href.startsWith("/") ? (
              <Link className={className} href={item.href}>
                {content}
              </Link>
            ) : (
              <a className={className} href={item.href} target="_blank" rel="noreferrer">
                {content}
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}
