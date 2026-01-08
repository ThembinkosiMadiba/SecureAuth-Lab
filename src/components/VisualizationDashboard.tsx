import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity } from 'lucide-react';

interface AttemptLog {
  password: string;
  status: string;
  timestamp: number;
}

interface VisualizationDashboardProps {
  attemptLog: AttemptLog[];
  isRunning: boolean;
  currentAttempt: number;
  timeElapsed: number;
}

export function VisualizationDashboard({ attemptLog, isRunning, currentAttempt, timeElapsed }: VisualizationDashboardProps) {
  // Prepare data for attempts over time (line chart)
  const attemptsOverTime = attemptLog
    .filter(log => log !== undefined)
    .reduce((acc, log, index) => {
      const second = Math.floor(log.timestamp / 1000);
      const existing = acc.find(item => item.second === second);
      if (existing) {
        existing.attempts += 1;
      } else {
        acc.push({ second, attempts: 1 });
      }
      return acc;
    }, [] as { second: number; attempts: number }[]);

  // Prepare data for success vs failure (pie chart)
  const successCount = attemptLog.filter(log => log && log.status === 'SUCCESS').length;
  const failureCount = attemptLog.filter(log => log && log.status === 'FAILED').length;
  const statusData = [
    { name: 'Failed', value: failureCount, color: '#94a3b8' },
    { name: 'Success', value: successCount, color: '#22c55e' }
  ];

  // Prepare data for attempts distribution (bar chart)
  const validAttempts = attemptLog.filter(log => log !== undefined);
  const recentAttempts = validAttempts.slice(-10).map((log, idx) => {
    const prevLog = idx > 0 ? validAttempts[validAttempts.length - 10 + idx - 1] : null;
    return {
      name: `#${validAttempts.length - 9 + idx}`,
      duration: prevLog ? log.timestamp - prevLog.timestamp : 0
    };
  });

  return (
    <div className="mb-6">
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg shadow-slate-200/50 p-6 border border-white/20">
        <div className="flex items-center gap-3 mb-6">
          <Activity className="w-6 h-6 text-blue-500" />
          <h3 className="text-slate-900">Real-Time Analytics</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attempts Over Time - Line Chart */}
          <div>
            <h4 className="text-slate-700 mb-4">Attempts Over Time</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={attemptsOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="second" 
                  stroke="#64748b"
                  label={{ value: 'Time (seconds)', position: 'insideBottom', offset: -5, fill: '#64748b' }}
                />
                <YAxis 
                  stroke="#64748b"
                  label={{ value: 'Attempts', angle: -90, position: 'insideLeft', fill: '#64748b' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="attempts" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Success vs Failure - Pie Chart */}
          <div>
            <h4 className="text-slate-700 mb-4">Attempt Results</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Attempt Durations - Bar Chart */}
          {recentAttempts.length > 0 && (
            <div className="lg:col-span-2">
              <h4 className="text-slate-700 mb-4">Recent Attempt Intervals (ms)</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={recentAttempts}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis 
                    stroke="#64748b"
                    label={{ value: 'Duration (ms)', angle: -90, position: 'insideLeft', fill: '#64748b' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '8px'
                    }}
                  />
                  <Bar dataKey="duration" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="text-blue-600 mb-1">Total Attempts</div>
            <div className="text-blue-900">{currentAttempt}</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
            <div className="text-purple-600 mb-1">Attempts/Second</div>
            <div className="text-purple-900">
              {timeElapsed > 0 ? ((currentAttempt / (timeElapsed / 1000)).toFixed(1)) : '0'}
            </div>
          </div>
          <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
            <div className="text-indigo-600 mb-1">Avg. Interval</div>
            <div className="text-indigo-900">
              {currentAttempt > 1 ? ((timeElapsed / currentAttempt).toFixed(0)) : '0'}ms
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}