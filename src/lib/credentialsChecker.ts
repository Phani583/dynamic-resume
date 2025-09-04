// Utility to check stored credentials
export const checkStoredCredentials = () => {
  const credentials = {
    openaiApiKey: localStorage.getItem('openai_api_key'),
  };
  
  return {
    hasOpenAIKey: !!credentials.openaiApiKey,
    credentials,
    summary: credentials.openaiApiKey ? 'OpenAI API key is stored' : 'No OpenAI API key found'
  };
};

// Function to display credentials status
export const displayCredentialsStatus = () => {
  const status = checkStoredCredentials();
  console.log('=== Credentials Status ===');
  console.log('OpenAI API Key:', status.hasOpenAIKey ? '✅ Stored' : '❌ Not found');
  console.log('Summary:', status.summary);
  return status;
};

// Auto-run check
displayCredentialsStatus();