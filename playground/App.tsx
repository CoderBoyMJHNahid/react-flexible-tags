import { useState } from "react";
import { FlexibleTags } from "../src/index";

const App = () => {
  const [tags, setTags] = useState<string[]>([]);

  return (
    <div style={{ padding: 40 }}>
      <h2>React Flexible Tags – Playground</h2>

      <FlexibleTags
        value={tags}
        onChange={setTags}
        placeholder="Type and press Enter"
        max={2}
        delimiters={["Enter", "Tab", ","]}
        asyncSuggestions={async (query) => {
          return [
            "React",
            "React Native",
            "React Query",
            "Vue",
            "Svelte",
          ].filter((t) => t.toLowerCase().includes(query.toLowerCase()));
        }}
        renderSuggestion={(suggestion, isActive) => (
          <div className={`suggestion ${isActive ? "highlighted" : ""}`}>
            <span className="suggestion-icon"># </span>
            <span>{suggestion}</span>
          </div>
        )}
      />

      <pre>{JSON.stringify(tags, null, 2)}</pre>
    </div>
  );
};

export default App;
