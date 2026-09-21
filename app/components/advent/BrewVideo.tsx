import { Play } from 'lucide-react'

// The roaster records their own brew for their day. Until that video exists the
// section holds its place, so the page doesn't reflow when one lands.
export default function BrewVideo({ videoId, roasterName }: { videoId?: string; roasterName: string }) {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-12">
      <h3 className="mb-3.5 text-xs font-semibold uppercase tracking-wider text-stone-500">
        Watch the roaster brew it
      </h3>
      <div className="aspect-video max-w-4xl overflow-hidden rounded-xl bg-stone-900">
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
            <Play className="size-10" />
            <p className="text-sm">{roasterName} hasn&apos;t filmed their brew yet.</p>
          </div>
        )}
      </div>
    </section>
  )
}
