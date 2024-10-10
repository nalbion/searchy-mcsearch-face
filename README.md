# Chrome Built-in AI

- [Prompt API Playground](https://chrome.dev/web-ai-demos/prompt-api-playground/)
- [Early Preview Program doc](https://docs.google.com/document/d/1VG8HIyz361zGduWgNG7R_R8Xkv0OOJ8b5C9QKeCjU0c/edit?pli=1)

- chrome://flags/#optimization-guide-on-device-model
  - Enabled BypassPerfRequirement
- chrome://flags/#prompt-api-for-gemini-nano
  - Enabled
- relaunch
- (await ai.assistant.capabilities()).available;

if that fails:

- chrome://components
  - Optimization Guide On Device Model
  - pressed "Check for update" (10GB download)
- relaunch

Notes:
- 1024 tokens/prompt
- session retains the last 4096 tokens
