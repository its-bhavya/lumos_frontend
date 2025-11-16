"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { evaluateAnswer } from "@/app/actions";
import { Check, ChevronsRight, Loader2, Sparkles, X, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type QuizState = 'config' | 'loading' | 'active' | 'finished';

type QuizQuestion = {
    question_num: number;
    question: string;
};

type GenerateQuizOutput = {
    questions: QuizQuestion[];
}

const formSchema = z.object({
  numberOfQuestions: z.string(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  answerType: z.enum(['one-word', 'short', 'long']),
});

type QuizResult = {
  question_num: number;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  score: number;
  feedback: string;
};

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function QuizClientPage({ sessionId }: { sessionId: string }) {
  const [quizState, setQuizState] = useState<QuizState>('config');
  const [quizData, setQuizData] = useState<GenerateQuizOutput | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluation, setEvaluation] = useState<{ score: number, feedback: string, correct_answer: string } | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numberOfQuestions: "3",
      difficulty: "medium",
      answerType: "short",
    },
  });

  async function onStartQuiz(values: z.infer<typeof formSchema>) {
    setQuizState('loading');
    try {
      const formData = new FormData();
      formData.append('session_id', sessionId);
      formData.append('num_questions', values.numberOfQuestions);
      formData.append('difficulty', values.difficulty);
      formData.append('question_type', values.answerType);

      const response = await fetch(`${BACKEND_URL}/generate_quiz`, {
          method: 'POST',
          body: formData,
      });

      if (!response.ok) {
          throw new Error('Failed to generate quiz');
      }

      const generatedQuiz: GenerateQuizOutput = await response.json();
      setQuizData(generatedQuiz);
      setQuizState('active');

    } catch (error) {
        console.error("Quiz generation error:", error);
        toast({
            variant: "destructive",
            title: "Quiz Generation Failed",
            description: "There was a problem creating your quiz. Please try again."
        });
        setQuizState('config');
    }
  }

  const handleAnswerSubmit = async () => {
    if (!quizData) return;
    const currentQuestion = quizData.questions[currentQuestionIndex];
    try {
        const result = await evaluateAnswer(sessionId, currentQuestion.question_num, userAnswer);
        setEvaluation(result);
        const newResult: QuizResult = {
            question_num: currentQuestion.question_num,
            question: currentQuestion.question,
            userAnswer: userAnswer,
            correctAnswer: result.correct_answer,
            score: result.score,
            feedback: result.feedback,
        };
        // Replace if already answered, else add
        setQuizResults(prev => {
            const existingIndex = prev.findIndex(r => r.question_num === currentQuestion.question_num);
            if(existingIndex > -1) {
                const updated = [...prev];
                updated[existingIndex] = newResult;
                return updated;
            }
            return [...prev, newResult];
        });

    } catch(error) {
        console.error("Answer evaluation error:", error);
        toast({
            variant: "destructive",
            title: "Evaluation Failed",
            description: "Could not submit your answer. Please try again."
        });
    }
  };

  const handleNextQuestion = () => {
    const isLastQuestion = quizData && currentQuestionIndex === quizData.questions.length - 1;

    if (!isLastQuestion) {
        setCurrentQuestionIndex(prev => prev + 1);
        setUserAnswer('');
        setEvaluation(null);
    } else {
        setQuizState('finished');
        // We use local storage to pass results to the summary page,
        // because the backend's finish_quiz doesn't take the results directly.
        localStorage.setItem(`quizSession_${sessionId}`, "active");
        router.push(`/dashboard/${sessionId}/quiz/summary`);
    }
  };

  const goToQuestion = (index: number) => {
    // Allow navigation only to answered questions or the current one.
    if (index < quizResults.length) {
      setCurrentQuestionIndex(index);
      const pastResult = quizResults[index];
      setUserAnswer(pastResult.userAnswer);
      // We set evaluation to show the past result feedback
      setEvaluation({
          score: pastResult.score,
          feedback: pastResult.feedback,
          correct_answer: pastResult.correctAnswer
      });
    }
  }
  
  const progress = quizData ? ((currentQuestionIndex + 1) / quizData.questions.length) * 100 : 0;
  const currentQuestion = quizData?.questions[currentQuestionIndex];

  if (quizState === 'loading') {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center space-y-4">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <h1 className="font-headline text-4xl text-primary">Generating Your Quiz...</h1>
      </div>
    );
  }

  if (quizState === 'active' && currentQuestion) {
    const isQuestionAnswered = quizResults.some(r => r.question_num === currentQuestion.question_num);

    return (
      <div className="container py-12 flex justify-center">
        <div className="w-full max-w-4xl space-y-6">
           <div className="flex items-center justify-between">
              <div className="w-24"></div>
              <div className="flex gap-2 items-center text-muted-foreground font-medium">
                  {quizData?.questions.map((q, index) => (
                      <button 
                        key={q.question_num}
                        onClick={() => goToQuestion(index)}
                        disabled={index >= quizResults.length}
                        className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center transition-colors",
                            index === currentQuestionIndex ? "bg-primary text-primary-foreground" : "bg-secondary",
                            index < quizResults.length ? "hover:bg-primary/80" : "cursor-not-allowed"
                        )}
                      >
                        {index + 1}
                      </button>
                  ))}
              </div>
              <div className="w-24"></div>
          </div>
          <Progress value={progress} />
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl leading-relaxed">{currentQuestion.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Type your answer here..."
                rows={4}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={!!evaluation}
              />
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-4">
              {!evaluation ? (
                 <div className="flex gap-2">
                    <Button onClick={handleAnswerSubmit} disabled={!userAnswer} className="w-full">Submit Answer</Button>
                 </div>
              ) : (
                <div className="space-y-4">
                   {evaluation && (
                    <div className={`p-4 rounded-md flex items-start gap-3 ${evaluation.score === 100 ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : evaluation.score >= 50 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                        {evaluation.score === 100 ? <Check className="h-5 w-5 mt-0.5"/> : <X className="h-5 w-5 mt-0.5"/>}
                        <p className="font-medium">{evaluation.feedback}</p>
                    </div>
                   )}
                  <Button onClick={handleNextQuestion} className="w-full">
                    {quizData && currentQuestionIndex === quizData.questions.length - 1 ? 'Finish & See Results' : 'Next Question'}
                    <ChevronsRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12 flex justify-center">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
            <CardTitle className="font-headline text-3xl">Quiz Setup</CardTitle>
            <CardDescription>Configure your quiz and start testing your knowledge.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onStartQuiz)} className="space-y-6">
              <FormField
                control={form.control}
                name="numberOfQuestions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Questions</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select number of questions" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[3, 5, 10, 15].map(n => <SelectItem key={n} value={String(n)}>{n} Questions</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select difficulty" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="answerType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Answer Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select answer type" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="one-word">One Word</SelectItem>
                        <SelectItem value="short">Short Answer</SelectItem>
                        <SelectItem value="long">Long Answer</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" size="lg">
                <Sparkles className="mr-2 h-5 w-5" />
                Start Quiz
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
