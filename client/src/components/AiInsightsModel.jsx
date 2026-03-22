import { X, Sparkles, Wand2, Brain, Zap, Cpu } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useGetInsightQuery } from "../redux/insightApiSlice";
import { useState, useEffect, useRef } from "react";
import useTypingEffect from "../hooks/useTypingEffect";
import { motion, AnimatePresence } from "framer-motion";

export const AiInsightsModel = ({ startDate, endDate, onCloseModel }) => {
  const previousOverflowRef = useRef("");

  const formatDate = (date) => {
    return date.split("-").reverse().join("-");
  };

  const { data, isLoading, isError, refetch } = useGetInsightQuery({
    formDate: formatDate(startDate),
    toDate: formatDate(endDate),
  });

  const [fullText, setFullText] = useState("");
  const displayedText = useTypingEffect(fullText);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (data?.insights) {
      setFullText(data.insights.trimStart());
    }
  }, [data]);

  useEffect(() => {
    const currentBodyOverflow = document.body.style.overflow;
    previousOverflowRef.current = currentBodyOverflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflowRef.current;
    };
  }, []);

  useEffect(() => {
    if (!scrollRef.current) {
      return;
    }

    const container = scrollRef.current;
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    if (distanceFromBottom < 120) {
      container.scrollTop = container.scrollHeight;
    }
  }, [displayedText]);

  const LoadingAnimation = () => (
    <div className="h-full flex flex-col items-center justify-center gap-10 py-20 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] animate-pulse" />
      
      <div className="relative">
        {/* Orbiting rings */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-8 border-2 border-dashed border-indigo-500/30 rounded-full"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-14 border border-violet-500/20 rounded-full"
        />
        
        {/* Central Core */}
        <div className="relative z-10 p-8 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl shadow-[0_0_40px_rgba(79,70,229,0.4)]">
          <Brain size={48} className="text-white animate-bounce" />
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-0 right-0 p-2"
          >
            <Zap size={16} className="text-yellow-300 fill-yellow-300" />
          </motion.div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 relative z-10 text-center px-6">
        <h4 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-500">
          Synthesizing Intelligence
        </h4>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ height: [8, 24, 8] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              className="w-1.5 bg-indigo-500/40 rounded-full"
            />
          ))}
        </div>
        <p className="text-sm font-bold text-muted-foreground/60 max-w-xs">
          Scanning transactions, identifying patterns, and crafting personalized tips just for you.
        </p>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4 sm:p-6"
      >
        <motion.div
          initial={{ scale: 0.9, y: 40, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 40, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-card dark:bg-[#0B0F1A] w-full max-w-5xl h-[85vh] sm:h-[90vh] max-h-[90vh] rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col border border-border/50 relative"
        >
          {/* Header */}
          <div className="relative shrink-0 px-4 py-5 sm:px-8 sm:py-8 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white flex items-start sm:items-center justify-between gap-3 sm:gap-6 overflow-hidden">
            {/* Abstract Background patterns */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl -ml-20 -mb-20" />
            
            <div className="flex min-w-0 items-start sm:items-center gap-3 sm:gap-6 relative z-10">
              <div className="shrink-0 p-3 sm:p-4 bg-white/15 rounded-2xl backdrop-blur-2xl border border-white/20 shadow-inner">
                <Sparkles className="text-yellow-300 animate-pulse" size={24} />
              </div>
              <div className="min-w-0">
                <h3 className="text-xl sm:text-3xl font-black tracking-tight leading-tight sm:leading-none mb-2 break-words">
                  Financial Intelligence
                </h3>
                <div className="inline-flex max-w-full items-center gap-2 text-indigo-100 font-bold text-xs sm:text-sm bg-black/10 px-3 py-1 rounded-full">
                  <Wand2 size={14} />
                  <span className="truncate">{startDate} — {endDate}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={onCloseModel}
              className="relative z-10 shrink-0 p-2.5 sm:p-3 bg-white/10 hover:bg-white/20 rounded-2xl backdrop-blur-md transition-all active:scale-90"
            >
              <X size={22} strokeWidth={2.5} />
            </button>
          </div>

          {/* Content Area */}
          <div 
            ref={scrollRef}
            className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:p-10 dark:text-gray-100 custom-scrollbar bg-gradient-to-b from-transparent to-muted/10"
          >
            {isLoading ? (
              <LoadingAnimation />
            ) : isError ? (
              <div className="h-full flex flex-col items-center justify-center gap-8 py-20 text-center">
                <div className="p-6 bg-destructive/10 rounded-3xl text-destructive border border-destructive/20 shadow-xl">
                  <X size={64} strokeWidth={2.5} />
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-black">Analysis Interrupted</h1>
                  <p className="text-muted-foreground font-medium max-w-sm mx-auto">
                    We encountered an obstacle while processing your financial data. Let's try once more.
                  </p>
                </div>
                <button
                  className="px-10 py-4 bg-primary text-primary-foreground rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-105 transition-all active:scale-95"
                  onClick={refetch}
                >
                  Relaunch Engine
                </button>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto">
                <div className="prose dark:prose-invert max-w-none pl-1 sm:pl-0">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    className="markdown-modern"
                    components={{
                      h1: ({ ...props }) => <h1 className="text-4xl font-black mb-8 pb-4 border-b-4 border-indigo-500/20 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500" {...props} />,
                      h2: ({ ...props }) => <h2 className="text-2xl font-black mt-12 mb-6 flex items-center gap-3 before:w-2 before:h-8 before:bg-indigo-500 before:rounded-full" {...props} />,
                      p: ({ ...props }) => <p className="mt-0 text-lg leading-relaxed mb-6 font-medium text-foreground/80" {...props} />,
                      table: ({ ...props }) => (
                        <div className="overflow-x-auto my-10 rounded-3xl border border-border/60 bg-card/50 shadow-2xl backdrop-blur-sm">
                          <table className="min-w-full divide-y divide-border" {...props} />
                        </div>
                      ),
                      thead: ({ ...props }) => <thead className="bg-muted/50" {...props} />,
                      th: ({ ...props }) => <th className="px-8 py-5 text-left text-xs font-black text-muted-foreground uppercase tracking-[0.2em]" {...props} />,
                      td: ({ ...props }) => <td className="px-8 py-5 text-sm font-bold border-t border-border/40" {...props} />,
                      li: ({ ...props }) => <li className="mb-4 text-lg font-medium list-none flex items-start gap-3 before:content-['•'] before:text-indigo-500 before:text-2xl before:leading-none" {...props} />,
                    }}
                  >
                    {displayedText}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Footer */}
          <div className="shrink-0 px-4 py-4 sm:px-10 sm:py-6 border-t border-border/50 bg-muted/20 backdrop-blur-md flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-black">
            {data?.model ? (
              <div className="flex items-center gap-3 text-muted-foreground/60 bg-muted/40 px-4 py-2 rounded-2xl border border-border/40 max-w-full">
                <Cpu size={14} className="text-indigo-500" />
                <span className="truncate">Model: <span className="text-foreground">{data.model}</span></span>
              </div>
            ) : (
              <div />
            )}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-muted-foreground/60">INTELLIGENCE POWERED BY</span>
              <a
                href="https://openrouter.ai/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-500/10 text-indigo-600 rounded-2xl border border-indigo-500/20 hover:bg-indigo-500 hover:text-white transition-all group"
              >
                <span className="tracking-widest">OPENROUTER</span>
                <Zap size={12} className="group-hover:fill-current" />
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
