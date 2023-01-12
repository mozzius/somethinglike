import { z } from "zod";
import { Configuration, OpenAIApi } from "openai";
import json5 from "json5";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { env } from "../../../env/server.mjs";

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const schema = z
  .array(
    z.object({
      title: z.string(),
      year: z.number(),
      description: z.string(),
      whyItsForYou: z.string(),
    })
  )
  .length(5);

export const aiRouter = createTRPCRouter({
  recommend: publicProcedure
    .input(z.object({ topic: z.string().default("movie"), prompt: z.string() }))
    .mutation(async ({ input }) => {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `// ${input.topic}Recommendations.js
import { z } from "zod";

const schema = z.array(
  z.object({
    title: z.string(),
  year: z.number(),
  description: z.string(),
  whyItsForYou: z.string(),  })
).length(5);

// get a request for the kind of ${input.topic} they want from the command line
const request = process.env.argv[2]

// fetch from API that recommends similar ${input.topic}s based on the user\'s interests
// it never recommends the same ${input.topic} twice
const res = await fetch("https://api.${input.topic}-recommendations.com/${input.topic}s", {
  method: "POST",
  body: JSON.stringify({ request, truncate: false }),
});

const data = await res.json();

const ${input.topic}s = schema.parse(data);

console.log(${input.topic}s)

// command line
> node movieRecommendations.js "${input.prompt}"
[{`,
        temperature: 0.7,
        max_tokens: 2297,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      const output = "[{" + (response.data.choices[0]?.text ?? "}]");
      console.log(output);
      return schema.parse(json5.parse(output));
    }),
});
