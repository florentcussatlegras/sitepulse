// assets\react/components\ui\ProgressBar.tsx

type Props = {
  value: number;
  color?: 'indigo' | 'green' | 'yellow' | 'red';
};

const colorClasses = {
  indigo: 'bg-indigo-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  red: 'bg-red-500',
};

export default function ProgressBar({ value, color = 'indigo' }: Props) {
  return (
    <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
      <div
        className={`h-2 rounded-full ${colorClasses[color]} transition-all duration-700 ease-out`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
