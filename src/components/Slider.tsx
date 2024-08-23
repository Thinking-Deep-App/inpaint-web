type SliderProps = {
  label?: any
  value?: number
  min?: number
  max?: number
  onChange: (value: number) => void
  onStart?: () => void
}

export default function Slider(props: SliderProps) {
  const { value, label, min, max, onChange, onStart } = props

  const step = ((max || 100) - (min || 0)) / 100

  return (
    <div className="inline-flex items-center text-black">
      <span>{label}</span>
      <input
        className={[
          'appearance-none rounded-full h-2 w-[23rem]',
          'bg-primary',
        ].join(' ')}
        type="range"
        step={step}
        min={min}
        max={max}
        value={value}
        onPointerDown={onStart}
        onChange={ev => {
          ev.preventDefault()
          ev.stopPropagation()
          onChange(parseInt(ev.currentTarget.value, 10))
        }}
        style={{
          background: `linear-gradient(to right, red ${
            ((value! - min!) / (max! - min!)) * 100
          }%, gray ${((value! - min!) / (max! - min!)) * 100}%)`,
        }}
      />
    </div>
  )
}
