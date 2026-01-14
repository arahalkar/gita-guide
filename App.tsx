
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { HashRouter } from 'react-router-dom';
import { 
  Send, 
  ArrowLeft, 
  ExternalLink, 
  Sparkles, 
  Book, 
  Download, 
  Info, 
  Shield, 
  Trash2,
  Share2,
  CheckCircle,
  Quote,
  Search,
  X
} from 'lucide-react';
import { CHAPTERS, GITA_PDF_URL, GITA_QUOTES } from './constants';
import { Chapter, ChatMessage, View } from './types';
import { sendGitaQuestion } from './services/geminiService';
import ChapterCard from './components/ChapterCard';
import BottomNav from './components/BottomNav';
import { PeacockFeather, PeacockBackground } from './components/PeacockFeather';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const dailyQuote = useMemo(() => {
    const today = new Date();
    const index = (today.getFullYear() + today.getMonth() + today.getDate()) % GITA_QUOTES.length;
    return GITA_QUOTES[index];
  }, []);

  const filteredChapters = useMemo(() => {
    return CHAPTERS.filter(chap => 
      chap.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chap.sanskritName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chap.summary.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const WELCOME_MESSAGE: ChatMessage = {
    id: 'welcome',
    role: 'model',
    text: "Namaste! I am your Gita AI Assistant. How can I help you today? You can ask me about duty, friendship, focus, or any specific chapter from the Bhagavad Gita."
  };

  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
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

  const handleClearChat = () => {
    if (window.confirm("Do you want to clear your conversation history?")) {
      setMessages([WELCOME_MESSAGE]);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Gita AI Assistant',
      text: "I found this amazing Gita AI Assistant for students! It answers questions about focus and duty using the Bhagavad Gita. 🙏",
      url: window.location.origin
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
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
      const history = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({
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

  const renderHome = () => (
    <div className="p-4 pb-24 max-w-3xl mx-auto relative">
      <PeacockBackground />
      <header className="mb-8 text-center pt-8">
        <div className="flex justify-center mb-4">
           <PeacockFeather className="h-16 w-16 drop-shadow-md" />
        </div>
        <h1 className="text-4xl font-serif font-bold text-krishna-900 mb-2">Gita AI</h1>
        <p className="text-krishna-700">Wisdom for the modern student</p>
        <div className="mt-4 mx-auto w-24 h-1 bg-gradient-to-r from-krishna-600 to-peacock-500 rounded-full"></div>
      </header>

      <div className="mb-6 bg-gradient-to-br from-peacock-50 to-white rounded-2xl p-6 shadow-sm border border-peacock-100 relative overflow-hidden">
        <Quote className="absolute -top-2 -left-2 w-12 h-12 text-peacock-200 opacity-20 transform -rotate-12" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-peacock-600 uppercase tracking-widest flex items-center">
              Daily Wisdom
              <span className="ml-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            </span>
            <span className="text-[10px] text-krishna-400 font-medium">{new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
          </div>
          <p className="text-krishna-900 font-serif italic text-lg leading-relaxed mb-3">"{dailyQuote.verse}"</p>
          <p className="text-krishna-700 text-sm mb-4">"{dailyQuote.translation}"</p>
          <div className="bg-peacock-600/5 p-3 rounded-xl border border-peacock-100/50">
            <p className="text-peacock-800 text-xs font-medium"><span className="font-bold">Student Tip:</span> {dailyQuote.lesson}</p>
          </div>
        </div>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-krishna-400 w-4 h-4" />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search chapters (e.g., Karma, Focus, Duty)..."
          className="w-full bg-white border border-krishna-100 rounded-full py-3 pl-10 pr-10 text-sm focus:ring-2 focus:ring-peacock-400 outline-none transition-all shadow-sm"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-krishna-400 hover:text-krishna-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {filteredChapters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredChapters.map(chapter => (
            <ChapterCard key={chapter.id} chapter={chapter} onClick={handleChapterClick} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white/50 rounded-2xl border border-dashed border-krishna-200">
          <p className="text-krishna-400 text-sm">No chapters found matching "{searchQuery}"</p>
          <button onClick={() => setSearchQuery('')} className="mt-2 text-peacock-600 text-xs font-bold uppercase tracking-wider">Clear Search</button>
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <button 
          onClick={handleShare}
          className="flex items-center px-6 py-3 bg-white text-krishna-700 rounded-full shadow-md border border-krishna-100 font-medium hover:bg-krishna-50 transition-colors"
        >
          <Share2 className="w-4 h-4 mr-2" /> Share with Friends
        </button>
      </div>

      <footer className="mt-12 text-center pb-8">
        <div className="flex flex-col items-center space-y-3 opacity-60">
          <div className="flex items-center space-x-2 text-[10px] font-bold text-peacock-700 bg-peacock-50 px-2 py-1 rounded-full border border-peacock-100 uppercase tracking-widest">
            <CheckCircle className="w-3 h-3" />
            <span>Official Version 1.1.2</span>
          </div>
          <button 
            onClick={() => setCurrentView('privacy')} 
            className="text-xs text-krishna-700 hover:underline flex items-center justify-center mx-auto"
          >
            <Shield className="w-3 h-3 mr-1" /> Privacy Policy
          </button>
        </div>
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
                This chapter of the Bhagavad Gita teaches us about focus and duty. 
                Reflect on how this applies to your life as a student.
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
                  <span className="font-medium text-krishna-800">Read Detailed Commentary</span>
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
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-peacock-100 p-2 rounded-full mr-3">
              <Sparkles className="w-5 h-5 text-peacock-700" />
            </div>
            <div>
              <h2 className="font-bold text-krishna-900 leading-tight">Gita AI Assistant</h2>
              <p className="text-[10px] text-krishna-500 uppercase tracking-tighter">AI Spiritual Guide</p>
            </div>
          </div>
          <button 
            onClick={handleClearChat}
            className="p-2 text-krishna-400 hover:text-red-500 transition-colors"
            title="Clear Chat"
          >
            <Trash2 className="w-5 h-5" />
          </button>
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
              } ${msg.isError ? 'border-red-200 bg-red-50' : ''}`}
            >
              <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-4 pt-3 border-t border-krishna-100 text-xs">
                  <p className="font-bold text-krishna-400 uppercase tracking-widest text-[9px] mb-2">Verified Sources</p>
                  <div className="flex flex-col gap-2">
                    {msg.citations.map((cite, idx) => {
                      try {
                        const url = new URL(cite);
                        return (
                          <a 
                            key={idx} 
                            href={cite} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center text-peacock-700 hover:underline bg-peacock-50/50 p-2 rounded border border-peacock-100/50"
                          >
                            <ExternalLink className="w-3 h-3 mr-2 flex-shrink-0" />
                            <span className="truncate">{url.hostname.replace('www.', '')}</span>
                          </a>
                        );
                      } catch {
                        return (
                          <a key={idx} href={cite} target="_blank" rel="noreferrer" className="text-peacock-700 underline">
                            Source {idx + 1}
                          </a>
                        );
                      }
                    })}
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
            placeholder="Ask about duty, focus, or a chapter..."
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
        <p className="text-[9px] text-center text-krishna-400 mt-2">AI guidance grounded in the Bhagavad Gita.</p>
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
        <div className="bg-gradient-to-br from-krishna-800 to-peacock-700 rounded-xl p-6 text-white shadow-lg overflow-hidden relative">
           <div className="absolute top-0 right-0 w-32 h-32 opacity-10 transform rotate-45 translate-x-8 -translate-y-8">
             <PeacockFeather className="w-full h-full" />
           </div>

          <div className="flex items-start justify-between relative z-10">
             <div>
               <h3 className="text-xl font-bold mb-2">Complete Gita PDF</h3>
               <p className="text-peacock-100 text-sm mb-4">Read the full Hindi translation text.</p>
               <a 
                 href={GITA_PDF_URL} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="inline-flex items-center bg-white text-krishna-900 px-4 py-2 rounded-lg font-bold text-sm hover:bg-peacock-50 transition-colors shadow-sm"
               >
                 <Book className="w-4 h-4 mr-2" /> Open Hindi PDF
               </a>
             </div>
             <Download className="w-16 h-16 text-white opacity-20" />
          </div>
        </div>

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
                  <span className="text-xs font-bold text-krishna-400 uppercase tracking-tighter">Chapter {chap.id}</span>
                  <p className="text-krishna-800 font-medium group-hover:text-peacock-700">{chap.sanskritName}</p>
                </div>
                <div className="flex items-center text-krishna-300 group-hover:text-peacock-500 transition-colors">
                  <span className="text-[10px] mr-2 opacity-0 group-hover:opacity-100 font-medium">Read More</span>
                  <ExternalLink className="w-4 h-4" />
                </div>
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
          <p>This Privacy Policy governs the use of the mobile application <strong>Gita AI Assistant</strong>, which was created and is maintained by <strong>GenAI Developer</strong>. This policy describes how we handle user information in the context of our student-focused app.</p>

          <h3>2. Developer Entity</h3>
          <p>The entity responsible for this application is <strong>GenAI Developer</strong>. The app "Gita AI Assistant" is listed on the Google Play Store under the same developer name.</p>

          <h3>3. Information Collection and Use</h3>
          <p><strong>Gita AI Assistant</strong> does not collect, transmit, or store any personal information from its users. We do not require account registration, email addresses, phone numbers, or any other personally identifiable information (PII). Any chat history or session data remains strictly local to your device and is not saved on our servers.</p>

          <h3>4. AI Services and Data Processing</h3>
          <p>To provide AI-powered answers, the app utilizes Google Gemini AI. When a user submits a question:</p>
          <ul>
            <li>The query text is sent to Google's API for real-time processing.</li>
            <li>No personal user data, identifiers, or device information are bundled with these AI requests.</li>
            <li>Interaction logs are not retained by <strong>GenAI Developer</strong>.</li>
          </ul>

          <h3>5. Device Permissions</h3>
          <p>This application does not request or require access to sensitive device features such as the camera, microphone, contacts, or fine-grained location data.</p>

          <h3>6. Children's Online Privacy Protection</h3>
          <p>We are fully committed to protecting the privacy of children. <strong>Gita AI Assistant</strong> is intended for educational use by students. Because we collect absolutely no personal data, we comply with standard global privacy protections for minors.</p>

          <h3>7. Changes to This Policy</h3>
          <p><strong>GenAI Developer</strong> may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>

          <h3>8. Contact Us</h3>
          <p>If you have any questions regarding privacy while using the <strong>Gita AI Assistant</strong> application, please contact <strong>GenAI Developer</strong> through the support channel provided in the Google Play Store listing.</p>
        </div>
    </div>
  );

  return (
    <HashRouter>
      <div className="min-h-screen bg-krishna-50 font-sans text-krishna-900 selection:bg-peacock-200 selection:text-peacock-900">
        
        <main className="min-h-screen">
          {currentView === 'home' && renderHome()}
          {currentView === 'chapter' && renderChapterDetail()}
          {currentView === 'chat' && renderChat()}
          {currentView === 'resources' && renderResources()}
          {currentView === 'privacy' && renderPrivacyPolicy()}
        </main>

        {currentView !== 'privacy' && (
          <BottomNav currentView={currentView} setView={setCurrentView} />
        )}
        
      </div>
    </HashRouter>
  );
};

export default App;
