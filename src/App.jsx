import { useMemo, useState } from 'react';
import * as d3 from 'd3';
import { demoConversation } from './demoData';
import BarChart from './components/BarChart';

export default function App() {
  const [prompt, setPrompt] = useState(demoConversation.prompt);
  const [conversation, setConversation] = useState(demoConversation);
  const [selectedTokenId, setSelectedTokenId] = useState(17);
  const [topK, setTopK] = useState(3);

  const selectedToken = useMemo(
    () => conversation.tokens.find((token) => token.id === selectedTokenId) || conversation.tokens[0],
    [conversation.tokens, selectedTokenId]
  );

  const averageConfidence = useMemo(() => {
    const mean = d3.mean(conversation.tokens, (token) => token.confidence) || 0;
    return `${Math.round(mean * 100)}%`;
  }, [conversation.tokens]);

  const handleLoadDemo = () => {
    setConversation(demoConversation);
    setSelectedTokenId(17);
  };

  return (
    <div className="app-shell">
      <div className="page-card">
        <header className="page-header">
          <div>
            <h1>LLM Token Alternatives Explorer</h1>
            <p>
              React + D3 demo. Click any token in the response to see the selected word and its top-k alternatives.
            </p>
          </div>
        </header>

        <main className="workspace-grid">
          <section className="chat-panel">
            <div className="prompt-row">
              <div className="prompt-bubble">{conversation.prompt}</div>
            </div>

            <div className="response-area">
              <div className="response-label">{conversation.responseLabel}</div>

              <div className="token-flow">
                {conversation.tokens.map((token) => {
                  const isSelected = token.id === selectedTokenId;
                  return (
                    <button
                      key={token.id}
                      type="button"
                      className={`token-button ${isSelected ? 'token-selected' : ''}`}
                      style={{ color: tokenColor(token.confidence) }}
                      onClick={() => setSelectedTokenId(token.id)}
                      title={`Confidence: ${(token.confidence * 100).toFixed(1)}%`}
                    >
                      {token.text}
                    </button>
                  );
                })}
              </div>

              <div className="response-meta">Average token confidence: {averageConfidence}</div>
            </div>

            <div className="input-row">
              <input
                className="prompt-input"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Ask anything"
              />
              <button className="demo-button" type="button" onClick={handleLoadDemo}>
                Load demo response
              </button>
            </div>
          </section>

          <aside className="analysis-panel">
            <div className="analysis-card">
              <div className="selected-token-column">
                <h2>
                  Selected Token: <span className="token-name">‘{cleanToken(selectedToken.text)}’</span>
                </h2>
                <div className="confidence-label">Confidence Score</div>
                <div className="confidence-value">{Math.round(selectedToken.confidence * 100)}%</div>
                
                <div className="k-control">
                  <label htmlFor="topk-select">Show top-k alternatives</label>
                  <select
                    id="topk-select"
                    value={topK}
                    onChange={(e) => setTopK(Number(e.target.value))}
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                    <option value={6}>6</option>
                    <option value={7}>7</option>
                    <option value={8}>8</option>
                    <option value={9}>9</option>
                    <option value={10}>10</option>
                  </select>
                </div>


              </div>

              <div className="chart-column">
                <h2>Tokens Considered</h2>
                <BarChart selectedToken={selectedToken} topK={topK} />
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}

function tokenColor(confidence) {
  return d3.interpolateRgb('#ff3b30', '#46b86b')(confidence);
}

function cleanToken(text) {
  return text.replace(/^"|"$/g, '');
}
