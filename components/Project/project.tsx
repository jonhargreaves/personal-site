interface ProjectProps {
  title: string;
  details: string;
}

export default function Project({ title, details }: ProjectProps) {
  return (
    <article className="project-row relative isolate flex w-full flex-col rounded-lg px-3 py-2">
      <h3 className="text-white">{title}</h3>
      <p>{details}</p>
    </article>
  );
}
