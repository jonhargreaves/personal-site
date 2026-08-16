interface ProjectProps {
  title: string;
  details: string;
}

export default function Project({ title, details }: ProjectProps) {
  return (
    <article className="flex w-full flex-col rounded-lg px-3 py-2 transition ease-in-out group-hover:bg-white/10 motion-reduce:transition-none">
      <h3 className="text-white">{title}</h3>
      <p>{details}</p>
    </article>
  );
}
