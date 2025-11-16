'use server';
/**
 * @fileOverview Generates a mind map from user-uploaded resources.
 *
 * - generateMindMapFromResources - A function that generates a mind map from the provided resources.
 * - GenerateMindMapFromResourcesInput - The input type for the generateMindMapFromResources function.
 * - GenerateMindMapFromResourcesOutput - The return type for the generateMindMapFromResources function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMindMapFromResourcesInputSchema = z.object({
  resourceText: z.string().describe('The extracted text content from the user-provided resources.'),
});
export type GenerateMindMapFromResourcesInput = z.infer<typeof GenerateMindMapFromResourcesInputSchema>;

const GenerateMindMapFromResourcesOutputSchema = z.object({
  mindMapSvg: z.string().describe('An SVG representation of the generated mind map.'),
});
export type GenerateMindMapFromResourcesOutput = z.infer<typeof GenerateMindMapFromResourcesOutputSchema>;

export async function generateMindMapFromResources(
  input: GenerateMindMapFromResourcesInput
): Promise<GenerateMindMapFromResourcesOutput> {
  return generateMindMapFromResourcesFlow(input);
}

const mindMapPrompt = ai.definePrompt({
  name: 'mindMapPrompt',
  input: {schema: GenerateMindMapFromResourcesInputSchema},
  output: {schema: GenerateMindMapFromResourcesOutputSchema},
  prompt: `You are an AI expert in creating mind maps.  Based on the text I provide, create a mind map in SVG format that visually organizes the information and shows the relationships between concepts.

  Text: {{{resourceText}}}
  `,
});

const generateMindMapFromResourcesFlow = ai.defineFlow(
  {
    name: 'generateMindMapFromResourcesFlow',
    inputSchema: GenerateMindMapFromResourcesInputSchema,
    outputSchema: GenerateMindMapFromResourcesOutputSchema,
  },
  async input => {
    const {output} = await mindMapPrompt(input);
    return output!;
  }
);
