import OpenAI from 'openai';

let openai: OpenAI | null = null;

export const initializeOpenAI = (apiKey: string) => {
  openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
  });
};

export const generateExperienceDescription = async (
  jobTitle: string,
  company: string,
  currentDescription?: string
): Promise<string> => {
  if (!openai) {
    throw new Error('OpenAI not initialized. Please provide your API key.');
  }

  try {
    const prompt = `Generate a professional resume description for a ${jobTitle} role at ${company}. 
    ${currentDescription ? `Current description: ${currentDescription}. Improve and enhance this description.` : ''}
    
    Requirements:
    - Write 3-5 bullet points
    - Use action verbs and quantifiable achievements where possible
    - Keep it professional and concise
    - Focus on relevant skills and accomplishments
    - Each bullet point should be on a new line
    - Don't include bullet symbols, just the text
    
    Return only the description text, nothing else.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content?.trim() || '';
  } catch (error) {
    console.error('Error generating description:', error);
    throw new Error('Failed to generate description. Please check your API key and try again.');
  }
};

export const generateEducationDescription = async (
  degree: string,
  school: string,
  currentDescription?: string
): Promise<string> => {
  if (!openai) {
    throw new Error('OpenAI not initialized. Please provide your API key.');
  }

  try {
    const prompt = `Generate a brief academic description for ${degree} at ${school}.
    ${currentDescription ? `Current description: ${currentDescription}. Improve this.` : ''}
    
    Requirements:
    - 1-3 bullet points highlighting relevant coursework, projects, or achievements
    - Keep it concise and professional
    - Focus on academic excellence and relevant skills gained
    - Each point on a new line
    - Don't include bullet symbols
    
    Return only the description text.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content?.trim() || '';
  } catch (error) {
    console.error('Error generating education description:', error);
    throw new Error('Failed to generate description.');
  }
};

export const generateSkillsSuggestions = async (
  jobTitle: string,
  experience: string[]
): Promise<string[]> => {
  if (!openai) {
    throw new Error('OpenAI not initialized. Please provide your API key.');
  }

  try {
    const experienceText = experience.map(exp => `${exp}`).join(', ');
    
    const prompt = `Based on the job title "${jobTitle}" and experience in: ${experienceText}, 
    suggest 8-12 relevant technical and soft skills for a resume.
    
    Requirements:
    - Include both technical and soft skills
    - Make them specific and relevant to the role
    - Return as a comma-separated list
    - Focus on in-demand skills for this position
    
    Return only the skills as a comma-separated list.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
      temperature: 0.7,
    });

    const skillsText = response.choices[0]?.message?.content?.trim() || '';
    return skillsText.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
  } catch (error) {
    console.error('Error generating skills:', error);
    throw new Error('Failed to generate skills suggestions.');
  }
};