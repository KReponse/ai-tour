import React, { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const AIChat = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      role: 'user',
      text: message,
    };

    setChat((prev) => [...prev, userMessage]);

    setLoading(true);

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
You are AI Tour Rwanda assistant.

Help tourists visiting Rwanda.

User Question:
${message}
`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();

      const aiText =
        data?.candidates?.[0]?.content?.parts?.[0]
          ?.text || 'No response';

      const aiMessage = {
        role: 'ai',
        text: aiText,
      };

      setChat((prev) => [...prev, aiMessage]);

    } catch (error) {
      console.error(error);

      setChat((prev) => [
        ...prev,
        {
          role: 'ai',
          text: 'AI failed to respond.',
        },
      ]);
    }

    setLoading(false);
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">

      <div className="max-w-4xl mx-auto">

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">

          {/* HEADER */}

          <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white p-6 flex items-center gap-3">

            <Bot className="w-8 h-8" />

            <div>
              <h1 className="text-2xl font-black">
                AI Tour Assistant
              </h1>

              <p className="text-white/80">
                Ask anything about Rwanda travel
              </p>
            </div>
          </div>

          {/* CHAT */}

          <div className="h-[600px] overflow-y-auto p-6 space-y-4">

            {chat.length === 0 && (
              <div className="text-center text-gray-500 mt-20">

                <Bot className="w-16 h-16 mx-auto mb-4 text-emerald-600" />

                <h2 className="text-2xl font-bold mb-2">
                  Welcome to AI Tour
                </h2>

                <p>
                  Ask:
                  <br />
                  “Best places in Kigali?”
                  <br />
                  “3 day Rwanda itinerary”
                  <br />
                  “Luxury hotels in Musanze”
                </p>
              </div>
            )}

            {chat.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === 'user'
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >

                <div
                  className={`max-w-[80%] rounded-3xl p-4 ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 dark:text-white'
                  }`}
                >

                  <div className="flex items-center gap-2 mb-2">

                    {msg.role === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}

                    <span className="text-sm font-bold">
                      {msg.role === 'user'
                        ? 'You'
                        : 'AI Tour'}
                    </span>
                  </div>

                  <div className="whitespace-pre-line leading-7">
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="text-gray-500">
                AI is typing...
              </div>
            )}
          </div>

          {/* INPUT */}

          <div className="p-6 border-t dark:border-gray-700 flex gap-4">

            <input
              type="text"
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              placeholder="Ask AI Tour..."
              className="flex-1 h-14 rounded-2xl px-5 border dark:bg-gray-900 dark:text-white"
            />

            <button
              onClick={sendMessage}
              className="w-14 h-14 rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-600 text-white flex items-center justify-center"
            >

              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;