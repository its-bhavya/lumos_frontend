import QuizClientPage from "./quiz-client-page";

export default function QuizPage({ params }: { params: { sessionId: string } }) {
  return <QuizClientPage sessionId={params.sessionId} />;
}
