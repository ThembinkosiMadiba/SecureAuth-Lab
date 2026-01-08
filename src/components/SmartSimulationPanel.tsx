import { useState, useEffect, useRef } from 'react';
import { Shield, Clock, AlertTriangle, CheckCircle, XCircle, Zap, Brain, Target } from 'lucide-react';
import { DefenseSettings, SimulationResult } from '../App';
import { ResultsDisplay } from './ResultsDisplay';
import { CharacterCracker } from './CharacterCracker';
import { 
  COMMON_PASSWORDS, 
  COMMON_WORDS, 
  HYBRID_TRANSFORMATIONS,
  calculateEntropy,
  detectPattern,
  getSmartCharset,
  estimateCrackTime,
  getPasswordStrength
} from '../utils/attackStrategies';

interface SmartSimulationPanelProps {
  targetPassword: string;
  defenseSettings: DefenseSettings;
  onComplete: (result: SimulationResult) => void;
  onRestart: () => void;
}

type AttackPhase = 'analysis' | 'dictionary' | 'hybrid' | 'bruteforce' | 'complete';

export function SmartSimulationPanel({ targetPassword, defenseSettings, onComplete, onRestart }: SmartSimulationPanelProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<AttackPhase>('analysis');
  const [phaseDescription, setPhaseDescription] = useState('');
  const [currentPosition, setCurrentPosition] = useState(0);
  const [currentChar, setCurrentChar] = useState('');
  const [currentAttempt, setCurrentAttempt] = useState('');
  const [crackedChars, setCrackedChars] = useState<string[]>([]);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(getPasswordStrength(targetPassword));
  const [estimatedTime, setEstimatedTime] = useState('');
  const [detectedPattern, setDetectedPattern] = useState('');
  
  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    // Initial analysis
    const entropy = calculateEntropy(targetPassword);
    const pattern = detectPattern(targetPassword);
    const estimated = estimateCrackTime(targetPassword);
    
    setDetectedPattern(pattern);
    setEstimatedTime(estimated);
    
    // Start after brief delay
    const timer = setTimeout(() => {
      startSmartSimulation();
    }, 2000);
    
    return () => {
      clearTimeout(timer);
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

  const checkDefenses = (attemptCount: number, defensesTriggered: string[]): boolean => {
    if (attemptCount >= defenseSettings.maxAttempts) {
      defensesTriggered.push('Maximum attempts reached');
      return true;
    }

    if (defenseSettings.accountLockout && attemptCount >= 100) {
      defensesTriggered.push('Account lockout after 100 failed attempts');
      return true;
    }

    return false;
  };

  const startSmartSimulation = async () => {
    setIsRunning(true);
    startTimeRef.current = Date.now();
    updateTimer();

    const defensesTriggered: string[] = [];
    let attemptCount = 0;

    // Phase 1: Dictionary Attack
    setCurrentPhase('dictionary');
    setPhaseDescription('Trying common passwords from database...');
    
    for (const password of COMMON_PASSWORDS) {
      setCurrentAttempt(password);
      attemptCount++;
      setTotalAttempts(attemptCount);

      if (checkDefenses(attemptCount, defensesTriggered)) {
        completeSimulation(false, '', attemptCount, defensesTriggered, 
          'Defense mechanisms prevented the attack. Password remained secure.', 'dictionary');
        return;
      }

      await sleep(defenseSettings.rateLimit ? defenseSettings.attemptDelay : 50);

      if (password === targetPassword || password.toLowerCase() === targetPassword.toLowerCase()) {
        completeSimulation(true, password, attemptCount, defensesTriggered,
          `Weak password found in common password database during dictionary attack phase. This password is known to attackers.`, 'dictionary');
        return;
      }
    }

    // Phase 2: Hybrid Attack
    setCurrentPhase('hybrid');
    setPhaseDescription('Generating variations of common words...');
    
    for (const word of COMMON_WORDS) {
      for (const transform of HYBRID_TRANSFORMATIONS) {
        const attempt = transform(word);
        setCurrentAttempt(attempt);
        attemptCount++;
        setTotalAttempts(attemptCount);

        if (checkDefenses(attemptCount, defensesTriggered)) {
          completeSimulation(false, '', attemptCount, defensesTriggered,
            'Defense mechanisms prevented the attack. Password remained secure.', 'hybrid');
          return;
        }

        await sleep(defenseSettings.rateLimit ? defenseSettings.attemptDelay : 40);

        if (attempt === targetPassword) {
          completeSimulation(true, attempt, attemptCount, defensesTriggered,
            `Password cracked using hybrid attack (common word with variations). Pattern detected: ${detectPattern(attempt)}`, 'hybrid');
          return;
        }
      }
    }

    // Phase 3: Smart Brute-Force (Character-by-Character with Intelligence)
    setCurrentPhase('bruteforce');
    setPhaseDescription('Analyzing character patterns with adaptive algorithm...');
    
    const cracked: string[] = [];

    for (let position = 0; position < targetPassword.length; position++) {
      setCurrentPosition(position);
      const targetChar = targetPassword[position];
      
      // Get smart charset based on what we've discovered
      const smartCharset = getSmartCharset(cracked);
      let found = false;

      // Try characters in smart order (frequency-based)
      for (let i = 0; i < smartCharset.length; i++) {
        const testChar = smartCharset[i];
        setCurrentChar(testChar);
        attemptCount++;
        setTotalAttempts(attemptCount);

        if (checkDefenses(attemptCount, defensesTriggered)) {
          completeSimulation(false, cracked.join(''), attemptCount, defensesTriggered,
            `Defense mechanisms stopped the attack at position ${position + 1}/${targetPassword.length}. ${cracked.length} characters were discovered before defenses triggered.`, 'bruteforce');
          return;
        }

        // Adaptive delay - slower for special chars (they're checked less frequently in reality)
        const charDelay = /[^a-zA-Z0-9]/.test(testChar) ? 1.5 : 1;
        const delay = (defenseSettings.rateLimit ? defenseSettings.attemptDelay : 60) * charDelay;
        await sleep(delay);

        if (testChar === targetChar) {
          cracked.push(testChar);
          setCrackedChars([...cracked]);
          found = true;
          
          // Brief pause to show the locked character
          await sleep(400);
          
          // Update description with learned pattern
          if (cracked.length > 2) {
            const partial = cracked.join('');
            const hasPattern = /^[A-Z]/.test(partial) ? 'Capitalized start detected' :
                              /^\d/.test(partial) ? 'Numeric start detected' :
                              'Analyzing patterns';
            setPhaseDescription(`Smart brute-force: ${hasPattern}...`);
          }
          break;
        }
      }

      if (!found) {
        completeSimulation(false, cracked.join(''), attemptCount, defensesTriggered,
          'Password contains characters outside standard charset or attack was unsuccessful.', 'bruteforce');
        return;
      }
    }

    // Success - all characters cracked
    completeSimulation(true, targetPassword, attemptCount, defensesTriggered,
      `Password fully compromised using adaptive brute-force analysis. Attack succeeded by learning patterns from discovered characters. Detected pattern: ${detectPattern(targetPassword)}`, 'bruteforce');
  };

  const completeSimulation = (
    success: boolean,
    discoveredPassword: string,
    attempts: number,
    defensesTriggered: string[],
    reason: string,
    phase: string
  ) => {
    setIsRunning(false);
    setCurrentPhase('complete');
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
          <h2 className="text-slate-100 mb-2">Intelligent Security Analysis</h2>
          <p className="text-slate-400">Multi-phase adaptive attack simulation with real-world strategies</p>
        </div>

        {/* Password Analysis Panel */}
        <div className="mb-6 bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/30 p-6 border border-slate-800/50">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-5 h-5 text-purple-400" />
            <h3 className="text-slate-100">Pre-Attack Analysis</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50">
              <div className="text-slate-400 mb-1 text-sm">Password Strength</div>
              <div className={`text-${passwordStrength.color}-400 flex items-center gap-2`}>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-8 h-2 rounded-full ${
                        i < passwordStrength.score 
                          ? `bg-${passwordStrength.color}-400` 
                          : 'bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
                <span>{passwordStrength.label}</span>
              </div>
            </div>

            <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50">
              <div className="text-slate-400 mb-1 text-sm">Detected Pattern</div>
              <div className="text-slate-200">{detectedPattern}</div>
            </div>

            <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/50">
              <div className="text-slate-400 mb-1 text-sm">Est. Crack Time</div>
              <div className="text-slate-200">{estimatedTime}</div>
            </div>
          </div>
        </div>

        {/* Attack Phase Indicator */}
        <div className="mb-6 bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/30 p-6 border border-slate-800/50">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-5 h-5 text-orange-400" />
            <h3 className="text-slate-100">Attack Phase</h3>
          </div>

          <div className="flex items-center gap-4 mb-4">
            {(['dictionary', 'hybrid', 'bruteforce'] as AttackPhase[]).map((phase) => (
              <div
                key={phase}
                className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                  currentPhase === phase
                    ? 'bg-orange-400'
                    : currentPhase === 'complete' || 
                      (['dictionary', 'hybrid', 'bruteforce'].indexOf(currentPhase) > 
                       ['dictionary', 'hybrid', 'bruteforce'].indexOf(phase))
                      ? 'bg-emerald-400'
                      : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className={currentPhase === 'dictionary' ? 'text-orange-400' : 'text-slate-500'}>
              Dictionary
            </div>
            <div className={currentPhase === 'hybrid' ? 'text-orange-400' : 'text-slate-500'}>
              Hybrid
            </div>
            <div className={currentPhase === 'bruteforce' ? 'text-orange-400' : 'text-slate-500'}>
              Brute-Force
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-slate-300">
            <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
            <span>{phaseDescription}</span>
          </div>

          {currentPhase !== 'bruteforce' && currentAttempt && (
            <div className="mt-3 p-3 bg-slate-800/40 rounded-lg border border-slate-700/50 font-mono text-sm text-slate-400">
              Testing: <span className="text-blue-400">{currentAttempt}</span>
            </div>
          )}
        </div>

        {/* Character Visualization (only during brute-force phase) */}
        {currentPhase === 'bruteforce' && (
          <div className="mb-6 bg-slate-900/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/50 p-8 border border-slate-800/50">
            <CharacterCracker
              password={targetPassword}
              currentPosition={currentPosition}
              currentChar={currentChar}
              crackedChars={crackedChars}
              isActive={isRunning}
            />
          </div>
        )}

        {/* Stats Panel */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
              {totalAttempts.toLocaleString()}
            </div>
          </div>

          <div className="bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/30 p-6 border border-slate-800/50">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-slate-400">Progress</span>
            </div>
            <div className="text-slate-100 font-mono">
              {currentPhase === 'bruteforce' 
                ? `${crackedChars.length}/${targetPassword.length} chars` 
                : currentPhase === 'dictionary' 
                  ? 'Dictionary' 
                  : currentPhase === 'hybrid'
                    ? 'Hybrid'
                    : 'Analyzing'}
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
        <div className="mb-6 bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/30 p-6 border border-slate-800/50">
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
        <div className="bg-blue-500/10 backdrop-blur-xl rounded-2xl shadow-lg shadow-black/30 p-6 border border-blue-500/30">
          <h4 className="text-blue-300 mb-2">How This Intelligent Attack Works</h4>
          <p className="text-blue-200/80 leading-relaxed mb-3">
            This simulation demonstrates real-world attack strategies used by sophisticated attackers:
          </p>
          <ul className="space-y-2 text-blue-200/80">
            <li className="flex gap-2">
              <span className="text-blue-400">1.</span>
              <span><strong>Dictionary Attack:</strong> Tests millions of known leaked passwords first (fastest method)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400">2.</span>
              <span><strong>Hybrid Attack:</strong> Combines common words with typical variations (Password123, Admin!, etc.)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-400">3.</span>
              <span><strong>Smart Brute-Force:</strong> Uses character frequency analysis and pattern learning to optimize guessing</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
