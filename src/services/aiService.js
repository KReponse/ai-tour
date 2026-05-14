// src/services/aiService.js

export const generateTripPlan = async (prompt) => {
  const API_KEY =
    'AIzaSyDvzJP665P73hNME5kIko-aM0AQ2-dV-nQ';

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
You are AI Tour Rwanda travel assistant.

Create a professional Rwanda travel plan.

${prompt}

Include:
- Best activities
- Budget advice
- Hotels
- Foods
- Transportation
- Safety tips
- Daily itinerary
`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    return (
      data?.candidates?.[0]?.content?.parts?.[0]
        ?.text || 'No AI response'
    );

  } catch (error) {
    console.error(error);

    return 'AI failed to generate response.';
  }
};