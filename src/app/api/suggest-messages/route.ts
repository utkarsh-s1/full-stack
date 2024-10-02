import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.OPEN_AI_KEY });


async function getGroqChatCompletion() {
  const resp = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.",
      },
    ],
    model: "llama3-8b-8192",
  });
  return resp.choices[0]?.message?.content||"";
}

export async function POST (request:Request){

    try {
        const {message} = await request.json()
        const resp:string = await getGroqChatCompletion()
        return Response.json(
            { suggestedMessage: resp, success: false },
            { status: 404 }
          );

    } catch (error) {
        console.log("unexpected error ouccred")
        throw error
        
    }



}

