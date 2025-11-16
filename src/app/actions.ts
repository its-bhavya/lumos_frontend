"use server";

import { v4 as uuidv4 } from 'uuid';

// Mock delay to simulate network latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function createSession(): Promise<string> {
  await delay(500);
  const sessionId = uuidv4();
  console.log(`Session created: ${sessionId}`);
  return sessionId;
}

export async function uploadResource(sessionId: string, resourceType: string, resourceName: string): Promise<{ success: boolean; message: string }> {
  await delay(1000);
  console.log(`Uploaded ${resourceType} "${resourceName}" to session ${sessionId}`);
  return { success: true, message: `${resourceType} uploaded successfully.` };
}


export async function buildIndex(sessionId: string): Promise<{ success: boolean }> {
  console.log(`Building index for session: ${sessionId}`);
  await delay(3000); // Simulate a longer process for index building
  console.log(`Index built successfully for session: ${sessionId}`);
  return { success: true };
}

export async function getCombinedResourceText(sessionId: string): Promise<string> {
  console.log(`Fetching combined text for session: ${sessionId}`);
  await delay(500);
  return `The mitochondria is the powerhouse of the cell. It generates most of the cell's supply of adenosine triphosphate (ATP), used as a source of chemical energy. Photosynthesis is a process used by plants and other organisms to convert light energy into chemical energy, through a cellular process that converts carbon dioxide and water into glucose and oxygen. The French Revolution was a period of radical political and societal change in France that began with the Estates General of 1789 and ended with the formation of the French Consulate in November 1799. Key figures include Napoleon Bonaparte, Robespierre, and Louis XVI. In computing, a binary tree is a tree data structure in which each node has at most two children, which are referred to as the left child and the right child.`;
}

export async function evaluateAnswer(userAnswer: string, correctAnswer: string): Promise<{ score: number, feedback: string }> {
  await delay(700);
  const normalizedUser = userAnswer.toLowerCase().trim();
  const normalizedCorrect = correctAnswer.toLowerCase().trim();

  if (normalizedUser === normalizedCorrect) {
    return { score: 100, feedback: "Correct!" };
  }
  
  if (normalizedCorrect.includes(normalizedUser) && normalizedUser.length > 3) {
    return { score: 75, feedback: `You're on the right track! The full answer is: "${correctAnswer}"` };
  }

  return { score: 0, feedback: `Not quite. The correct answer is: "${correctAnswer}"` };
}

export async function finishQuiz(sessionId: string, results: any[]): Promise<{ accuracy: number; strong_topics: string[]; weak_topics: string[]; topic_strength: Record<string, number> }> {
  await delay(500);
  const totalQuestions = results.length;
  const correctAnswers = results.filter(r => r.score === 100).length;
  const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

  // Mock topic analysis
  return {
    accuracy: parseFloat(accuracy.toFixed(1)),
    strong_topics: ["Cell Biology", "Data Structures"],
    weak_topics: ["French History"],
    topic_strength: {
      "Cell Biology": 0.9,
      "Photosynthesis": 0.8,
      "French Revolution": 0.4,
      "Computing": 0.95
    }
  };
}
