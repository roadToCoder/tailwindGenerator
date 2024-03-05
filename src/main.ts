import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const form = document.querySelector("#generate-form") as HTMLFormElement;
const generateIframe = document.querySelector(
  "#generated-code"
) as HTMLIFrameElement;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  const prompt = formData.get("prompt") as string;

  await getResponse(prompt);
});

const getResponse = async (prompt: string) => {
  const stream = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant designed to create beatiful landing pages with tailwind. i want only html code, no commentary. Return only valid html code. The result must not contain '```html' and '```'. Generate and give me only the code generated after the 'body' tag (but never with this tag and markdown syntax). If user ask you anything else than a landing page, return 'Sorry, I can't fulfill your request.'",
      },
      { role: "user", content: prompt },
    ],
    model: "gpt-4-0125-preview",
    stream: true,
  });
  
  let response = "";
  const updateIframe = createTimedUdpateIframe()

  for await (const chunk of stream) {
    const isDone = chunk.choices[0].finish_reason === "stop";
    response += chunk.choices[0]?.delta?.content || ""
    updateIframe(response)
    
  }

};

const updateIframe = (response: string) => {
  generateIframe.srcdoc = `
    <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <script src="https://cdn.tailwindcss.com"></script>
          <title>Generated code</title>
        </head>
        <body>
        
          ${response}
        </body>
      </html>`;

}

const createTimedUdpateIframe = () => {
  
  let date = new Date();
  let timeout: any = null;

  return (response: string) => {

    // only call updateIframe if last call was more than 1 second ago
    if(new Date().getTime() - date.getTime() > 1000){
      updateIframe(response);
      date = new Date();
    }

    // clear previous timeout
    if (timeout) {
      clearTimeout(timeout);
    }

    // set new timeout
    timeout = setTimeout(() => {
      updateIframe(response);
    }, 1000)
  }

}