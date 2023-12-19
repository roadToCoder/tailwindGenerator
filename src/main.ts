
import OpenAI from "openai";

const form = document.querySelector('#generateForm') as HTMLFormElement;
const iframe = document.querySelector('#generatedCode') as HTMLIFrameElement;

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY, 
    dangerouslyAllowBrowser: true
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const prompt = formData.get('prompt') as string;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        { role: "system", content: import.meta.env.VITE_PROMPT},
        { role: "user", content: prompt }
      ],
      // stream: true,
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    const code = chatCompletion.choices[0].message.content;

    if (!code) {
      console.log("Erreur: Aucun code généré");
      return;
    }
    
    iframe.srcdoc = `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Tailwind Generator</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="h-full">
        ${code}
      </body>
    </html>`;

    document.body.appendChild(iframe);
  } catch (error) {
    console.error("Erreur lors de la requête à OpenAI:", error);
  }
})

