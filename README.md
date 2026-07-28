# 📚 StudyMate AI — Your Personal Study Planner & AI Tutor

> 🚀 **Live Working Application:** [https://studymate-ai-tawny.vercel.app/](https://studymate-ai-tawny.vercel.app/)  
> 💻 **GitHub Repository:** [https://github.com/umairoffical55/studymate-ai](https://github.com/umairoffical55/studymate-ai)

---

## 📌 Problem Statement & Overview
Students often struggle to stay organized across multiple academic subjects and lack quick, 24/7 assistance when trying to understand difficult concepts. Traditional tutoring can be expensive, inaccessible late at night, or slow to provide immediate answers.

**StudyMate AI** solves this problem by combining an intuitive **Study Task Planner** with an interactive **AI Tutor**. Students can organize their daily study targets with deadlines while instantly getting clear breakdowns of complex topics, key takeaways, and practice quiz questions to test their knowledge on demand.

---

## ✨ Features List
* 📅 **Study Task Planner:** Add, manage, and track study tasks organized by subject, topic, and deadline date.
* 🤖 **Interactive AI Tutor:** Enter any complex topic or question to receive simple, student-friendly explanations.
* 💡 **Key Takeaways & Summaries:** Automatically extracts essential facts into quick, readable bullet points.
* ❓ **Practice Question Generator:** Generates instant quiz/practice questions to help reinforce learning and test comprehension.
* ⚡ **Fast & Responsive UI:** Built with modern web technologies, ensuring a clean and seamless layout on both desktop and mobile screens.

---

## 🧠 AI Feature & System Prompt
The AI Tutor in **StudyMate AI** is powered by the **Groq API** (`llama-3.1-8b-instant`).

### System Prompt / Instructions Used:
```text
You are StudyMate AI, an empathetic, patient, and highly knowledgeable AI academic tutor. 
Your primary goal is to help students learn effectively and test their knowledge.

When given a subject or topic:
1. Explain the concept clearly using simple, analogy-rich language suitable for students.
2. Provide 3-4 key bullet takeaways.
3. End with 2 practice/quiz questions to test understanding.
Keep your response supportive, structured, concise, and easy to read.
🛠️ Tools & Technologies Used
Framework: Next.js (App Router)

Styling: Tailwind CSS

AI Provider: Groq API (llama-3.1-8b-instant)

Deployment Platform: Vercel

Version Control: Git & GitHub

🚀 How to Run Locally
Clone the repository:

Bash
git clone [https://github.com/umairoffical55/studymate-ai.git](https://github.com/umairoffical55/studymate-ai.git)
cd studymate-ai
Install dependencies:

Bash
npm install
Set up Environment Variables:
Create a .env.local file in the root directory and add your Groq API Key:

Code snippet
GROQ_API_KEY=your_groq_api_key_here
Run the development server:

Bash
npm run dev
Open http://localhost:3000 in your browser.
