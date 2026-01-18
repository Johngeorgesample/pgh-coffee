import { getTagStyle, getTagLabel } from '@/types/news-types'

type TagBadgeProps = {
  tag: string
  variant?: 'compact' | 'pill'
}

const variantStyles = {
  compact: 'inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border',
  pill: 'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
}

export const TagBadge = ({ tag, variant = 'pill' }: TagBadgeProps) => {
  const styles = getTagStyle(tag)
  const label = getTagLabel(tag)
  return (
    <span className={`${variantStyles[variant]} ${styles.badge}`}>
      {label}
    </span>
  )
}
