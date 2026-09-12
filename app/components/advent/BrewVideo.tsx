// The roaster records their own brew for their day. Nothing renders until the
// video exists, so days without one simply skip the section.
export default function BrewVideo({ videoId, roasterName }: { videoId?: string; roasterName: string }) {
  if (!videoId) return null

  return (
    <section className="mx-auto max-w-7xl px-6 pt-12">
      <h3 className="mb-3.5 text-xs font-semibold uppercase tracking-wider text-stone-500">
        Watch the roaster brew it
      </h3>
      <div className="max-w-4xl">
        <div className="aspect-video max-w-full overflow-hidden rounded-xl bg-stone-900">
          <iframe
            className="size-full"
            src={`https://www.youtube-nocookie.com/embed/${videoId}`}
            title={`${roasterName} brews their advent calendar coffee`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}
