import { useEffect } from "react";
import type { RefObject } from "react";

import {
  MicrophoneIcon,
  SendIcon,
  SpeakerOffIcon,
  SpeakerOnIcon,
} from "@/components/chatbot/ChatIcons";

interface ChatComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onToggleVoice: () => void;
  onToggleListening: () => void;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  disabled: boolean;
  isListening: boolean;
  isVoiceEnabled: boolean;
  isVoiceBusy: boolean;
  isMicSupported: boolean;
  remainingMessages: number;
}

export function ChatComposer({
  value,
  onChange,
  onSubmit,
  onToggleVoice,
  onToggleListening,
  textareaRef,
  disabled,
  isListening,
  isVoiceEnabled,
  isVoiceBusy,
  isMicSupported,
  remainingMessages,
}: ChatComposerProps) {
  useEffect(() => {
    const element = textareaRef.current;
    if (!element) {
      return;
    }

    element.style.height = "0px";
    element.style.height = `${Math.min(element.scrollHeight, 144)}px`;
  }, [textareaRef, value]);

  return (
    <div className="space-y-3 border-t border-white/10 bg-slate-950/70 px-4 py-4 backdrop-blur">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>
          {remainingMessages} of 10 messages remaining in this session
        </span>
        {isListening ? (
          <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-emerald-200">
            Listening...
          </span>
        ) : null}
      </div>

      <div className="rounded-[28px] border border-white/10 bg-white/6 p-2 shadow-[0_18px_50px_rgba(2,8,23,0.28)]">
        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={onToggleVoice}
            className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition ${
              isVoiceEnabled
                ? "border-amber-300/30 bg-amber-400/15 text-amber-100"
                : "border-white/10 bg-slate-900/80 text-slate-300 hover:border-white/20 hover:text-white"
            }`}
            aria-pressed={isVoiceEnabled}
            aria-label={isVoiceEnabled ? "Disable voice replies" : "Enable voice replies"}
            title={isVoiceEnabled ? "Voice replies enabled" : "Enable voice replies"}
          >
            {isVoiceEnabled ? (
              <SpeakerOnIcon className={`h-5 w-5 ${isVoiceBusy ? "animate-pulse" : ""}`} />
            ) : (
              <SpeakerOffIcon className="h-5 w-5" />
            )}
          </button>

          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                onSubmit();
              }
            }}
            placeholder={
              disabled
                ? "This session has reached the 10-message limit."
                : "Ask anything about my work, projects, or experience..."
            }
            disabled={disabled}
            className="max-h-36 min-h-11 flex-1 resize-none bg-transparent px-3 py-2.5 text-sm leading-6 text-white outline-none placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <button
            type="button"
            onClick={onToggleListening}
            disabled={disabled || !isMicSupported}
            className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition ${
              isListening
                ? "border-emerald-300/35 bg-emerald-400/18 text-emerald-100"
                : "border-white/10 bg-slate-900/80 text-slate-300 hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            }`}
            aria-pressed={isListening}
            aria-label={
              isMicSupported
                ? isListening
                  ? "Stop voice input"
                  : "Start voice input"
                : "Speech recognition is not supported in this browser"
            }
            title={
              isMicSupported
                ? isListening
                  ? "Stop voice input"
                  : "Start voice input"
                : "Speech recognition is not supported in this browser"
            }
          >
            <MicrophoneIcon className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={disabled || value.trim().length === 0}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#D4B896,#8D6E42)] text-amber-950 shadow-[0_14px_30px_rgba(141,110,66,0.38)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
            aria-label="Send message"
          >
            <SendIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
