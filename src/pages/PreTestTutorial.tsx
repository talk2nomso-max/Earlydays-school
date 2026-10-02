import { useState } from 'react';
import { PlayCircle, ArrowRight, Clock, MousePointer, Eye, CheckCircle, Lightbulb, Brain, ShieldCheck, Star } from 'lucide-react';

interface PreTestTutorialProps {
  studentName: string;
  classLevel: string;
  onStart: () => void;
  onCancel: () => void;
}

const steps = [
  {
    icon: Eye,
    title: 'Read the Question Carefully',
    description: 'Look at the question slowly. Read it two times so you understand what it is asking. Take a deep breath before you answer.',
    color: 'from-primary-500 to-primary-700',
  },
  {
    icon: MousePointer,
    title: 'Choose Your Answer',
    description: 'Click on the answer you think is correct. The box will turn blue when you pick it. You can change your answer by clicking another one.',
    color: 'from-accent-500 to-accent-700',
  },
  {
    icon: Clock,
    title: 'Watch the Timer',
    description: 'Each question has a timer. The blue bar shows how much time you have left. Answer before the time runs out!',
    color: 'from-error-500 to-error-700',
  },
  {
    icon: ArrowRight,
    title: 'Move to the Next Question',
    description: 'After answering, click the green "Next" button to go to the next question. You can also use the number grid at the bottom to jump to any question.',
    color: 'from-success-500 to-success-700',
  },
  {
    icon: ShieldCheck,
    title: 'Stay on the Quiz Page',
    description: 'Do not switch to other tabs or close the window. The quiz must stay open the whole time. If you leave, the teacher will know!',
    color: 'from-primary-600 to-primary-800',
  },
  {
    icon: Star,
    title: 'Do Your Best!',
    description: 'Answer every question. If you are not sure, pick the answer you think is closest. Every question you get right brings you closer to winning ₦30,000!',
    color: 'from-accent-600 to-accent-800',
  },
];

export default function PreTestTutorial({ studentName, classLevel, onStart, onCancel }: PreTestTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const isLast = currentStep === steps.length - 1;
  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl shadow-lg mb-4">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-gray-900 mb-2">
            Hello {studentName}! Let's Learn How to Take the Quiz
          </h1>
          <p className="text-gray-600">
            Before we start, let's practice how the quiz works. This will help you do your best!
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === currentStep ? 'w-8 bg-primary-600' : i < currentStep ? 'w-2 bg-success-500' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Step Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-6 animate-fade-in" key={currentStep}>
          <div className={`inline-flex p-5 rounded-2xl bg-gradient-to-br ${step.color} mb-6 shadow-md`}>
            <Icon className="w-12 h-12 text-white" />
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
              Step {currentStep + 1} of {steps.length}
            </span>
            {currentStep >= 4 && (
              <span className="text-xs font-bold text-error-600 bg-error-50 px-3 py-1 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Important Rule
              </span>
            )}
          </div>

          <h2 className="font-display text-xl font-bold text-gray-900 mb-3">{step.title}</h2>
          <p className="text-gray-600 leading-relaxed text-base">{step.description}</p>

          {/* Demo illustration for step 2 (choosing answer) */}
          {currentStep === 1 && (
            <div className="mt-6 space-y-2">
              <p className="text-sm text-gray-500 mb-2">Here is what it looks like:</p>
              <div className="border-2 border-primary-500 bg-primary-50 rounded-xl px-5 py-3 flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-primary-500 text-white flex items-center justify-center text-sm font-bold">A</div>
                <span className="font-medium text-primary-900">12</span>
              </div>
              <div className="border-2 border-gray-200 rounded-xl px-5 py-3 flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center text-sm font-bold">B</div>
                <span className="font-medium text-gray-700">15</span>
              </div>
            </div>
          )}

          {/* Demo illustration for step 2 (timer) */}
          {currentStep === 2 && (
            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-2">Here is what the timer looks like:</p>
              <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full" style={{ width: '65%' }} />
              </div>
              <div className="text-center text-xs text-gray-500 mt-1">Time left: 39 seconds</div>
            </div>
          )}

          {/* Anti-malpractice warning */}
          {currentStep === 4 && (
            <div className="mt-6 bg-error-50 border-2 border-error-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-error-600" />
                <span className="font-semibold text-error-800">Anti-Cheating Rules</span>
              </div>
              <ul className="space-y-1 text-sm text-error-700">
                <li>• Do not open any other website or app</li>
                <li>• Do not ask anyone for help with answers</li>
                <li>• Do not copy or search for answers</li>
                <li>• The quiz is watching to make sure it is fair for everyone</li>
              </ul>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => (currentStep === 0 ? onCancel() : setCurrentStep(currentStep - 1))}
            className="px-5 py-3 bg-white border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
          >
            {currentStep === 0 ? 'Cancel' : 'Back'}
          </button>

          {!isLast ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all flex items-center gap-2"
            >
              Next Step
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <div className="flex flex-col items-end gap-3">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-5 h-5 rounded text-primary-600"
                />
                I understand the rules and I am ready to start
              </label>
              <button
                onClick={onStart}
                disabled={!agreed}
                className="px-8 py-3 bg-gradient-to-r from-success-500 to-success-600 text-white rounded-xl font-bold hover:from-success-600 hover:to-success-700 transition-all shadow-lg flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <PlayCircle className="w-5 h-5" />
                Start My Quiz Now!
              </button>
            </div>
          )}
        </div>

        {/* Tip box */}
        <div className="mt-6 bg-accent-50 border border-accent-200 rounded-xl p-4 flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-accent-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-accent-800">Tip for {classLevel} students</p>
            <p className="text-sm text-accent-700 mt-1">
              You have a timer for each question. Answer as quickly as you can, but make sure to read the question first!
              If the timer runs out, the quiz will move to the next question automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
