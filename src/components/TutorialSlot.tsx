import { Video } from "lucide-react";
import { TUTORIALS } from "@/lib/tutorials";

export function TutorialSlot({ tutorial }: { tutorial: keyof typeof TUTORIALS }) {
  const { title, src } = TUTORIALS[tutorial];
  return (
    <div className="mt-5 border-t border-border pt-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-primary"><Video size={20} />{title}</h3>
      {src ? <video className="mt-3 aspect-video w-full rounded-lg bg-muted" src={src} controls preload="metadata" aria-label={title} /> : <p className="mt-2 text-sm text-muted-foreground">Coming soon</p>}
    </div>
  );
}