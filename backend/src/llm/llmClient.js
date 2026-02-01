const Groq = require("groq-sdk");


const client = new Groq({
    apiKey: GROQ_API_KEY
});

async function callLLM(prompt) {
    const response = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile", // Fast & accurate
        temperature: 0,
        max_tokens: 2000,
        messages: [
            {
                role: "system",
                content: "You are a resume normalization engine. Extract skills, experience, and education in structured JSON format."
            },
            {
                role: "user",
                content: prompt
            }
        ]
    });

    return response.choices[0].message.content;
}


module.exports = {callLLM}