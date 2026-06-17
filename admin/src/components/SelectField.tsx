import { ChevronDown } from 'lucide-react'

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  wrapperClass?: string
}

export default function SelectField({ className = '', wrapperClass = '', children, ...props }: Props) {
  return (
    <div className={`relative ${wrapperClass}`}>
      <select
        {...props}
        className={`w-full appearance-none pr-9 ${className}`}
      >
        {children}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-coal-dim"
      />
    </div>
  )
}
