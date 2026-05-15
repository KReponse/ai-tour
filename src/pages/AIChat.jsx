// src/pages/AIChat.jsx

import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Trash2, 
  Copy, 
  RefreshCw, 
  ThumbsUp, 
  ThumbsDown,
  Sparkles,
  MessageSquare,
  Clock,
  MapPin,
  Calendar,
  DollarSign,
  Wifi,
  X,
  Check,
  Loader2,
  Mic,
  MicOff,
  Image,
  Upload,
  Globe,
  Languages,
  ChevronDown,
  Volume2,
  VolumeX,
  Download,
  FileImage,
  Trash,
  ZoomIn,
} from 'lucide-react';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Language configurations
const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧', nativeName: 'English' },
  { code: 'fr', name: 'French', flag: '🇫🇷', nativeName: 'Français' },
  { code: 'rw', name: 'Kinyarwanda', flag: '🇷🇼', nativeName: 'Ikinyarwanda' },
  { code: 'sw', name: 'Swahili', flag: '🇹🇿', nativeName: 'Kiswahili' },
];

// System prompts for each language
const systemPrompts = {
  en: `
You are AI Tour, a smart and professional Rwanda travel assistant.
Help travelers discover Rwanda beautifully and confidently.

Always respond in a friendly, premium, and helpful tourism tone.
Keep answers clear, inspiring, and practical.

Focus on:
- Rwanda destinations
- National parks
- Gorilla trekking
- Safari experiences
- Hotels & lodges
- Local culture
- Food experiences
- Transportation
- Trip planning
- Budget recommendations
- Safety tips
- Weather and best travel seasons

Make travelers feel excited about visiting Rwanda.
Use emojis naturally and professionally.
`,

  fr: `
Vous êtes AI Tour, un assistant intelligent et professionnel spécialisé dans le tourisme au Rwanda.

Aidez les voyageurs à découvrir le Rwanda avec confiance et enthousiasme.

Répondez toujours avec un ton chaleureux, professionnel et inspirant.

Concentrez-vous sur :
- les destinations du Rwanda
- les parcs nationaux
- les gorilles de montagne
- les safaris
- les hôtels et lodges
- la culture rwandaise
- la gastronomie locale
- les transports
- l’organisation des voyages
- les conseils de budget
- la sécurité
- les saisons touristiques

Donnez envie aux voyageurs de visiter le Rwanda.
Utilisez les emojis avec élégance.
`,

  rw: `
Uri AI Tour, umufasha w’ubwenge kabuhariwe mu bukerarugendo bw’u Rwanda.

Fasha abagenzi n’abakerarugendo gutegura ingendo zabo neza kandi bishimye.

Subiza mu Kinyarwanda cyiza, gisobanutse kandi gikoreshwa mu bukerarugendo nyabwo.

Jya wibanda kuri:
- ahantu nyaburanga ho gusura mu Rwanda
- pariki z’igihugu
- gusura ingagi zo mu birunga
- safari n’inyamaswa
- amahoteli na lodges
- umuco nyarwanda
- amafunguro nyarwanda
- gutegura urugendo
- inama ku ngengo y’imari
- umutekano w’abakerarugendo
- ibihe byiza byo gusura u Rwanda

Tuma umukoresha yumva ashishikajwe no gusura u Rwanda.
Koresha emoji mu buryo bwiza kandi bw’umwuga.
`,

  sw: `
Wewe ni AI Tour, msaidizi mahiri wa utalii nchini Rwanda.

Wasaidie wasafiri kupanga safari zao kwa urahisi na furaha.

Jibu kwa lugha ya kitaalamu, rafiki, na ya kuvutia.

Zingatia:
- vivutio vya Rwanda
- hifadhi za taifa
- gorilla trekking
- safari za wanyamapori
- hoteli na lodges
- utamaduni wa Rwanda
- chakula cha kienyeji
- mipango ya safari
- bajeti za usafiri
- usalama wa watalii
- misimu bora ya kutembelea Rwanda

Wafanye watalii watamani kutembelea Rwanda.
Tumia emojis kwa ustadi.
`,
};
// Suggested questions by language
const suggestedQuestionsByLang = {
  en: [
    { text: "Top tourist attractions in Rwanda", icon: MapPin },
    { text: "How much is gorilla trekking in Rwanda?", icon: DollarSign },
    { text: "Luxury Rwanda safari itinerary", icon: Calendar },
    { text: "Best time to visit Volcanoes National Park", icon: Sparkles },
  ],

  fr: [
    { text: "Les meilleures attractions touristiques du Rwanda", icon: MapPin },
    { text: "Quel est le prix du trekking des gorilles ?", icon: DollarSign },
    { text: "Itinéraire safari de luxe au Rwanda", icon: Calendar },
    { text: "Meilleure saison pour visiter le Parc des Volcans", icon: Sparkles },
  ],

  rw: [
    { text: "Ahantu nyaburanga heza ho gusura mu Rwanda", icon: MapPin },
    { text: "Gusura ingagi mu Rwanda bisaba amafaranga angahe?", icon: DollarSign },
    { text: "Urugendo rwiza rwa safari mu Rwanda", icon: Calendar },
    { text: "Igihe cyiza cyo gusura Pariki y’Ibirunga", icon: Sparkles },
  ],

  sw: [
    { text: "Vivutio bora vya utalii nchini Rwanda", icon: MapPin },
    { text: "Gorilla trekking Rwanda inagharimu kiasi gani?", icon: DollarSign },
    { text: "Ratiba ya safari ya kifahari Rwanda", icon: Calendar },
    { text: "Msimu bora wa kutembelea Volcanoes National Park", icon: Sparkles },
  ],
};

const AIChat = () => {
  // State
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [language, setLanguage] = useState('en');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  
  // Voice input states
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [voiceSupported, setVoiceSupported] = useState(true);
  
  // Image upload states
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Audio output
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = getSpeechLang(language);
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessage(prev => prev + (prev ? ' ' : '') + transcript);
        setIsListening(false);
      };
      
      recognitionInstance.onerror = () => {
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    } else {
      setVoiceSupported(false);
    }
  }, [language]);

  // Get speech recognition language code
  const getSpeechLang = (langCode) => {
    const speechLangs = {
      en: 'en-US',
      fr: 'fr-FR',
      rw: 'en-US', // Fallback for Kinyarwanda
      sw: 'sw-TZ',
    };
    return speechLangs[langCode] || 'en-US';
  };

  // Load chat from localStorage
  useEffect(() => {
    const savedChat = localStorage.getItem(`aiTourChat_${language}`);
    if (savedChat) {
      try {
        const parsed = JSON.parse(savedChat);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setChat(parsed);
        } else {
          setWelcomeMessage();
        }
      } catch (e) {
        setWelcomeMessage();
      }
    } else {
      setWelcomeMessage();
    }
  }, [language]);

  const setWelcomeMessage = () => {
    const welcomeMessages = {
  en: "👋 Welcome to AI Tour! I’m your smart Rwanda travel assistant. I can help you plan unforgettable experiences across Rwanda — from gorilla trekking and safaris to luxury stays, culture, and adventure. Ask me anything ✨",

  fr: "👋 Bienvenue sur AI Tour ! Je suis votre assistant intelligent pour découvrir le Rwanda. Je peux vous aider à organiser des expériences inoubliables : safaris, gorilles, culture, hébergements et aventures. Posez-moi vos questions ✨",

  rw: "👋 Murakaza neza kuri AI Tour! Ndi umufasha wawe w’ubukerarugendo mu Rwanda. Ndagufasha gutegura urugendo rwiza harimo gusura ingagi, safari, amahoteli meza, umuco nyarwanda n’ibindi bikorwa bitangaje. Mbaza icyo ushaka kumenya ✨",

  sw: "👋 Karibu AI Tour! Mimi ni msaidizi wako wa utalii nchini Rwanda. Nitakusaidia kupanga safari nzuri za gorilla trekking, safari za wanyamapori, hoteli, utamaduni na vivutio vya Rwanda. Uliza chochote ✨",
};
    
    setChat([{
      id: Date.now(),
      role: 'ai',
      text: welcomeMessages[language] || welcomeMessages.en,
      timestamp: new Date().toISOString(),
    }]);
  };

  // Save chat to localStorage
  useEffect(() => {
    if (chat.length > 0) {
      localStorage.setItem(`aiTourChat_${language}`, JSON.stringify(chat));
    }
  }, [chat, language]);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat, loading]);

  // Voice input handler
  const startVoiceInput = () => {
    if (recognition && !isListening) {
      try {
        recognition.lang = getSpeechLang(language);
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error('Voice recognition error:', error);
        setIsListening(false);
      }
    }
  };

  const stopVoiceInput = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  // Text-to-speech
     const speakText = (text) => {
  if ('speechSynthesis' in window) {

    // Stop previous speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Better language settings
    const speechLangs = {
      en: 'en-US',
      fr: 'fr-FR',
      rw: 'en-US',
      sw: 'sw-TZ',
    };

    utterance.lang = speechLangs[language] || 'en-US';

    // Premium voice tuning
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Load available voices
    const voices = window.speechSynthesis.getVoices();

    // Best AI voices
    let selectedVoice = null;

    if (language === 'fr') {
      selectedVoice =
        voices.find(v => v.name.includes('Google français')) ||
        voices.find(v => v.lang === 'fr-FR');
    }

    if (language === 'en') {
      selectedVoice =
        voices.find(v => v.name.includes('Google US English')) ||
        voices.find(v => v.lang === 'en-US');
    }

    if (language === 'sw') {
      selectedVoice =
        voices.find(v => v.lang.includes('sw')) ||
        voices.find(v => v.lang === 'en-US');
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);

    utterance.onend = () => setIsSpeaking(false);

    utterance.onerror = (e) => {
      console.error(e);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }
}; 

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Image upload handler
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setUploadingImage(true);
    
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageData = {
            id: Date.now() + Math.random(),
            url: reader.result,
            name: file.name,
            size: file.size,
            type: file.type,
          };
          setUploadedImages(prev => [...prev, imageData]);
        };
        reader.readAsDataURL(file);
      }
    }
    
    setUploadingImage(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (imageId) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  };

  // Send message with image context
  const sendMessage = async () => {
  if ((!message.trim() && uploadedImages.length === 0) || loading) return;

  const userMessage = {
    id: Date.now(),
    role: 'user',
    text: message || '📷 Shared image',
    images: uploadedImages.map((img) => img.url),
    timestamp: new Date().toISOString(),
  };

  setChat((prev) => [...prev, userMessage]);

  const currentMessage = message;
  const currentImages = [...uploadedImages];

  setMessage('');
  setUploadedImages([]);
  setLoading(true);
  setTyping(true);

  try {
    await new Promise((resolve) =>
      setTimeout(resolve, 1200)
    );

    const parts = [];

    // SYSTEM PROMPT
    parts.push({
      text: `
${systemPrompts[language]}

User message:
${currentMessage}

Respond professionally.
`,
    });

    // ADD IMAGES
    currentImages.forEach((img) => {
  const base64Data = img.url.split(',')[1];

  parts.push({
    inline_data: {
      mime_type: img.type || 'image/jpeg',
      data: base64Data,
    },
  });
});

    const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts,
            },
          ],

          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1000,
          },
        }),
      }
    );

    const data = await response.json();
    if (data.error) {
  throw new Error(data.error.message);
}

    console.log(data);

    let aiText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I couldn't generate a response.";

    const aiMessage = {
      id: Date.now() + 1,
      role: 'ai',
      text: aiText,
      timestamp: new Date().toISOString(),
    };

    setChat((prev) => [...prev, aiMessage]);

  } catch (error) {
    console.error(error);

    setChat((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: 'ai',
        text: `⚠️ ${error.message}`,
        timestamp: new Date().toISOString(),
      },
    ]);
  }

  setLoading(false);
  setTyping(false);
};

  // Format message text
  const formatMessageText = (text) => {
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/^- (.*?)$/gm, '• $1');
    formatted = formatted.replace(/\n/g, '<br />');
    return formatted;
  };

  // Copy message
  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Clear chat
  const clearChat = () => {
    const clearMessages = {
  en: "✨ Conversation cleared. I’m ready to help you plan your next Rwanda adventure!",

  fr: "✨ Conversation supprimée. Je suis prêt à vous aider à organiser votre prochaine aventure au Rwanda !",

  rw: "✨ Ibiganiro bisibwe neza. Ndi tayari kugufasha gutegura urugendo rwawe rutaha mu Rwanda!",

  sw: "✨ Mazungumzo yamefutwa. Niko tayari kukusaidia kupanga safari yako ijayo nchini Rwanda!",
};
    setChat([{
      id: Date.now(),
      role: 'ai',
      text: clearMessages[language] || clearMessages.en,
      timestamp: new Date().toISOString(),
    }]);
    setShowClearConfirm(false);
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Get current suggested questions
  const currentSuggestions = suggestedQuestionsByLang[language] || suggestedQuestionsByLang.en;

  return (
    <div className=" max-h-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/20 dark:bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-200/20 dark:bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-4xl max-h-[90vh]">
            <img src={selectedImage} alt="Preview" className="max-w-full max-h-[90vh] object-contain rounded-2xl" />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* MAIN WRAPPER */}
<div className="w-full min-h-screen px-2 sm:px-4 md:px-6 py-2 md:py-6">
  
  {/* Chat Card */}
  <div className="
    w-full
    h-[100dvh] md:h-auto
    flex flex-col
    bg-white dark:bg-gray-800
    rounded-none md:rounded-3xl
    shadow-2xl
    overflow-hidden
    border-0 md:border
    border-gray-100 dark:border-gray-700
  ">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white p-4 md:p-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                    <Bot className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-black">AI Tour Assistant</h1>
                  <div className="flex items-center gap-2 text-xs md:text-sm text-white/80">
                    <span className="inline-flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Online 24/7
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Language Selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/20 backdrop-blur hover:bg-white/30 transition-all duration-300"
                  >
                    <Languages className="w-4 h-4" />
                    <span className="text-sm font-medium hidden sm:inline">
                      {languages.find(l => l.code === language)?.nativeName}
                    </span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  
                  {showLanguageMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowLanguageMenu(false)}></div>
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              setLanguage(lang.code);
                              setShowLanguageMenu(false);
                            }}
                            className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-2 ${
                              language === lang.code ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : ''
                            }`}
                          >
                            <span className="text-xl">{lang.flag}</span>
                            <span className="font-medium">{lang.nativeName}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Clear Chat Button */}
                {chat.length > 1 && (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="p-2 rounded-xl hover:bg-white/20 transition-all duration-300"
                    title="Clear chat history"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Clear Chat Modal */}
          {showClearConfirm && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-sm w-full p-6 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold dark:text-white">
                    {language === 'en' && 'Clear Chat?'}
                    {language === 'fr' && 'Effacer le chat?'}
                    {language === 'rw' && 'Gusiba ibibazo?'}
                    {language === 'sw' && 'Futa Mazungumzo?'}
                  </h3>
                  <button onClick={() => setShowClearConfirm(false)} className="p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {language === 'en' && 'This will delete all your conversation history. This action cannot be undone.'}
                  {language === 'fr' && 'Cela supprimera tout votre historique de conversation. Cette action est irréversible.'}
                  {language === 'rw' && 'Ibi bizisiba ibyo mwaganiriye byose. Ntibishobora gusubirwaho.'}
                  {language === 'sw' && 'Hii itafuta historia yako yote ya mazungumzo. Kitendo hiki hakiwezi kutenduliwa.'}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 py-2 rounded-xl border border-gray-300 dark:border-gray-600 font-medium"
                  >
                    {language === 'en' && 'Cancel'}
                    {language === 'fr' && 'Annuler'}
                    {language === 'rw' && 'Hagarika'}
                    {language === 'sw' && 'Ghairi'}
                  </button>
                  <button
                    onClick={clearChat}
                    className="flex-1 py-2 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition"
                  >
                    {language === 'en' && 'Clear'}
                    {language === 'fr' && 'Effacer'}
                    {language === 'rw' && 'Siba'}
                    {language === 'sw' && 'Futa'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 scroll-smooth">
            {chat.map((msg) => (
              <div
                key={msg.id}
                className={`flex animate-slide-up ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    msg.role === 'user'
                      ? 'bg-emerald-100 dark:bg-emerald-900/50'
                      : 'bg-gradient-to-r from-emerald-600 to-cyan-600'
                  }`}>
                    {msg.role === 'user' ? (
                      <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className="group relative">
                    <div className={`rounded-2xl p-4 ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}>
                      <div className="text-sm font-medium mb-1 opacity-70">
                        {msg.role === 'user' ? (
                          language === 'en' ? 'You' : language === 'fr' ? 'Vous' : language === 'rw' ? 'Wewe' : 'Wewe'
                        ) : (
                          'AI Tour'
                        )}
                      </div>
                      
                      {/* Display uploaded images */}
                      {msg.images && msg.images.length > 0 && (
                        <div className="flex gap-2 mb-3 flex-wrap">
                          {msg.images.map((img, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSelectedImage(img)}
                              className="relative group/img"
                            >
                              <img
                                src={img}
                                alt={`Uploaded ${idx + 1}`}
                                className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-90 transition"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 rounded-lg flex items-center justify-center transition">
                                <ZoomIn className="w-5 h-5 text-white" />
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                      
                      <div 
                        className="whitespace-pre-wrap leading-relaxed text-sm md:text-base"
                        dangerouslySetInnerHTML={{ __html: formatMessageText(msg.text) }}
                      />
                      <div className="text-xs opacity-50 mt-2">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    {/* Message Actions */}
                    <div className="absolute -bottom-8 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                      <button
                        onClick={() => copyToClipboard(msg.text, msg.id)}
                        className="p-1.5 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-green-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                      {msg.role === 'ai' && (
                        <>
                          <button
                            onClick={() => speakText(msg.text)}
                            className="p-1.5 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                            title="Read aloud"
                          >
                            <Volume2 className="w-3 h-3" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {typing && (
              <div className="flex justify-start animate-fade-in">
                <div className="flex gap-3 max-w-[85%]">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-emerald-600 to-cyan-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-4">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Uploaded Images Preview */}
          {uploadedImages.length > 0 && (
            <div className="px-4 pb-2">
              <div className="flex gap-2 flex-wrap">
                {uploadedImages.map((img) => (
                  <div key={img.id} className="relative group">
                    <img
                      src={img.url}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeImage(img.id)}
                      className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Questions */}
          {chat.length <= 2 && !loading && (
            <div className="px-4 pb-2">
              <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {language === 'en' && 'Suggested questions:'}
                {language === 'fr' && 'Questions suggérées:'}
                {language === 'rw' && 'Ibibazo byatanzwe:'}
                {language === 'sw' && 'Maswali yanayopendekezwa:'}
              </p>
              <div className="flex flex-wrap gap-2">
                {currentSuggestions.map((q, idx) => {
                  const Icon = q.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setMessage(q.text);
                        inputRef.current?.focus();
                      }}
                      className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-all duration-200 flex items-center gap-1"
                    >
                      <Icon className="w-3 h-3" />
                      {q.text.length > 35 ? q.text.substring(0, 35) + '...' : q.text}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-gray-100 dark:border-gray-700 p-4 md:p-6 pb-24 md:pb-6 bg-white dark:bg-gray-800">
            <div className="flex gap-3">
              {/* Image Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 flex items-center justify-center"
                title="Upload image"
              >
                <Image className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              
              {/* Text Input */}
              <div className="flex-1 relative">
                <textarea
  ref={inputRef}
  value={message}
  onChange={(e) => {
    setMessage(e.target.value);

    e.target.style.height = 'auto';
    e.target.style.height =
      Math.min(e.target.scrollHeight, 180) + 'px';
  }}
  onKeyPress={handleKeyPress}
  placeholder={
    language === 'en'
      ? "Ask about Rwanda safaris, hotels, gorilla trekking..."
      : language === 'fr'
      ? "Posez des questions sur les safaris, hôtels..."
      : language === 'rw'
      ? "Baza ibyerekeye safari, hoteli cyangwa ingendo..."
      : "Uliza kuhusu safari, hoteli au utalii..."
  }
  className="
    w-full
    min-h-[52px]
    max-h-[180px]
    px-3 md:px-4
    py-3
    pr-10
    rounded-xl
    border border-gray-200 dark:border-gray-700
    bg-gray-50 dark:bg-gray-900
    text-sm md:text-base
    text-gray-800 dark:text-white
    placeholder:text-xs
    md:placeholder:text-sm
    placeholder:leading-tight
    focus:outline-none
    focus:ring-2
    focus:ring-emerald-500
    resize-none
    overflow-y-auto
  "
  rows="1"
/>
              </div>
              
              {/* Voice Input Button */}
              {voiceSupported && (
                <button
                  onClick={isListening ? stopVoiceInput : startVoiceInput}
                  className={`w-12 h-12 rounded-xl transition-all duration-300 flex items-center justify-center ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300'
                  }`}
                  title={isListening ? "Stop recording" : "Start voice input"}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              )}
              
              {/* Send Button */}
              <button
                onClick={sendMessage}
                disabled={(!message.trim() && uploadedImages.length === 0) || loading}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  (message.trim() || uploadedImages.length > 0) && !loading
                    ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white hover:scale-105 shadow-lg'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
            
            {/* Voice Recording Indicator */}
            {isListening && (
              <div className="mt-2 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 text-xs">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                 {language === 'en' && 'Listening... Speak about your trip'}
{language === 'en' && 'Listening... Speak about your trip'}
{language === 'fr' && 'Je vous écoute... Parlez de votre voyage'}
{language === 'rw' && 'Ndakumva... Vuga iby’urugendo rwawe'}
{language === 'sw' && 'Ninasikiliza... Ongea kuhusu safari yako'}
                </div>
              </div>
            )}
            
            {/* Audio Playing Indicator */}
            {isSpeaking && (
              <div className="mt-2 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 text-xs">
                  <Volume2 className="w-3 h-3 animate-pulse" />
                  {language === 'en' && 'AI Tour is speaking...'}
{language === 'fr' && 'AI Tour parle...'}
{language === 'rw' && 'AI Tour iri kuvuga...'}
{language === 'sw' && 'AI Tour inazungumza...'}
                  <button onClick={stopSpeaking} className="ml-2 hover:text-emerald-800">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AIChat;