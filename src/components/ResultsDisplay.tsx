import { CheckCircle, XCircle, Shield, Clock, AlertTriangle, RotateCcw, Brain, Zap } from 'lucide-react';
import { SimulationResult } from '../App';
import { calculateEntropy, detectPattern, estimateCrackTime, getPasswordStrength } from '../utils/attackStrategies';

interface ResultsDisplayProps {
  result: SimulationResult;
  onRestart: () => void;
}

export function ResultsDisplay({ result, onRestart }: ResultsDisplayProps) {
  const isSuccess = result.success;
  
  // Calculate additional metrics
  const password = result.password || '';
  const entropy = password ? calculateEntropy(password) : 0;
  const pattern = password ? detectPattern(password) : '';
  const strength = password ? getPasswordStrength(password) : null;
  const attackRate = result.timeElapsed > 0 ? (result.attempts / (result.timeElapsed / 1000)).toFixed(1) : '0';

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        <div className="bg-slate-900/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/50 p-12 border border-slate-800/50">
          {/* Result Icon */}
          <div className="flex justify-center mb-8">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg ${
              isSuccess 
                ? 'bg-gradient-to-br from-red-500 to-orange-600 shadow-red-500/30' 
                : 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-500/30'
            }`}>
              {isSuccess ? (
                <AlertTriangle className="w-12 h-12 text-white" />
              ) : (
                <Shield className="w-12 h-12 text-white" />
              )}
            </div>
          </div>

          {/* Title */}
          <h2 className={`text-center mb-4 ${
            isSuccess ? 'text-red-400' : 'text-green-400'
          }`}>
            {isSuccess ? 'Password Compromised' : 'Password Secure'}
          </h2>

          {/* Main Message */}
          <div className={`mb-8 p-6 rounded-2xl border ${
            isSuccess 
              ? 'bg-red-500/10 border-red-500/30' 
              : 'bg-green-500/10 border-green-500/30'
          }`}>
            {isSuccess ? (
              <div>
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-red-300 mb-2">Security Breach Detected</h3>
                    <p className="text-red-200/90 leading-relaxed">
                      The password <strong className="font-mono bg-red-500/20 px-2 py-0.5 rounded">"{result.password}"</strong> was successfully 
                      discovered in <strong>{(result.timeElapsed / 1000).toFixed(2)} seconds</strong> using 
                      a brute-force method with <strong>{result.attempts} attempts</strong>.
                    </p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-red-500/20 rounded-xl">
                  <p className="text-red-300">
                    <strong>Why was this password vulnerable?</strong>
                  </p>
                  <p className="text-red-200/90 mt-2">
                    {result.reason}
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-green-300 mb-2">Password Protected Successfully</h3>
                    <p className="text-green-200/90 leading-relaxed">
                      The password was not discovered after <strong>{result.attempts} attempts</strong> over 
                      <strong> {(result.timeElapsed / 1000).toFixed(2)} seconds</strong>. 
                      Your password successfully resisted the brute-force attack.
                    </p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-green-500/20 rounded-xl">
                  <p className="text-green-300">
                    <strong>Why was this password secure?</strong>
                  </p>
                  <p className="text-green-200/90 mt-2">
                    {result.reason}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-slate-400">Time Elapsed</span>
              </div>
              <div className="text-slate-100">{(result.timeElapsed / 1000).toFixed(2)}s</div>
            </div>

            <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-slate-400" />
                <span className="text-slate-400">Total Attempts</span>
              </div>
              <div className="text-slate-100">{result.attempts.toLocaleString()}</div>
            </div>

            <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-slate-400" />
                <span className="text-slate-400">Attack Rate</span>
              </div>
              <div className="text-slate-100">{attackRate} attempts/sec</div>
            </div>

            {isSuccess && entropy > 0 && (
              <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-400">Password Entropy</span>
                </div>
                <div className="text-slate-100">{entropy.toFixed(1)} bits</div>
              </div>
            )}
          </div>

          {/* Pattern Analysis (for compromised passwords) */}
          {isSuccess && password && (
            <div className="mb-8 p-6 bg-purple-500/10 rounded-2xl border border-purple-500/30">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-5 h-5 text-purple-400" />
                <h3 className="text-purple-300">Intelligence Analysis</h3>
              </div>
              <div className="space-y-2 text-purple-200/80">
                <p><strong>Detected Pattern:</strong> {pattern}</p>
                {strength && (
                  <p><strong>Strength Rating:</strong> {strength.label} ({entropy.toFixed(1)} bits of entropy)</p>
                )}
                <p><strong>Length:</strong> {password.length} characters</p>
                <p className="text-sm mt-3 pt-3 border-t border-purple-500/30">
                  This password was vulnerable because it matched predictable patterns that attackers exploit. 
                  Strong passwords should have high entropy (60+ bits) and avoid common patterns.
                </p>
              </div>
            </div>
          )}

          {/* Defenses Triggered */}
          {result.defensesTriggered.length > 0 && (
            <div className="mb-8 p-6 bg-blue-500/10 rounded-2xl border border-blue-500/30">
              <h3 className="text-blue-300 mb-3">Defense Mechanisms Activated</h3>
              <ul className="space-y-2">
                {result.defensesTriggered.map((defense, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-blue-200/90">
                    <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>{defense}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          <div className="mb-8 p-6 bg-slate-800/40 rounded-2xl border border-slate-700/50">
            <h3 className="text-slate-100 mb-3">Security Recommendations</h3>
            <ul className="space-y-2 text-slate-300">
              {isSuccess ? (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Avoid common words and phrases found in dictionaries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Use a combination of uppercase, lowercase, numbers, and special characters</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Create passwords that are at least 12-16 characters long</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Consider using a passphrase or password manager</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Your password demonstrates good security practices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Continue using unique, complex passwords for each account</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Enable multi-factor authentication when available</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Regularly update your passwords every 3-6 months</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Action Buttons */}
          <button
            onClick={onRestart}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Test Another Password
          </button>
        </div>
      </div>
    </div>
  );
}