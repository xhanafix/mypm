// Initialize core modules
const constructionChatbot = {
    // Core state management
    state: {
        currentProject: null,
        darkMode: localStorage.getItem('darkMode') === 'true',
        chatHistory: [],
        activeModules: new Set(),
        apiKey: localStorage.getItem('openRouterApiKey'),
        siteUrl: window.location.origin,
        siteName: 'AI Construction PM',
        isLoading: false,
        conversationHistory: []
    },

    // Initialize the chatbot
    init() {
        this.setupEventListeners();
        this.loadTheme();
        this.loadConversationHistory();
        this.initializeUI();
        this.loadModules();
        
        // Check for API key
        if (!this.getApiKey()) {
            this.promptForApiKey();
        }
    },

    // Set up event listeners for user interactions
    setupEventListeners() {
        document.getElementById('chatInput').addEventListener('submit', this.handleUserInput.bind(this));
        document.getElementById('themeToggle').addEventListener('click', this.toggleTheme.bind(this));
        document.getElementById('clearChat').addEventListener('click', this.clearChat.bind(this));
        document.getElementById('resetApiKey').addEventListener('click', this.resetApiKey.bind(this));
        
        // Add file input listener
        const fileInput = document.getElementById('imageInput');
        if (fileInput) {
            fileInput.addEventListener('change', this.handleImageUpload.bind(this));
        }

        // Add keyboard shortcut (Ctrl/Cmd + K) to clear chat
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.clearChat();
            }
        });
    },

    // Handle user input and generate responses
    async handleUserInput(event) {
        event.preventDefault();
        const input = document.getElementById('userInput').value.trim();
        if (!input) return;

        // Add user message to chat
        this.addMessageToChat('user', input);
        document.getElementById('userInput').value = '';

        // Show loading message
        this.showLoadingMessage();

        // Process the input and generate response
        const response = await this.processUserInput(input);
        
        // Remove loading message and show response
        this.removeLoadingMessage();
        this.addMessageToChat('bot', response);
    },

    // Process user input and determine appropriate response
    async processUserInput(input) {
        const form = document.getElementById('chatInput');
        form.classList.add('loading');
        
        if (!this.getApiKey()) {
            this.promptForApiKey();
            form.classList.remove('loading');
            return {
                type: 'error',
                content: 'Please set your API key to continue.'
            };
        }

        try {
            const response = await this.callOpenRouterApi(input);
            form.classList.remove('loading');
            return response;
        } catch (error) {
            console.error('API Error:', error);
            form.classList.remove('loading');
            return {
                type: 'error',
                content: `Error: ${error.message || 'An unexpected error occurred'}`
            };
        }
    },

    // Add message to chat interface
    addMessageToChat(sender, message) {
        const chatContainer = document.getElementById('chatContainer');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        try {
            if (typeof message === 'object') {
                if (message.type === 'error') {
                    messageDiv.className += ' error-message';
                }
                messageDiv.innerHTML = this.formatStructuredMessage(message);
            } else {
                messageDiv.textContent = message;
            }

            chatContainer.appendChild(messageDiv);
            chatContainer.scrollTop = chatContainer.scrollHeight;
            
            this.state.chatHistory.push({ sender, message, timestamp: new Date() });
        } catch (error) {
            console.error('Error adding message to chat:', error);
            const errorDiv = document.createElement('div');
            errorDiv.className = 'message error-message';
            errorDiv.textContent = 'Error displaying message';
            chatContainer.appendChild(errorDiv);
        }
    },

    // Toggle dark/light theme
    toggleTheme() {
        this.state.darkMode = !this.state.darkMode;
        localStorage.setItem('darkMode', this.state.darkMode);
        document.body.classList.toggle('dark-theme', this.state.darkMode);
    },

    // Load saved theme preference
    loadTheme() {
        document.body.classList.toggle('dark-theme', this.state.darkMode);
    },

    // Initialize UI components
    initializeUI() {
        // Set up initial UI state
        document.body.classList.toggle('dark-theme', this.state.darkMode);
        this.addMessageToChat('bot', 'Hello! I\'m your AI Construction Project Manager. How can I assist you today?');
    },

    // Module specific handlers
    async handleRiskManagement(input) {
        // Implement risk management logic
        return {
            type: 'risk-assessment',
            content: 'Risk assessment in progress...',
            risks: [] // Populate with identified risks
        };
    },

    async handleBudgetManagement(input) {
        // Implement budget management logic
        return {
            type: 'budget-report',
            content: 'Budget analysis in progress...',
            data: {} // Populate with budget data
        };
    },

    // Format structured messages for display
    formatStructuredMessage(message) {
        switch (message.type) {
            case 'formatted':
                return `
                    <div class="formatted-response">
                        <div class="response-header">
                            <button class="copy-button" onclick="constructionChatbot.copyResponse(this)">
                                <span class="copy-icon">📋</span>
                                <span class="copy-text">Copy</span>
                            </button>
                        </div>
                        <div class="response-content">
                            <p>${message.content}</p>
                        </div>
                    </div>`;
            case 'error':
                return `<div class="structured-message error">
                    <div class="error-content">
                        <h3>Error</h3>
                        <p>${message.content}</p>
                    </div>
                    <button class="retry-button" onclick="constructionChatbot.retryLastMessage(this)">
                        <span class="retry-icon">🔄</span>
                        Retry
                    </button>
                </div>`;
            case 'risk-assessment':
                return `<div class="structured-message risk-assessment">
                    <h3>Risk Assessment</h3>
                    <p>${message.content}</p>
                    ${this.formatRiskList(message.risks)}
                </div>`;
            case 'budget-report':
                return `<div class="structured-message budget-report">
                    <h3>Budget Report</h3>
                    <p>${message.content}</p>
                    ${this.formatBudgetData(message.data)}
                </div>`;
            default:
                return message.content;
        }
    },

    // Helper functions for formatting specific message types
    formatRiskList(risks) {
        return risks.length ? 
            `<ul>${risks.map(risk => `<li>${risk}</li>`).join('')}</ul>` : 
            '<p>No risks identified.</p>';
    },

    formatBudgetData(data) {
        return Object.keys(data).length ?
            `<table>${Object.entries(data).map(([key, value]) => 
                `<tr><td>${key}</td><td>${value}</td></tr>`).join('')}</table>` :
            '<p>No budget data available.</p>';
    },

    // Clear chat history
    clearChat() {
        if (confirm('Are you sure you want to clear the entire chat history? This cannot be undone.')) {
            // Clear DOM elements
            document.getElementById('chatContainer').innerHTML = '';
            
            // Clear both chat histories
            this.state.chatHistory = [];
            this.state.conversationHistory = [];
            
            // Clear from localStorage
            localStorage.removeItem('conversationHistory');
            
            // Add confirmation message
            this.addMessageToChat('bot', {
                type: 'formatted',
                content: `
                    # Chat History Cleared
                    - All previous messages have been removed
                    - Conversation context has been reset
                    - Starting fresh conversation
                    
                    How can I assist you today?
                `
            });
        }
    },

    // Intent analysis
    async analyzeIntent(input) {
        // Implement intent analysis logic
        const keywords = {
            riskManagement: ['risk', 'hazard', 'safety', 'danger'],
            budgetManagement: ['budget', 'cost', 'expense', 'financial'],
            planning: ['schedule', 'timeline', 'deadline', 'plan'],
            stakeholderEngagement: ['stakeholder', 'client', 'investor'],
            permits: ['permit', 'compliance', 'regulation', 'legal'],
            costEstimation: ['estimate', 'quote', 'pricing'],
            supervision: ['supervise', 'monitor', 'inspect'],
            contracts: ['contract', 'agreement', 'document'],
            teamManagement: ['team', 'staff', 'worker', 'employee']
        };

        const inputLower = input.toLowerCase();
        for (const [intent, keywordList] of Object.entries(keywords)) {
            if (keywordList.some(keyword => inputLower.includes(keyword))) {
                return intent;
            }
        }

        return 'general';
    },

    // Add API key management methods
    async setApiKey(key) {
        this.state.apiKey = key;
        localStorage.setItem('openRouterApiKey', key);
    },

    getApiKey() {
        return this.state.apiKey;
    },

    // Add API key prompt
    promptForApiKey() {
        const apiKey = prompt('Please enter your OpenRouter API key:');
        if (apiKey) {
            this.setApiKey(apiKey);
            this.addMessageToChat('bot', 'API key has been set successfully.');
        } else {
            this.addMessageToChat('bot', 'Warning: API key is required for functionality. Click the "Reset API Key" button to try again.');
        }
    },

    // Add OpenRouter API integration
    async callOpenRouterApi(input) {
        try {
            // Get last few messages for context (limit to last 10 messages)
            const conversationContext = this.state.conversationHistory
                .slice(-10)
                .map(msg => ({
                    role: msg.role,
                    content: msg.content
                }));

            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${this.getApiKey()}`,
                    "HTTP-Referer": this.state.siteUrl,
                    "X-Title": this.state.siteName,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "model": "meta-llama/llama-3.1-70b-instruct:free",
                    "messages": [
                        {
                            "role": "system",
                            "content": `You are an AI Construction Project Manager assistant. Format your responses for easy scanning:
                                - Use bullet points for lists
                                - Break information into clear sections with headers
                                - Keep paragraphs short (2-3 sentences max)
                                - Use bold for important terms
                                - Include line breaks between sections
                                - If providing steps, number them
                                - If mentioning costs or metrics, display them clearly
                                - Use tables for structured data (format: |header1|header2|\n|data1|data2|)
                                - Use checklists for tasks (format: [ ] Task or [x] Completed task)
                                - Present numerical data in clear, tabular format
                                - Reference previous conversations when relevant`
                        },
                        ...conversationContext,
                        {
                            "role": "user",
                            "content": input
                        }
                    ]
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                throw new Error('Invalid response format from API');
            }

            // Store the new message in conversation history
            this.state.conversationHistory.push(
                { role: "user", content: input },
                { role: "assistant", content: data.choices[0].message.content }
            );

            const content = data.choices[0].message.content;
            return this.formatAIResponse(content);
        } catch (error) {
            if (error.message.includes('API request failed: 401')) {
                this.state.apiKey = null;
                localStorage.removeItem('openRouterApiKey');
                throw new Error('Invalid API key. Please reset your API key and try again.');
            }
            throw error;
        }
    },

    // Add method to format input content
    formatInputContent(input) {
        // Check if input contains an image URL
        const imageUrlMatch = input.match(/https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp)/i);
        
        if (imageUrlMatch) {
            // If image URL is found, return array with text and image
            return [
                {
                    "type": "text",
                    "text": input.replace(imageUrlMatch[0], '').trim()
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": imageUrlMatch[0]
                    }
                }
            ];
        } else {
            // If no image URL, return simple text content
            return [
                {
                    "type": "text",
                    "text": input
                }
            ];
        }
    },

    // Add new method to format AI responses
    formatAIResponse(content) {
        const formatted = content
            // Convert tables
            .replace(/\|(.+)\|/g, (match, content) => {
                const cells = content.split('|').map(cell => cell.trim());
                return `<td>${cells.join('</td><td>')}</td>`;
            })
            .replace(/^((?:\|.+\|\n?)+)$/gm, (match) => {
                const rows = match.split('\n').filter(row => row.trim());
                return `<table class="ai-table">${rows.map(row => `<tr>${row}</tr>`).join('')}</table>`;
            })
            
            // Convert checklists
            .replace(/^\[[\sx]\]\s(.+)$/gm, (match, text) => {
                const checked = match.includes('[x]');
                return `<div class="checklist-item">
                    <input type="checkbox" ${checked ? 'checked' : ''} disabled>
                    <span>${text}</span>
                </div>`;
            })
            
            // Convert existing markdown
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/^- (.+)$/gm, '<li>$1</li>')
            .replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>')
            .replace(/^###\s+(.+)$/gm, '<h4>$1</h4>')
            .replace(/^##\s+(.+)$/gm, '<h3>$1</h3>')
            .replace(/^#\s+(.+)$/gm, '<h2>$1</h2>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');

        return {
            type: 'formatted',
            content: formatted
        };
    },

    // Add new method for resetting API key
    resetApiKey() {
        if (confirm('Are you sure you want to reset your API key?')) {
            this.state.apiKey = null;
            localStorage.removeItem('openRouterApiKey');
            this.addMessageToChat('bot', 'API key has been reset. Please provide a new API key.');
            this.promptForApiKey();
        }
    },

    // Add methods to handle loading state
    showLoadingMessage() {
        const chatContainer = document.getElementById('chatContainer');
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message bot-message loading-message';
        loadingDiv.id = 'loadingMessage';
        loadingDiv.innerHTML = `
            <div class="loading-content">
                <div class="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <p>AI is thinking...</p>
            </div>
        `;
        chatContainer.appendChild(loadingDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        this.state.isLoading = true;
    },

    removeLoadingMessage() {
        const loadingMessage = document.getElementById('loadingMessage');
        if (loadingMessage) {
            loadingMessage.remove();
        }
        this.state.isLoading = false;
    },

    // Add method to handle image uploads
    async handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            // Convert image to base64 or upload to temporary storage
            const imageUrl = await this.uploadImage(file);
            
            // Add image URL to input field
            const userInput = document.getElementById('userInput');
            userInput.value += ` ${imageUrl}`;
            
            // Clear file input
            event.target.value = '';
        } catch (error) {
            console.error('Error uploading image:', error);
            this.addMessageToChat('bot', {
                type: 'error',
                content: 'Error uploading image. Please try again.'
            });
        }
    },

    // Add method to handle image upload (implement as needed)
    async uploadImage(file) {
        // Implement image upload to your preferred storage service
        // Return the URL of the uploaded image
        // This is a placeholder - implement actual upload logic
        throw new Error('Image upload not implemented');
    },

    // Add new method to handle copying
    copyResponse(button) {
        const responseDiv = button.closest('.formatted-response').querySelector('.response-content');
        const textToCopy = responseDiv.innerText;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            const copyText = button.querySelector('.copy-text');
            const originalText = copyText.textContent;
            
            copyText.textContent = 'Copied!';
            button.classList.add('copied');
            
            setTimeout(() => {
                copyText.textContent = originalText;
                button.classList.remove('copied');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text:', err);
        });
    },

    // Add method to persist conversation history
    saveConversationHistory() {
        try {
            localStorage.setItem('conversationHistory', JSON.stringify(this.state.conversationHistory));
        } catch (error) {
            console.error('Error saving conversation history:', error);
        }
    },

    // Add method to load conversation history
    loadConversationHistory() {
        try {
            const savedHistory = localStorage.getItem('conversationHistory');
            if (savedHistory) {
                this.state.conversationHistory = JSON.parse(savedHistory);
            }
        } catch (error) {
            console.error('Error loading conversation history:', error);
            this.state.conversationHistory = [];
        }
    },

    // Add method to retry last message
    async retryLastMessage(button) {
        // Get the last user message from conversation history
        const lastUserMessage = this.state.conversationHistory
            .filter(msg => msg.role === 'user')
            .pop();

        if (!lastUserMessage) return;

        // Remove the error message
        const errorDiv = button.closest('.message');
        errorDiv.remove();

        // Show loading state
        this.showLoadingMessage();

        // Retry the request
        try {
            const response = await this.processUserInput(lastUserMessage.content);
            this.removeLoadingMessage();
            this.addMessageToChat('bot', response);
        } catch (error) {
            this.removeLoadingMessage();
            this.addMessageToChat('bot', {
                type: 'error',
                content: `Retry failed: ${error.message || 'An unexpected error occurred'}`
            });
        }
    }
};

// Initialize the chatbot when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    constructionChatbot.init();
}); 