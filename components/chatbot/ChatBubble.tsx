import { motion } from "framer-motion";

import { ChatSparkIcon } from "@/components/chatbot/ChatIcons";
import type { ChatMessage } from "@/components/chatbot/chat-types";

interface ChatBubbleProps {
  message?: ChatMessage;
  content?: string;
  role?: ChatMessage["role"];
  isStreaming?: boolean;
}

function LoadingDots() {
  return (
    <div className="flex items-center gap-1.5" aria-label="Assistant is typing">
      {[0, 0.14, 0.28].map((delay) => (
        <motion.span
          key={delay}
          className="h-2.5 w-2.5 rounded-full bg-amber-200/95"
          animate={{ y: [0, -4, 0], opacity: [0.45, 1, 0.45] }}
          transition={{
            delay,
            duration: 0.8,
            ease: "easeInOut",
            repeat: Number.POSITIVE_INFINITY,
          }}
        />
      ))}
    </div>
  );
}

export function ChatBubble({
  message,
  content,
  role,
  isStreaming = false,
}: ChatBubbleProps) {
  const resolvedRole = role ?? message?.role ?? "assistant";
  const resolvedContent = content ?? message?.content ?? "";
  const isUser = resolvedRole === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={`flex items-end gap-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser ? (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-white/12 bg-white/10 text-amber-200 shadow-[0_12px_28px_rgba(7,17,31,0.22)]">
          <ChatSparkIcon className="h-4.5 w-4.5" />
        </div>
      ) : null}

      <div
        className={`max-w-[85%] rounded-[24px] px-4 py-3 text-sm leading-7 shadow-[0_18px_50px_rgba(7,17,31,0.16)] ${
          isUser
            ? "rounded-br-md bg-[linear-gradient(135deg,#D4B896,#8D6E42)] text-amber-950"
            : "rounded-bl-md border border-white/10 bg-slate-950/55 text-slate-100 backdrop-blur"
        }`}
      >
        {isStreaming && !resolvedContent ? (
          <LoadingDots />
        ) : (
          <p className="whitespace-pre-wrap break-words">{resolvedContent}</p>
        )}
      </div>
    </motion.div>
  );
}
