import { config } from 'dotenv';
config();

import '@/ai/flows/generate-quiz-from-resources.ts';
import '@/ai/flows/answer-questions-about-resources.ts';
import '@/ai/flows/generate-notes-from-resources.ts';
import '@/ai/flows/generate-mind-map-from-resources.ts';