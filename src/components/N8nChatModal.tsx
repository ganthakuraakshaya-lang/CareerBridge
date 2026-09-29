import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  RotateCcw, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink,
  ChevronDown,
  Settings2,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { useCareer } from '../context/CareerContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  timestamp: string;
}

const PRODUCTION_WEBHOOK = 'https://akshaya66.app.n8n.cloud/webhook/7271425c-c4a1-4397-8bd1-ac3ac5e180a1/chat';
const TEST_WEBHOOK = 'https://akshaya66.app.n8n.cloud/webhook-test/7271425c-c4a1-4397-8bd1-ac3ac5e180a1/chat';

export const N8nChatModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { profile } = useCareer();
  const [webhookMode, setWebhookMode] = useState<'production' | 'test'>('production');
  const [webhookStatus, setWebhookStatus] = useState<'unknown' | 'ready' | 'inactive'>('unknown');
  const [showSettings, setShowSettings] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const currentWebhookUrl = webhookMode === 'production' ? PRODUCTION_WEBHOOK : TEST_WEBHOOK;

  const [sessionId] = useState(() => {
    try {
      const stored = localStorage.getItem('careerbridge_n8n_session_id');
      if (stored) return stored;
      const newId = `cb-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('careerbridge_n8n_session_id', newId);
      return newId;
    } catch {
      return `cb-${Date.now()}`;
    }
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('careerbridge_n8n_chat_messages');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'welcome',
        sender: 'bot',
        text: `Hello ${profile.name.split(' ')[0]}! I'm your CareerBridge Placement AI agent connected to your n8n workflow. Ask me anything about recruitment drives, company interview rounds, DSA patterns, or resume tips!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Persist messages
  useEffect(() => {
    try {
      localStorage.setItem('careerbridge_n8n_chat_messages', JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const payload = {
        action: 'sendMessage',
        chatInput: text,
        message: text,
        sessionId: sessionId,
        studentContext: {
          name: profile.name,
          branch: profile.branch,
          cgpa: profile.cgpa,
          activeBacklogs: profile.activeBacklogs,
          college: profile.college,
        }
      };

      const response = await fetch(currentWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*',
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 404) {
        setWebhookStatus('inactive');
        throw new Error(
          webhookMode === 'production'
            ? 'n8n workflow is currently INACTIVE. Please toggle the "Active" switch to ON in the top right of your n8n workflow canvas.'
            : 'Test webhook not active. In n8n, click the "Execute workflow" button on the canvas and try sending your message again.'
        );
      }

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}: ${response.statusText}`);
      }

      setWebhookStatus('ready');

      const contentType = response.headers.get('content-type') || '';
      let botResponse = '';

      if (contentType.includes('application/json')) {
        const data = await response.json();
        if (typeof data === 'string') {
          botResponse = data;
        } else if (Array.isArray(data) && data[0]) {
          botResponse = data[0].output || data[0].text || data[0].response || JSON.stringify(data[0], null, 2);
        } else if (data.output) {
          botResponse = data.output;
        } else if (data.text) {
          botResponse = data.text;
        } else if (data.response) {
          botResponse = data.response;
        } else if (data.message) {
          botResponse = data.message;
        } else {
          botResponse = JSON.stringify(data, null, 2);
        }
      } else {
        botResponse = await response.text();
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botResponse || 'Message received and processed successfully by your n8n agent.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      console.error('n8n error:', err);
      const systemError: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'system',
        text: err.message || 'Could not connect to n8n webhook.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, systemError]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    const welcome: ChatMessage = {
      id: `welcome-${Date.now()}`,
      sender: 'bot',
      text: `Chat reset. Ask me anything about final-year placements, company drive patterns (Amazon, Qualcomm, TCS), SDE preparation, or resume advice!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([welcome]);
  };

  const quickPrompts = [
    "What are the rounds for Amazon SDE-1?",
    "Qualcomm hardware interview questions",
    "Explain In-Hand salary vs 12 LPA CTC",
    "How to improve my ATS resume score?"
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`w-full transition-all duration-200 flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden ${
          isExpanded 
            ? 'h-[92vh] max-w-5xl' 
            : 'h-[620px] max-h-[90vh] max-w-xl'
        }`}
      >
        {/* Header */}
        <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white truncate">CareerBridge Placement AI</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700/50 font-medium">
                  n8n agent
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <span className={`w-1.5 h-1.5 rounded-full ${webhookStatus === 'inactive' ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`} />
                <span className="truncate">
                  {webhookMode === 'production' ? 'Production Webhook' : 'Test Mode'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-slate-400 shrink-0">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-1.5 hover:text-white rounded-lg transition-colors ${showSettings ? 'bg-slate-800 text-blue-400' : 'hover:bg-slate-800'}`}
              title="Webhook Settings"
            >
              <Settings2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleClearHistory}
              className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Clear Chat History"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="hidden sm:block p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Settings Drawer (Webhook configuration & troubleshooting) */}
        {showSettings && (
          <div className="bg-slate-950/90 border-b border-slate-800 p-3.5 text-xs space-y-2.5 shrink-0 animate-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-300 text-[11px] uppercase tracking-wider">n8n Webhook Target</span>
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[11px]">
                <button
                  onClick={() => setWebhookMode('production')}
                  className={`px-2 py-0.5 rounded font-medium transition-colors ${
                    webhookMode === 'production'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Production (/webhook)
                </button>
                <button
                  onClick={() => setWebhookMode('test')}
                  className={`px-2 py-0.5 rounded font-medium transition-colors ${
                    webhookMode === 'test'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Test Mode (/webhook-test)
                </button>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 font-mono text-[10px] text-slate-300 break-all select-all">
              {currentWebhookUrl}
            </div>

            <div className="bg-blue-950/30 border border-blue-800/40 rounded-lg p-2.5 text-[11px] text-blue-200 space-y-1">
              <div className="font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>n8n Activation Guide:</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                If the chat returns a 404 error, make sure your workflow in n8n is set to <strong>Active (ON)</strong> via the toggle switch in the top-right corner of your n8n workflow canvas.
              </p>
            </div>
          </div>
        )}

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const isSystem = msg.sender === 'system';

            if (isSystem) {
              return (
                <div key={msg.id} className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/50 text-amber-200 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1 min-w-0">
                    <p className="font-medium">{msg.text}</p>
                    <p className="text-[10px] text-amber-300/80">
                      💡 Tip: Open your n8n canvas at <a href="https://akshaya66.app.n8n.cloud" target="_blank" rel="noreferrer" className="underline font-semibold hover:text-white inline-flex items-center gap-0.5">akshaya66.app.n8n.cloud <ExternalLink className="w-2.5 h-2.5" /></a> and switch the toggle in the top-right corner to <strong>Active</strong>.
                    </p>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-6 h-6 rounded-full bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300 shrink-0 text-[10px] mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className={`space-y-1 max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap break-words ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-tr-sm'
                        : 'bg-slate-800/90 border border-slate-700/70 text-slate-200 rounded-tl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-500 px-1 font-mono block">
                    {msg.timestamp}
                  </span>
                </div>

                {isUser && (
                  <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 shrink-0 text-[10px] mt-0.5">
                    <span className="font-bold text-[9px]">YOU</span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs py-1">
              <div className="w-6 h-6 rounded-full bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300 text-[10px]">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-[11px] text-slate-400 ml-1">n8n thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts (if chat is short) */}
        {messages.length <= 2 && (
          <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/40 shrink-0">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-400" />
              <span>Suggested Placement Queries:</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isLoading}
                  className="text-[11px] px-2.5 py-1 bg-slate-800 hover:bg-slate-700 hover:text-blue-300 border border-slate-700 rounded-md text-slate-300 text-left transition-colors truncate max-w-full"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask about placement drives, DSA, interview tips, CTC..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white flex items-center justify-center transition-colors shadow-sm shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[9px] text-slate-500 mt-1.5 px-1 font-mono">
            <span>Target: {webhookMode === 'production' ? 'Production Webhook' : 'Test Webhook'}</span>
            <span className="truncate max-w-[200px]">ID: 7271425c...</span>
          </div>
        </div>
      </div>
    </div>
  );
};
