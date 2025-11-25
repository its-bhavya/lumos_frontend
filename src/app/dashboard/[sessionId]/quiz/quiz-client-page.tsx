
"use client";

import { useState, useEffect } from "react";
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
import { Check, ChevronsRight, Loader2, Sparkles, X, ArrowLeft, Info, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type QuizState = 'config' | 'loading' | 'active' | 'finished';

type QuizQuestion = {
    question_num: number;
    question: string;
};

type GenerateQuizOutput = {
    quiz_questions: QuizQuestion[];
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

const BACKEND_URL = "https://lumos-ai-69yf.onrender.com";

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

  useEffect(() => {
    // When the question index changes, check if there's an existing result
    // for the new question and populate the fields.
    const resultForCurrentQuestion = quizResults.find(
      (r) => r.question_num === quizData?.quiz_questions[currentQuestionIndex]?.question_num
    );
    if (resultForCurrentQuestion) {
      setUserAnswer(resultForCurrentQuestion.userAnswer);
      setEvaluation({
        score: resultForCurrentQuestion.score,
        feedback: resultForCurrentQuestion.feedback,
        correct_answer: resultForCurrentQuestion.correctAnswer,
      });
    } else {
      setUserAnswer('');
      setEvaluation(null);
    }
  }, [currentQuestionIndex, quizData, quizResults]);


  async function onStartQuiz(values: z.infer<typeof formSchema>) {
    setQuizState('loading');
    try {
      const formData = new FormData();
      formData.append('session_id', sessionId);
      formData.append('num_questions', values.numberOfQuestions);
      formData.append('difficulty', values.difficulty);
      formData.append('type', values.answerType);

      const response = await fetch(`${BACKEND_URL}/get_quiz_questions`, {
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
    const currentQuestion = quizData.quiz_questions[currentQuestionIndex];
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
    const isLastQuestion = quizData && currentQuestionIndex === quizData.quiz_questions.length - 1;

    if (!isLastQuestion) {
        setCurrentQuestionIndex(prev => prev + 1);
    } else {
        setQuizState('finished');
        localStorage.setItem(`quizSession_${sessionId}`, "active");
        router.push(`/dashboard/${sessionId}/quiz/summary`);
    }
  };

  const handleSkipQuestion = () => {
     handleNextQuestion();
  }

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  }
  
  const answeredQuestionsCount = quizData ? quizResults.length : 0;
  const totalQuestionsCount = quizData ? quizData.quiz_questions.length : 0;
  const progress = totalQuestionsCount > 0 ? (answeredQuestionsCount / totalQuestionsCount) * 100 : 0;
  const currentQuestion = quizData?.quiz_questions[currentQuestionIndex];
  
  if (quizState === 'loading' || quizState === 'finished') {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center space-y-4">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <h1 className="font-headline text-4xl text-primary">
          {quizState === 'loading' ? 'Generating Your Quiz...' : 'Calculating your results...'}
        </h1>
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
                  {quizData?.quiz_questions.map((q, index) => {
                       const isAnswered = quizResults.some(r => r.question_num === q.question_num);
                       return (
                        <button 
                          key={q.question_num}
                          onClick={() => goToQuestion(index)}
                          className={cn(
                              "h-8 w-8 rounded-full flex items-center justify-center transition-colors",
                              index === currentQuestionIndex ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-primary/80",
                               isAnswered && index !== currentQuestionIndex ? "bg-green-300 dark:bg-green-700" : ""
                          )}
                        >
                          {index + 1}
                        </button>
                       )
                  })}
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
                    <Button onClick={handleSkipQuestion} variant="outline">
                        <SkipForward className="mr-2 h-4 w-4"/>
                        Skip
                    </Button>
                 </div>
              ) : (
                <div className="space-y-4">
                   {evaluation && (
                     <div className="space-y-4">
                        <div className={`p-4 rounded-md flex items-start gap-3 ${evaluation.score === 1 ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : evaluation.score >= 0.5 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                            {evaluation.score === 1 ? <Check className="h-5 w-5 mt-0.5"/> : <X className="h-5 w-5 mt-0.5"/>}
                            <p className="font-medium">{evaluation.feedback}</p>
                        </div>
                        {evaluation.score < 1 && (
                            <div className="p-4 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 flex items-start gap-3">
                                <Info className="h-5 w-5 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold">Correct Answer</h4>
                                    <p className="font-medium">{evaluation.correct_answer}</p>
                                </div>
                            </div>
                        )}
                     </div>
                   )}
                  <Button onClick={handleNextQuestion} className="w-full">
                    {quizData && currentQuestionIndex === quizData.quiz_questions.length - 1 ? 'Finish & See Results' : 'Next Question'}
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

    

    