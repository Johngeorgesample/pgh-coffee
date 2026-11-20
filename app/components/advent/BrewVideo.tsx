'use client'

import { Play } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useAnalytics } from '@/hooks'

const useIframeClick = (onClick: () => void) => {
  const frame = useRef<HTMLIFrameElement>(null)
  useEffect(() => {
    const onBlur = () => {
      if (document.activeElement !== frame.current) return
      window.removeEventListener('blur', onBlur)
      onClick()
    }
    window.addEventListener('blur', onBlur)
    return () => window.removeEventListener('blur', onBlur)
  }, [onClick])
  return frame
}

const Video = ({ videoId, roasterName, jar }: { videoId: string; roasterName: string; jar: number }) => {
  const track = useAnalytics()
  const frame = useIframeClick(() => track('AdventBrewVideoPlayed', { props: { jar } }))
  return (
    <iframe
      ref={frame}
      className="size-full"
      src={`https://www.youtube-nocookie.com/embed/${videoId}`}
      title={`${roasterName} brews their advent calendar coffee`}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      loading="lazy"
    />
  )
}

// The roaster records their own brew for their day. Until that video exists the
// slot holds its place, so the page doesn't reflow when one lands.
export default function BrewVideo({ videoId, roasterName, jar }: { videoId?: string; roasterName: string; jar: number }) {
  return (
    <div className="aspect-video overflow-hidden rounded-xl bg-stone-900">
      {videoId ? (
        <Video videoId={videoId} roasterName={roasterName} jar={jar} />
      ) : (
        <div className="flex size-full flex-col items-center justify-center gap-3 text-stone-400">
          <Play className="size-8" />
          <p className="text-sm">{roasterName} hasn&apos;t filmed their brew yet.</p>
        </div>
      )}
    </div>
  )
}
