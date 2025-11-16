import QuizSummaryClientPage from "./quiz-summary-client-page";

export default function QuizSummaryPage({ params }: { params: { sessionId: string } }) {
  return <QuizSummaryClientPage sessionId={params.sessionId} />;
}
