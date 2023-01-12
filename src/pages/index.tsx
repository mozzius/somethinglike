import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { Spinner } from "../components/spinner";

import { api, type RouterOutputs } from "../utils/api";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<
    RouterOutputs["ai"]["recommend"] | null
  >(null);
  const recommend = api.ai.recommend.useMutation({
    onSuccess: (data) => setResponse(data),
    onMutate: () => setLoading(true),
    onSettled: () => setLoading(false),
  });

  return (
    <>
      <Head>
        <title>Recommend Me Something</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="self-start text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Recommend Me Something
          </h1>
          <div className="flex w-full items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Something like Knives Out but more of a comedy"
              className="flex-1 rounded-md border border-white bg-transparent px-4 py-2 text-lg text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              onClick={() =>
                recommend.mutate({ topic: "movie", prompt: input })
              }
              className="rounded-md bg-white px-4 py-2 text-lg font-semibold text-[#15162c] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-white"
            >
              Ask the AI
            </button>
          </div>
          {loading ? (
            <Spinner />
          ) : recommend.error ? (
            <p className="text-white">Sorry, an error occured</p>
          ) : (
            response && (
              <div className="w-full space-y-4">
                {response.map((item) => (
                  <div key={item.title}>
                    <h1 className="text-xl text-white">
                      {item.title} ({item.year})
                    </h1>
                    <p className="text-white">{item.description}</p>
                    <p className="text-sm text-white/80">
                      <span className="font-bold">Why it{"'"}s for you:</span>{" "}
                      {item.whyItsForYou}
                    </p>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </main>
    </>
  );
};

export default Home;
