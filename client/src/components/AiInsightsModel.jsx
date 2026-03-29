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
    <div className="relative flex h-full flex-col items-center justify-center gap-8 overflow-hidden py-20">
      <div className="absolute top-1/2 left-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[80px]" />
      
      <div className="relative">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-8 rounded-full border-2 border-dashed border-primary/20"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-14 rounded-full border border-border/60"
        />
        
        <div className="relative z-10 rounded-3xl border border-border/60 bg-card p-8 shadow-xl">
          <Brain size={48} className="text-primary" />
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-0 right-0 p-2"
          >
            <Zap size={16} className="text-primary" />
          </motion.div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 relative z-10 text-center px-6">
        <h4 className="text-xl font-black text-foreground">Synthesizing Intelligence</h4>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ height: [8, 24, 8] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              className="w-1.5 rounded-full bg-primary/40"
            />
          ))}
        </div>
        <p className="max-w-xs text-sm font-bold text-muted-foreground/70">
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
          className="relative flex h-[85vh] max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] border border-border/50 bg-card shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] sm:h-[90vh] sm:rounded-[2.5rem]"
        >
          {/* Header */}
          <div className="relative flex shrink-0 items-start justify-between gap-3 overflow-hidden border-b border-border/50 bg-muted/20 px-4 py-5 sm:items-center sm:gap-6 sm:px-8 sm:py-8">
            <div className="absolute right-0 top-0 -mr-24 -mt-24 h-72 w-72 rounded-full bg-primary/8 blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-52 w-52 rounded-full bg-muted blur-3xl" />
            
            <div className="flex min-w-0 items-start sm:items-center gap-3 sm:gap-6 relative z-10">
              <div className="shrink-0 rounded-2xl border border-border/60 bg-background p-3 shadow-sm sm:p-4">
                <Sparkles className="text-primary" size={24} />
              </div>
              <div className="min-w-0">
                <h3 className="mb-2 break-words text-xl font-black tracking-tight leading-tight text-foreground sm:text-3xl sm:leading-none">
                  Financial Intelligence
                </h3>
                <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-bold text-muted-foreground sm:text-sm">
                  <Wand2 size={14} />
                  <span className="truncate">{startDate} — {endDate}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={onCloseModel}
              className="relative z-10 shrink-0 rounded-2xl border border-border/60 bg-background p-2.5 text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-90 sm:p-3"
            >
              <X size={22} strokeWidth={2.5} />
            </button>
          </div>

          {/* Content Area */}
          <div 
            ref={scrollRef}
            className="min-h-0 flex-1 overflow-y-auto bg-gradient-to-b from-transparent to-muted/10 px-4 py-5 custom-scrollbar sm:p-10"
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
                <div className="prose max-w-none pl-1 sm:pl-0 dark:prose-invert">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    className="markdown-modern"
                    components={{
                      h1: ({ ...props }) => <h1 className="mb-8 border-b-4 border-primary/20 pb-4 text-4xl font-black text-foreground" {...props} />,
                      h2: ({ ...props }) => <h2 className="mt-12 mb-6 flex items-center gap-3 text-2xl font-black before:h-8 before:w-2 before:rounded-full before:bg-primary" {...props} />,
                      p: ({ ...props }) => <p className="mt-0 text-lg leading-relaxed mb-6 font-medium text-foreground/80" {...props} />,
                      table: ({ ...props }) => (
                        <div className="overflow-x-auto my-10 rounded-3xl border border-border/60 bg-card/50 shadow-2xl backdrop-blur-sm">
                          <table className="min-w-full divide-y divide-border" {...props} />
                        </div>
                      ),
                      thead: ({ ...props }) => <thead className="bg-muted/50" {...props} />,
                      th: ({ ...props }) => <th className="px-8 py-5 text-left text-xs font-black text-muted-foreground uppercase tracking-[0.2em]" {...props} />,
                      td: ({ ...props }) => <td className="px-8 py-5 text-sm font-bold border-t border-border/40" {...props} />,
                      li: ({ ...props }) => <li className="mb-4 flex list-none items-start gap-3 text-lg font-medium before:text-2xl before:leading-none before:text-primary before:content-['•']" {...props} />,
                    }}
                  >
                    {displayedText}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Footer */}
          <div className="flex shrink-0 flex-col items-center justify-between gap-4 border-t border-border/50 bg-muted/20 px-4 py-4 text-xs font-black backdrop-blur-md sm:flex-row sm:px-10 sm:py-6">
            {data?.model ? (
              <div className="flex max-w-full items-center gap-3 rounded-2xl border border-border/40 bg-muted/40 px-4 py-2 text-muted-foreground/60">
                <Cpu size={14} className="text-primary" />
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
                className="group flex items-center gap-1.5 rounded-2xl border border-border/60 bg-background px-4 py-2 text-foreground transition-all hover:border-primary/30 hover:bg-primary/5"
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
