import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { PasswordSetup } from './components/PasswordSetup';
import { SmartSimulationPanel } from './components/SmartSimulationPanel';

export type DefenseSettings = {
  rateLimit: boolean;
  accountLockout: boolean;
  maxAttempts: number;
  attemptDelay: number;
};

export type SimulationResult = {
  success: boolean;
  password?: string;
  attempts: number;
  timeElapsed: number;
  reason: string;
  defensesTriggered: string[];
};

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'setup' | 'simulation' | 'results'>('landing');
  const [targetPassword, setTargetPassword] = useState('');
  const [defenseSettings, setDefenseSettings] = useState<DefenseSettings>({
    rateLimit: true,
    accountLockout: true,
    maxAttempts: 50,
    attemptDelay: 100
  });
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  const handleStartLab = () => {
    setCurrentPage('setup');
  };

  const handleRunSimulation = (password: string, settings: DefenseSettings) => {
    setTargetPassword(password);
    setDefenseSettings(settings);
    setCurrentPage('simulation');
  };

  const handleSimulationComplete = (result: SimulationResult) => {
    setSimulationResult(result);
  };

  const handleRestart = () => {
    setTargetPassword('');
    setSimulationResult(null);
    setCurrentPage('setup');
  };

  const handleBackToLanding = () => {
    setTargetPassword('');
    setSimulationResult(null);
    setCurrentPage('landing');
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {currentPage === 'landing' && (
        <LandingPage onStartLab={handleStartLab} />
      )}
      
      {currentPage === 'setup' && (
        <PasswordSetup 
          onRunSimulation={handleRunSimulation}
          onBack={handleBackToLanding}
          initialSettings={defenseSettings}
        />
      )}
      
      {currentPage === 'simulation' && (
        <SmartSimulationPanel
          targetPassword={targetPassword}
          defenseSettings={defenseSettings}
          onComplete={handleSimulationComplete}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

export default App;