import { Play } from 'lucide-react'

// The roaster records their own brew for their day. Until that video exists the
// slot holds its place, so the page doesn't reflow when one lands.
export default function BrewVideo({ videoId, roasterName }: { videoId?: string; roasterName: string }) {
  return (
    <div className="aspect-video overflow-hidden rounded-xl bg-stone-900">
      {videoId ? (
        <iframe
          className="size-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title={`${roasterName} brews their advent calendar coffee`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <div className="flex size-full flex-col items-center justify-center gap-3 text-stone-400">
          <Play className="size-8" />
          <p className="text-sm">{roasterName} hasn&apos;t filmed their brew yet.</p>
        </div>
      )}
    </div>
  )
}
