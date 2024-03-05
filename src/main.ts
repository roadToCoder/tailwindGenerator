const form = document.querySelector("#generate-form") as HTMLFormElement;

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  const prompt = formData.get("prompt") as string;
  console.log(prompt);
  
});
