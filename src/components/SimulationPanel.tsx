import { useState, useEffect, useRef } from 'react';
import { Shield, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { DefenseSettings, SimulationResult } from '../App';
import { ResultsDisplay } from './ResultsDisplay';
import { CharacterCracker } from './CharacterCracker';

interface SimulationPanelProps {
  targetPassword: string;
  defenseSettings: DefenseSettings;
  onComplete: (result: SimulationResult) => void;
  onRestart: () => void;
}

// Character set for brute force
const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

export function SimulationPanel({ targetPassword, defenseSettings, onComplete, onRestart }: SimulationPanelProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [currentChar, setCurrentChar] = useState('A');
  const [crackedChars, setCrackedChars] = useState<string[]>([]);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    startSimulation();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const updateTimer = () => {
    setTimeElapsed(Date.now() - startTimeRef.current);
    animationFrameRef.current = requestAnimationFrame(updateTimer);
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const startSimulation = async () => {
    setIsRunning(true);
    startTimeRef.current = Date.now();
    updateTimer();

    const defensesTriggered: string[] = [];
    let attemptCount = 0;
    const cracked: string[] = [];

    // Character-by-character cracking
    for (let position = 0; position < targetPassword.length; position++) {
      setCurrentPosition(position);
      const targetChar = targetPassword[position];
      let found = false;

      // Try each character in the charset
      for (let i = 0; i < CHARSET.length; i++) {
        const testChar = CHARSET[i];
        setCurrentChar(testChar);
        attemptCount++;
        setTotalAttempts(attemptCount);

        // Check defenses
        if (attemptCount >= defenseSettings.maxAttempts) {
          defensesTriggered.push('Maximum attempts reached');
          completeSimulation(false, cracked.join(''), attemptCount, defensesTriggered, 'Maximum attempts limit reached. Defense mechanism successfully stopped the attack.');
          return;
        }

        if (defenseSettings.accountLockout && attemptCount >= 100) {
          defensesTriggered.push('Account lockout after 100 failed attempts');
          completeSimulation(false, cracked.join(''), attemptCount, defensesTriggered, 'Account locked out after too many attempts. Defense mechanism successfully stopped the attack.');
          return;
        }

        // Apply rate limiting delay
        const delay = defenseSettings.rateLimit ? defenseSettings.attemptDelay : 80;
        await sleep(delay);

        // Check if character matches
        if (testChar === targetChar) {
          cracked.push(testChar);
          setCrackedChars([...cracked]);
          found = true;
          await sleep(300); // Pause to show the locked character
          break;
        }
      }

      if (!found) {
        // Character not in charset - this shouldn't happen with our charset
        completeSimulation(false, cracked.join(''), attemptCount, defensesTriggered, 'Password contains characters outside the standard character set.');
        return;
      }
    }

    // Success - all characters cracked
    completeSimulation(true, targetPassword, attemptCount, defensesTriggered, 'Password successfully discovered using character-by-character brute-force analysis. This demonstrates why strong, unique passwords are essential.');
  };

  const completeSimulation = (
    success: boolean, 
    discoveredPassword: string, 
    attempts: number, 
    defensesTriggered: string[],
    reason: string
  ) => {
    setIsRunning(false);
    cancelAnimationFrame(animationFrameRef.current);

    const finalResult: SimulationResult = {
      success,
      password: success ? discoveredPassword : undefined,
      attempts,
      timeElapsed: Date.now() - startTimeRef.current,
      reason,
      defensesTriggered
    };

    setResult(finalResult);
    onComplete(finalResult);
  };

  if (result) {
    return <ResultsDisplay result={result} onRestart={onRestart} />;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700/50 mb-4">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="text-slate-300">SecureAuth Lab</span>
          </div>
          <h2 className="text-slate-100 mb-2">Character Analysis in Progress</h2>
          <p className="text-slate-400">Demonstrating how brute-force attacks work at the character level</p>
        </div>

        {/* Main Visualization */}
        <div className="mb-8 bg-slate-900/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/50 p-8 border border-slate-800/50">
          <CharacterCracker
            password={targetPassword}
            currentPosition={currentPosition}
            currentChar={currentChar}
            crackedChars={crackedChars}
            isActive={isRunning}
          />
        </div>

        {/* Stats Panel */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/30 p-6 border border-slate-800/50">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="text-slate-400">Time Elapsed</span>
            </div>
            <div className="text-slate-100 font-mono">
              {(timeElapsed / 1000).toFixed(1)}s
            </div>
          </div>

          <div className="bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/30 p-6 border border-slate-800/50">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-purple-400" />
              <span className="text-slate-400">Total Attempts</span>
            </div>
            <div className="text-slate-100 font-mono">
              {totalAttempts}
            </div>
          </div>

          <div className="bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/30 p-6 border border-slate-800/50">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-slate-400">Characters Found</span>
            </div>
            <div className="text-slate-100 font-mono">
              {crackedChars.length} / {targetPassword.length}
            </div>
          </div>

          <div className="bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/30 p-6 border border-slate-800/50">
            <div className="flex items-center gap-3 mb-2">
              <XCircle className="w-5 h-5 text-orange-400" />
              <span className="text-slate-400">Attempts/Sec</span>
            </div>
            <div className="text-slate-100 font-mono">
              {timeElapsed > 0 ? ((totalAttempts / (timeElapsed / 1000)).toFixed(1)) : '0'}
            </div>
          </div>
        </div>

        {/* Defense Status */}
        <div className="mt-6 bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/30 p-6 border border-slate-800/50">
          <h3 className="text-slate-100 mb-4">Active Defense Mechanisms</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-xl border ${defenseSettings.rateLimit ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-800/30 border-slate-700/50'}`}>
              <div className={`${defenseSettings.rateLimit ? 'text-emerald-400' : 'text-slate-500'} mb-1`}>
                Rate Limiting
              </div>
              <div className="text-slate-400 text-sm">
                {defenseSettings.rateLimit ? `${defenseSettings.attemptDelay}ms delay` : 'Disabled'}
              </div>
            </div>

            <div className={`p-4 rounded-xl border ${defenseSettings.accountLockout ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-800/30 border-slate-700/50'}`}>
              <div className={`${defenseSettings.accountLockout ? 'text-emerald-400' : 'text-slate-500'} mb-1`}>
                Account Lockout
              </div>
              <div className="text-slate-400 text-sm">
                {defenseSettings.accountLockout ? 'After 100 attempts' : 'Disabled'}
              </div>
            </div>

            <div className="p-4 rounded-xl border bg-emerald-500/10 border-emerald-500/30">
              <div className="text-emerald-400 mb-1">
                Max Attempts
              </div>
              <div className="text-slate-400 text-sm">
                Limit: {defenseSettings.maxAttempts}
              </div>
            </div>
          </div>
        </div>

        {/* Educational Note */}
        <div className="mt-6 bg-blue-500/10 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/30 p-6 border border-blue-500/30">
          <h4 className="text-blue-300 mb-2">How This Works</h4>
          <p className="text-blue-200/80 leading-relaxed">
            This visualization demonstrates a character-by-character brute-force attack. The system systematically tests each possible character 
            at each position until it finds a match. Real-world attacks are prevented by defense mechanisms like rate limiting (slowing down attempts), 
            account lockout (blocking after too many failures), and attempt limits. Strong passwords with many characters and diverse character types 
            exponentially increase the time required for such attacks.
          </p>
        </div>
      </div>
    </div>
  );
}
