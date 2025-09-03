// AI Chatbot for John Rey Q. Clemeña Portfolio
// Professional AI Assistant with portfolio-specific knowledge

class PortfolioChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.isTyping = false;
        this.currentMessageIndex = 0;
        this.init();
    }

    init() {
        this.createChatbotHTML();
        this.bindEvents();
        this.addWelcomeMessage();
    }

    createChatbotHTML() {
        const chatbotHTML = `
            <!-- Chatbot Modal Overlay -->
            <div id="chatbot-modal" class="chatbot-modal" style="display: none;">
                <div class="chatbot-modal-content">
                    <div class="chatbot-header">
                        <div class="chatbot-title">
                            <i class="fas fa-robot"></i>
                            <span>AI Assistant</span>
                        </div>
                        <div class="chatbot-controls">
                            <button id="close-btn" class="control-btn" title="Close">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="chatbot-messages" id="chatbot-messages">
                        <!-- Messages will be added here -->
                    </div>
                    
                    <div class="chatbot-input-container">
                        <div class="typing-indicator" id="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <div class="input-wrapper">
                            <input type="text" id="chatbot-input" placeholder="Ask me about John Rey's portfolio..." maxlength="500">
                            <button id="send-btn" class="send-btn">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                        <div class="quick-actions">
                            <button class="quick-btn" data-message="Tell me about John Rey's skills">Skills</button>
                            <button class="quick-btn" data-message="What projects has he worked on?">Projects</button>
                            <button class="quick-btn" data-message="How can I contact him?">Contact</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Floating Chatbot Toggle Button -->
            <button id="chatbot-toggle" class="chatbot-toggle">
                <i class="fas fa-comments"></i>
                <span class="notification-badge" id="notification-badge">1</span>
            </button>
        `;

        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    bindEvents() {
        // Toggle chatbot
        document.getElementById('chatbot-toggle').addEventListener('click', () => {
            this.toggleChatbot();
        });

        // Close chatbot
        document.getElementById('close-btn').addEventListener('click', () => {
            this.closeChatbot();
        });

        // Close chatbot when clicking outside modal
        document.getElementById('chatbot-modal').addEventListener('click', (e) => {
            if (e.target.id === 'chatbot-modal') {
                this.closeChatbot();
            }
        });

        // Send message
        document.getElementById('send-btn').addEventListener('click', () => {
            this.sendMessage();
        });

        // Enter key to send
        document.getElementById('chatbot-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Quick action buttons
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const message = e.target.getAttribute('data-message');
                document.getElementById('chatbot-input').value = message;
                this.sendMessage();
            });
        });

        // Auto-hide notification after opening
        document.getElementById('chatbot-toggle').addEventListener('click', () => {
            this.hideNotification();
        });
    }

    toggleChatbot() {
        const modal = document.getElementById('chatbot-modal');
        const toggle = document.getElementById('chatbot-toggle');
        
        if (this.isOpen) {
            modal.style.display = 'none';
            toggle.classList.remove('active');
            this.isOpen = false;
        } else {
            modal.style.display = 'flex';
            toggle.classList.add('active');
            this.isOpen = true;
            this.hideNotification();
            // Focus on input when opened
            setTimeout(() => {
                document.getElementById('chatbot-input').focus();
            }, 300);
        }
    }

    closeChatbot() {
        const modal = document.getElementById('chatbot-modal');
        const toggle = document.getElementById('chatbot-toggle');
        
        modal.style.display = 'none';
        toggle.classList.remove('active');
        this.isOpen = false;
    }

    hideNotification() {
        const badge = document.getElementById('notification-badge');
        badge.style.display = 'none';
    }

    addWelcomeMessage() {
        const welcomeMessage = {
            type: 'bot',
            content: "Hello! I'm your AI assistant. I can help you learn about John Rey Q. Clemeña's portfolio, skills, projects, and how to get in touch. What would you like to know?",
            timestamp: new Date()
        };
        
        this.addMessage(welcomeMessage);
        
        // Show notification after a delay
        setTimeout(() => {
            if (!this.isOpen) {
                document.getElementById('notification-badge').style.display = 'block';
            }
        }, 2000);
    }

    sendMessage() {
        const input = document.getElementById('chatbot-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message
        const userMessage = {
            type: 'user',
            content: message,
            timestamp: new Date()
        };
        
        this.addMessage(userMessage);
        input.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Generate bot response
        setTimeout(() => {
            this.hideTypingIndicator();
            const botResponse = this.generateResponse(message);
            this.addMessage(botResponse);
        }, 1000 + Math.random() * 2000); // Random delay for realism
    }

    addMessage(message) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.type}-message`;
        
        const timeString = message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        messageElement.innerHTML = `
            <div class="message-content">
                ${message.content}
            </div>
            <div class="message-time">${timeString}</div>
        `;
        
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        this.messages.push(message);
    }

    showTypingIndicator() {
        this.isTyping = true;
        document.getElementById('typing-indicator').style.display = 'flex';
    }

    hideTypingIndicator() {
        this.isTyping = false;
        document.getElementById('typing-indicator').style.display = 'none';
    }

    generateResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // WHAT questions
        if (message.includes('what is your name') || message.includes('what\'s your name') || message.includes('your name') || message.includes('who are you') || message.includes('introduce yourself') || message.includes('tell me about yourself')) {
            return {
                type: 'bot',
                content: "My name is John Rey Q. Clemeña. I'm a hard-working and motivated IT student pursuing a Bachelor of Science in Information Technology at Phinma Education - Cagayan de Oro College.",
                timestamp: new Date()
            };
        }
        
        if (message.includes('what do you do') || message.includes('what are you doing') || message.includes('what is your job') || message.includes('what is your profession') || message.includes('what is your career') || message.includes('what do you work as') || message.includes('what is your occupation') || message.includes('what is your field') || message.includes('what is your specialization')) {
            return {
                type: 'bot',
                content: "I'm currently a BSIT student specializing in programming, web development, and computer systems servicing. I develop academic and personal projects using Python, Java, PHP, HTML, CSS, JavaScript, and MySQL. I'm passionate about continuous learning and applying technical knowledge to real-world challenges.",
                timestamp: new Date()
            };
        }
        
        if (message.includes('what skills do you have') || message.includes('what are your skills') || message.includes('skill') || message.includes('programming') || message.includes('technology') || message.includes('what can you do') || message.includes('what are you good at') || message.includes('what are your abilities') || message.includes('what are your competencies') || message.includes('what technologies do you know') || message.includes('what programming languages') || message.includes('what tools do you use') || message.includes('what software do you know') || message.includes('what are your technical skills') || message.includes('what can you code') || message.includes('what can you develop') || message.includes('what can you build') || message.includes('what can you create') || message.includes('what can you make') || message.includes('what can you program')) {
            return {
                type: 'bot',
                content: "I have a comprehensive set of technical and core skills:<br><br><strong>Programming & Development:</strong><br>• Python, Java, PHP, HTML5, CSS, Bootstrap 5, JavaScript, Flutter (Dart)<br><br><strong>Web Development Tools:</strong><br>• VS Code, Atom, IntelliJ, NetBeans, XAMPP<br><br><strong>Design & Editing Tools:</strong><br>• Photoshop, PicsArt, PowerDirector<br><br><strong>System Skills:</strong><br>• Computer Maintenance, Windows Reprogramming & Installation, Encoding, Pydroid 3<br><br><strong>Core Skills:</strong><br>• Problem Solving & Logical Thinking<br>• Critical Thinking & Decision-Making<br>• Resilience & Adaptability<br>• Team Collaboration",
                timestamp: new Date()
            };
        }
        
        if (message.includes('what is your goal') || message.includes('what are your goals') || message.includes('what do you want to achieve') || message.includes('what are your objectives') || message.includes('what are your aspirations') || message.includes('what are your plans') || message.includes('what do you want to become') || message.includes('what is your dream') || message.includes('what is your vision') || message.includes('what do you aim for') || message.includes('what are your targets') || message.includes('what do you hope to achieve') || message.includes('what is your ambition') || message.includes('what do you want to do in the future') || message.includes('what is your career goal')) {
            return {
                type: 'bot',
                content: "My primary goal is to graduate with a Bachelor of Science in Information Technology and become a skilled software developer. I want to apply my technical knowledge to solve real-world problems, contribute to innovative projects, and continuously grow in the IT field. I'm seeking opportunities to gain professional experience and make a meaningful impact through technology.",
                timestamp: new Date()
            };
        }
        
        if (message.includes('what are your strengths') || message.includes('strengths and weaknesses') || message.includes('what are your weaknesses') || message.includes('what are your strong points') || message.includes('what are your weak points') || message.includes('what are you good at') || message.includes('what are you bad at') || message.includes('what are your advantages') || message.includes('what are your disadvantages') || message.includes('what are your positive traits') || message.includes('what are your negative traits') || message.includes('what are your best qualities') || message.includes('what are your worst qualities') || message.includes('what are your strong suits') || message.includes('what are your weak suits') || message.includes('what do you excel at') || message.includes('what do you struggle with') || message.includes('what are your talents') || message.includes('what are your limitations')) {
            return {
                type: 'bot',
                content: "<strong>Strengths:</strong><br>• Strong foundation in multiple programming languages<br>• Excellent problem-solving and logical thinking abilities<br>• Resilient and adaptable to new challenges<br>• Passionate about continuous learning<br>• Good team collaboration skills<br>• Practical experience through projects and work immersion<br><br><strong>Areas for Growth:</strong><br>• Gaining more professional work experience<br>• Learning advanced frameworks and technologies<br>• Developing leadership skills in team projects<br>• Expanding knowledge in specialized IT domains",
                timestamp: new Date()
            };
        }
        
        if (message.includes('what experience do you have') || message.includes('experience') || message.includes('work') || message.includes('job') || message.includes('what is your experience') || message.includes('what work experience') || message.includes('what job experience') || message.includes('what professional experience') || message.includes('what work history') || message.includes('what employment history') || message.includes('what career experience') || message.includes('what practical experience') || message.includes('what hands-on experience') || message.includes('what real-world experience') || message.includes('what industry experience') || message.includes('what work background') || message.includes('what employment background') || message.includes('what career background') || message.includes('what work record') || message.includes('what employment record')) {
            return {
                type: 'bot',
                content: "My work experience includes:<br><br><strong>Bureau of Fire Protection – Panglao, Bohol</strong><br>• Work Immersion (Senior High School) | 40 Days<br>• Assisted in computer maintenance and troubleshooting tasks<br>• Gained hands-on experience in hardware and software maintenance<br><br><strong>Project Experience:</strong><br>• Completed 8+ web development and programming projects<br>• Developed systems using multiple programming languages<br>• Created responsive websites and web applications<br>• Built database-driven applications with MySQL",
                timestamp: new Date()
            };
        }
        
        if (message.includes('what projects have you completed') || message.includes('what projects') || message.includes('project') || message.includes('portfolio') || message.includes('work') || message.includes('what have you built') || message.includes('what have you created') || message.includes('what have you developed') || message.includes('what have you made') || message.includes('what have you programmed') || message.includes('what have you coded') || message.includes('what applications have you built') || message.includes('what websites have you created') || message.includes('what systems have you developed') || message.includes('what software have you built') || message.includes('what programs have you created') || message.includes('what have you worked on') || message.includes('what have you accomplished') || message.includes('what have you achieved') || message.includes('what have you delivered') || message.includes('what have you produced') || message.includes('what have you completed') || message.includes('what have you finished') || message.includes('what have you done') || message.includes('what are your accomplishments') || message.includes('what are your achievements') || message.includes('what are your works') || message.includes('what are your creations') || message.includes('what are your builds') || message.includes('what are your developments') || message.includes('what are your outputs') || message.includes('what are your deliverables')) {
            return {
                type: 'bot',
                content: "I've completed several impressive projects:<br><br>• <strong>Conversion Tool (Kg ⇄ Lbs):</strong> Python project using Pydroid 3 (2021-2022)<br>• <strong>Cashiering System:</strong> Java program for street foods ordering (2022-2023)<br>• <strong>Comfee Cafe Website:</strong> Responsive coffee shop website (Mar-Apr 2023)<br>• <strong>Lui Finance Solution:</strong> Multi-section financial website (2022-2023)<br>• <strong>Cere JUICE Website:</strong> Promotional website for juice product (2022-2023)<br>• <strong>Personal Portfolio Website:</strong> Responsive portfolio showcasing skills (2022-2023)<br>• <strong>HRRD Landing Page:</strong> User-friendly landing page (2022-2023)<br>• <strong>Stock Management System:</strong> Web-based inventory tracking system (2023-2024)<br><br>Check my GitHub: https://github.com/johnjohn1012",
                timestamp: new Date()
            };
        }
        
        if (message.includes('what tools do you use') || message.includes('what tools')) {
            return {
                type: 'bot',
                content: "I use a variety of professional development tools:<br><br><strong>Code Editors & IDEs:</strong><br>• VS Code, Atom, IntelliJ, NetBeans<br><br><strong>Development Environment:</strong><br>• XAMPP for local server development<br><br><strong>Design & Editing:</strong><br>• Photoshop for image editing<br>• PicsArt for photo manipulation<br>• PowerDirector for video editing<br><br><strong>Mobile Development:</strong><br>• Pydroid 3 for Python mobile development<br><br><strong>Version Control:</strong><br>• GitHub for project management and collaboration",
                timestamp: new Date()
            };
        }
        
        if (message.includes('what motivates you') || message.includes('motivation')) {
            return {
                type: 'bot',
                content: "I'm motivated by several key factors:<br><br>• <strong>Problem-Solving:</strong> I love tackling complex challenges and finding innovative solutions<br>• <strong>Continuous Learning:</strong> The IT field constantly evolves, and I enjoy staying updated with new technologies<br>• <strong>Real-World Impact:</strong> I want to create applications and systems that help people and businesses<br>• <strong>Personal Growth:</strong> Each project teaches me something new and helps me become a better developer<br>• <strong>Team Collaboration:</strong> Working with others to achieve common goals is highly rewarding<br>• <strong>Future Opportunities:</strong> I'm excited about the endless possibilities in the IT industry",
                timestamp: new Date()
            };
        }
        
        if (message.includes('what challenges have you faced') || message.includes('challenges')) {
            return {
                type: 'bot',
                content: "I've faced and overcome several challenges:<br><br>• <strong>Learning Multiple Languages:</strong> Mastering different programming languages required dedication and practice<br>• <strong>Project Complexity:</strong> Building the Stock Management System with full-stack development was challenging but rewarding<br>• <strong>Time Management:</strong> Balancing academic studies with personal projects and learning<br>• <strong>Technical Issues:</strong> Debugging complex code and solving system compatibility problems<br>• <strong>Work Immersion:</strong> Adapting to real-world work environment at BFP Panglao Bohol<br><br>These challenges have made me more resilient and better prepared for professional work.",
                timestamp: new Date()
            };
        }
        
        // WHO questions
        if (message.includes('who are you') || message.includes('who is john rey')) {
            return {
                type: 'bot',
                content: "I'm John Rey Q. Clemeña, a hard-working and motivated IT student with a strong foundation in programming, web development, and computer systems servicing. I'm passionate about continuous learning and applying technical knowledge to real-world challenges. I'm currently pursuing my Bachelor of Science in Information Technology at Phinma Education - Cagayan de Oro College.",
                timestamp: new Date()
            };
        }
        
        if (message.includes('who do you work with') || message.includes('who do you collaborate with')) {
            return {
                type: 'bot',
                content: "I work and collaborate with:<br><br>• <strong>Classmates and Study Groups:</strong> Collaborating on academic projects and assignments<br>• <strong>Instructors and Professors:</strong> Learning from experienced IT professionals at Phinma Education<br>• <strong>Work Immersion Colleagues:</strong> Worked with the team at Bureau of Fire Protection - Panglao, Bohol<br>• <strong>Online Learning Community:</strong> Engaging with W3Schools and other online learning platforms<br>• <strong>GitHub Community:</strong> Sharing projects and collaborating with other developers",
                timestamp: new Date()
            };
        }
        
        if (message.includes('who taught you') || message.includes('who are your teachers') || message.includes('mentor')) {
            return {
                type: 'bot',
                content: "I've learned from several sources:<br><br>• <strong>Instructors at Phinma Education:</strong> Experienced IT professionals who taught me Java, JavaScript, PHP, MySQL, CSS, and HTML<br>• <strong>W3Schools Online Platform:</strong> Self-directed learning for HTML and CSS fundamentals<br>• <strong>TESDA Instructors:</strong> Taught me Computer Maintenance Servicing skills<br>• <strong>Work Immersion Supervisors:</strong> Guided me during my 40-day experience at BFP Panglao Bohol<br>• <strong>Self-Learning:</strong> Continuous practice and exploration of new technologies",
                timestamp: new Date()
            };
        }
        
        if (message.includes('who do you admire') || message.includes('who inspires you')) {
            return {
                type: 'bot',
                content: "I admire and am inspired by:<br><br>• <strong>Successful IT Professionals:</strong> Those who have built innovative solutions and made significant contributions to technology<br>• <strong>Open Source Developers:</strong> Contributors who share knowledge and build amazing projects<br>• <strong>My Instructors:</strong> Dedicated educators who patiently teach complex programming concepts<br>• <strong>Tech Entrepreneurs:</strong> Visionaries who use technology to solve real-world problems<br>• <strong>Continuous Learners:</strong> People who never stop learning and adapting to new technologies",
                timestamp: new Date()
            };
        }
        
        if (message.includes('who can verify') || message.includes('references') || message.includes('who can confirm')) {
            return {
                type: 'bot',
                content: "You can verify my work and skills through:<br><br>• <strong>GitHub Portfolio:</strong> https://github.com/johnjohn1012 - All my projects are publicly available<br>• <strong>LinkedIn Profile:</strong> https://www.linkedin.com/in/johnrey-cleme%C3%B1a-ab9b2a257/<br>• <strong>Phinma Education Instructors:</strong> Can verify my academic performance and project work<br>• <strong>BFP Panglao Bohol:</strong> Can confirm my work immersion experience<br>• <strong>TESDA Talibon Bohol:</strong> Can verify my NC II certification in Computer Maintenance Servicing",
                timestamp: new Date()
            };
        }
        
        if (message.includes('who benefits from your projects')) {
            return {
                type: 'bot',
                content: "My projects benefit various stakeholders:<br><br>• <strong>Businesses:</strong> The cashiering system helps streamline operations for street food vendors<br>• <strong>Customers:</strong> Websites like Comfee Cafe provide better user experience and information<br>• <strong>Organizations:</strong> The HRRD landing page helps organizations present their services professionally<br>• <strong>Students:</strong> My portfolio serves as a learning resource for other IT students<br>• <strong>Future Employers:</strong> My projects demonstrate practical skills and problem-solving abilities<br>• <strong>Myself:</strong> Each project enhances my skills and builds my professional portfolio",
                timestamp: new Date()
            };
        }
        
        // WHEN questions
        if (message.includes('when did you start learning it') || message.includes('when did you start programming')) {
            return {
                type: 'bot',
                content: "I started my IT journey in 2019-2020 during my Senior High School at Lourdes National High School Panglao Bohol, where I studied TVL - Computer System Servicing and Animation. I received my NC II certification in Computer Maintenance Servicing from TESDA in 2019-2020. I began my formal IT education in 2022 when I enrolled in the Bachelor of Science in Information Technology program at Phinma Education - Cagayan de Oro College.",
                timestamp: new Date()
            };
        }
        
        if (message.includes('when will you graduate') || message.includes('when do you graduate')) {
            return {
                type: 'bot',
                content: "I'm currently pursuing my Bachelor of Science in Information Technology at Phinma Education - Cagayan de Oro College, which I started in 2022. The program typically takes 4 years, so I expect to graduate around 2026. I'm committed to completing my studies and continuing to build my skills throughout my academic journey.",
                timestamp: new Date()
            };
        }
        
        if (message.includes('when did you finish your projects') || message.includes('when were your projects completed')) {
            return {
                type: 'bot',
                content: "My projects were completed over several years:<br><br>• <strong>Conversion Tool:</strong> 2021-2022<br>• <strong>Cashiering System:</strong> 2022-2023<br>• <strong>Comfee Cafe Website:</strong> March-April 2023<br>• <strong>Lui Finance Solution:</strong> 2022-2023<br>• <strong>Cere JUICE Website:</strong> 2022-2023<br>• <strong>Personal Portfolio:</strong> 2022-2023<br>• <strong>HRRD Landing Page:</strong> 2022-2023<br>• <strong>Stock Management System:</strong> 2023-2024<br><br>Each project represents continuous learning and skill development over time.",
                timestamp: new Date()
            };
        }
        
        if (message.includes('when did you receive your certification') || message.includes('when was your certification')) {
            return {
                type: 'bot',
                content: "I received my National Certificate (NC II) in Computer Maintenance Servicing from TESDA - Talibon Bohol Training Center in 2019-2020. This certification is valid until 2026, demonstrating my competency in computer maintenance and troubleshooting skills.",
                timestamp: new Date()
            };
        }
        
        if (message.includes('when can you start working') || message.includes('when are you available')) {
            return {
                type: 'bot',
                content: "I'm currently available for part-time work, internships, or freelance projects while continuing my studies. I can start working immediately for projects that align with my academic schedule. I'm particularly interested in opportunities that allow me to apply my programming and web development skills while gaining professional experience.",
                timestamp: new Date()
            };
        }
        
        if (message.includes('when did you complete your immersion') || message.includes('when was your work immersion')) {
            return {
                type: 'bot',
                content: "I completed my 40-day work immersion at the Bureau of Fire Protection - Panglao, Bohol during my Senior High School years (2019-2020). This experience provided me with hands-on training in computer maintenance and troubleshooting tasks, giving me valuable real-world experience in the IT field.",
                timestamp: new Date()
            };
        }
        
        // WHERE questions
        if (message.includes('where are you studying') || message.includes('where do you study')) {
            return {
                type: 'bot',
                content: "I'm currently studying at Phinma Education - Cagayan de Oro College, pursuing my Bachelor of Science in Information Technology. I started this program in 2022 and am actively engaged in both academic coursework and practical project development.",
                timestamp: new Date()
            };
        }
        
        if (message.includes('where did you complete your work immersion') || message.includes('where was your immersion')) {
            return {
                type: 'bot',
                content: "I completed my work immersion at the Bureau of Fire Protection (BFP) in Panglao, Bohol. This 40-day experience during my Senior High School years provided me with practical experience in computer maintenance and troubleshooting in a real workplace environment.",
                timestamp: new Date()
            };
        }
        
        if (message.includes('where did you learn programming') || message.includes('where do you learn')) {
            return {
                type: 'bot',
                content: "I've learned programming from multiple sources:<br><br>• <strong>Phinma Education - Cagayan de Oro College:</strong> Formal education in Java, JavaScript, PHP, MySQL, CSS, and HTML<br>• <strong>W3Schools Online Platform:</strong> Self-directed learning for HTML and CSS fundamentals<br>• <strong>TESDA Talibon Bohol:</strong> Computer maintenance and system skills<br>• <strong>Self-Practice:</strong> Continuous learning through project development and online resources<br>• <strong>Work Immersion:</strong> Practical application at BFP Panglao Bohol",
                timestamp: new Date()
            };
        }
        
        if (message.includes('where can employers see your portfolio') || message.includes('where is your portfolio')) {
            return {
                type: 'bot',
                content: "Employers can view my work and portfolio at:<br><br>• <strong>GitHub:</strong> https://github.com/johnjohn1012 - All my coding projects and repositories<br>• <strong>LinkedIn:</strong> https://www.linkedin.com/in/johnrey-cleme%C3%B1a-ab9b2a257/ - Professional profile and updates<br>• <strong>This Portfolio Website:</strong> Comprehensive showcase of my skills and projects<br>• <strong>Facebook:</strong> https://www.facebook.com/johnrey.clemena.71 - Personal updates and project shares",
                timestamp: new Date()
            };
        }
        
        if (message.includes('where do you see yourself in 5 years') || message.includes('where will you be in 5 years')) {
            return {
                type: 'bot',
                content: "In 5 years, I see myself as a skilled software developer with several years of professional experience. I envision working for a technology company or running my own development business, creating innovative solutions that solve real-world problems. I plan to have mastered advanced programming languages and frameworks, and I hope to be mentoring other aspiring developers while continuing to learn and grow in the ever-evolving IT industry.",
                timestamp: new Date()
            };
        }
        
        if (message.includes('where did you earn your certifications') || message.includes('where are your certifications from')) {
            return {
                type: 'bot',
                content: "I earned my National Certificate (NC II) in Computer Maintenance Servicing from TESDA - Talibon Bohol Training Center in 2019-2020. This certification is valid until 2026 and demonstrates my competency in computer maintenance, troubleshooting, and system servicing skills.",
                timestamp: new Date()
            };
        }
        
        if (message.includes('contact') || message.includes('reach') || message.includes('email') || message.includes('phone')) {
            return {
                type: 'bot',
                content: "You can contact John Rey through multiple channels:<br><br>• <strong>Email:</strong> joqu.clemena.coc@phinmaed.com<br>• <strong>Phone (TM):</strong> 09533480232<br>• <strong>Phone (Globe):</strong> 09159464548<br>• <strong>LinkedIn:</strong> https://www.linkedin.com/in/johnrey-cleme%C3%B1a-ab9b2a257/<br>• <strong>GitHub:</strong> https://github.com/johnjohn1012<br>• <strong>Facebook:</strong> https://www.facebook.com/johnrey.clemena.71<br>• <strong>Location:</strong> Cagayan de Oro, Philippines<br><br>He's always interested in discussing new opportunities, collaborations, or answering questions about his work!",
                timestamp: new Date()
            };
        }
        
        // WHY questions
        if (message.includes('why did you choose it') || message.includes('why it as your course') || message.includes('why programming')) {
            return {
                type: 'bot',
                content: "I chose IT as my course because:<br><br>• <strong>Problem-Solving Passion:</strong> I love tackling complex challenges and finding innovative solutions<br>• <strong>Technology Impact:</strong> IT has the power to transform businesses and improve people's lives<br>• <strong>Continuous Learning:</strong> The field constantly evolves, offering endless opportunities to grow<br>• <strong>Creative Expression:</strong> Programming allows me to build and create something from nothing<br>• <strong>Future Opportunities:</strong> IT skills are in high demand across all industries<br>• <strong>Practical Application:</strong> I enjoy seeing my code come to life and solve real problems",
                timestamp: new Date()
            };
        }
        
        if (message.includes('why are you interested in programming') || message.includes('why do you like programming')) {
            return {
                type: 'bot',
                content: "I'm interested in programming because:<br><br>• <strong>Logical Thinking:</strong> Programming challenges me to think systematically and logically<br>• <strong>Creativity:</strong> It allows me to create solutions and applications from scratch<br>• <strong>Problem-Solving:</strong> Each bug or challenge is a puzzle to solve<br>• <strong>Impact:</strong> My code can help businesses operate more efficiently<br>• <strong>Learning:</strong> There's always something new to learn in programming<br>• <strong>Community:</strong> The programming community is supportive and collaborative",
                timestamp: new Date()
            };
        }
        
        if (message.includes('why should we hire you') || message.includes('why hire you')) {
            return {
                type: 'bot',
                content: "You should hire me because:<br><br>• <strong>Strong Foundation:</strong> I have solid skills in multiple programming languages and technologies<br>• <strong>Practical Experience:</strong> I've completed 8+ real projects demonstrating my capabilities<br>• <strong>Problem-Solving Skills:</strong> I excel at logical thinking and finding innovative solutions<br>• <strong>Continuous Learning:</strong> I'm committed to staying updated with new technologies<br>• <strong>Work Experience:</strong> I have real-world experience from my work immersion at BFP<br>• <strong>Certification:</strong> I hold an NC II certification in Computer Maintenance Servicing<br>• <strong>Motivation:</strong> I'm passionate about applying my skills to solve real business problems<br>• <strong>Team Player:</strong> I work well in collaborative environments",
                timestamp: new Date()
            };
        }
        
        if (message.includes('why do you enjoy problem-solving') || message.includes('why problem-solving')) {
            return {
                type: 'bot',
                content: "I enjoy problem-solving because:<br><br>• <strong>Mental Challenge:</strong> It exercises my brain and keeps me engaged<br>• <strong>Satisfaction:</strong> There's great satisfaction in finding the right solution<br>• <strong>Learning Opportunity:</strong> Each problem teaches me something new<br>• <strong>Real-World Impact:</strong> Solving problems helps businesses and people<br>• <strong>Skill Development:</strong> It improves my analytical and critical thinking abilities<br>• <strong>Innovation:</strong> Problem-solving often leads to creative and innovative solutions",
                timestamp: new Date()
            };
        }
        
        if (message.includes('why did you make your portfolio projects') || message.includes('why portfolio projects')) {
            return {
                type: 'bot',
                content: "I created my portfolio projects because:<br><br>• <strong>Skill Demonstration:</strong> They showcase my practical abilities to potential employers<br>• <strong>Learning Tool:</strong> Each project teaches me new technologies and techniques<br>• <strong>Real-World Application:</strong> They solve actual problems (like the cashiering system for street food vendors)<br>• <strong>Portfolio Building:</strong> They create a comprehensive showcase of my capabilities<br>• <strong>Practice:</strong> They provide hands-on experience with different programming languages<br>• <strong>Innovation:</strong> They allow me to experiment with new ideas and approaches<br>• <strong>Professional Growth:</strong> They demonstrate my commitment to continuous improvement",
                timestamp: new Date()
            };
        }
        
        if (message.includes('why do you use certain tools') || message.includes('why these tools')) {
            return {
                type: 'bot',
                content: "I choose specific tools because:<br><br>• <strong>VS Code:</strong> Excellent for web development with great extensions and debugging<br>• <strong>IntelliJ/NetBeans:</strong> Powerful IDEs for Java development with advanced features<br>• <strong>XAMPP:</strong> Easy local server setup for PHP and MySQL development<br>• <strong>Photoshop/PicsArt:</strong> Essential for creating and editing visual elements<br>• <strong>GitHub:</strong> Industry standard for version control and collaboration<br>• <strong>W3Schools:</strong> Reliable resource for learning web technologies<br>• <strong>Pydroid 3:</strong> Convenient for Python development on mobile devices<br><br>Each tool serves a specific purpose in my development workflow.",
                timestamp: new Date()
            };
        }
        
        // HOW questions
        if (message.includes('how do you solve problems') || message.includes('how do you approach problems')) {
            return {
                type: 'bot',
                content: "My problem-solving approach:<br><br>• <strong>Analysis:</strong> I break down complex problems into smaller, manageable parts<br>• <strong>Research:</strong> I gather information and study similar solutions<br>• <strong>Planning:</strong> I create a step-by-step plan before coding<br>• <strong>Implementation:</strong> I build the solution systematically<br>• <strong>Testing:</strong> I thoroughly test and debug the solution<br>• <strong>Iteration:</strong> I refine and improve based on results<br>• <strong>Documentation:</strong> I document the process for future reference<br>• <strong>Learning:</strong> I reflect on what I learned from each problem",
                timestamp: new Date()
            };
        }
        
        if (message.includes('how do you manage your projects') || message.includes('how do you organize projects')) {
            return {
                type: 'bot',
                content: "My project management approach:<br><br>• <strong>Planning:</strong> I start with clear objectives and requirements<br>• <strong>Timeline:</strong> I set realistic deadlines and milestones<br>• <strong>Organization:</strong> I use GitHub for version control and project organization<br>• <strong>Documentation:</strong> I maintain clear documentation throughout development<br>• <strong>Testing:</strong> I implement testing at each stage<br>• <strong>Feedback:</strong> I seek input from instructors and peers<br>• <strong>Iteration:</strong> I continuously improve based on feedback<br>• <strong>Completion:</strong> I ensure all requirements are met before finalizing",
                timestamp: new Date()
            };
        }
        
        if (message.includes('how do you keep learning') || message.includes('how do you stay updated')) {
            return {
                type: 'bot',
                content: "My continuous learning strategy:<br><br>• <strong>W3Schools:</strong> Regular practice with HTML, CSS, and web technologies<br>• <strong>Project-Based Learning:</strong> I learn by building real projects<br>• <strong>Academic Courses:</strong> Formal education at Phinma Education<br>• <strong>Online Resources:</strong> Tutorials, documentation, and coding challenges<br>• <strong>Practice:</strong> Daily coding practice in Java and Python<br>• <strong>Community:</strong> Engaging with GitHub and programming communities<br>• <strong>Experimentation:</strong> Trying new technologies and frameworks<br>• <strong>Reflection:</strong> Analyzing what I've learned from each project",
                timestamp: new Date()
            };
        }
        
        if (message.includes('how did you build your portfolio websites') || message.includes('how did you create your websites')) {
            return {
                type: 'bot',
                content: "My website development process:<br><br>• <strong>Planning:</strong> I start with wireframes and design concepts<br>• <strong>HTML Structure:</strong> I create semantic, accessible markup<br>• <strong>CSS Styling:</strong> I use modern CSS with Bootstrap 5 for responsive design<br>• <strong>JavaScript Functionality:</strong> I add interactive features and dynamic content<br>• <strong>Database Integration:</strong> For complex projects, I integrate PHP and MySQL<br>• <strong>Testing:</strong> I test across different browsers and devices<br>• <strong>Optimization:</strong> I ensure fast loading and good performance<br>• <strong>Deployment:</strong> I use appropriate hosting and version control",
                timestamp: new Date()
            };
        }
        
        if (message.includes('how do you handle challenges') || message.includes('how do you deal with setbacks')) {
            return {
                type: 'bot',
                content: "My approach to handling challenges:<br><br>• <strong>Stay Calm:</strong> I maintain a positive mindset and don't panic<br>• <strong>Break It Down:</strong> I divide complex problems into smaller parts<br>• <strong>Research:</strong> I look for solutions and learn from others' experiences<br>• <strong>Ask for Help:</strong> I consult instructors, peers, or online communities<br>• <strong>Persist:</strong> I don't give up easily and keep trying different approaches<br>• <strong>Learn:</strong> I treat each challenge as a learning opportunity<br>• <strong>Document:</strong> I record solutions for future reference<br>• <strong>Reflect:</strong> I analyze what went wrong and how to prevent it",
                timestamp: new Date()
            };
        }
        
        if (message.includes('how do you work with a team') || message.includes('how do you collaborate')) {
            return {
                type: 'bot',
                content: "My team collaboration approach:<br><br>• <strong>Communication:</strong> I maintain clear and regular communication with team members<br>• <strong>Respect:</strong> I value everyone's input and contributions<br>• <strong>Flexibility:</strong> I adapt to different working styles and preferences<br>• <strong>Responsibility:</strong> I take ownership of my assigned tasks<br>• <strong>Support:</strong> I help teammates when they need assistance<br>• <strong>Feedback:</strong> I provide constructive feedback and accept it graciously<br>• <strong>Tools:</strong> I use GitHub and other collaboration tools effectively<br>• <strong>Goals:</strong> I focus on achieving common team objectives",
                timestamp: new Date()
            };
        }
        
        if (message.includes('how do you apply what you learned') || message.includes('how do you use your knowledge')) {
            return {
                type: 'bot',
                content: "I apply my learning through:<br><br>• <strong>Real Projects:</strong> I build practical applications using my skills<br>• <strong>Problem-Solving:</strong> I use programming concepts to solve real-world issues<br>• <strong>Work Immersion:</strong> I applied computer maintenance skills at BFP<br>• <strong>Academic Projects:</strong> I implement learned concepts in coursework<br>• <strong>Personal Development:</strong> I create tools that help me in daily tasks<br>• <strong>Teaching Others:</strong> I share knowledge with classmates and peers<br>• <strong>Continuous Practice:</strong> I regularly code to maintain and improve skills<br>• <strong>Innovation:</strong> I experiment with new ways to apply existing knowledge",
                timestamp: new Date()
            };
        }
        
        if (message.includes('how do you see yourself growing') || message.includes('how will you grow in it')) {
            return {
                type: 'bot',
                content: "My growth plan in IT:<br><br>• <strong>Technical Skills:</strong> I'll master advanced programming languages and frameworks<br>• <strong>Specialization:</strong> I'll focus on specific areas like web development or mobile apps<br>• <strong>Professional Experience:</strong> I'll gain real-world work experience through internships and jobs<br>• <strong>Certifications:</strong> I'll pursue additional professional certifications<br>• <strong>Leadership:</strong> I'll develop project management and team leadership skills<br>• <strong>Innovation:</strong> I'll work on cutting-edge projects and technologies<br>• <strong>Mentoring:</strong> I'll help other aspiring developers learn and grow<br>• <strong>Entrepreneurship:</strong> I'll explore opportunities to start my own tech business",
                timestamp: new Date()
            };
        }
        
        if (message.includes('about') || message.includes('who') || message.includes('background')) {
            return {
                type: 'bot',
                content: "John Rey Q. Clemeña is a hardworking college student pursuing a Bachelor of Science in Information Technology at Phinma Education - Cagayan de Oro College. He brings forth a motivated attitude and a variety of powerful skills:<br><br>• <strong>Education:</strong> BSIT student (2022-Present) with NC II in Computer Maintenance Servicing<br>• <strong>Experience:</strong> 40-day work immersion at BFP Panglao Bohol as computer maintenance<br>• <strong>Core Skills:</strong> Problem solving, logical thinking, resilience<br>• <strong>Learning:</strong> Actively learning through W3Schools and practicing Java & Python<br>• <strong>Location:</strong> Cagayan de Oro, Philippines<br><br>He's committed to utilizing his skills and continuously expanding his knowledge in information technology!",
                timestamp: new Date()
            };
        }
        
        if (message.includes('service') || message.includes('offer') || message.includes('help') || message.includes('what can you offer') || message.includes('what services do you provide') || message.includes('what services do you offer') || message.includes('what can you provide') || message.includes('what can you deliver') || message.includes('what can you do for me') || message.includes('what can you help with') || message.includes('what can you assist with') || message.includes('what can you support') || message.includes('what can you help me with') || message.includes('what can you do for us') || message.includes('what can you do for our company') || message.includes('what can you do for our business') || message.includes('what can you do for our organization') || message.includes('what can you do for our team') || message.includes('what can you do for our project') || message.includes('what can you do for our website') || message.includes('what can you do for our system') || message.includes('what can you do for our application') || message.includes('what can you do for our software') || message.includes('what can you do for our program') || message.includes('what can you do for our platform') || message.includes('what can you do for our solution') || message.includes('what can you do for our product') || message.includes('what can you do for our service') || message.includes('what can you do for our development') || message.includes('what can you do for our design') || message.includes('what can you do for our maintenance') || message.includes('what can you do for our support') || message.includes('what can you do for our consulting') || message.includes('what can you do for our training') || message.includes('what can you do for our implementation') || message.includes('what can you do for our deployment') || message.includes('what can you do for our integration') || message.includes('what can you do for our optimization') || message.includes('what can you do for our enhancement') || message.includes('what can you do for our improvement') || message.includes('what can you do for our upgrade') || message.includes('what can you do for our migration') || message.includes('what can you do for our customization') || message.includes('what can you do for our configuration') || message.includes('what can you do for our setup') || message.includes('what can you do for our installation') || message.includes('what can you do for our troubleshooting') || message.includes('what can you do for our debugging') || message.includes('what can you do for our testing') || message.includes('what can you do for our quality assurance') || message.includes('what can you do for our security') || message.includes('what can you do for our performance') || message.includes('what can you do for our scalability') || message.includes('what can you do for our reliability') || message.includes('what can you do for our efficiency') || message.includes('what can you do for our productivity') || message.includes('what can you do for our automation') || message.includes('what can you do for our innovation') || message.includes('what can you do for our transformation') || message.includes('what can you do for our digitalization') || message.includes('what can you do for our modernization') || message.includes('what can you do for our advancement') || message.includes('what can you do for our progress') || message.includes('what can you do for our growth') || message.includes('what can you do for our success') || message.includes('what can you do for our achievement') || message.includes('what can you do for our goal') || message.includes('what can you do for our objective') || message.includes('what can you do for our target') || message.includes('what can you do for our mission') || message.includes('what can you do for our vision') || message.includes('what can you do for our strategy') || message.includes('what can you do for our plan') || message.includes('what can you do for our roadmap') || message.includes('what can you do for our timeline') || message.includes('what can you do for our budget') || message.includes('what can you do for our cost') || message.includes('what can you do for our investment') || message.includes('what can you do for our return') || message.includes('what can you do for our value') || message.includes('what can you do for our benefit') || message.includes('what can you do for our advantage') || message.includes('what can you do for our opportunity') || message.includes('what can you do for our potential') || message.includes('what can you do for our future') || message.includes('what can you do for our next step') || message.includes('what can you do for our next phase') || message.includes('what can you do for our next stage') || message.includes('what can you do for our next level') || message.includes('what can you do for our next milestone') || message.includes('what can you do for our next achievement') || message.includes('what can you do for our next success') || message.includes('what can you do for our next goal') || message.includes('what can you do for our next objective') || message.includes('what can you do for our next target') || message.includes('what can you do for our next mission') || message.includes('what can you do for our next vision') || message.includes('what can you do for our next strategy') || message.includes('what can you do for our next plan') || message.includes('what can you do for our next roadmap') || message.includes('what can you do for our next timeline') || message.includes('what can you do for our next budget') || message.includes('what can you do for our next cost') || message.includes('what can you do for our next investment') || message.includes('what can you do for our next return') || message.includes('what can you do for our next value') || message.includes('what can you do for our next benefit') || message.includes('what can you do for our next advantage') || message.includes('what can you do for our next opportunity') || message.includes('what can you do for our next potential') || message.includes('what can you do for our next future')) {
            return {
                type: 'bot',
                content: "John Rey offers a range of IT services based on his skills and experience:<br><br>• <strong>Web Development:</strong> HTML5, CSS, JavaScript, PHP, Bootstrap 5 websites<br>• <strong>Programming Services:</strong> Python, Java, Flutter Dart development<br>• <strong>Database Management:</strong> MySQL database design and management<br>• <strong>Computer Maintenance:</strong> Hardware troubleshooting, Windows installation<br>• <strong>Photo Editing:</strong> Photoshop, PicsArt for image editing<br>• <strong>Video Editing:</strong> PowerDirector for video projects<br>• <strong>System Development:</strong> Web-based systems with full-stack development<br><br>All services are delivered with attention to detail and client satisfaction!",
                timestamp: new Date()
            };
        }
        
        if (message.includes('education') || message.includes('school') || message.includes('degree') || message.includes('college')) {
            return {
                type: 'bot',
                content: "John Rey's educational background:<br><br>• <strong>Current:</strong> Bachelor of Science in Information Technology at Phinma Education - Cagayan de Oro College (2022-Present)<br>• <strong>Senior High:</strong> TVL - Computer System Servicing and Animation at Lourdes National High School Panglao Bohol (2019-2020)<br>• <strong>Certification:</strong> National Certificate NC II in Computer Maintenance Servicing from Talibon Bohol TESDA Center (2019-2020, Expires 2026)<br><br>He's actively learning through W3Schools online courses and continuously expanding his programming knowledge!",
                timestamp: new Date()
            };
        }
        
        if (message.includes('experience') || message.includes('work') || message.includes('job')) {
            return {
                type: 'bot',
                content: "John Rey's work experience:<br><br>• <strong>BFP Panglao Bohol:</strong> 40-day work immersion in Senior High School as computer maintenance technician<br>• <strong>Skills Gained:</strong> Hardware troubleshooting, software installation, system maintenance<br>• <strong>Current Focus:</strong> Web development projects, programming practice, and continuous learning<br><br>He's a motivated student seeking employment opportunities to further utilize his technical skills!",
                timestamp: new Date()
            };
        }
        
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return {
                type: 'bot',
                content: "Hello! 👋 Welcome to John Rey's portfolio! I'm here to help you learn more about his skills, projects, and services. Feel free to ask me anything about his work or how to get in touch!",
                timestamp: new Date()
            };
        }
        
        if (message.includes('thank') || message.includes('thanks')) {
            return {
                type: 'bot',
                content: "You're very welcome! 😊 I'm glad I could help. If you have any more questions about John Rey's portfolio or services, just let me know. Good luck with your project!",
                timestamp: new Date()
            };
        }
        
        // Default response
        return {
            type: 'bot',
            content: "That's an interesting question! I can help you with information about John Rey's skills, projects, services, or how to contact him. Try asking about his programming skills, portfolio projects, or available services. What would you like to know?",
            timestamp: new Date()
        };
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioChatbot();
});

// Add some fun interactions
document.addEventListener('DOMContentLoaded', () => {
    // Add floating animation to chatbot toggle
    const toggle = document.getElementById('chatbot-toggle');
    if (toggle) {
        setInterval(() => {
            toggle.style.transform = 'translateY(-5px)';
            setTimeout(() => {
                toggle.style.transform = 'translateY(0)';
            }, 2000);
        }, 4000);
    }
});