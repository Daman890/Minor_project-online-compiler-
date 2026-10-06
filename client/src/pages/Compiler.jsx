import { useState, useEffect } from 'react';
import CodeEditor from '../components/Editor';
import API from '../services/api';

const LANGUAGES = [
  { id: 'python', name: 'Python', monaco: 'python', color: '#3776ab' },
  { id: 'java', name: 'Java', monaco: 'java', color: '#f89820' },
  { id: 'cpp', name: 'C++', monaco: 'cpp', color: '#00599c' },
  { id: 'c', name: 'C', monaco: 'c', color: '#a8b9cc' },
  { id: 'javascript', name: 'JavaScript', monaco: 'javascript', color: '#f7df1e' },
];

const DEFAULT_CODE = {
  python: `print("Hello from Python!")
name = input("Enter your name: ")
print(f"Welcome {name}")`,
  java: `public class Main {
  public static void main(String[] args) {
    System.out.println("Hello from Java!");
  }
}`,
  cpp: `#include <iostream>
using namespace std;

int main() {
  cout << "Hello from C++!" << endl;
  return 0;
}`,
  c: `#include <stdio.h>

int main() {
  printf("Hello from C!\\n");
  return 0;
}`,
  javascript: `console.log("Hello from JavaScript!");`,
};

export default function Compiler() {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(DEFAULT_CODE.python);
  const [stdin, setStdin] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(true);

  // MongoDB related states
  const [savedCodes, setSavedCodes] = useState([]);
  const [showSaved, setShowSaved] = useState(false);
  const [saveTitle, setSaveTitle] = useState('');
  const [saving, setSaving] = useState(false);

  const currentLang = LANGUAGES.find((l) => l.id === language);

  // Theme
  const theme = isDark
    ? {
        bg: '#0b0f19',
        panel: '#111827',
        border: '#1f2937',
        text: '#e2e8f0',
        muted: '#94a3b8',
        inputBg: '#020617',
        inputText: '#4ade80',
        navbar: 'linear-gradient(90deg, #111827, #1f2937)',
        instructionBg: '#172554',
        instructionText: '#93c5fd',
      }
    : {
        bg: '#f8fafc',
        panel: '#ffffff',
        border: '#e2e8f0',
        text: '#1e293b',
        muted: '#64748b',
        inputBg: '#f1f5f9',
        inputText: '#166534',
        navbar: 'linear-gradient(90deg, #f1f5f9, #e2e8f0)',
        instructionBg: '#dbeafe',
        instructionText: '#1e40af',
      };

  // Load saved codes from MongoDB
  const fetchSavedCodes = async () => {
    try {
      const res = await API.get('/code');
      setSavedCodes(res.data);
    } catch (err) {
      console.error('Failed to load saved codes', err);
    }
  };

  useEffect(() => {
    fetchSavedCodes();
  }, []);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(DEFAULT_CODE[lang] || '');
    setOutput('');
  };

  const runCode = async () => {
    setLoading(true);
    setOutput('Running your code...');

    try {
      const res = await API.post('/execute', {
        code,
        language,
        stdin,
      });

      const { stdout, stderr, status, time, memory } = res.data;

      setOutput(
        `Status: ${status}\nTime: ${time}s | Memory: ${memory} KB\n\n` +
          (stdout || '') +
          (stderr ? `\n----- Error -----\n${stderr}` : '')
      );
    } catch (err) {
      setOutput(
        'Error: ' + (err.response?.data?.error || err.message || 'Something went wrong')
      );
    } finally {
      setLoading(false);
    }
  };

  // Save code to MongoDB
  const saveCode = async () => {
    if (!saveTitle.trim()) {
      alert('Please enter a title for your code');
      return;
    }

    setSaving(true);
    try {
      await API.post('/code', {
        title: saveTitle,
        language,
        code,
      });
      setSaveTitle('');
      alert('Code saved successfully!');
      fetchSavedCodes(); // refresh list
    } catch (err) {
      alert('Failed to save code');
    } finally {
      setSaving(false);
    }
  };

  // Load a saved code
  const loadCode = (snippet) => {
    setLanguage(snippet.language);
    setCode(snippet.code);
    setShowSaved(false);
    setOutput('');
  };

  // Delete a saved code
  const deleteCode = async (id) => {
    if (!window.confirm('Are you sure you want to delete this code?')) return;

    try {
      await API.delete(`/code/${id}`);
      fetchSavedCodes();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  return (
    <div style={{ ...styles.container, backgroundColor: theme.bg, color: theme.text }}>
      {/* Navbar */}
      <div style={{ ...styles.navbar, background: theme.navbar, borderBottom: `1px solid ${theme.border}` }}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>⟨/⟩</span>
          <span style={styles.logoText}>CodeLab</span>
        </div>

        <div style={styles.controls}>
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            style={{
              ...styles.select,
              backgroundColor: isDark ? '#1f2937' : '#fff',
              color: theme.text,
              border: `1px solid ${theme.border}`,
            }}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>{lang.name}</option>
            ))}
          </select>

          <button
            onClick={() => setIsDark(!isDark)}
            style={{
              ...styles.themeBtn,
              backgroundColor: isDark ? '#1f2937' : '#e2e8f0',
              color: theme.text,
              border: `1px solid ${theme.border}`,
            }}
          >
            {isDark ? '☀️ Light' : '🌙 Dark'}
          </button>

          <button
            onClick={() => setShowSaved(!showSaved)}
            style={{
              ...styles.themeBtn,
              backgroundColor: isDark ? '#1f2937' : '#e2e8f0',
              color: theme.text,
              border: `1px solid ${theme.border}`,
            }}
          >
            {showSaved ? 'Close Saved' : '📁 Saved Codes'}
          </button>

          <button
            onClick={runCode}
            disabled={loading}
            style={{
              ...styles.runButton,
              background: loading ? '#4b5563' : 'linear-gradient(135deg, #22c55e, #16a34a)',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Running...' : '▶ Run Code'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        {/* Editor */}
        <div style={{ ...styles.editorPanel, borderRight: `1px solid ${theme.border}` }}>
          <div style={{ ...styles.panelHeader, backgroundColor: theme.panel, borderBottom: `1px solid ${theme.border}` }}>
            <div style={{ ...styles.panelTitle, color: theme.muted }}>
              <span style={{ ...styles.langBadge, backgroundColor: currentLang?.color }} />
              {currentLang?.name} Editor
            </div>

            {/* Save Section */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Enter title to save..."
                value={saveTitle}
                onChange={(e) => setSaveTitle(e.target.value)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: `1px solid ${theme.border}`,
                  backgroundColor: isDark ? '#1f2937' : '#fff',
                  color: theme.text,
                  fontSize: '13px',
                  width: '180px',
                }}
              />
              <button
                onClick={saveCode}
                disabled={saving}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontWeight: '500',
                }}
              >
                {saving ? 'Saving...' : '💾 Save'}
              </button>
            </div>
          </div>

          <div style={styles.editorWrapper}>
            <CodeEditor
              language={currentLang?.monaco || 'python'}
              code={code}
              onChange={setCode}
              theme={isDark ? 'vs-dark' : 'light'}
            />
          </div>
        </div>

        {/* Right Side */}
        <div style={{ ...styles.consolePanel, backgroundColor: theme.bg }}>
          {showSaved ? (
            // Saved Codes List
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ ...styles.panelHeader, backgroundColor: theme.panel, borderBottom: `1px solid ${theme.border}` }}>
                <div style={{ ...styles.panelTitle, color: theme.muted }}>Saved Codes ({savedCodes.length})</div>
              </div>

              <div style={{ flex: 1, overflow: 'auto', padding: '12px' }}>
                {savedCodes.length === 0 ? (
                  <p style={{ color: theme.muted, textAlign: 'center', marginTop: '40px' }}>
                    No saved codes yet
                  </p>
                ) : (
                  savedCodes.map((item) => (
                    <div
                      key={item._id}
                      style={{
                        backgroundColor: theme.panel,
                        border: `1px solid ${theme.border}`,
                        borderRadius: '8px',
                        padding: '12px',
                        marginBottom: '10px',
                      }}
                    >
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>{item.title}</div>
                      <div style={{ fontSize: '12px', color: theme.muted, marginBottom: '8px' }}>
                        {item.language} • {new Date(item.createdAt).toLocaleString()}
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => loadCode(item)}
                          style={{
                            padding: '4px 10px',
                            fontSize: '12px',
                            borderRadius: '4px',
                            border: 'none',
                            background: '#3b82f6',
                            color: 'white',
                            cursor: 'pointer',
                          }}
                        >
                          Load
                        </button>
                        <button
                          onClick={() => deleteCode(item._id)}
                          style={{
                            padding: '4px 10px',
                            fontSize: '12px',
                            borderRadius: '4px',
                            border: 'none',
                            background: '#ef4444',
                            color: 'white',
                            cursor: 'pointer',
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            // Console
            <>
              <div style={{ ...styles.panelHeader, backgroundColor: theme.panel, borderBottom: `1px solid ${theme.border}` }}>
                <div style={{ ...styles.panelTitle, color: theme.muted }}>Console</div>
                <button
                  onClick={() => {
                    setStdin('');
                    setOutput('');
                  }}
                  style={{
                    ...styles.clearBtn,
                    border: `1px solid ${theme.border}`,
                    color: theme.muted,
                  }}
                >
                  Clear
                </button>
              </div>

              <div style={{
                padding: '8px 16px',
                backgroundColor: theme.instructionBg,
                color: theme.instructionText,
                fontSize: '12px',
                borderBottom: `1px solid ${theme.border}`,
              }}>
                Type input below first → then click <strong>Run Code</strong>
              </div>

              <textarea
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                placeholder="Enter program input here (example: 100)"
                style={{
                  ...styles.inputBox,
                  backgroundColor: theme.inputBg,
                  color: theme.inputText,
                  borderBottom: `1px solid ${theme.border}`,
                }}
              />

              <div style={{ ...styles.outputWrapper, backgroundColor: theme.inputBg }}>
                <pre style={{ ...styles.output, color: theme.text }}>
                  {output || 'Output will appear here...'}
                </pre>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  navbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoIcon: {
    fontSize: '22px',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 'bold',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: '700',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  select: {
    appearance: 'none',
    padding: '9px 32px 9px 14px',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    outline: 'none',
  },
  themeBtn: {
    padding: '9px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  runButton: {
    padding: '9px 20px',
    borderRadius: '8px',
    border: 'none',
    color: 'white',
    fontWeight: '600',
    fontSize: '14px',
  },
  main: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
  },
  editorPanel: {
    width: '62%',
    display: 'flex',
    flexDirection: 'column',
  },
  consolePanel: {
    width: '38%',
    display: 'flex',
    flexDirection: 'column',
  },
  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 16px',
  },
  panelTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    fontWeight: '600',
  },
  langBadge: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  },
  editorWrapper: {
    flex: 1,
    overflow: 'hidden',
  },
  clearBtn: {
    background: 'transparent',
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer',
  },
  inputBox: {
    width: '100%',
    height: '90px',
    border: 'none',
    padding: '12px 16px',
    resize: 'none',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '13px',
    outline: 'none',
  },
  outputWrapper: {
    flex: 1,
    overflow: 'auto',
  },
  output: {
    margin: 0,
    padding: '16px',
    fontSize: '13px',
    fontFamily: "'JetBrains Mono', monospace",
    whiteSpace: 'pre-wrap',
    lineHeight: '1.6',
  },
};