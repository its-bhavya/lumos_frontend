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
import { Check, ChevronsRight, Loader2, Sparkles, X } from "lucide-react";

type QuizState = 'config' | 'loading' | 'active' | 'finished';

type QuizQuestion = {
    question: string;
    answer: string;
};

type GenerateQuizOutput = {
    questions: QuizQuestion[];
}

const placeholderQuiz: GenerateQuizOutput = {
    questions: [
      { question: "What is the powerhouse of the cell?", answer: "Mitochondria" },
      { question: "Who was a key figure in the French Revolution?", answer: "Napoleon Bonaparte" },
      { question: "In computing, what is a tree data structure where each node has at most two children?", answer: "Binary Tree" },
    ],
  };

const formSchema = z.object({
  numberOfQuestions: z.string(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  answerType: z.enum(['one-word', 'short', 'long']),
});

type QuizResult = {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  score: number;
  feedback: string;
};

export default function QuizClientPage({ sessionId }: { sessionId: string }) {
  const [quizState, setQuizState] = useState<QuizState>('config');
  const [quizData, setQuizData] = useState<GenerateQuizOutput | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluation, setEvaluation] = useState<{ score: number, feedback: string } | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const router = useRouter();

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
    // Simulate API call to generate quiz
    await new Promise(resolve => setTimeout(resolve, 1500));
    setQuizData(placeholderQuiz);
    setQuizState('active');
  }

  const handleAnswerSubmit = async () => {
    if (!quizData) return;
    const currentQuestion = quizData.questions[currentQuestionIndex];
    const result = await evaluateAnswer(userAnswer, currentQuestion.answer);
    setEvaluation(result);
    setQuizResults(prev => [...prev, {
        question: currentQuestion.question,
        userAnswer: userAnswer,
        correctAnswer: currentQuestion.answer,
        ...result
    }]);
  };

  const handleNextQuestion = () => {
    const isLastQuestion = quizData && currentQuestionIndex === quizData.questions.length - 1;
    if (quizData && !isLastQuestion) {
        const newQuizResults = [...quizResults];
        if(!evaluation) { // if user skipped question
            const currentQuestion = quizData.questions[currentQuestionIndex];
            newQuizResults.push({
                question: currentQuestion.question,
                userAnswer: 'Skipped',
                correctAnswer: currentQuestion.answer,
                score: 0,
                feedback: `The correct answer is: "${currentQuestion.answer}"`
            });
            setQuizResults(newQuizResults);
        }

        setCurrentQuestionIndex(prev => prev + 1);
        setUserAnswer('');
        setEvaluation(null);
    } else {
        setQuizState('finished');
        localStorage.setItem(`quizResults_${sessionId}`, JSON.stringify(quizResults));
        router.push(`/dashboard/${sessionId}/quiz/summary`);
    }
  };
  

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
    return (
      <div className="container py-12 flex justify-center">
        <div className="w-full max-w-3xl space-y-6">
          <div>
              <p className="text-center text-muted-foreground font-medium mb-2">Question {currentQuestionIndex + 1} of {quizData?.questions.length}</p>
              <Progress value={progress} />
          </div>
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
                    <Button onClick={handleNextQuestion} variant="outline" className="w-full">Skip</Button>
                 </div>
              ) : (
                <div className="space-y-4">
                   <div className={`p-4 rounded-md flex items-start gap-3 ${evaluation.score === 100 ? 'bg-green-100 text-green-800' : evaluation.score > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {evaluation.score === 100 ? <Check className="h-5 w-5 mt-0.5"/> : <X className="h-5 w-5 mt-0.5"/>}
                        <p className="font-medium">{evaluation.feedback}</p>
                    </div>
                  <Button onClick={handleNextQuestion} className="w-full">
                    {currentQuestionIndex === quizData!.questions.length - 1 ? 'Finish & See Results' : 'Next Question'}
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
