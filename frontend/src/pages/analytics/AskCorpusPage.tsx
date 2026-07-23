import AnswerCard from '../../components/analytics/chat/AnswerCard'
import QuestionInput from '../../components/analytics/chat/QuestionInput'
import SuggestedQuestions from '../../components/analytics/chat/SuggestedQuestions'

import MediaTypeChart from '../../components/analytics/charts/MediaTypeChart'
import LanguageChart from '../../components/analytics/charts/LanguageChart'

import MainLayout from '../../layouts/MainLayout'

import { useInsights } from '../../hooks/useInsights'

const AskCorpusPage = () => {
  const { answer, chart, askQuestion } = useInsights()

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">Ask Corpus</h1>
          <p className="mt-2 text-gray-500">
            Ask questions and explore analytics from the Indic Corpus Platform.
          </p>
        </div>

        <QuestionInput onAsk={askQuestion} />

        <SuggestedQuestions onSelect={askQuestion} />

        {answer && <AnswerCard answer={answer} />}

        {chart === 'mediaType' && (
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Recordings by Media Type</h2>
            <MediaTypeChart />
          </div>
        )}

        {chart === 'language' && (
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Top Languages by Record Count</h2>
            <LanguageChart />
          </div>
        )}
      </div>
    </MainLayout>
  )
}

export default AskCorpusPage
