// Advanced Fraud Detection System - JavaScript
class FraudDetectionSystem {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.startAnimations();
        this.initializeActivityFeed();
    }

    init() {
        this.form = document.getElementById('fraud-form');
        this.resultsSection = document.getElementById('results-section');
        this.formSection = document.getElementById('form-section');
        this.analyzeBtn = document.getElementById('analyze-btn');
        this.clearBtn = document.getElementById('clear-btn');
        this.newAnalysisBtn = document.getElementById('new-analysis-btn');
        this.saveReportBtn = document.getElementById('save-report-btn');
        
        // Animation counters
        this.animateCounters();
        
        // Initialize form validation
        this.setupFormValidation();
        
        // Initialize tooltips and help system
        this.initializeTooltips();
        
        // Setup notification system
        this.notificationContainer = document.getElementById('notifications');
        
        // Initialize real-time calculations
        this.setupRealTimeCalculations();
    }

    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Clear form
        this.clearBtn.addEventListener('click', () => this.clearForm());
        
        // New analysis
        this.newAnalysisBtn.addEventListener('click', () => this.resetForNewAnalysis());
        
        // Save report
        this.saveReportBtn.addEventListener('click', () => this.saveReport());
        
        // Input change events for real-time validation
        const inputs = this.form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.validateField(input));
            input.addEventListener('blur', () => this.calculateRiskLevel());
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
        
        // Window resize for responsive adjustments
        window.addEventListener('resize', () => this.handleResize());
        
        // Page visibility change
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            this.showNotification('Please fill in all required fields correctly', 'error');
            return;
        }
        
        this.showLoading();
        this.simulateAnalysis();
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldGroup = field.closest('.input-group');
        
        // Remove existing error states
        fieldGroup.classList.remove('error');
        
        if (field.hasAttribute('required') && !value) {
            this.showFieldError(fieldGroup, 'This field is required');
            return false;
        }
        
        if (field.type === 'number' && value) {
            const numValue = parseFloat(value);
            if (isNaN(numValue) || numValue < 0) {
                this.showFieldError(fieldGroup, 'Please enter a valid positive number');
                return false;
            }
            
            // Additional validation for specific fields
            if (field.name === 'amount' && numValue > 1000000) {
                this.showFieldError(fieldGroup, 'Transaction amount seems unusually high');
                return false;
            }
        }
        
        // Clear any existing errors
        this.clearFieldError(fieldGroup);
        return true;
    }

    showFieldError(fieldGroup, message) {
        fieldGroup.classList.add('error');
        
        let errorElement = fieldGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            fieldGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        fieldGroup.classList.add('glitch');
        setTimeout(() => fieldGroup.classList.remove('glitch'), 300);
    }

    clearFieldError(fieldGroup) {
        fieldGroup.classList.remove('error');
        const errorElement = fieldGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    showLoading() {
        this.analyzeBtn.classList.add('loading');
        this.analyzeBtn.querySelector('.btn-text').style.display = 'none';
        this.analyzeBtn.querySelector('.loading-spinner').style.display = 'flex';
        this.analyzeBtn.disabled = true;
        
        // Add loading state to form
        this.form.classList.add('loading');
        
        // Show processing notification
        this.showNotification('Analyzing transaction...', 'info');
    }

    hideLoading() {
        this.analyzeBtn.classList.remove('loading');
        this.analyzeBtn.querySelector('.btn-text').style.display = 'flex';
        this.analyzeBtn.querySelector('.loading-spinner').style.display = 'none';
        this.analyzeBtn.disabled = false;
        
        // Remove loading state from form
        this.form.classList.remove('loading');
    }

    simulateAnalysis() {
        const startTime = Date.now();
        
        // Simulate API call delay
        setTimeout(() => {
            const endTime = Date.now();
            const processingTime = (endTime - startTime) / 1000;
            
            this.hideLoading();
            this.performFraudAnalysis(processingTime);
        }, Math.random() * 2000 + 1000); // 1-3 seconds
    }

    performFraudAnalysis(processingTime) {
        const formData = new FormData(this.form);
        const amount = parseFloat(formData.get('amount'));
        const oldBalanceOrg = parseFloat(formData.get('oldbalanceOrg'));
        const newBalanceOrig = parseFloat(formData.get('newbalanceOrig'));
        const type = formData.get('type');
        
        // Simple fraud detection logic (replace with actual ML model results)
        const riskFactors = [];
        let riskScore = 0;
        
        // Check for suspicious patterns
        if (amount > 100000) {
            riskFactors.push('High transaction amount');
            riskScore += 30;
        }
        
        if (Math.abs((oldBalanceOrg - amount) - newBalanceOrig) > 1000) {
            riskFactors.push('Balance inconsistency detected');
            riskScore += 40;
        }
        
        if (type === 'CASH_OUT' && amount > 50000) {
            riskFactors.push('Large cash withdrawal');
            riskScore += 25;
        }
        
        if (oldBalanceOrg === 0 && amount > 10000) {
            riskFactors.push('New account large transaction');
            riskScore += 35;
        }
        
        // Add random factor for demo
        riskScore += Math.random() * 20;
        
        const isFraudulent = riskScore > 60;
        const confidence = Math.min(95, Math.max(65, 100 - Math.abs(riskScore - 50)));
        
        this.displayResults({
            isFraudulent,
            confidence,
            riskScore,
            riskFactors,
            processingTime,
            amount,
            type
        });
    }

    displayResults(analysis) {
        const { isFraudulent, confidence, riskScore, riskFactors, processingTime, amount, type } = analysis;
        
        // Hide form section and show results
        this.formSection.style.display = 'none';
        this.resultsSection.style.display = 'block';
        
        // Update result icon and message
        const resultIcon = document.getElementById('result-icon');
        const resultMessage = document.getElementById('result-message');
        const resultTitle = document.getElementById('result-title');
        
        if (isFraudulent) {
            resultIcon.className = 'result-icon danger';
            resultIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
            resultTitle.textContent = 'Fraud Alert!';
            resultMessage.innerHTML = `
                <div class="fraud-alert">
                    <h3>⚠️ Suspicious Transaction Detected</h3>
                    <p>This transaction shows multiple risk indicators and requires immediate attention.</p>
                    <div class="risk-factors">
                        <h4>Risk Factors Identified:</h4>
                        <ul>${riskFactors.map(factor => `<li>${factor}</li>`).join('')}</ul>
                    </div>
                </div>
            `;
            
            this.addActivityFeedItem('🚨 Fraud detected', 'High risk transaction blocked');
            this.showNotification('Fraudulent transaction detected!', 'error');
        } else {
            resultIcon.className = 'result-icon safe';
            resultIcon.innerHTML = '<i class="fas fa-check"></i>';
            resultTitle.textContent = 'Transaction Approved';
            resultMessage.innerHTML = `
                <div class="safe-transaction">
                    <h3>✅ Transaction Appears Legitimate</h3>
                    <p>Our AI analysis indicates this transaction is within normal parameters.</p>
                    <div class="transaction-details">
                        <p><strong>Amount:</strong> $${amount.toLocaleString()}</p>
                        <p><strong>Type:</strong> ${type}</p>
                        <p><strong>Risk Level:</strong> Low</p>
                    </div>
                </div>
            `;
            
            this.addActivityFeedItem('✅ Transaction approved', 'Low risk transaction processed');
            this.showNotification('Transaction approved successfully!', 'success');
        }
        
        // Update confidence score
        const confidenceFill = document.getElementById('confidence-fill');
        const confidenceScore = document.getElementById('confidence-score');
        const processingTimeElement = document.getElementById('processing-time');
        
        setTimeout(() => {
            confidenceFill.style.width = `${confidence}%`;
            confidenceScore.textContent = `${confidence}%`;
            processingTimeElement.textContent = `${processingTime.toFixed(2)}s`;
        }, 500);
        
        // Scroll to results
        this.resultsSection.scrollIntoView({ behavior: 'smooth' });
        
        // Create particles effect
        this.createParticleEffect(isFraudulent ? 'danger' : 'safe');
    }

    calculateRiskLevel() {
        const amount = parseFloat(document.getElementById('amount').value) || 0;
        const oldBalance = parseFloat(document.getElementById('oldbalanceOrg').value) || 0;
        const newBalance = parseFloat(document.getElementById('newbalanceOrig').value) || 0;
        const type = document.getElementById('type').value;
        
        let riskLevel = 'Low';
        let riskColor = '#4ecdc4';
        
        if (amount > 50000 || (oldBalance - newBalance) !== amount) {
            riskLevel = 'Medium';
            riskColor = '#ffa500';
        }
        
        if (amount > 100000 || (type === 'CASH_OUT' && amount > 50000)) {
            riskLevel = 'High';
            riskColor = '#ff6b6b';
        }
        
        const riskLevelElement = document.getElementById('risk-level');
        if (riskLevelElement) {
            riskLevelElement.textContent = riskLevel;
            riskLevelElement.style.color = riskColor;
        }
    }

    clearForm() {
        this.form.reset();
        
        // Clear any error states
        const errorGroups = this.form.querySelectorAll('.input-group.error');
        errorGroups.forEach(group => this.clearFieldError(group));
        
        // Reset risk level
        document.getElementById('risk-level').textContent = 'Calculating...';
        document.getElementById('analysis-status').textContent = 'Ready';
        
        this.showNotification('Form cleared successfully', 'info');
        
        // Add clear animation
        this.form.classList.add('form-clear');
        setTimeout(() => this.form.classList.remove('form-clear'), 300);
    }

    resetForNewAnalysis() {
        this.resultsSection.style.display = 'none';
        this.formSection.style.display = 'block';
        this.clearForm();
        
        // Scroll back to form
        this.formSection.scrollIntoView({ behavior: 'smooth' });
    }

    saveReport() {
        const reportData = {
            timestamp: new Date().toISOString(),
            result: document.getElementById('result-message').textContent,
            confidence: document.getElementById('confidence-score').textContent,
            processingTime: document.getElementById('processing-time').textContent
        };
        
        const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fraud-analysis-report-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('Report saved successfully', 'success');
    }

    // Animation and Visual Effects
    animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current);
                    setTimeout(updateCounter, 20);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        });
    }

    createParticleEffect(type) {
        const colors = type === 'safe' ? ['#4ecdc4', '#00d4ff'] : ['#ff6b6b', '#ff4757'];
        const container = document.querySelector('.result-icon');
        
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.background = colors[Math.floor(Math.random() * colors.length)];
                particle.style.left = Math.random() * 80 + 'px';
                particle.style.top = Math.random() * 80 + 'px';
                container.appendChild(particle);
                
                setTimeout(() => particle.remove(), 2000);
            }, i * 100);
        }
    }

    // Activity Feed
    initializeActivityFeed() {
        this.activityFeed = document.getElementById('activity-feed');
        
        // Add initial items
        const initialItems = [
            { icon: '🔒', message: 'System initialized', time: '2 min ago' },
            { icon: '🛡️', message: 'Security protocols active', time: '5 min ago' },
            { icon: '📊', message: 'AI model loaded', time: '10 min ago' }
        ];
        
        initialItems.forEach(item => {
            this.addActivityFeedItem(item.icon + ' ' + item.message, item.time);
        });
        
        // Start periodic updates
        setInterval(() => this.updateActivityFeed(), 30000); // Update every 30 seconds
    }

    addActivityFeedItem(message, time = 'just now') {
        const feedItem = document.createElement('div');
        feedItem.className = 'feed-item';
        feedItem.innerHTML = `
            <i class="fas fa-circle"></i>
            <span class="message">${message}</span>
            <span class="time">${time}</span>
        `;
        
        this.activityFeed.insertBefore(feedItem, this.activityFeed.firstChild);
        
        // Remove old items (keep only 10)
        while (this.activityFeed.children.length > 10) {
            this.activityFeed.removeChild(this.activityFeed.lastChild);
        }
    }

    updateActivityFeed() {
        const activities = [
            '🔍 Scanning network traffic',
            '📡 Monitoring transactions',
            '🤖 AI model self-updating',
            '🔐 Encryption keys rotated',
            '📈 Performance metrics updated'
        ];
        
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        this.addActivityFeedItem(randomActivity);
    }

    // Notification System
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        this.notificationContainer.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    // Advanced Features
    setupFormValidation() {
        // Real-time validation with debouncing
        let validationTimeout;
        
        const inputs = this.form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                clearTimeout(validationTimeout);
                validationTimeout = setTimeout(() => {
                    this.validateField(input);
                }, 300);
            });
        });
    }

    setupRealTimeCalculations() {
        const amountInput = document.getElementById('amount');
        const oldBalanceInput = document.getElementById('oldbalanceOrg');
        const newBalanceInput = document.getElementById('newbalanceOrig');
        
        [amountInput, oldBalanceInput, newBalanceInput].forEach(input => {
            input.addEventListener('input', () => {
                this.updateTransactionSummary();
            });
        });
    }

    updateTransactionSummary() {
        const amount = parseFloat(document.getElementById('amount').value) || 0;
        const oldBalance = parseFloat(document.getElementById('oldbalanceOrg').value) || 0;
        const newBalance = parseFloat(document.getElementById('newbalanceOrig').value) || 0;
        
        // Calculate expected new balance
        const expectedBalance = oldBalance - amount;
        const discrepancy = Math.abs(newBalance - expectedBalance);
        
        // Update analysis status
        const statusElement = document.getElementById('analysis-status');
        if (amount > 0 && oldBalance > 0 && newBalance >= 0) {
            if (discrepancy > 1000) {
                statusElement.textContent = 'Balance discrepancy detected';
                statusElement.style.color = '#ff6b6b';
            } else {
                statusElement.textContent = 'Ready for analysis';
                statusElement.style.color = '#4ecdc4';
            }
        } else {
            statusElement.textContent = 'Incomplete data';
            statusElement.style.color = '#ffa500';
        }
    }

    initializeTooltips() {
        // Add tooltips to form fields
        const tooltips = {
            'amount': 'Enter the transaction amount in USD',
            'oldbalanceOrg': 'Account balance before the transaction',
            'newbalanceOrig': 'Account balance after the transaction',
            'oldbalanceDest': 'Recipient account balance before transaction',
            'newbalanceDest': 'Recipient account balance after transaction',
            'type': 'Select the type of financial transaction'
        };
        
        Object.keys(tooltips).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                field.setAttribute('title', tooltips[fieldName]);
            }
        });
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + Enter to submit form
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            if (this.formSection.style.display !== 'none') {
                this.form.dispatchEvent(new Event('submit'));
            }
        }
        
        // Escape to clear form or go back
        if (e.key === 'Escape') {
            if (this.resultsSection.style.display !== 'none') {
                this.resetForNewAnalysis();
            } else {
                this.clearForm();
            }
        }
    }

    handleResize() {
        // Adjust layout for mobile devices
        const isMobile = window.innerWidth <= 768;
        const activityFeed = document.querySelector('.activity-feed');
        
        if (isMobile && activityFeed) {
            activityFeed.style.position = 'static';
            activityFeed.style.width = '100%';
            activityFeed.style.transform = 'none';
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            // Pause animations when tab is not visible
            document.body.style.animationPlayState = 'paused';
        } else {
            // Resume animations when tab becomes visible
            document.body.style.animationPlayState = 'running';
        }
    }

    startAnimations() {
        // Start floating shapes animation
        const shapes = document.querySelectorAll('.shape');
        shapes.forEach((shape, index) => {
            shape.style.animationDelay = `${index * 2}s`;
        });
        
        // Start scan line animation
        const scanLine = document.querySelector('.scan-line');
        if (scanLine) {
            scanLine.style.animationDelay = '1s';
        }
    }
}

// Initialize the system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FraudDetectionSystem();
});

// Additional utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function generateTransactionId() {
    return 'TXN-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

function getTimeAgo(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hr ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
}

// Service Worker registration for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}