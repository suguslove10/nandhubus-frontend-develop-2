import { ReactNode } from "react";

interface BlogSectionProps {
  id: string;
  title: string;
  icon: ReactNode;
  content: ReactNode;
}

export default function BlogSection({ id, title, icon, content }: BlogSectionProps) {
  return (
    <section id={id} className="scroll-mt-20 mb-16">
      <div className="flex items-center mb-6">
        <div className="mr-3">{icon}</div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#0f7bab]">{title}</h2>
      </div>
      
      <div className="ml-0 md:ml-9">
        {content}
      </div>
    </section>
  );
}