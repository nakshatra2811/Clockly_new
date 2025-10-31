// Global State
let currentTheme = 'light';
let stopwatchInterval = null;
let stopwatchTime = 0;
let stopwatchRunning = false;
let lapCounter = 0;
let timerInterval = null;
let timerTime = 0;
let timerRunning = false;
let audioContext = null;
let oscillator = null;
let gainNode = null;
let newsletterEmails = [];
let contactMessages = [];

// Timezone Data - Expanded with 40+ cities worldwide
const timezones = [
    // ASIA
    { city: 'Delhi', country: 'India', timezone: 'IST', offset: '+05:30', flag: '🇮🇳' },
    { city: 'Mumbai', country: 'India', timezone: 'IST', offset: '+05:30', flag: '🇮🇳' },
    { city: 'Tokyo', country: 'Japan', timezone: 'JST', offset: '+09:00', flag: '🇯🇵' },
    { city: 'Seoul', country: 'South Korea', timezone: 'KST', offset: '+09:00', flag: '🇰🇷' },
    { city: 'Bangkok', country: 'Thailand', timezone: 'ICT', offset: '+07:00', flag: '🇹🇭' },
    { city: 'Hong Kong', country: 'Hong Kong', timezone: 'HKT', offset: '+08:00', flag: '🇭🇰' },
    { city: 'Singapore', country: 'Singapore', timezone: 'SGT', offset: '+08:00', flag: '🇸🇬' },
    { city: 'Manila', country: 'Philippines', timezone: 'PHT', offset: '+08:00', flag: '🇵🇭' },
    { city: 'Jakarta', country: 'Indonesia', timezone: 'WIB', offset: '+07:00', flag: '🇮🇩' },
    { city: 'Kuala Lumpur', country: 'Malaysia', timezone: 'MYT', offset: '+08:00', flag: '🇲🇾' },
    { city: 'Karachi', country: 'Pakistan', timezone: 'PKT', offset: '+05:00', flag: '🇵🇰' },
    { city: 'Istanbul', country: 'Turkey', timezone: 'EET', offset: '+03:00', flag: '🇹🇷' },
    { city: 'Dubai', country: 'UAE', timezone: 'GST', offset: '+04:00', flag: '🇦🇪' },
    
    // EUROPE
    { city: 'London', country: 'UK', timezone: 'GMT', offset: '+00:00', flag: '🇬🇧' },
    { city: 'Paris', country: 'France', timezone: 'CET', offset: '+01:00', flag: '🇫🇷' },
    { city: 'Berlin', country: 'Germany', timezone: 'CET', offset: '+01:00', flag: '🇩🇪' },
    { city: 'Rome', country: 'Italy', timezone: 'CET', offset: '+01:00', flag: '🇮🇹' },
    { city: 'Madrid', country: 'Spain', timezone: 'CET', offset: '+01:00', flag: '🇪🇸' },
    { city: 'Amsterdam', country: 'Netherlands', timezone: 'CET', offset: '+01:00', flag: '🇳🇱' },
    { city: 'Moscow', country: 'Russia', timezone: 'MSK', offset: '+03:00', flag: '🇷🇺' },
    { city: 'Athens', country: 'Greece', timezone: 'EET', offset: '+02:00', flag: '🇬🇷' },
    
    // AFRICA
    { city: 'Cairo', country: 'Egypt', timezone: 'EET', offset: '+02:00', flag: '🇪🇬' },
    { city: 'Lagos', country: 'Nigeria', timezone: 'WAT', offset: '+01:00', flag: '🇳🇬' },
    { city: 'Johannesburg', country: 'South Africa', timezone: 'SAST', offset: '+02:00', flag: '🇿🇦' },
    { city: 'Nairobi', country: 'Kenya', timezone: 'EAT', offset: '+03:00', flag: '🇰🇪' },
    { city: 'Casablanca', country: 'Morocco', timezone: 'WET', offset: '+00:00', flag: '🇲🇦' },
    
    // NORTH AMERICA
    { city: 'New York', country: 'USA', timezone: 'EST', offset: '-05:00', flag: '🇺🇸' },
    { city: 'Miami', country: 'USA', timezone: 'EST', offset: '-05:00', flag: '🇺🇸' },
    { city: 'Chicago', country: 'USA', timezone: 'CST', offset: '-06:00', flag: '🇺🇸' },
    { city: 'Denver', country: 'USA', timezone: 'MST', offset: '-07:00', flag: '🇺🇸' },
    { city: 'Los Angeles', country: 'USA', timezone: 'PST', offset: '-08:00', flag: '🇺🇸' },
    { city: 'Toronto', country: 'Canada', timezone: 'EST', offset: '-05:00', flag: '🇨🇦' },
    { city: 'Vancouver', country: 'Canada', timezone: 'PST', offset: '-08:00', flag: '🇨🇦' },
    { city: 'Mexico City', country: 'Mexico', timezone: 'CST', offset: '-06:00', flag: '🇲🇽' },
    
    // SOUTH AMERICA
    { city: 'São Paulo', country: 'Brazil', timezone: 'BRT', offset: '-03:00', flag: '🇧🇷' },
    { city: 'Buenos Aires', country: 'Argentina', timezone: 'ART', offset: '-03:00', flag: '🇦🇷' },
    { city: 'Santiago', country: 'Chile', timezone: 'CLT', offset: '-03:00', flag: '🇨🇱' },
    { city: 'Bogotá', country: 'Colombia', timezone: 'COT', offset: '-05:00', flag: '🇨🇴' },
    
    // OCEANIA
    { city: 'Sydney', country: 'Australia', timezone: 'AEDT', offset: '+11:00', flag: '🇦🇺' },
    { city: 'Auckland', country: 'New Zealand', timezone: 'NZDT', offset: '+13:00', flag: '🇳🇿' },
    { city: 'Suva', country: 'Fiji', timezone: 'FJT', offset: '+12:00', flag: '🇫🇯' },
    { city: 'Honolulu', country: 'USA', timezone: 'HST', offset: '-10:00', flag: '🇺🇸' }
];

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Initialize theme
    const savedTheme = currentTheme; // Default to light
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('themeToggle').innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Initialize clocks
    renderClocks();
    startClockUpdates();
    
    // Navigation
    setupNavigation();
    
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Stopwatch controls
    document.getElementById('stopwatchStart').addEventListener('click', startStopwatch);
    document.getElementById('stopwatchPause').addEventListener('click', pauseStopwatch);
    document.getElementById('stopwatchLap').addEventListener('click', addLap);
    document.getElementById('stopwatchReset').addEventListener('click', resetStopwatch);
    
    // Timer controls
    document.getElementById('timerStart').addEventListener('click', startTimer);
    document.getElementById('timerPause').addEventListener('click', pauseTimer);
    document.getElementById('timerCancel').addEventListener('click', cancelTimer);
    
    // Timer input controls
    setupTimerInputs();
    
    // Modal close
    document.getElementById('closeModal').addEventListener('click', closeTimerModal);
    
    // Newsletter popup - show after 30 seconds
    setTimeout(() => {
        showNewsletterPopup();
    }, 100000);
    
    // Newsletter forms
    document.getElementById('popupNewsletterForm').addEventListener('submit', handleNewsletterSignup);
    document.getElementById('sidebarNewsletterForm').addEventListener('submit', handleNewsletterSignup);
    document.getElementById('footerNewsletterForm').addEventListener('submit', handleNewsletterSignup);
    document.getElementById('closeNewsletter').addEventListener('click', closeNewsletterPopup);
    
    // Contact form
    document.getElementById('contactForm').addEventListener('submit', handleContactForm);
}

// Theme Toggle
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('themeToggle');
    
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        themeIcon.innerHTML = '<i class="fas fa-moon"></i>';
        currentTheme = 'light';
    } else {
        body.classList.add('dark-mode');
        themeIcon.innerHTML = '<i class="fas fa-sun"></i>';
        currentTheme = 'dark';
    }
}

// Navigation
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const page = btn.dataset.page;
            switchPage(page);
        });
    });
}

function switchPage(page) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.classList.remove('active'));
    
    const targetPage = document.getElementById(`${page}Page`);
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Update nav buttons
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            if (btn.dataset.page === page) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// World Clocks
function renderClocks() {
    const grid = document.getElementById('clocksGrid');
    grid.innerHTML = '';
    
    timezones.forEach(tz => {
        const card = document.createElement('div');
        card.className = 'clock-card';
        card.innerHTML = `
            <div class="city-name">${tz.city}</div>
            <div class="country-name">${tz.country}</div>
            <div class="time-display" id="clock-${tz.city.replace(/\s+/g, '')}">--:--:--</div>
            <div class="timezone-info">
                <span>${tz.timezone}</span>
                <span>UTC ${tz.offset}</span>
            </div>
        `;
        grid.appendChild(card);
    });
}

function startClockUpdates() {
    updateClocks();
    setInterval(updateClocks, 1000);
}

function updateClocks() {
    const now = new Date();
    
    timezones.forEach(tz => {
        const offset = parseOffset(tz.offset);
        const localTime = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + (offset * 60000));
        
        const hours = String(localTime.getHours()).padStart(2, '0');
        const minutes = String(localTime.getMinutes()).padStart(2, '0');
        const seconds = String(localTime.getSeconds()).padStart(2, '0');
        
        const timeString = `${hours}:${minutes}:${seconds}`;
        const element = document.getElementById(`clock-${tz.city.replace(/\s+/g, '')}`);
        if (element) {
            element.textContent = timeString;
        }
    });
}

function parseOffset(offset) {
    const sign = offset[0] === '+' ? 1 : -1;
    const parts = offset.substring(1).split(':');
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1] || 0);
    return sign * (hours * 60 + minutes);
}

// Stopwatch
function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);
    
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(ms).padStart(2, '0')}`;
}

function updateStopwatchDisplay() {
    document.getElementById('stopwatchDisplay').textContent = formatTime(stopwatchTime);
}

function startStopwatch() {
    if (!stopwatchRunning) {
        stopwatchRunning = true;
        const startTime = Date.now() - stopwatchTime;
        
        stopwatchInterval = setInterval(() => {
            stopwatchTime = Date.now() - startTime;
            updateStopwatchDisplay();
        }, 10);
        
        document.getElementById('stopwatchStart').disabled = true;
        document.getElementById('stopwatchPause').disabled = false;
        document.getElementById('stopwatchLap').disabled = false;
    }
}

function pauseStopwatch() {
    if (stopwatchRunning) {
        stopwatchRunning = false;
        clearInterval(stopwatchInterval);
        
        document.getElementById('stopwatchStart').disabled = false;
        document.getElementById('stopwatchPause').disabled = true;
        document.getElementById('stopwatchLap').disabled = true;
        
        // Change start button to resume
        document.getElementById('stopwatchStart').innerHTML = '<i class="fas fa-play"></i> Resume';
    }
}

function resetStopwatch() {
    stopwatchRunning = false;
    clearInterval(stopwatchInterval);
    stopwatchTime = 0;
    lapCounter = 0;
    
    updateStopwatchDisplay();
    
    document.getElementById('stopwatchStart').disabled = false;
    document.getElementById('stopwatchPause').disabled = true;
    document.getElementById('stopwatchLap').disabled = true;
    document.getElementById('stopwatchStart').innerHTML = '<i class="fas fa-play"></i> Start';
    
    // Clear laps
    document.getElementById('lapsList').innerHTML = '<p class="no-laps">No laps recorded yet</p>';
}

function addLap() {
    if (stopwatchRunning) {
        lapCounter++;
        const lapsList = document.getElementById('lapsList');
        
        if (lapCounter === 1) {
            lapsList.innerHTML = '';
        }
        
        const lapItem = document.createElement('div');
        lapItem.className = 'lap-item';
        lapItem.innerHTML = `
            <span class="lap-number">Lap ${lapCounter}</span>
            <span class="lap-time">${formatTime(stopwatchTime)}</span>
        `;
        
        lapsList.insertBefore(lapItem, lapsList.firstChild);
    }
}

// Timer
function setupTimerInputs() {
    const inputBtns = document.querySelectorAll('.input-btn');
    
    inputBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            const unit = btn.dataset.unit;
            const input = document.getElementById(`${unit}Input`);
            let value = parseInt(input.value) || 0;
            
            if (action === 'inc') {
                value++;
            } else if (action === 'dec') {
                value--;
            }
            
            // Enforce limits
            const max = parseInt(input.max);
            const min = parseInt(input.min);
            value = Math.max(min, Math.min(max, value));
            
            input.value = value;
        });
    });
}

function formatTimerDisplay(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function updateTimerDisplay() {
    const display = document.getElementById('timerDisplay');
    display.textContent = formatTimerDisplay(timerTime);
    
    // Visual feedback for low time
    if (timerTime <= 10 && timerTime > 0) {
        display.classList.add('critical');
    } else if (timerTime <= 30) {
        display.classList.add('warning');
        display.classList.remove('critical');
    } else {
        display.classList.remove('warning', 'critical');
    }
}

function startTimer() {
    const hours = parseInt(document.getElementById('hoursInput').value) || 0;
    const minutes = parseInt(document.getElementById('minutesInput').value) || 0;
    const seconds = parseInt(document.getElementById('secondsInput').value) || 0;
    
    timerTime = hours * 3600 + minutes * 60 + seconds;
    
    if (timerTime > 0 && !timerRunning) {
        timerRunning = true;
        
        // Hide inputs, show only display
        document.getElementById('timerInputs').style.display = 'none';
        
        updateTimerDisplay();
        
        timerInterval = setInterval(() => {
            timerTime--;
            updateTimerDisplay();
            
            if (timerTime <= 0) {
                timerComplete();
            }
        }, 1000);
        
        document.getElementById('timerStart').disabled = true;
        document.getElementById('timerPause').disabled = false;
        document.getElementById('timerCancel').disabled = false;
    }
}

function pauseTimer() {
    if (timerRunning) {
        timerRunning = false;
        clearInterval(timerInterval);
        
        document.getElementById('timerStart').disabled = false;
        document.getElementById('timerPause').disabled = true;
        
        // Change start button to resume
        document.getElementById('timerStart').innerHTML = '<i class="fas fa-play"></i> Resume';
    }
}

function cancelTimer() {
    timerRunning = false;
    clearInterval(timerInterval);
    timerTime = 0;
    
    updateTimerDisplay();
    
    document.getElementById('timerInputs').style.display = 'flex';
    document.getElementById('timerStart').disabled = false;
    document.getElementById('timerPause').disabled = true;
    document.getElementById('timerCancel').disabled = true;
    document.getElementById('timerStart').innerHTML = '<i class="fas fa-play"></i> Start';
    
    const display = document.getElementById('timerDisplay');
    display.classList.remove('warning', 'critical');
}

function timerComplete() {
    clearInterval(timerInterval);
    timerRunning = false;
    timerTime = 0;
    
    // Play alarm sound
    playAlarmSound();
    
    // Show modal
    const modal = document.getElementById('timerModal');
    const completionTime = document.getElementById('completionTime');
    const now = new Date();
    completionTime.textContent = `Completed at: ${now.toLocaleTimeString()}`;
    
    modal.classList.add('active');
}

function closeTimerModal() {
    const modal = document.getElementById('timerModal');
    modal.classList.remove('active');
    
    // Stop alarm sound
    stopAlarmSound();
    
    // Reset timer
    cancelTimer();
}

// Audio for Timer
function playAlarmSound() {
    // Create audio context if not exists
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // Create oscillator for beep sound
    oscillator = audioContext.createOscillator();
    gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Configure sound - alternating tones for alarm effect
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    
    // Volume
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    
    // Start the sound
    oscillator.start();
    
    // Create pulsing effect
    let toggle = true;
    const pulseInterval = setInterval(() => {
        if (oscillator && audioContext) {
            oscillator.frequency.setValueAtTime(
                toggle ? 800 : 600,
                audioContext.currentTime
            );
            toggle = !toggle;
        } else {
            clearInterval(pulseInterval);
        }
    }, 500);
    
    // Store interval for cleanup
    oscillator.pulseInterval = pulseInterval;
}

function stopAlarmSound() {
    if (oscillator) {
        // Clear pulse interval
        if (oscillator.pulseInterval) {
            clearInterval(oscillator.pulseInterval);
        }
        
        // Fade out
        if (gainNode) {
            gainNode.gain.exponentialRampToValueAtTime(
                0.01,
                audioContext.currentTime + 0.5
            );
        }
        
        // Stop after fade
        setTimeout(() => {
            if (oscillator) {
                oscillator.stop();
                oscillator.disconnect();
                oscillator = null;
            }
            if (gainNode) {
                gainNode.disconnect();
                gainNode = null;
            }
        }, 500);
    }
}

// Newsletter Popup
function showNewsletterPopup() {
    const popup = document.getElementById('newsletterPopup');
    // Only show if not already subscribed (check if we have shown it)
    if (!popup.classList.contains('shown')) {
        popup.classList.add('active');
        popup.classList.add('shown');
    }
}
document.getElementById('closeNewsletter').addEventListener('click', () => {
  document.getElementById('newsletterPopup').classList.remove('active');
});

function closeNewsletterPopup() {
    const popup = document.getElementById('newsletterPopup');
    popup.classList.remove('active');
}

// Newsletter Signup Handler
function handleNewsletterSignup(e) {
    e.preventDefault();
    
    const form = e.target;
    const emailInput = form.querySelector('input[type="email"]');
    const email = emailInput.value.trim();
    
    if (email) {
        // Store email in memory
        newsletterEmails.push({
            email: email,
            timestamp: new Date().toISOString(),
            source: form.id || 'unknown'
        });
        
        // Show success message
        alert('\u2705 Successfully subscribed!\n\nThank you for subscribing to our newsletter. You\'ll receive time management tips and updates in your inbox.');
        
        // Reset form
        emailInput.value = '';
        
        // Close popup if it was the popup form
        if (form.id === 'popupNewsletterForm') {
            closeNewsletterPopup();
        }
        
        console.log('Newsletter subscribers:', newsletterEmails);
    }
}

// Contact Form Handler
function handleContactForm(e) {
    e.preventDefault();
    
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const subject = document.getElementById('contactSubject').value.trim();
    const message = document.getElementById('contactMessage').value.trim();
    
    if (name && email && subject && message) {
        // Store message in memory
        contactMessages.push({
            name: name,
            email: email,
            subject: subject,
            message: message,
            timestamp: new Date().toISOString()
        });
        
        // Hide form and show success message
        document.getElementById('contactForm').style.display = 'none';
        document.getElementById('contactSuccess').style.display = 'block';
        
        console.log('Contact messages:', contactMessages);
        
        // Reset form after 5 seconds
        setTimeout(() => {
            document.getElementById('contactForm').style.display = 'flex';
            document.getElementById('contactSuccess').style.display = 'none';
            document.getElementById('contactForm').reset();
        }, 5000);
    }
}