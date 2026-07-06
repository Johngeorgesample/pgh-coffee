import VerifiedBadge from '@/app/components/VerifiedBadge'

interface IProps {
  name?: string
  subtitle?: string
  photo?: string
}

export default function ClaimPreview({ name, subtitle, photo }: IProps) {
  if (!name) return null

  return (
    <section className="max-w-2xl mx-auto px-6 pb-8">
      <p className="text-sm text-slate-500 text-center mb-3">Here&apos;s how your listing will look:</p>
      <div className="rounded-xl overflow-hidden border border-stone-200 shadow-sm">
        <div
          className="h-40 sm:h-48 relative bg-stone-300 bg-cover bg-center"
          style={photo ? { backgroundImage: `url('${photo}')` } : undefined}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-white">
            <h2 className="flex items-center gap-1.5 text-2xl sm:text-3xl font-serif font-normal tracking-tight leading-tight">
              {name}
              <VerifiedBadge className="mt-0.5" />
            </h2>
            {subtitle && <p className="text-base text-white/80 mt-0.5">{subtitle}</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
