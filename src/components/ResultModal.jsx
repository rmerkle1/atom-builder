export default function ResultModal({ result, errors, onDismiss, onNextChallenge }) {
  const isCorrect = result === 'correct';

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
         onClick={onDismiss}>
      <div
        className={`relative max-w-md w-full mx-4 rounded-2xl p-6 border-2 shadow-2xl
          ${isCorrect
            ? 'bg-emerald-950 border-emerald-500'
            : 'bg-slate-900 border-red-500/60'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="text-4xl text-center mb-3">
          {isCorrect ? '🎉' : '🔬'}
        </div>
        <h2 className={`text-2xl font-bold text-center mb-2
          ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
          {isCorrect ? 'Correct!' : 'Not quite…'}
        </h2>

        {isCorrect ? (
          <p className="text-slate-300 text-center text-sm mb-5">
            Great work! You built the atom correctly.
          </p>
        ) : (
          <ul className="mt-2 mb-5 space-y-2">
            {errors.map((e, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-red-300">
                <span className="mt-0.5 text-red-500">✗</span>
                <span>{e}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex gap-3">
          <button
            onClick={onDismiss}
            className="flex-1 py-2 rounded-lg bg-slate-700 hover:bg-slate-600
                       text-slate-200 text-sm font-semibold transition-colors"
          >
            {isCorrect ? 'Review' : 'Try Again'}
          </button>
          {isCorrect && (
            <button
              onClick={onNextChallenge}
              className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500
                         text-white text-sm font-semibold transition-colors"
            >
              Next Challenge →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
