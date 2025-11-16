'use server';

/**
 * @fileOverview A question answering AI agent that answers questions about uploaded resources.
 *
 * - answerQuestionsAboutResources - A function that handles the question answering process.
 * - AnswerQuestionsAboutResourcesInput - The input type for the answerQuestionsAboutResources function.
 * - AnswerQuestionsAboutResourcesOutput - The return type for the answerQuestionsAboutResources function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerQuestionsAboutResourcesInputSchema = z.object({
  question: z.string().describe('The question to answer.'),
  sessionId: z.string().describe('The ID of the session containing the uploaded resources.'),
});
export type AnswerQuestionsAboutResourcesInput = z.infer<
  typeof AnswerQuestionsAboutResourcesInputSchema
>;

const AnswerQuestionsAboutResourcesOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
});
export type AnswerQuestionsAboutResourcesOutput = z.infer<
  typeof AnswerQuestionsAboutResourcesOutputSchema
>;

export async function answerQuestionsAboutResources(
  input: AnswerQuestionsAboutResourcesInput
): Promise<AnswerQuestionsAboutResourcesOutput> {
  return answerQuestionsAboutResourcesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerQuestionsAboutResourcesPrompt',
  input: {schema: AnswerQuestionsAboutResourcesInputSchema},
  output: {schema: AnswerQuestionsAboutResourcesOutputSchema},
  prompt: `You are a helpful study assistant. Answer the following question based on the content of the user's uploaded resources. If you cannot answer the question based on the resources, say that you don't know.\n\nQuestion: {{{question}}}`,
});

const answerQuestionsAboutResourcesFlow = ai.defineFlow(
  {
    name: 'answerQuestionsAboutResourcesFlow',
    inputSchema: AnswerQuestionsAboutResourcesInputSchema,
    outputSchema: AnswerQuestionsAboutResourcesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
