import { Shield, Lock, AlertTriangle } from 'lucide-react';

interface LandingPageProps {
  onStartLab: () => void;
}

export function LandingPage({ onStartLab }: LandingPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        {/* Main Card */}
        <div className="bg-slate-900/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/50 p-12 border border-slate-800/50">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-center mb-4 tracking-tight text-slate-100">
            SecureAuth Lab
          </h1>

          {/* Subtitle */}
          <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
            An educational cybersecurity laboratory for understanding authentication security
          </p>

          {/* What is Brute Force */}
          <div className="mb-10 p-6 bg-slate-800/40 rounded-2xl border border-slate-700/50">
            <div className="flex items-start gap-3 mb-3">
              <Lock className="w-5 h-5 text-slate-300 mt-0.5" />
              <h3 className="text-slate-100">What is a Brute-Force Attack?</h3>
            </div>
            <p className="text-slate-400 leading-relaxed mb-4">
              A brute-force attack is a trial-and-error method used to decode encrypted data such as passwords. 
              This lab demonstrates three sophisticated attack strategies used by real attackers:
            </p>
            <ul className="space-y-2 text-slate-400 ml-6">
              <li className="flex gap-2">
                <span className="text-blue-400">1.</span>
                <span><strong className="text-slate-300">Dictionary Attack:</strong> Tests millions of leaked passwords and common words</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">2.</span>
                <span><strong className="text-slate-300">Hybrid Attack:</strong> Combines words with typical variations (Password123, Admin!)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">3.</span>
                <span><strong className="text-slate-300">Smart Brute-Force:</strong> Uses character frequency analysis and pattern recognition</span>
              </li>
            </ul>
          </div>

          {/* Ethical Disclaimer */}
          <div className="mb-10 p-6 bg-amber-500/10 rounded-2xl border border-amber-500/30">
            <div className="flex items-start gap-3 mb-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
              <h3 className="text-amber-300">Educational Use Only</h3>
            </div>
            <div className="text-amber-200/90 leading-relaxed space-y-2">
              <p>
                <strong>This simulator operates entirely within your browser and does not connect to any external systems.</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>No real credentials are used or stored</li>
                <li>No actual systems are attacked</li>
                <li>All simulations run locally in your browser</li>
                <li>For educational and ethical learning purposes only</li>
              </ul>
              <p className="mt-3">
                Unauthorized access to computer systems is illegal. This tool is designed to teach defensive security concepts.
              </p>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={onStartLab}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Start Lab
          </button>
        </div>
      </div>
    </div>
  );
}