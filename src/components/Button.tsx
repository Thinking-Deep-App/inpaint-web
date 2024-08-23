import { ReactNode, useState } from 'react'

interface ButtonProps {
  children: ReactNode
  className?: string
  icon?: ReactNode
  primary?: boolean
  style?: {
    [key: string]: string
  }
  onClick?: () => void
  onDown?: () => void
  onUp?: () => void
  onEnter?: () => void
  onLeave?: () => void
}

export default function Button(props: ButtonProps) {
  const {
    children,
    className,
    icon,
    primary,
    style,
    onClick,
    onDown,
    onUp,
    onEnter,
    onLeave,
  } = props
  const [active, setActive] = useState(false)
  let background = ''
  if (primary) {
    background =
      'text-white hover:opacity-90 hover:text-white bg-gradient-to-r from-[#3A7DF9] to-[#7556F9]'
  }
  if (active) {
    background =
      'bg-gradient-to-r from-[#3A7DF9] to-[#7556F9] text-white hover:opacity-90'
  }
  if (!primary && !active) {
    background = 'bg-[#d3d3d3] text-[#a1a1a1] cursor-not-allowed'
  }
  return (
    <div
      role="button"
      onKeyDown={() => {
        onDown?.()
      }}
      onClick={onClick}
      onPointerDown={() => {
        setActive(true)
        onDown?.()
      }}
      onPointerUp={() => {
        setActive(false)
        onUp?.()
      }}
      onPointerEnter={() => {
        onEnter?.()
      }}
      onPointerLeave={() => {
        onLeave?.()
      }}
      tabIndex={-1}
      className={[
        'inline-flex space-x-3 h-10 items-center px-5 rounded-full cursor-pointer ',
        background,
        className,
      ].join(' ')}
      style={style}
    >
      {icon}
      <span className="whitespace-nowrap select-none">{children}</span>
    </div>
  )
}
