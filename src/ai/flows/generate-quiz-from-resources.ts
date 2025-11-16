'use server';

/**
 * @fileOverview Generates a quiz from the provided resources.
 *
 * - generateQuiz - A function that generates a quiz from the provided resources.
 * - GenerateQuizInput - The input type for the generateQuiz function.
 * - GenerateQuizOutput - The return type for the generateQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizInputSchema = z.object({
  resourceSummary: z.string().describe('A summary of the resources to generate a quiz from.'),
  numberOfQuestions: z.number().describe('The number of questions to generate.'),
  difficulty: z.enum(['easy', 'medium', 'hard']).describe('The difficulty of the quiz questions.'),
  answerType: z.enum(['one-word', 'short', 'long']).describe('The desired answer type for the quiz questions.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const GenerateQuizOutputSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string().describe('The quiz question.'),
      answer: z.string().describe('The correct answer to the question.'),
    })
  ).describe('The generated quiz questions and answers.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: {schema: GenerateQuizInputSchema},
  output: {schema: GenerateQuizOutputSchema},
  prompt: `You are an expert quiz generator. Given a summary of study resources, generate a quiz with the specified number of questions, difficulty, and answer type.\n\nResource Summary: {{{resourceSummary}}}\nNumber of Questions: {{{numberOfQuestions}}}\nDifficulty: {{{difficulty}}}\nAnswer Type: {{{answerType}}}\n\nFormat the output as a JSON object with a \"questions\" array. Each question object should have a \"question\" field and an \"answer\" field.\n\nExample:\n{
  \"questions\": [
    {\n      \"question\": \"What is the capital of France?\",
      \"answer\": \"Paris\"
    },
    {\n      \"question\": \"What is the square root of 9?\",
      \"answer\": \"3\"
    }
  ]
}`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
