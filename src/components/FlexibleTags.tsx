import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import "./FlexibleTags.css";

export interface FlexibleTagsProps {
  value?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
  max?: number;
  delimiters?: Array<string | "Enter" | "Tab">;
  validate?: RegExp | ((tag: string) => boolean);

  renderTag?: (tag: string, index: number, remove: () => void) => ReactNode;

  renderInput?: (props: {
    value: string;
    placeholder?: string;
    onChange: (value: string) => void;
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
    ref: React.Ref<HTMLInputElement>;
  }) => ReactNode;

  asyncSuggestions?: (query: string) => Promise<string[]>;
  renderSuggestion?: (suggestion: string, isActive: boolean) => ReactNode;
}

const DEFAULT_DELIMITERS = ["Enter", "Tab", ",", ";"];

const FlexibleTags = ({
  value = [],
  onChange,
  placeholder = "Add tag...",
  max = 20,
  delimiters = DEFAULT_DELIMITERS,
  validate,
  renderTag,
  renderInput,
  asyncSuggestions,
  renderSuggestion,
}: FlexibleTagsProps) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const isValidTag = (tag: string) => {
    if (!validate) return true;
    if (validate instanceof RegExp) return validate.test(tag);
    return validate(tag);
  };

  const addTag = (tag: string) => {
    if (!tag || value.includes(tag)) return;

    if (!isValidTag(tag)) {
      setError("Invalid tag");
      return;
    }

    if (value.length >= max) {
      setError(`You can add up to ${max} tags`);
      return;
    }

    onChange?.([...value, tag]);
    setInput("");
    setError(null);
  };

  const removeTag = (index: number) => {
    onChange?.(value.filter((_, i) => i !== index));
    setError(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        return;
      }

      if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault();
        addTag(suggestions[activeIndex]);
        setSuggestions([]);
        setActiveIndex(-1);
        return;
      }

      if (e.key === "Escape") {
        setSuggestions([]);
        setActiveIndex(-1);
        return;
      }
    }

    if (delimiters.includes(e.key)) {
      e.preventDefault();
      addTag(input.trim());
    }

    if (e.key === "Backspace" && !input && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  useEffect(() => {
    if (!asyncSuggestions || !input) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const result = await asyncSuggestions(input);
        setSuggestions(result.filter((s) => !value.includes(s)));
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [input, asyncSuggestions, value]);

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(null), 3000);
    return () => clearTimeout(timer);
  }, [error]);

  return (
    <>
      <div
        className="flexible-tags__container"
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag, i) =>
          renderTag ? (
            <span key={i}>{renderTag(tag, i, () => removeTag(i))}</span>
          ) : (
            <span key={i} className="flexible-tags__tag">
              {tag}
              <button
                type="button"
                className="flexible-tags__remove"
                onClick={() => removeTag(i)}
              >
                ×
              </button>
            </span>
          ),
        )}

        {renderInput ? (
          renderInput({
            value: input,
            placeholder,
            onChange: setInput,
            onKeyDown: handleKeyDown,
            ref: inputRef,
          })
        ) : (
          <input
            ref={inputRef}
            className="flexible-tags__input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
          />
        )}

        {(loading || suggestions.length > 0) && (
          <div className="suggestions_wrapper">
            <div className="flexible-tags__suggestions">
              {loading && (
                <div className="flexible-tags__suggestion">Loading…</div>
              )}

              {suggestions.map((s, i) => (
                <div
                  key={s}
                  className={`flexible-tags__suggestion ${
                    i === activeIndex ? "active" : ""
                  }`}
                  onMouseDown={() => {
                    addTag(s);
                    setSuggestions([]);
                    setActiveIndex(-1);
                  }}
                >
                  {renderSuggestion
                    ? renderSuggestion(s, i === activeIndex)
                    : s}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && <span className="flexible-tags__error">{error}</span>}
    </>
  );
};

export default FlexibleTags;
