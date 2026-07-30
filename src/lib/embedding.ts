import { openai } from "@ai-sdk/openai";
import { embed, embedMany } from "ai";



export async function generateEmbedding(text: string) {
  const input = text.replaceAll("\n", " ");

  const { embedding } = await embed({
    model: openai.embeddingModel("text-embedding-3-small"),
    value: input,
    providerOptions: {
      openai: {
        dimensions: 768,
      },
    },
  });

  return embedding;
}

export async function generateEmbeddings(texts: string[]) {
  const inputs = texts.map((text) => text.replaceAll("\n", " "));

  const batchSize = 90;
  const allEmbeddings: number[][] = [];

  for (let i = 0; i < inputs.length; i += batchSize) {
    const batch = inputs.slice(i, i + batchSize);

    const { embeddings } = await embedMany({
      model: openai.embeddingModel("text-embedding-3-small"),
      values: batch,
      providerOptions: {
        openai: {
          dimensions: 768,
        },
      },
    });

    allEmbeddings.push(...embeddings);
  }

  return allEmbeddings;
}
