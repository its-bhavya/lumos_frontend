import ProcessingClientPage from "./processing-client-page";

export default function ProcessingPage({ params }: { params: { sessionId: string } }) {
  return <ProcessingClientPage sessionId={params.sessionId} />;
}
