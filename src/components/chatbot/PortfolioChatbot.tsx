import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { ChatBubble } from "@/components/chatbot/ChatBubble";
import { ChatComposer } from "@/components/chatbot/ChatComposer";
import { ChatSparkIcon, CloseIcon } from "@/components/chatbot/ChatIcons";
import type {
  ChatMessage,
  ChatRequestMessage,
} from "@/components/chatbot/chat-types";

const CHAT_ENDPOINT = "/api/chat";
const PRIMARY_TTS_ENDPOINT = "/api/tts";
const FALLBACK_TTS_ENDPOINT = "/api/chat/tts";
const MAX_USER_MESSAGES = 10;

const INITIAL_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi, I'm the portfolio assistant. Ask about projects, experience, skills, or anything else you want to know.",
};

function createMessageId() {
  return globalThis.crypto?.randomUUID?.() ?? `msg-${Date.now()}-${Math.random()}`;
}

function serializeMessages(messages: ChatMessage[]) {
  return messages
    .filter((message) => message.id !== INITIAL_MESSAGE.id)
    .map<ChatRequestMessage>(({ role, content }) => ({ role, content }));
}

async function streamChatResponse(
  messages: ChatRequestMessage[],
  onChunk: (responseSoFar: string) => void
) {
  const response = await fetch(CHAT_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok || !response.body) {
    throw new Error("The chat service is unavailable right now.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let fullResponse = "";

  while (true) {
    const { done, value } = await reader.read();
    buffer += decoder.decode(value ?? new Uint8Array(), { stream: !done });

    let boundaryIndex = buffer.indexOf("\n\n");

    while (boundaryIndex !== -1) {
      const rawEvent = buffer.slice(0, boundaryIndex);
      buffer = buffer.slice(boundaryIndex + 2);

      const payload = rawEvent
        .split("\n")
        .filter((line) => line.startsWith("data: "))
        .map((line) => line.slice(6))
        .join("");

      if (payload && payload !== "[DONE]") {
        const parsed = JSON.parse(payload) as { text?: string };

        if (parsed.text) {
          fullResponse += parsed.text;
          onChunk(fullResponse);
        }
      }

      boundaryIndex = buffer.indexOf("\n\n");
    }

    if (done) {
      break;
    }
  }

  return fullResponse.trim();
}

export function PortfolioChatbot() {
  const shouldReduceMotion = useReducedMotion();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const sendMessageRef = useRef<(input: string) => Promise<void>>(async () => {});

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [draft, setDraft] = useState("");
  const [streamedResponse, setStreamedResponse] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isVoiceBusy, setIsVoiceBusy] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMicSupported, setIsMicSupported] = useState(false);

  const userMessageCount = messages.filter((message) => message.role === "user").length;
  const remainingMessages = Math.max(MAX_USER_MESSAGES - userMessageCount, 0);
  const isSessionLimitReached = remainingMessages === 0;

  const stopAudioPlayback = () => {
    if (!audioSourceRef.current) {
      return;
    }

    try {
      audioSourceRef.current.stop();
    } catch {
      // Ignore invalid stop calls if playback already ended.
    }

    audioSourceRef.current = null;
  };

  const ensureAudioContext = async () => {
    const AudioContextCtor =
      window.AudioContext ??
      (window as Window & {
        webkitAudioContext?: typeof AudioContext;
      }).webkitAudioContext;

    if (!AudioContextCtor) {
      return null;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextCtor();
    }

    if (audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume();
    }

    return audioContextRef.current;
  };

  const playVoiceReply = async (text: string) => {
    if (!text.trim()) {
      return;
    }

    const audioContext = await ensureAudioContext();

    if (!audioContext) {
      return;
    }

    setIsVoiceBusy(true);

    try {
      let response = await fetch(PRIMARY_TTS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (response.status === 404) {
        response = await fetch(FALLBACK_TTS_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        });
      }

      if (!response.ok) {
        throw new Error("Voice playback is unavailable right now.");
      }

      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer.slice(0));

      stopAudioPlayback();

      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.onended = () => {
        if (audioSourceRef.current === source) {
          audioSourceRef.current = null;
        }
      };

      audioSourceRef.current = source;
      source.start();
    } finally {
      setIsVoiceBusy(false);
    }
  };

  const sendMessage = async (input: string) => {
    const content = input.trim();

    if (!content || isThinking || isSessionLimitReached) {
      return;
    }

    const userMessage: ChatMessage = {
      id: createMessageId(),
      role: "user",
      content,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setDraft("");
    setStreamedResponse("");
    setIsThinking(true);
    setIsListening(false);

    try {
      const assistantReply = await streamChatResponse(
        serializeMessages(nextMessages),
        (responseSoFar) => {
          setStreamedResponse(responseSoFar);
        }
      );

      const finalReply =
        assistantReply.trim() ||
        "I didn't get a full answer back that time. Please try again.";

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: createMessageId(),
          role: "assistant",
          content: finalReply,
        },
      ]);
      setStreamedResponse("");

      if (isVoiceEnabled) {
        await playVoiceReply(finalReply);
      }
    } catch {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: createMessageId(),
          role: "assistant",
          content:
            "I ran into a connection issue while answering. Please try again in a moment.",
        },
      ]);
      setStreamedResponse("");
    } finally {
      setIsThinking(false);
    }
  };

  useEffect(() => {
    sendMessageRef.current = sendMessage;
  });

  useEffect(() => {
    const SpeechRecognitionCtor =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      let transcript = "";

      for (
        let index = event.resultIndex;
        index < event.results.length;
        index += 1
      ) {
        transcript += `${event.results[index]?.[0]?.transcript ?? ""} `;
      }

      transcript = transcript.trim();

      if (!transcript) {
        return;
      }

      void sendMessageRef.current(transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    queueMicrotask(() => setIsMicSupported(true));

    return () => {
      recognition.onresult = null;
      recognition.onend = null;
      recognition.onerror = null;
      recognition.abort();
      recognitionRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const viewport = scrollAreaRef.current;
    viewport?.scrollTo({
      top: viewport.scrollHeight,
      behavior: "auto",
    });

    const focusTimer = window.setTimeout(() => {
      textareaRef.current?.focus();
    }, 120);

    return () => {
      window.clearTimeout(focusTimer);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const viewport = scrollAreaRef.current;
    viewport?.scrollTo({
      top: viewport.scrollHeight,
      behavior: streamedResponse ? "auto" : "smooth",
    });
  }, [isOpen, messages, streamedResponse]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      if (audioSourceRef.current) {
        try {
          audioSourceRef.current.stop();
        } catch {
          // Ignore invalid stop calls if playback already ended.
        }
      }
      audioSourceRef.current = null;
      void audioContextRef.current?.close();
    };
  }, []);

  const toggleListening = async () => {
    if (!recognitionRef.current || isThinking || isSessionLimitReached) {
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch {
      setIsListening(false);
    }
  };

  const toggleVoice = async () => {
    if (isVoiceEnabled) {
      stopAudioPlayback();
      setIsVoiceEnabled(false);
      return;
    }

    await ensureAudioContext();
    setIsVoiceEnabled(true);
  };

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed right-5 bottom-5 z-40 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,#D4B896,#8D6E42)] text-amber-950 shadow-[0_22px_45px_rgba(141,110,66,0.45)] ring-1 ring-amber-100/20 transition hover:brightness-110 sm:right-6 sm:bottom-6"
        whileHover={shouldReduceMotion ? undefined : { scale: 1.04, y: -2 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
        aria-label="Open AI chatbot"
      >
        <ChatSparkIcon className="h-9 w-9" />
      </motion.button>

      <AnimatePresence>
        {isOpen ? (
          <>
            <motion.button
              type="button"
              className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[2px] sm:bg-slate-950/15"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.section
              id="portfolio-chatbot"
              aria-label="Portfolio chatbot"
              initial={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 0, y: 26, scale: 0.98 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 18, scale: 0.98 }
              }
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="fixed inset-x-2 bottom-2 z-50 flex h-[min(600px,calc(100dvh-1rem))] flex-col overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,6,23,0.94))] shadow-[0_40px_90px_rgba(2,8,23,0.58)] sm:inset-x-auto sm:right-6 sm:bottom-24 sm:w-[420px]"
            >
              <div className="border-b border-white/10 bg-[linear-gradient(135deg,rgba(212,184,150,0.2),rgba(141,110,66,0.05))] px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12 bg-white/10 text-amber-200">
                        <ChatSparkIcon className="h-5.5 w-5.5" />
                      </div>
                      <div>
                        <h2 className="text-base font-semibold text-white">
                          Ask the portfolio assistant
                        </h2>
                        <p className="text-sm text-slate-300">
                          Streaming answers with optional voice playback
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-slate-300 transition hover:border-white/20 hover:text-white"
                    aria-label="Close chatbot"
                  >
                    <CloseIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div
                ref={scrollAreaRef}
                className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-5"
              >
                {messages.map((message) => (
                  <ChatBubble key={message.id} message={message} />
                ))}

                {isThinking ? (
                  <ChatBubble
                    role="assistant"
                    content={streamedResponse}
                    isStreaming={streamedResponse.length === 0}
                  />
                ) : null}
              </div>

              {isSessionLimitReached ? (
                <div className="mx-4 rounded-2xl border border-amber-300/18 bg-amber-400/10 px-4 py-3 text-sm text-amber-100 sm:mx-5">
                  This chat demo has reached its 10-message session limit.
                  Refresh the page to start a fresh conversation.
                </div>
              ) : null}

              <ChatComposer
                value={draft}
                onChange={setDraft}
                onSubmit={() => void sendMessage(draft)}
                onToggleVoice={() => void toggleVoice()}
                onToggleListening={() => void toggleListening()}
                textareaRef={textareaRef}
                disabled={isThinking || isSessionLimitReached}
                isListening={isListening}
                isVoiceEnabled={isVoiceEnabled}
                isVoiceBusy={isVoiceBusy}
                isMicSupported={isMicSupported}
                remainingMessages={remainingMessages}
              />
            </motion.section>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
