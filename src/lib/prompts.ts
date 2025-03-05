export const generatePredefinedQuestionsPrompts = (data: {
  jobRole: string;
  jobDescription: string;
  experience: number;
}) => {
  return `
    You are a hiring manager for a company. You are looking to hire a ${data.jobRole} with ${data.experience} years of experience.
    The job description is as follows: ${data.jobDescription}.
    Please generate 10 predefined questions that you would like to ask the candidate.
    The questions should be based on the job description and the experience of the candidate.
    return the questions in a json array of strings. Example JSON: [{"question": "...", "category": "..."}, ...]
  `;
};

export const evaluateAnswerPrompt = (data: { question: string; answer: string }) => {
  return `
  Question: ${data.question},  
  User Answer: ${data.answer}.  

1. Rate the answer on a scale of 1-10 (1=weak, 10=excellent) based on clarity, relevance, and specificity.  
2. Provide 1-2 lines of actionable feedback focusing on improvement.  

Return JSON: {rating, feedback}.  `;
};

export const generateQuestionPrompt = ({
  nextQuestion,
  startQuestion,
}: {
  startQuestion?: {
    jobPosition: string;
    jobDescription: string;
    jobExperience: number;
  };
  nextQuestion?: {
    question: string;
    answer: string;
    context: string[];
  };
}) => {
  if(startQuestion){
    return `
    Job Position: ${startQuestion.jobPosition},  
    Job Description: ${startQuestion.jobDescription},  
    Years of Experience: ${startQuestion.jobExperience},  

      Generate one interview question tailored to the role. Follow these rules:  
      1. Focus: Prioritize the most critical skill/requirement from the job description.  
      2. Seniority: Adjust complexity based on experience (e.g., leadership for seniors, learning agility for juniors).  
      3. Dynamic Context: Include keywords to guide future follow-up questions.  

      Return JSON:  
      {  
        "question": "...",  
        "context_keywords": ["skill1", "skill2", "seniority_level"]  
      }
    `;
  } else if (nextQuestion) {
    return `
    Question: ${nextQuestion.question},  
    User Answer: ${nextQuestion.answer},  
    Context Keywords: ${nextQuestion.context},  

    1. Rate the answer on a scale of 1-10 (1=weak, 10=excellent) based on clarity, relevance, and specificity.  
    2. Provide 1-2 lines of actionable feedback focusing on improvement.  
    3. Extract new keywords from the user’s answer to update the context.  
    4. Generate a follow-up question based on the updated context keywords.  

    Return JSON:  
    {  
      "rating": "...",  
      "feedback": "...",  
      "next_question": "...",  
      "context_keywords": ["new_keyword1", "new_keyword2"]  
    }
  `;
  } else {
    throw new Error("No Prompt parameters provided");
  }
};
