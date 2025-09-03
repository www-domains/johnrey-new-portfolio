// Persistent Music System
(function() {
    'use strict';
    
    // Create audio element
    const audio = new Audio('music/bones.mp3');
    audio.loop = true;
    audio.volume = 0.3;
    audio.preload = 'auto';
    
    let isPlaying = false;
    let currentTime = 0;
    let saveInterval;
    
    // Load state from localStorage and sessionStorage
    function loadState() {
        // Try localStorage first, then sessionStorage
        let savedState = localStorage.getItem('musicState') || sessionStorage.getItem('musicState');
        
        if (savedState) {
            try {
                const state = JSON.parse(savedState);
                const now = Date.now();
                
                // Check if state is recent (within 30 seconds)
                if (state.timestamp && (now - state.timestamp) < 30000) {
                    isPlaying = state.isPlaying;
                    currentTime = state.currentTime || 0;
                    console.log('Loaded music state:', { isPlaying, currentTime });
                    return true;
                }
            } catch (e) {
                console.log('Error loading music state:', e);
            }
        }
        return false;
    }
    
    // Save state to localStorage and sessionStorage
    function saveState() {
        const state = {
            isPlaying: isPlaying,
            currentTime: currentTime,
            timestamp: Date.now()
        };
        
        // Save to both localStorage and sessionStorage for redundancy
        localStorage.setItem('musicState', JSON.stringify(state));
        sessionStorage.setItem('musicState', JSON.stringify(state));
        
        console.log('Saved music state:', state);
    }
    
    // Set audio time
    function setAudioTime(time) {
        if (audio.readyState >= 1) {
            audio.currentTime = time;
            currentTime = time;
            console.log('Set audio time to:', time);
        } else {
            audio.addEventListener('loadedmetadata', function() {
                audio.currentTime = time;
                currentTime = time;
                console.log('Set audio time after metadata load:', time);
            }, { once: true });
        }
    }
    
    // Start playing
    function startPlaying() {
        if (isPlaying && currentTime > 0) {
            console.log('Resuming music from:', currentTime);
            setAudioTime(currentTime);
        } else {
            console.log('Starting music fresh');
        }
        
        audio.play().then(() => {
            isPlaying = true;
            saveState();
            console.log('Music started playing');
        }).catch(error => {
            console.log('Auto-play blocked:', error);
            // Try again on user interaction
            document.addEventListener('click', function() {
                audio.play().then(() => {
                    isPlaying = true;
                    saveState();
                    console.log('Music started after user interaction');
                }).catch(e => console.log('Still blocked:', e));
            }, { once: true });
        });
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Time update - save current position
        audio.addEventListener('timeupdate', function() {
            if (!audio.paused) {
                currentTime = audio.currentTime;
            }
        });
        
        // Play event
        audio.addEventListener('play', function() {
            isPlaying = true;
            saveState();
        });
        
        // Pause event
        audio.addEventListener('pause', function() {
            isPlaying = false;
            saveState();
        });
        
        // Page visibility change
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                audio.pause();
            } else if (isPlaying) {
                audio.play().catch(e => console.log('Resume failed:', e));
            }
        });
        
        // User interaction events
        ['click', 'touchstart', 'keydown'].forEach(event => {
            document.addEventListener(event, function() {
                if (audio.paused && isPlaying) {
                    audio.play().catch(e => console.log('Play failed:', e));
                }
            }, { once: true });
        });
        
        // Save state periodically
        saveInterval = setInterval(saveState, 1000);
        
        // Save state on page unload
        window.addEventListener('beforeunload', saveState);
        window.addEventListener('unload', saveState);
    }
    
    // Initialize
    function init() {
        console.log('Initializing music system...');
        
        // Load previous state
        const hasState = loadState();
        
        // Setup event listeners
        setupEventListeners();
        
        // Start playing
        if (hasState && isPlaying) {
            // Wait for audio to be ready, then resume
            setTimeout(() => {
                setAudioTime(currentTime);
                startPlaying();
            }, 200);
        } else {
            // Start fresh
            setTimeout(startPlaying, 100);
        }
        
        // Additional attempts
        setTimeout(() => {
            if (audio.paused) {
                startPlaying();
            }
        }, 500);
        
        setTimeout(() => {
            if (audio.paused) {
                startPlaying();
            }
        }, 2000);
    }
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Make audio globally accessible for debugging
    window.backgroundMusic = audio;
    
    // Intercept navigation links to save state before navigation
    function interceptNavigation() {
        document.addEventListener('click', function(e) {
            const link = e.target.closest('a[href]');
            if (link && link.href && !link.href.startsWith('http') && !link.href.startsWith('mailto:') && !link.href.startsWith('tel:')) {
                // Save state immediately before navigation
                saveState();
                console.log('Saved state before navigation to:', link.href);
            }
        });
    }
    
    // Setup navigation interception
    interceptNavigation();
    
})();
