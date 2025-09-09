// MH Construction - AI Chatbot Implementation

class MHConstructionChatbot {
    constructor() {
        this.isOpen = false;
        this.conversationHistory = [];
        this.currentContext = null;
        this.responses = this.initializeResponses();
        this.init();
    }
    
    init() {
        this.createChatbotElements();
        this.bindEvents();
        this.loadConversationHistory();
    }
    
    createChatbotElements() {
        // Chatbot is already in HTML, just need to initialize
        this.chatbotContainer = document.getElementById('chatbot');
        this.chatbotToggle = document.getElementById('chatbot-toggle');
        this.chatbotWindow = document.getElementById('chatbot-window');
        this.chatbotClose = document.getElementById('chatbot-close');
        this.chatbotMessages = document.getElementById('chatbot-messages');
        this.chatbotInput = document.getElementById('chatbot-input');
        this.chatbotSend = document.getElementById('chatbot-send');
        
        // Initialize with welcome message
        this.addMessage('bot', 'Hello! I\'m the MH Construction assistant. I can help you with:');
        this.addMessage('bot', '• Project estimates and timelines\n• Service information\n• Scheduling consultations\n• Our construction process\n• Technology tools\n\nWhat would you like to know?');
    }
    
    bindEvents() {
        // Toggle chatbot
        this.chatbotToggle.addEventListener('click', () => {
            this.toggleChatbot();
        });
        
        // Close chatbot
        this.chatbotClose.addEventListener('click', () => {
            this.closeChatbot();
        });
        
        // Send message on button click
        this.chatbotSend.addEventListener('click', () => {
            this.sendMessage();
        });
        
        // Send message on Enter key
        this.chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!this.chatbotContainer.contains(e.target) && this.isOpen) {
                // Don't close immediately, give user time to interact
                setTimeout(() => {
                    if (!this.chatbotContainer.matches(':hover')) {
                        this.closeChatbot();
                    }
                }, 100);
            }
        });
    }
    
    toggleChatbot() {
        if (this.isOpen) {
            this.closeChatbot();
        } else {
            this.openChatbot();
        }
    }
    
    openChatbot() {
        this.isOpen = true;
        this.chatbotWindow.style.display = 'flex';
        this.chatbotInput.focus();
        
        // Track analytics
        if (window.analyticsHelper) {
            window.analyticsHelper.trackEvent('chatbot_opened', {
                page: window.location.pathname,
                timestamp: new Date().toISOString()
            });
        }
    }
    
    closeChatbot() {
        this.isOpen = false;
        this.chatbotWindow.style.display = 'none';
    }
    
    sendMessage() {
        const message = this.chatbotInput.value.trim();
        if (!message) return;
        
        // Add user message
        this.addMessage('user', message);
        this.chatbotInput.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Process message and generate response
        setTimeout(() => {
            this.hideTypingIndicator();
            this.processMessage(message);
        }, 1000 + Math.random() * 1000); // Realistic delay
    }
    
    addMessage(sender, message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        if (sender === 'bot') {
            messageDiv.innerHTML = `
                <div class="message-avatar">🤖</div>
                <div class="message-content">${this.formatMessage(message)}</div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-content">${this.formatMessage(message)}</div>
                <div class="message-avatar">👤</div>
            `;
        }
        
        this.chatbotMessages.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Save to conversation history
        this.conversationHistory.push({
            sender,
            message,
            timestamp: new Date().toISOString()
        });
        
        this.saveConversationHistory();
    }
    
    formatMessage(message) {
        // Convert newlines to <br> tags
        return message.replace(/\n/g, '<br>');
    }
    
    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        this.chatbotMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        const typingIndicator = this.chatbotMessages.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    scrollToBottom() {
        this.chatbotMessages.scrollTop = this.chatbotMessages.scrollHeight;
    }
    
    processMessage(message) {
        const lowerMessage = message.toLowerCase();
        let response = '';
        let followUpActions = [];
        
        // Determine intent and context
        const intent = this.determineIntent(lowerMessage);
        
        switch (intent) {
            case 'greeting':
                response = this.responses.greetings[Math.floor(Math.random() * this.responses.greetings.length)];
                break;
                
            case 'services':
                response = this.responses.services;
                followUpActions = [
                    { text: 'Get AI Estimate', action: 'estimate' },
                    { text: 'View Services', action: 'services' }
                ];
                break;
                
            case 'estimate':
                response = this.responses.estimate;
                followUpActions = [
                    { text: 'Start AI Estimator', action: 'start_estimator' },
                    { text: 'Schedule Consultation', action: 'contact' }
                ];
                break;
                
            case 'timeline':
                response = this.responses.timeline;
                break;
                
            case 'technology':
                response = this.responses.technology;
                followUpActions = [
                    { text: 'Try Project Sandbox', action: 'sandbox' },
                    { text: 'View 3D Tours', action: 'viewer' }
                ];
                break;
                
            case 'contact':
                response = this.responses.contact;
                followUpActions = [
                    { text: 'Call Now', action: 'call' },
                    { text: 'Schedule Consultation', action: 'contact_form' }
                ];
                break;
                
            case 'pricing':
                response = this.responses.pricing;
                followUpActions = [
                    { text: 'Get AI Estimate', action: 'start_estimator' }
                ];
                break;
                
            case 'projects':
                response = this.responses.projects;
                followUpActions = [
                    { text: 'View Portfolio', action: 'projects' },
                    { text: 'Take 3D Tours', action: 'viewer' }
                ];
                break;
                
            case 'veteran':
                response = this.responses.veteran;
                break;
                
            default:
                response = this.responses.fallback[Math.floor(Math.random() * this.responses.fallback.length)];
                followUpActions = [
                    { text: 'Contact Human Expert', action: 'contact' },
                    { text: 'View Services', action: 'services' }
                ];
        }
        
        // Add main response
        this.addMessage('bot', response);
        
        // Add follow-up actions if any
        if (followUpActions.length > 0) {
            setTimeout(() => {
                this.addActionButtons(followUpActions);
            }, 500);
        }
        
        // Track analytics
        if (window.analyticsHelper) {
            window.analyticsHelper.trackEvent('chatbot_interaction', {
                user_message: message,
                intent: intent,
                response_type: 'automated'
            });
        }
    }
    
    determineIntent(message) {
        const intents = {
            greeting: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'greetings'],
            services: ['services', 'what do you do', 'construction', 'build', 'residential', 'commercial'],
            estimate: ['estimate', 'cost', 'price', 'quote', 'how much', 'budget'],
            timeline: ['timeline', 'how long', 'duration', 'schedule', 'when'],
            technology: ['technology', 'ai', 'sandbox', '3d', 'virtual', 'innovation'],
            contact: ['contact', 'phone', 'call', 'speak', 'consultation', 'meeting'],
            pricing: ['pricing', 'rates', 'fees', 'expensive', 'affordable'],
            projects: ['projects', 'portfolio', 'examples', 'work', 'completed'],
            veteran: ['veteran', 'military', 'army', 'service']
        };
        
        for (const [intent, keywords] of Object.entries(intents)) {
            if (keywords.some(keyword => message.includes(keyword))) {
                return intent;
            }
        }
        
        return 'general';
    }
    
    addActionButtons(actions) {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'message bot-message action-buttons';
        
        const buttonsHtml = actions.map(action => 
            `<button class="action-btn" data-action="${action.action}">${action.text}</button>`
        ).join('');
        
        actionsDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <div class="actions-container">
                    ${buttonsHtml}
                </div>
            </div>
        `;
        
        this.chatbotMessages.appendChild(actionsDiv);
        this.scrollToBottom();
        
        // Bind action button events
        actionsDiv.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleActionClick(btn.dataset.action);
            });
        });
    }
    
    handleActionClick(action) {
        switch (action) {
            case 'start_estimator':
                window.open('estimator.html', '_blank');
                this.addMessage('bot', 'Opening our AI-powered estimator for you! 🤖');
                break;
                
            case 'sandbox':
                window.open('sandbox.html', '_blank');
                this.addMessage('bot', 'Opening our interactive project sandbox! 🏗️');
                break;
                
            case 'viewer':
                window.open('project-viewer.html', '_blank');
                this.addMessage('bot', 'Opening our 3D project tours! 🥽');
                break;
                
            case 'services':
                window.open('services.html', '_blank');
                this.addMessage('bot', 'Here are all our construction services! 🏠');
                break;
                
            case 'projects':
                window.open('projects.html', '_blank');
                this.addMessage('bot', 'Check out our amazing project portfolio! 📸');
                break;
                
            case 'contact':
            case 'contact_form':
                window.open('contact.html', '_blank');
                this.addMessage('bot', 'Opening our contact form. We guarantee a 24-hour response! 📞');
                break;
                
            case 'call':
                window.open('tel:5093086489');
                this.addMessage('bot', 'Calling MH Construction at (509) 308-6489! 📞');
                break;
                
            default:
                this.addMessage('bot', 'I\'m not sure how to help with that. Let me connect you with a human expert.');
        }
        
        // Track action
        if (window.analyticsHelper) {
            window.analyticsHelper.trackEvent('chatbot_action_clicked', {
                action: action,
                page: window.location.pathname
            });
        }
    }
    
    initializeResponses() {
        return {
            greetings: [
                'Hello! Welcome to MH Construction. How can I help you today?',
                'Hi there! I\'m here to assist you with your construction needs.',
                'Greetings! Ready to discuss your next construction project?'
            ],
            
            services: `We offer comprehensive construction services including:

🏠 **Residential Construction**
• New homes, additions, remodels
• Smart home integration

🏢 **Commercial Construction** 
• Office buildings, retail spaces
• Warehouses and distribution centers

🏛️ **Institutional & Government**
• Fire stations, community centers
• Educational and healthcare facilities

🏭 **Industrial & Manufacturing**
• Food processing, manufacturing
• Specialized equipment integration

What type of project are you planning?`,

            estimate: `Our revolutionary AI-powered estimator provides:

✅ Accurate cost estimates
✅ Interactive timeline visualization  
✅ Real-time material pricing
✅ Transparent breakdown of all costs

The process takes just 5-10 minutes and you'll get results instantly! We also offer free consultations for more detailed estimates.`,

            timeline: `Project timelines vary by type and complexity:

🏠 **Residential**: 6-18 months
🏢 **Commercial**: 8-24 months  
🏛️ **Institutional**: 12-30 months
🏭 **Industrial**: 15-36 months

Our AI estimator provides specific timelines for your exact project. We're known for our 98% on-time completion rate!`,

            technology: `We're revolutionizing construction with cutting-edge technology:

🤖 **AI-Powered Estimation** - Revolutionary cost and timeline predictions
🏗️ **Interactive Project Sandbox** - Design your project with real-time costs
🥽 **VR Project Tours** - Explore completed projects in 3D
📱 **Smart Building Integration** - IoT and automation systems

Experience the future of construction with MH Construction!`,

            contact: `Ready to get started? Here are your options:

📞 **Call**: (509) 308-6489
⏰ **Hours**: Mon-Fri 7AM-6PM PST
🚨 **Emergency**: 24/7 availability

📧 **Email**: info@mhc-gc.com
💬 **Response**: Guaranteed within 24 hours

📍 **Service Area**: Washington, Oregon & Idaho
🏢 **Headquarters**: Pasco, Washington

We offer free consultations and site visits!`,

            pricing: `Our pricing is transparent and competitive:

💡 **Free Services**:
• Initial consultation
• AI-powered estimates  
• Project design consultation

💰 **Transparent Pricing**:
• No hidden fees
• Detailed cost breakdowns
• Real-time material pricing
• Value engineering options

🎯 **Competitive Advantage**:
• 96% of projects completed within budget
• Military-inspired efficiency
• Technology-driven cost savings`,

            projects: `Explore our award-winning portfolio:

🏆 **Featured Project**: Summer's Hub Community Center
• LEED Gold certified
• 2024 Excellence Award winner
• 3D virtual tour available

📊 **Portfolio Stats**:
• 150+ completed projects
• 100% client satisfaction
• 98% on-time completion
• 0 safety incidents

🎯 **Project Types**: Residential, Commercial, Institutional, Industrial

Take our 3D virtual tours to see our craftsmanship!`,

            veteran: `MH Construction is 100% veteran-owned and operated:

🇺🇸 **Veteran Leadership**: Founded by military veterans
⭐ **Military Values**: Discipline, integrity, excellence
🎖️ **Certified**: Department of Veterans Affairs certified
🤝 **Community**: Supporting local veteran businesses

Our military background ensures:
• Attention to detail
• Mission-focused execution  
• Safety-first culture
• Reliable project delivery

Thank you for supporting veteran-owned business!`,

            fallback: [
                'I want to make sure I give you the most accurate information. Could you rephrase your question?',
                'That\'s a great question! Let me connect you with one of our construction experts who can provide detailed answers.',
                'I\'m still learning about all aspects of construction. Would you like to speak with a human expert?'
            ]
        };
    }
    
    saveConversationHistory() {
        try {
            localStorage.setItem('mh_chatbot_history', JSON.stringify(this.conversationHistory));
        } catch (error) {
            console.error('Error saving conversation:', error);
        }
    }
    
    loadConversationHistory() {
        try {
            const saved = localStorage.getItem('mh_chatbot_history');
            if (saved) {
                this.conversationHistory = JSON.parse(saved);
                
                // Only restore recent conversations (last 24 hours)
                const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                this.conversationHistory = this.conversationHistory.filter(msg => 
                    new Date(msg.timestamp) > oneDayAgo
                );
            }
        } catch (error) {
            console.error('Error loading conversation:', error);
            this.conversationHistory = [];
        }
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mhChatbot = new MHConstructionChatbot();
});

// Add CSS for chatbot (will be included in components.css)
const chatbotStyles = `
.chatbot-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
    font-family: var(--font-family);
}

.chatbot-toggle {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--mh-primary-green), var(--army-green));
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    box-shadow: var(--shadow-xl);
    transition: all var(--transition-fast);
}

.chatbot-toggle:hover {
    transform: scale(1.1);
    box-shadow: var(--shadow-2xl);
}

.chatbot-window {
    position: absolute;
    bottom: 80px;
    right: 0;
    width: 350px;
    height: 500px;
    background: white;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-2xl);
    display: none;
    flex-direction: column;
    overflow: hidden;
}

.chatbot-header {
    background: linear-gradient(135deg, var(--mh-primary-green), var(--army-green));
    color: white;
    padding: var(--spacing-md);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.chatbot-header h4 {
    margin: 0;
    font-size: var(--font-size-base);
}

.chatbot-close {
    background: none;
    border: none;
    color: white;
    font-size: var(--font-size-xl);
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
    transition: background-color var(--transition-fast);
}

.chatbot-close:hover {
    background-color: rgba(255, 255, 255, 0.2);
}

.chatbot-messages {
    flex: 1;
    padding: var(--spacing-md);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
}

.message {
    display: flex;
    gap: var(--spacing-sm);
    align-items: flex-start;
}

.bot-message {
    align-self: flex-start;
}

.user-message {
    align-self: flex-end;
    flex-direction: row-reverse;
}

.message-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-sm);
    flex-shrink: 0;
}

.bot-message .message-avatar {
    background-color: var(--mh-primary-green);
}

.user-message .message-avatar {
    background-color: var(--mh-secondary-tan);
}

.message-content {
    max-width: 80%;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    line-height: 1.4;
}

.bot-message .message-content {
    background-color: var(--bg-secondary);
    color: var(--text-primary);
}

.user-message .message-content {
    background-color: var(--mh-primary-green);
    color: white;
}

.typing-dots {
    display: flex;
    gap: 4px;
    align-items: center;
}

.typing-dots span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--text-muted);
    animation: typing 1.4s ease-in-out infinite;
}

.typing-dots span:nth-child(2) {
    animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes typing {
    0%, 60%, 100% {
        transform: translateY(0);
        opacity: 0.4;
    }
    30% {
        transform: translateY(-10px);
        opacity: 1;
    }
}

.actions-container {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    margin-top: var(--spacing-sm);
}

.action-btn {
    background: var(--mh-primary-green);
    color: white;
    border: none;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-md);
    cursor: pointer;
    font-size: var(--font-size-xs);
    transition: background-color var(--transition-fast);
}

.action-btn:hover {
    background: var(--army-green);
}

.chatbot-input {
    display: flex;
    padding: var(--spacing-md);
    border-top: 1px solid var(--bg-tertiary);
    gap: var(--spacing-sm);
}

.chatbot-input input {
    flex: 1;
    padding: var(--spacing-sm);
    border: 1px solid var(--bg-tertiary);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
}

.chatbot-input input:focus {
    outline: none;
    border-color: var(--mh-primary-green);
}

.chatbot-input button {
    background: var(--mh-primary-green);
    color: white;
    border: none;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-md);
    cursor: pointer;
    font-size: var(--font-size-sm);
    transition: background-color var(--transition-fast);
}

.chatbot-input button:hover {
    background: var(--army-green);
}

@media (max-width: 768px) {
    .chatbot-window {
        width: 300px;
        height: 400px;
        bottom: 70px;
    }
    
    .chatbot-toggle {
        width: 50px;
        height: 50px;
        font-size: 20px;
    }
}
`;

// Inject chatbot styles
if (!document.getElementById('chatbot-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'chatbot-styles';
    styleSheet.textContent = chatbotStyles;
    document.head.appendChild(styleSheet);
}