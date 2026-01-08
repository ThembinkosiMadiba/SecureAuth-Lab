import { motion } from 'motion/react';
import { Lock, Unlock } from 'lucide-react';

interface CharacterCrackerProps {
  password: string;
  currentPosition: number;
  currentChar: string;
  crackedChars: string[];
  isActive: boolean;
}

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

export function CharacterCracker({ 
  password, 
  currentPosition, 
  currentChar, 
  crackedChars, 
  isActive 
}: CharacterCrackerProps) {
  const passwordLength = password.length;

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-12">
      {/* Educational Label */}
      <div className="text-center space-y-2">
        <p className="text-slate-400 tracking-wide">
          {isActive ? (
            <>
              Analyzing Position <span className="text-blue-400 font-mono">{currentPosition + 1}</span> of <span className="font-mono">{passwordLength}</span>
            </>
          ) : (
            <>Password Analysis</>
          )}
        </p>
        <p className="text-slate-500 text-sm max-w-md">
          {isActive 
            ? 'The system tests each character position sequentially, cycling through all possible characters until a match is found.'
            : 'Waiting to begin character analysis...'}
        </p>
      </div>

      {/* Character Slots */}
      <div className="flex items-center gap-3 justify-center flex-wrap max-w-4xl">
        {Array.from({ length: passwordLength }).map((_, index) => {
          const isLocked = index < crackedChars.length;
          const isCurrentPosition = index === currentPosition;
          const displayChar = isLocked 
            ? crackedChars[index] 
            : isCurrentPosition && isActive 
              ? currentChar 
              : '?';

          return (
            <motion.div
              key={index}
              className={`relative flex items-center justify-center w-14 h-16 sm:w-16 sm:h-20 rounded-xl border-2 transition-all duration-300 ${
                isLocked
                  ? 'bg-emerald-500/10 border-emerald-500/30 shadow-lg shadow-emerald-500/10'
                  : isCurrentPosition && isActive
                    ? 'bg-blue-500/10 border-blue-400/50 shadow-lg shadow-blue-500/20'
                    : 'bg-slate-800/50 border-slate-700/50'
              }`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                y: isCurrentPosition && isActive ? [0, -4, 0] : 0
              }}
              transition={{ 
                duration: 0.4,
                y: {
                  duration: 1.5,
                  repeat: isCurrentPosition && isActive ? Infinity : 0,
                  ease: "easeInOut"
                }
              }}
            >
              {/* Character Display */}
              <motion.span
                key={displayChar}
                className={`font-mono tracking-tight ${
                  isLocked 
                    ? 'text-emerald-400' 
                    : isCurrentPosition && isActive 
                      ? 'text-blue-400' 
                      : 'text-slate-600'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
              >
                {displayChar}
              </motion.span>

              {/* Lock Icon Overlay */}
              {isLocked && (
                <motion.div
                  className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 shadow-lg"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 260, 
                    damping: 20 
                  }}
                >
                  <Lock className="w-3 h-3 text-slate-900" />
                </motion.div>
              )}

              {/* Active Indicator */}
              {isCurrentPosition && isActive && !isLocked && (
                <motion.div
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-400 rounded-full"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Progress Indicator */}
      <div className="w-full max-w-md space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Progress</span>
          <span className="text-slate-300 font-mono">
            {crackedChars.length} / {passwordLength} characters
          </span>
        </div>
        <div className="relative h-2 bg-slate-800/50 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ 
              width: `${(crackedChars.length / passwordLength) * 100}%` 
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Status Messages */}
      {isActive && (
        <motion.div
          className="flex items-center gap-2 text-sm text-slate-400 bg-slate-800/30 px-4 py-2 rounded-lg border border-slate-700/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Unlock className="w-4 h-4 text-blue-400" />
          <span>
            Testing character: <span className="text-blue-400 font-mono">{currentChar}</span>
          </span>
        </motion.div>
      )}
    </div>
  );
}
