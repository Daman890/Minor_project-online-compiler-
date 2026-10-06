import Editor from '@monaco-editor/react';

export default function CodeEditor({ language, code, onChange, theme = 'vs-dark' }) {
  return (
    <Editor
      height="100%"
      language={language === 'cpp' ? 'cpp' : language}
      value={code}
      theme={theme}
      onChange={(value) => onChange(value || '')}
      options={{
        fontSize: 15,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        wordWrap: 'on',
        tabSize: 2,
      }}
    />
  );
}