import { useState } from 'react';
import { ArrowLeft, Shield, Lock, Clock, AlertCircle } from 'lucide-react';
import { DefenseSettings } from '../App';

interface PasswordSetupProps {
  onRunSimulation: (password: string, settings: DefenseSettings) => void;
  onBack: () => void;
  initialSettings: DefenseSettings;
}

export function PasswordSetup({ onRunSimulation, onBack, initialSettings }: PasswordSetupProps) {
  const [password, setPassword] = useState('');
  const [settings, setSettings] = useState<DefenseSettings>(initialSettings);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      onRunSimulation(password, settings);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        {/* Main Card */}
        <div className="bg-slate-900/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/50 p-10 border border-slate-800/50">
          <h2 className="text-center mb-2 text-slate-100">Configure Security Test</h2>
          <p className="text-center text-slate-400 mb-8">
            Enter a password to test its strength against a brute-force simulation
          </p>

          <form onSubmit={handleSubmit}>
            {/* Password Input */}
            <div className="mb-8">
              <label htmlFor="password" className="block text-slate-300 mb-3">
                Test Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a password to test..."
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <p className="text-slate-500 mt-2">
                This password will be tested against a predefined wordlist
              </p>
            </div>

            {/* Defense Settings */}
            <div className="mb-8 p-6 bg-slate-800/40 rounded-2xl border border-slate-700/50">
              <h3 className="text-slate-100 mb-4">Defense Mechanisms</h3>
              
              <div className="space-y-4">
                {/* Rate Limiting */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <Clock className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <div className="text-slate-200">Rate Limiting</div>
                      <div className="text-slate-500">
                        Adds delay between attempts to slow down attacks
                      </div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      checked={settings.rateLimit}
                      onChange={(e) => setSettings({ ...settings, rateLimit: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                  </label>
                </div>

                {/* Account Lockout */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <Shield className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <div className="text-slate-200">Account Lockout</div>
                      <div className="text-slate-500">
                        Locks after multiple failed attempts
                      </div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      checked={settings.accountLockout}
                      onChange={(e) => setSettings({ ...settings, accountLockout: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                  </label>
                </div>

                {/* Max Attempts */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <Lock className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <div className="text-slate-200">Maximum Attempts</div>
                      <div className="text-slate-500">
                        Limit total number of password attempts
                      </div>
                    </div>
                  </div>
                  <input
                    type="number"
                    value={settings.maxAttempts}
                    onChange={(e) => setSettings({ ...settings, maxAttempts: parseInt(e.target.value) || 50 })}
                    min="10"
                    max="10000"
                    className="w-20 px-3 py-1.5 bg-slate-800/50 border border-slate-700 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                  />
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="mb-8 p-4 bg-blue-500/10 rounded-xl border border-blue-500/30 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-blue-200/90">
                The simulation uses a common password wordlist to demonstrate how attackers exploit weak passwords. 
                Strong, unique passwords are essential for real security.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Run Security Test
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}