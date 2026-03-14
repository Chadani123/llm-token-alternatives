# LLM Token Alternatives Demo

A small React + D3 demo that shows a generated response, lets you click any token, and displays the selected token plus top-k alternative tokens considered by the model.

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL shown in the terminal.

## Build for production

```bash
npm run build
npm run preview
```

## Replace demo data with LLM output later

Right now the app uses `src/demoData.js`.
Later, replace `demoConversation` with data returned by your backend, for example:

```js
{
  prompt: 'Who is the best hockey player?',
  responseLabel: 'Generated Response (Click Token to see other Tokens Considered):',
  tokens: [
    {
      id: 0,
      text: 'Wayne',
      confidence: 0.93,
      alternatives: [
        { token: 'Mario', prob: 0.03 },
        { token: 'Sidney', prob: 0.02 },
        { token: 'Connor', prob: 0.01 }
      ]
    }
  ]
}
```
# llm-token-alternatives
