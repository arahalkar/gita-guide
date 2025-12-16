import React, { useState, useRef, useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import { Send, ArrowLeft, ExternalLink, Sparkles, Book, Download, Info, Shield } from 'lucide-react';
import { CHAPTERS, GITA_PDF_URL } from './constants';
import { Chapter, ChatMessage, View } from './types';
import { sendGitaQuestion } from './services/geminiService';
import ChapterCard from './components/ChapterCard';
import BottomNav from './components/BottomNav';
import { PeacockFeather, PeacockBackground } from './components/PeacockFeather';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);
  
  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Namaste! I am your guide to the Bhagavad Gita. How can I help you today? You can ask me about duty, friendship, focus, or any specific chapter."
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentView]);

  const handleChapterClick = (id: number) => {
    setSelectedChapterId(id);
    setCurrentView('chapter');
    window.scrollTo(0,0);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare history for API
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const response = await sendGitaQuestion(userMsg.text, history);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text,
        citations: response.citations
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "I'm having trouble connecting to the source right now. Please check your internet or try again later.",
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Views ---

  const renderHome = () => (
    <div className="p-4 pb-24 max-w-3xl mx-auto relative">
      <PeacockBackground />
      <header className="mb-8 text-center pt-8">
        <div className="flex justify-center mb-4">
           <PeacockFeather className="h-16 w-16 drop-shadow-md" />
        </div>
        <h1 className="text-4xl font-serif font-bold text-krishna-900 mb-2">Gita Guide</h1>
        <p className="text-krishna-700">Wisdom for the modern student</p>
        <div className="mt-6 mx-auto w-24 h-1 bg-gradient-to-r from-krishna-600 to-peacock-500 rounded-full"></div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CHAPTERS.map(chapter => (
          <ChapterCard key={chapter.id} chapter={chapter} onClick={handleChapterClick} />
        ))}
      </div>

      <footer className="mt-12 text-center pb-8 opacity-60">
        <button 
          onClick={() => setCurrentView('privacy')} 
          className="text-xs text-krishna-700 hover:underline flex items-center justify-center mx-auto"
        >
          <Shield className="w-3 h-3 mr-1" /> Privacy Policy
        </button>
      </footer>
    </div>
  );

  const renderChapterDetail = () => {
    const chapter = CHAPTERS.find(c => c.id === selectedChapterId);
    if (!chapter) return null;

    return (
      <div className="p-4 pb-24 max-w-3xl mx-auto min-h-screen bg-krishna-50">
        <button 
          onClick={() => setCurrentView('home')}
          className="flex items-center text-krishna-700 font-medium mb-6 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Chapters
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-krishna-100">
          {/* Header with Deep Blue/Green Gradient */}
          <div className="bg-gradient-to-br from-krishna-900 via-krishna-800 to-peacock-800 h-40 relative flex items-center justify-center overflow-hidden">
            <PeacockBackground />
            <div className="text-center relative z-10 p-4">
               <span className="inline-block px-3 py-1 bg-white/10 text-gold-400 font-bold uppercase tracking-widest text-xs rounded-full mb-2 backdrop-blur-sm border border-white/20">
                 Chapter {chapter.id}
               </span>
               <h1 className="text-2xl md:text-3xl font-serif font-bold text-white mt-1 drop-shadow-md">{chapter.sanskritName}</h1>
               <p className="text-krishna-100 text-sm mt-1 opacity-90">{chapter.translation}</p>
            </div>
          </div>
          
          <div className="p-6 md:p-8">
            <h2 className="text-xl font-bold text-krishna-900 mb-4 font-serif">{chapter.englishName}</h2>
            
            <div className="prose prose-stone max-w-none mb-8">
              <p className="text-lg leading-relaxed text-krishna-900/80">
                {chapter.summary}
              </p>
              <p className="mt-4 text-krishna-700 italic border-l-4 border-peacock-400 pl-4 bg-peacock-50 py-2 pr-2 rounded-r-lg">
                This chapter teaches us about the fundamental nature of reality and our place within it. 
                Reflect on how this applies to your daily duties as a student.
              </p>
            </div>

            <div className="border-t border-krishna-100 pt-6">
              <h3 className="text-sm font-bold text-krishna-400 uppercase tracking-wide mb-3">Resources</h3>
              <a 
                href={chapter.detailedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-lg bg-krishna-50 hover:bg-krishna-100 transition-colors border border-krishna-100 group"
              >
                <div className="flex items-center">
                  <Book className="w-5 h-5 text-krishna-600 mr-3" />
                  <span className="font-medium text-krishna-800">Read Full Chapter Explanation</span>
                </div>
                <ExternalLink className="w-4 h-4 text-krishna-400 group-hover:text-krishna-600" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderChat = () => (
    <div className="flex flex-col h-screen bg-krishna-50 pb-[64px]">
      <div className="bg-white border-b border-krishna-200 p-4 shadow-sm z-10">
        <div className="max-w-3xl mx-auto flex items-center">
          <div className="bg-peacock-100 p-2 rounded-full mr-3">
            <Sparkles className="w-5 h-5 text-peacock-700" />
          </div>
          <div>
            <h2 className="font-bold text-krishna-900">Ask Krishna</h2>
            <p className="text-xs text-krishna-500">AI Guide based on Gita</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-3xl mx-auto w-full">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-krishna-700 text-white rounded-tr-none' 
                  : 'bg-white text-krishna-900 border border-krishna-100 rounded-tl-none'
              }`}
            >
              <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              
              {/* Citations */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/20 text-xs">
                  <p className="font-medium opacity-70 mb-1">Sources:</p>
                  <div className="flex flex-wrap gap-2">
                    {msg.citations.map((cite, idx) => (
                      <a 
                        key={idx} 
                        href={cite} 
                        target="_blank" 
                        rel="noreferrer"
                        className="underline opacity-60 hover:opacity-100 truncate max-w-full"
                      >
                        Source {idx + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
           <div className="flex justify-start">
             <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-krishna-100 flex items-center space-x-2">
               <div className="w-2 h-2 bg-peacock-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
               <div className="w-2 h-2 bg-peacock-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
               <div className="w-2 h-2 bg-peacock-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-krishna-200">
        <div className="max-w-3xl mx-auto relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask a question about the Gita..."
            className="w-full pl-4 pr-12 py-3 rounded-full border border-krishna-300 focus:border-peacock-500 focus:ring-1 focus:ring-peacock-500 outline-none text-krishna-900 bg-krishna-50 transition-all placeholder-krishna-400"
            disabled={isLoading}
          />
          <button 
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-peacock-600 text-white rounded-full hover:bg-peacock-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderResources = () => (
    <div className="p-4 pb-24 max-w-3xl mx-auto">
      <header className="mb-8 pt-8">
        <h1 className="text-3xl font-serif font-bold text-krishna-900 mb-2">Study Resources</h1>
        <p className="text-krishna-600">Deepen your understanding</p>
      </header>

      <div className="space-y-6">
        {/* PDF Card */}
        <div className="bg-gradient-to-br from-krishna-800 to-peacock-700 rounded-xl p-6 text-white shadow-lg overflow-hidden relative">
           {/* Decoration */}
           <div className="absolute top-0 right-0 w-32 h-32 opacity-10 transform rotate-45 translate-x-8 -translate-y-8">
             <PeacockFeather className="w-full h-full" />
           </div>

          <div className="flex items-start justify-between relative z-10">
             <div>
               <h3 className="text-xl font-bold mb-2">Complete Gita PDF</h3>
               <p className="text-peacock-100 text-sm mb-4">Read the full text from the file uploaded to this app.</p>
               <a 
                 href={GITA_PDF_URL} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="inline-flex items-center bg-white text-krishna-900 px-4 py-2 rounded-lg font-bold text-sm hover:bg-peacock-50 transition-colors shadow-sm"
               >
                 <Book className="w-4 h-4 mr-2" /> Open Local PDF
               </a>
             </div>
             <Download className="w-16 h-16 text-white opacity-20" />
          </div>
        </div>

        {/* External Links List */}
        <div>
          <h3 className="text-lg font-bold text-krishna-900 mb-4 flex items-center">
            <Info className="w-5 h-5 text-peacock-600 mr-2" />
            Chapter-wise Explanations
          </h3>
          <div className="bg-white rounded-xl shadow-sm border border-krishna-100 divide-y divide-krishna-50">
            {CHAPTERS.map((chap) => (
              <a 
                key={chap.id}
                href={chap.detailedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 hover:bg-krishna-50 transition-colors group"
              >
                <div>
                  <span className="text-xs font-bold text-krishna-400 uppercase">Chapter {chap.id}</span>
                  <p className="text-krishna-800 font-medium group-hover:text-peacock-700">{chap.sanskritName}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-krishna-300 group-hover:text-peacock-500" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacyPolicy = () => (
    <div className="p-6 pb-24 max-w-3xl mx-auto bg-white min-h-screen">
       <button 
          onClick={() => setCurrentView('home')}
          className="flex items-center text-krishna-700 font-medium mb-6 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back Home
        </button>
        
        <h1 className="text-2xl font-bold text-krishna-900 mb-6">Privacy Policy</h1>
        
        <div className="prose prose-sm text-krishna-800">
          <p><strong>Effective Date:</strong> {new Date().toLocaleDateString()}</p>
          
          <h3>1. Introduction</h3>
          <p>Welcome to Gita Guide. This app is designed for students to explore the Bhagavad Gita. We are committed to protecting your privacy.</p>

          <h3>2. Data Collection</h3>
          <p>We do not collect, store, or share any personal identifiable information (PII) from children or any users. </p>

          <h3>3. AI and Third-Party Services</h3>
          <p>This app uses Google Gemini AI to answer questions about the Gita. When you ask a question:</p>
          <ul>
            <li>The text of your question is sent to Google's servers for processing.</li>
            <li>No personal data is attached to this request.</li>
            <li>We do not store your chat history on our servers.</li>
          </ul>

          <h3>4. Permissions</h3>
          <p>This app does not request access to your camera, microphone, or location.</p>

          <h3>5. Contact</h3>
          <p>If you have questions about this policy, please contact us through the Google Play Store support link.</p>
        </div>
    </div>
  );

  return (
    <HashRouter>
      <div className="min-h-screen bg-krishna-50 font-sans text-krishna-900 selection:bg-peacock-200 selection:text-peacock-900">
        
        {/* Main Content Area */}
        <main className="min-h-screen">
          {currentView === 'home' && renderHome()}
          {currentView === 'chapter' && renderChapterDetail()}
          {currentView === 'chat' && renderChat()}
          {currentView === 'resources' && renderResources()}
          {currentView === 'privacy' && renderPrivacyPolicy()}
        </main>

        {/* Navigation - Hide on privacy page */}
        {currentView !== 'privacy' && (
          <BottomNav currentView={currentView} setView={setCurrentView} />
        )}
        
      </div>
    </HashRouter>
  );
};

export default App;