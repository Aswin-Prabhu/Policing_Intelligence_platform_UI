import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  status?: 'success' | 'warning' | 'danger' | 'neutral';
}

export function MetricCard({ label, value, icon: Icon, trend, status = 'neutral' }: MetricCardProps) {
  const statusColors = {
    success: 'bg-green-500/10',
    warning: 'bg-yellow-500/10',
    danger: 'bg-red-500/10',
    neutral: 'bg-blue-500/10',
  };

  return (
    <div className="bg-card rounded-xl p-6 card-shadow hover-elevate smooth-transition">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-2">{label}</p>
          {/* Always use neutral text color so numbers appear black in light theme and bright in dark theme */}
          <p className="text-2xl font-semibold text-white">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span className={`text-sm ${trend.positive ? 'text-green-500' : 'text-red-500'}`}>
                {trend.positive ? '↑' : '↓'} {trend.value}
              </span>
              <span className="text-xs text-muted-foreground ml-1">today</span>
            </div>
          )}
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${statusColors[status]}`}>
          <Icon className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}
