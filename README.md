# React Flexible Tags

A lightweight, customizable, and feature-rich tag input component for React with TypeScript support.

## Features

- 🎨 **Fully Customizable** - Custom rendering for tags, input, and suggestions
- ⌨️ **Keyboard Navigation** - Arrow keys, Enter, Escape, and Backspace support
- 🔍 **Async Suggestions** - Built-in autocomplete with debouncing
- ✅ **Validation** - RegExp or custom function validation
- 🎯 **Flexible Delimiters** - Configure Enter, Tab, comma, semicolon, or custom keys
- 📦 **Zero Dependencies** - Lightweight and performant
- 🎭 **TypeScript** - Full TypeScript support with type definitions
- ♿ **Accessible** - Keyboard-friendly and screen reader compatible

## Installation

```bash
npm install react-flexible-tags
```

```bash
yarn add react-flexible-tags
```

```bash
pnpm add react-flexible-tags
```

## Quick Start

```jsx
import { useState } from "react";
import FlexibleTags from "react-flexible-tags";
import "react-flexible-tags/dist/react-flexible-tags.css";

function App() {
  const [tags, setTags] = useState([]);

  return (
    <FlexibleTags value={tags} onChange={setTags} placeholder="Add a tag..." />
  );
}
```

## Props

| Prop               | Type                                                            | Default                      | Description                     |
| ------------------ | --------------------------------------------------------------- | ---------------------------- | ------------------------------- |
| `value`            | `string[]`                                                      | `[]`                         | Current tags array              |
| `onChange`         | `(tags: string[]) => void`                                      | -                            | Callback when tags change       |
| `placeholder`      | `string`                                                        | `"Add tag..."`               | Input placeholder text          |
| `max`              | `number`                                                        | `20`                         | Maximum number of tags allowed  |
| `delimiters`       | `Array<string \| "Enter" \| "Tab">`                             | `["Enter", "Tab", ",", ";"]` | Keys that trigger tag creation  |
| `validate`         | `RegExp \| (tag: string) => boolean`                            | -                            | Validation for new tags         |
| `renderTag`        | `(tag: string, index: number, remove: () => void) => ReactNode` | -                            | Custom tag renderer             |
| `renderInput`      | See below                                                       | -                            | Custom input renderer           |
| `asyncSuggestions` | `(query: string) => Promise<string[]>`                          | -                            | Async function for autocomplete |
| `renderSuggestion` | `(suggestion: string, isActive: boolean) => ReactNode`          | -                            | Custom suggestion renderer      |

## Examples

### Basic Usage

```jsx
import { useState } from "react";
import FlexibleTags from "react-flexible-tags";

function BasicExample() {
  const [tags, setTags] = useState(["react", "typescript"]);

  return (
    <FlexibleTags
      value={tags}
      onChange={setTags}
      placeholder="Type and press Enter..."
      max={10}
    />
  );
}
```

### Email Validation

```jsx
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

<FlexibleTags
  value={emails}
  onChange={setEmails}
  placeholder="Enter email addresses..."
  validate={emailRegex}
  delimiters={["Enter", "Tab", ",", " "]}
/>;
```

### Custom Validation Function

```jsx
<FlexibleTags
  value={tags}
  onChange={setTags}
  validate={(tag) => tag.length >= 3 && tag.length <= 20}
  placeholder="Tags must be 3-20 characters..."
/>
```

### Async Autocomplete

```jsx
async function fetchSuggestions(query) {
  const response = await fetch(`/api/tags?q=${query}`);
  const data = await response.json();
  return data.suggestions;
}

<FlexibleTags
  value={tags}
  onChange={setTags}
  asyncSuggestions={fetchSuggestions}
  placeholder="Start typing for suggestions..."
/>;
```

### Custom Tag Rendering

```jsx
<FlexibleTags
  value={tags}
  onChange={setTags}
  renderTag={(tag, index, remove) => (
    <div className="custom-tag">
      <span className="tag-icon">🏷️</span>
      <span>{tag}</span>
      <button onClick={remove} className="remove-btn">
        ✕
      </button>
    </div>
  )}
/>
```

### Custom Input Rendering

```jsx
<FlexibleTags
  value={tags}
  onChange={setTags}
  renderInput={({ value, onChange, onKeyDown, ref, placeholder }) => (
    <input
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      className="my-custom-input"
      style={{ fontSize: "16px", padding: "8px" }}
    />
  )}
/>
```

### Custom Suggestion Rendering

```jsx
<FlexibleTags
  value={tags}
  onChange={setTags}
  asyncSuggestions={fetchSuggestions}
  renderSuggestion={(suggestion, isActive) => (
    <div className={`suggestion ${isActive ? "highlighted" : ""}`}>
      <span className="suggestion-icon">🔍 </span>
      <span>{suggestion}</span>
    </div>
  )}
/>
```

### Complete Example with All Features

```jsx
import { useState } from "react";
import FlexibleTags from "react-flexible-tags";

function AdvancedExample() {
  const [skills, setSkills] = useState(["React", "TypeScript"]);

  const popularSkills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Vue",
    "Angular",
    "Node.js",
    "Python",
    "Java",
    "C++",
    "Go",
    "Rust",
  ];

  const getSuggestions = async (query) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));
    return popularSkills.filter((skill) =>
      skill.toLowerCase().includes(query.toLowerCase()),
    );
  };

  return (
    <div>
      <label htmlFor="skills-input">Your Skills</label>
      <FlexibleTags
        value={skills}
        onChange={setSkills}
        placeholder="Add your skills..."
        max={15}
        delimiters={["Enter", "Tab", ","]}
        validate={(tag) => tag.length >= 2 && /^[a-zA-Z0-9\s.#+]+$/.test(tag)}
        asyncSuggestions={getSuggestions}
        renderTag={(tag, index, remove) => (
          <span className="skill-tag">
            {tag}
            <button onClick={remove} aria-label={`Remove ${tag}`}>
              ×
            </button>
          </span>
        )}
      />
      <p className="tag-count">{skills.length} / 15 skills added</p>
    </div>
  );
}
```

## Keyboard Shortcuts

| Key                         | Action                                  |
| --------------------------- | --------------------------------------- |
| `Enter` / `Tab` / `,` / `;` | Add current input as tag (configurable) |
| `Backspace`                 | Remove last tag when input is empty     |
| `Arrow Down`                | Navigate to next suggestion             |
| `Arrow Up`                  | Navigate to previous suggestion         |
| `Enter`                     | Select active suggestion                |
| `Escape`                    | Close suggestions dropdown              |

## Styling

The component comes with default styles. Import the CSS file:

```jsx
import "react-flexible-tags/dist/react-flexible-tags.css";
```

### Custom Styling

Override the default classes:

```css
.flexible-tags__container {
  border: 2px solid #3b82f6;
  border-radius: 8px;
  padding: 8px;
}

.flexible-tags__tag {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
}

.flexible-tags__input {
  font-size: 16px;
  color: #1f2937;
}

.flexible-tags__suggestion {
  padding: 12px;
  font-weight: 500;
}

.flexible-tags__suggestion.active {
  background: #3b82f6;
  color: white;
}
```

## TypeScript

The package includes full TypeScript definitions:

```typescript
import FlexibleTags, { FlexibleTagsProps } from 'react-flexible-tags';

interface MyComponentProps {
  initialTags: string[];
}

const MyComponent: React.FC<MyComponentProps> = ({ initialTags }) => {
  const [tags, setTags] = useState<string[]>(initialTags);

  const handleChange = (newTags: string[]) => {
    setTags(newTags);
    // Do something with newTags
  };

  return <FlexibleTags value={tags} onChange={handleChange} />;
};
```

## Common Use Cases

### Email Input

```jsx
<FlexibleTags
  validate={/^[^\s@]+@[^\s@]+\.[^\s@]+$/}
  placeholder="Enter email addresses..."
/>
```

### Hashtags

```jsx
<FlexibleTags
  validate={(tag) => tag.startsWith("#")}
  placeholder="Add hashtags (e.g., #react)..."
/>
```

### Color Codes

```jsx
<FlexibleTags
  validate={/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/}
  placeholder="Enter hex colors (e.g., #FF5733)..."
/>
```

### URLs

```jsx
<FlexibleTags
  validate={(tag) => {
    try {
      new URL(tag);
      return true;
    } catch {
      return false;
    }
  }}
  placeholder="Add website URLs..."
/>
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © CoderBoy M J H Nahid

## Links

- [GitHub Repository](https://github.com/CoderBoyMJHNahid/react-flexible-tags)
- [NPM Package](https://www.npmjs.com/package/react-flexible-tags)
- [Report Issues](https://github.com/CoderBoyMJHNahid/react-flexible-tags/issues)

---

Made with ❤️ by CoderBoy M J H Nahid
