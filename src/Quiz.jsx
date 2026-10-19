import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Couple } from './Characters.jsx'
import { useFX } from './FX.jsx'
import { config } from './config.js'
import loadingGif from './photos/quiz-loading.gif'

export default function Quiz({ onBack, onReplay }) {
  const fx = useFX()
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const [finished, setFinished] = useState(false)

  const questions = config.quizQuestions
  const question = questions[current]
  const answered = selected !== null

  useEffect(() => {
    if (!loading) return undefined

    const timer = window.setTimeout(() => {
      setLoading(false)
      setFinished(true)
      fx.burst(window.innerWidth / 2, window.innerHeight / 2, { count: 28, spread: 220 })
    }, 2800)

    return () => window.clearTimeout(timer)
  }, [fx, loading])

  const answer = (choiceIndex) => {
    if (answered) return

    setSelected(choiceIndex)
  }

  const next = () => {
    const nextAnswers = [...answers, selected]
    setAnswers(nextAnswers)

    if (current === questions.length - 1) {
      setLoading(true)
      return
    }

    setCurrent((value) => value + 1)
    setSelected(null)
  }

  const restart = () => {
    setCurrent(0)
    setAnswers([])
    setSelected(null)
    setLoading(false)
    setFinished(false)
  }

  const score = answers.reduce(
    (total, choiceIndex, index) => total + (questions[index].choices[choiceIndex]?.correct ? 1 : 0),
    0,
  )
  const scoreCaption =
    score <= 4
      ? "Damn, you really don't love me"
      : score <= 6
        ? 'Do you really love me?'
        : score <= 9
          ? 'You should know be better'
          : 'you really love me'

  return (
    <div className="quiz-root">
      <motion.section
        className="quiz"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 14 }}
      >
        <div className="quiz-head">
          <Couple small happy={finished} gifSlot="closing" />
          <span className="quiz-kicker">a tiny love quiz</span>
          <h2>How well do you know us?</h2>
          <p>{finished ? 'You are officially my favorite person to quiz!' : 'Let’s see how much you remember 💗'}</p>
        </div>

      {loading ? (
        <motion.div
          className="quiz-loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <img src={loadingGif} alt="Cute animation while your score is being calculated" />
          <strong>Calculating your love score...</strong>
          <span>Don’t peek yet 👀</span>
        </motion.div>
      ) : !finished ? (
        <div className="quiz-card">
          <div className="quiz-progress" aria-label={`Question ${current + 1} of ${questions.length}`}>
            <span>
              question {current + 1} / {questions.length}
            </span>
            <div className="quiz-progress-track">
              <motion.i
                animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
                transition={{ type: 'spring', stiffness: 180, damping: 20 }}
              />
            </div>
          </div>

          <motion.h3
            key={current}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
          >
            {question.prompt}
          </motion.h3>

          <div className="quiz-choices">
            {question.choices.map((choice, index) => {
              const isSelected = selected === index
              return (
                <button
                  key={choice.label}
                  className={`quiz-choice${isSelected ? ' selected' : ''}`}
                  type="button"
                  onClick={() => answer(index)}
                  disabled={answered}
                >
                  <span className="quiz-choice-letter">{String.fromCharCode(65 + index)}</span>
                  <span>{choice.label}</span>
                </button>
              )
            })}
          </div>

          {answered && (
            <motion.div
              className="quiz-feedback"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span>Your answer is locked in 💗</span>
              <button className="btn quiz-next" type="button" onClick={next}>
                {current === questions.length - 1 ? 'Submit answers' : 'Next question →'}
              </button>
            </motion.div>
          )}
        </div>
      ) : (
        <motion.div
          className="quiz-result"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 13 }}
        >
          <span className="quiz-score">{score} / {questions.length}</span>
          <p>{scoreCaption}</p>
          <div className="quiz-review">
            {questions.map((item, index) => {
              const selectedAnswer = item.choices[answers[index]]
              const correctAnswer = item.choices.find((choice) => choice.correct)
              return (
                <div className={`quiz-review-item${selectedAnswer?.correct ? ' is-correct' : ''}`} key={item.prompt}>
                  <strong>{index + 1}. {item.prompt}</strong>
                  <span>Your answer: {selectedAnswer?.label}</span>
                  {!selectedAnswer?.correct && <span>Correct answer: {correctAnswer.label}</span>}
                </div>
              )
            })}
          </div>
          <button className="btn quiz-retry" type="button" onClick={restart}>
            Try again 🔁
          </button>
        </motion.div>
      )}
      </motion.section>

      <div className="quiz-actions">
        <button className="btn btn-quiz-back" type="button" onClick={onBack}>
          ← Back to gallery
        </button>
        <button className="btn btn-replay" type="button" onClick={onReplay}>
          {config.replayLabel}
        </button>
      </div>
    </div>
  )
}
