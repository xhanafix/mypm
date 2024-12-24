# AI Construction Project Manager Chatbot

An intelligent chatbot designed specifically for construction project management. This AI assistant helps manage construction projects by handling risk assessment, budget management, scheduling, stakeholder engagement, and more.

## Features

- 🤖 Powered by Llama 3.1 70B through OpenRouter API
- 🌓 Dark/Light theme support
- 💬 Contextual conversation memory
- 📋 Copy responses with one click
- 📊 Supports tables and structured data
- ✅ Task checklists
- 🔑 Secure API key management
- 📱 Responsive design for mobile and desktop

## Demo

[Add screenshots or GIF demonstrations here]

## Getting Started

### Prerequisites

- A modern web browser
- An OpenRouter API key

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/construction-pm-chatbot.git
```

2. Navigate to the project directory:
```bash
cd construction-pm-chatbot
```

3. Open `index.html` in your web browser or serve it through a local server:
```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000
```

4. Visit `http://localhost:8000` in your browser

### Getting an API Key

1. Visit [OpenRouter](https://openrouter.ai/)
2. Create an account
3. Navigate to the API Keys section
4. Generate a new API key
5. Copy the API key
6. Paste the API key when prompted in the chatbot

## Usage

1. Enter your OpenRouter API key when first launching the app
2. Type your construction management related questions in the chat input
3. The AI will respond with formatted, easy-to-read answers
4. Use the copy button to copy responses
5. Clear chat history using the clear button or Ctrl/Cmd + K
6. Reset API key if needed using the reset button

## Features in Detail

### AI Model
This chatbot uses the `meta-llama/llama-3.1-70b-instruct:free` model through OpenRouter, which provides:
- High-quality responses
- Context awareness
- Construction domain knowledge
- Structured output formatting

### Response Formatting
The AI formats responses with:
- Headers for sections
- Bullet points for lists
- Tables for structured data
- Checklists for tasks
- Bold text for important terms

### Data Persistence
- Chat history is saved locally
- Theme preference is remembered
- API key is securely stored in localStorage

## Keyboard Shortcuts

- `Ctrl/Cmd + K`: Clear chat history
- `Enter`: Send message
- `Esc`: Clear input field

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```MIT License

Copyright (c) [year] [your name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.```

## Security

- API keys are stored locally in the browser
- No data is sent to external servers except OpenRouter
- All communication with OpenRouter API is encrypted

## Known Issues

- Image upload functionality is not yet implemented
- Some markdown formatting may not render correctly in certain browsers

## Acknowledgments

- OpenRouter for providing API access
- Meta for the Llama model
- Contributors and testers

## Support

For support, please open an issue in the GitHub repository.
