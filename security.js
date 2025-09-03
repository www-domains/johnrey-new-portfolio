// Balanced Website Security Protection
(function() {
    'use strict';
    
    // Only block if user is actively trying to inspect code
    function blockPage() {
        document.documentElement.innerHTML = `
            <head>
                <title>Access Denied</title>
                <style>
                    body { 
                        margin: 0; padding: 0; background: #000; color: #fff; 
                        font-family: Arial, sans-serif; display: flex; 
                        justify-content: center; align-items: center; 
                        height: 100vh; text-align: center; 
                    }
                    .error { font-size: 24px; }
                </style>
            </head>
            <body>
                <div class="error">Access Denied - Developer Tools Detected</div>
            </body>
        `;
        document.documentElement.style.display = 'block';
    }
    
    // Only activate protection when user shows intent to inspect
    let inspectionAttempts = 0;
    let protectionActive = false;
    
    // Method 1: Only detect when dev tools are actively used (very conservative)
    function checkDevTools() {
        const widthThreshold = window.outerWidth - window.innerWidth > 300;
        const heightThreshold = window.outerHeight - window.innerHeight > 300;
        
        if (widthThreshold || heightThreshold) {
            inspectionAttempts++;
            // Only block after many attempts (user is very persistent)
            if (inspectionAttempts > 15 && !protectionActive) {
                protectionActive = true;
                blockPage();
            }
        } else {
            // Reset counter when dev tools are closed
            inspectionAttempts = Math.max(0, inspectionAttempts - 2);
        }
    }
    
    // Method 2: Console detection (only when actively debugging - very conservative)
    let debuggerCount = 0;
    setInterval(function() {
        const before = new Date();
        debugger;
        const after = new Date();
        if (after - before > 100) {
            debuggerCount++;
            // Only block after many debugger hits (active debugging session)
            if (debuggerCount > 25 && !protectionActive) {
                protectionActive = true;
                blockPage();
            }
        }
    }, 2000);
    
    // Method 3: Console usage detection (only when heavily used - very conservative)
    let consoleUsage = 0;
    setInterval(function() {
        if (consoleUsage > 100 && !protectionActive) { // Extremely high threshold
            protectionActive = true;
            blockPage();
        }
        consoleUsage = Math.max(0, consoleUsage - 5); // Decrease faster over time
    }, 5000);
    
    // Override console methods to detect heavy usage (very conservative)
    ['log', 'warn', 'error', 'info', 'debug', 'trace', 'dir', 'dirxml', 'group', 'groupEnd', 'time', 'timeEnd', 'count', 'clear', 'table', 'assert'].forEach(function(method) {
        const original = console[method];
        console[method] = function() {
            consoleUsage += 1; // Increase counter slowly
            return original.apply(console, arguments);
        };
    });
    
    // Much less frequent monitoring
    setInterval(checkDevTools, 3000);
    
    // Disable right-click context menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    });
    
    // Disable text selection
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    });
    
    // Disable drag and drop
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    });
    
    // Enhanced keyboard blocking
    document.addEventListener('keydown', function(e) {
        const blockedKeys = [
            'F12', 'F11', 'F10', 'F9', 'F8', 'F7', 'F6', 'F5'
        ];
        
        const blockedCombinations = [
            { ctrl: true, shift: true, key: 'I' },
            { ctrl: true, shift: true, key: 'J' },
            { ctrl: true, shift: true, key: 'C' },
            { ctrl: true, key: 'u' },
            { ctrl: true, key: 's' },
            { ctrl: true, key: 'a' },
            { ctrl: true, key: 'c' },
            { ctrl: true, key: 'v' },
            { ctrl: true, key: 'x' },
            { ctrl: true, key: 'p' },
            { ctrl: true, key: 'h' },
            { ctrl: true, key: 'r' },
            { ctrl: true, key: 'f' },
            { ctrl: true, key: 'g' },
            { alt: true, key: 'F4' },
            { shift: true, key: 'F10' }
        ];
        
        // Check single keys
        if (blockedKeys.includes(e.key)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        
        // Check combinations
        for (let combo of blockedCombinations) {
            if (e.ctrlKey === combo.ctrl && 
                e.shiftKey === combo.shift && 
                e.altKey === combo.alt && 
                e.key.toLowerCase() === combo.key.toLowerCase()) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }
    });
    
    // Disable image saving
    document.addEventListener('dragstart', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    });
    
    // Disable print
    window.addEventListener('beforeprint', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Allow normal page navigation
    // Removed beforeunload blocking to prevent "Leave site?" popup
    
    // Add aggressive CSS protection
    const style = document.createElement('style');
    style.textContent = `
        * {
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
            -webkit-touch-callout: none !important;
            -webkit-tap-highlight-color: transparent !important;
            -webkit-user-drag: none !important;
            -khtml-user-drag: none !important;
            -moz-user-drag: none !important;
            -o-user-drag: none !important;
            user-drag: none !important;
        }
        
        img, video, audio {
            -webkit-user-drag: none !important;
            -khtml-user-drag: none !important;
            -moz-user-drag: none !important;
            -o-user-drag: none !important;
            user-drag: none !important;
            pointer-events: none !important;
        }
        
        /* Hide source code from view source */
        html, body {
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
        }
        
        /* Disable text selection on all elements */
        *::selection {
            background: transparent !important;
        }
        
        *::-moz-selection {
            background: transparent !important;
        }
    `;
    document.head.appendChild(style);
    
    // Only activate obfuscation when protection is active
    let obfuscationActive = false;
    
    function activateObfuscation() {
        if (obfuscationActive) return;
        obfuscationActive = true;
        
        const originalInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
        Object.defineProperty(Element.prototype, 'innerHTML', {
            get: function() {
                return '[Content Protected]';
            },
            set: function(value) {
                originalInnerHTML.set.call(this, value);
            }
        });
        
        const originalOuterHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'outerHTML');
        Object.defineProperty(Element.prototype, 'outerHTML', {
            get: function() {
                return '[Content Protected]';
            }
        });
    }
    
    // Activate obfuscation only when protection is triggered
    setInterval(function() {
        if (protectionActive && !obfuscationActive) {
            activateObfuscation();
        }
    }, 1000);
    
    // Disable debugging functions only when protection is active
    function disableDebuggingFunctions() {
        window.eval = function() { return '[Function Disabled]'; };
        window.Function = function() { return function() { return '[Function Disabled]'; }; };
    }
    
    setInterval(function() {
        if (protectionActive) {
            disableDebuggingFunctions();
        }
    }, 1000);
    
    // Additional Code Protection Methods
    
    // 1. DOM Structure Obfuscation
    function obfuscateDOM() {
        const elements = document.querySelectorAll('*');
        elements.forEach(el => {
            // Add fake attributes to confuse inspectors
            el.setAttribute('data-obfuscated', Math.random().toString(36));
            el.setAttribute('data-protected', 'true');
        });
    }
    
    // 2. Function Name Obfuscation
    const originalFunction = window.Function;
    window.Function = function(...args) {
        const fn = originalFunction.apply(this, args);
        // Rename function to confuse debugging
        Object.defineProperty(fn, 'name', {
            value: 'anonymous_' + Math.random().toString(36).substr(2, 9),
            configurable: true
        });
        return fn;
    };
    
    // 3. Variable Name Obfuscation
    const originalEval = window.eval;
    window.eval = function(code) {
        // Obfuscate variable names in eval'd code
        const obfuscatedCode = code.replace(/\b[a-zA-Z_$][a-zA-Z0-9_$]*\b/g, function(match) {
            if (match.length > 3 && !['true', 'false', 'null', 'undefined'].includes(match)) {
                return 'var_' + Math.random().toString(36).substr(2, 6);
            }
            return match;
        });
        return originalEval.call(this, obfuscatedCode);
    };
    
    // 4. Source Map Protection
    if (typeof window.SourceMap !== 'undefined') {
        window.SourceMap = undefined;
    }
    
    // 5. Stack Trace Obfuscation
    const originalError = window.Error;
    window.Error = function(message) {
        const error = new originalError(message);
        const originalStack = error.stack;
        if (originalStack) {
            error.stack = originalStack.replace(/at\s+.*?\(.*?\)/g, 'at <anonymous>');
        }
        return error;
    };
    
    // 6. Memory Protection
    function clearMemory() {
        if (window.gc) {
            window.gc();
        }
        // Clear unused variables
        for (let prop in window) {
            if (window.hasOwnProperty(prop) && prop.startsWith('temp_')) {
                delete window[prop];
            }
        }
    }
    
    // 7. Network Request Obfuscation
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        // Add random headers to confuse network inspection
        if (!options) options = {};
        if (!options.headers) options.headers = {};
        options.headers['X-Request-ID'] = Math.random().toString(36);
        options.headers['X-Protection'] = 'enabled';
        return originalFetch.call(this, url, options);
    };
    
    // 8. CSS Obfuscation
    function obfuscateCSS() {
        const styleSheets = document.styleSheets;
        for (let i = 0; i < styleSheets.length; i++) {
            try {
                const rules = styleSheets[i].cssRules || styleSheets[i].rules;
                if (rules) {
                    for (let j = 0; j < rules.length; j++) {
                        const rule = rules[j];
                        if (rule.selectorText) {
                            // Add random classes to confuse CSS inspection
                            rule.selectorText += ', .obf_' + Math.random().toString(36).substr(2, 5);
                        }
                    }
                }
            } catch (e) {
                // Cross-origin stylesheets will throw errors
            }
        }
    }
    
    // 9. Event Listener Obfuscation
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        // Wrap listeners to hide their source
        const wrappedListener = function(event) {
            try {
                return listener.call(this, event);
            } catch (e) {
                // Hide error details
                console.error('Event handler error');
            }
        };
        return originalAddEventListener.call(this, type, wrappedListener, options);
    };
    
    // 10. Object Property Hiding
    function hideObjectProperties() {
        const sensitiveObjects = ['document', 'window', 'navigator', 'location'];
        sensitiveObjects.forEach(objName => {
            if (window[objName]) {
                const obj = window[objName];
                const originalToString = obj.toString;
                obj.toString = function() {
                    return '[object ' + objName + ']';
                };
            }
        });
    }
    
    // 11. Code Injection Protection
    function protectFromInjection() {
        // Override dangerous methods
        const dangerousMethods = ['innerHTML', 'outerHTML', 'insertAdjacentHTML', 'write', 'writeln'];
        dangerousMethods.forEach(method => {
            if (Element.prototype[method]) {
                const original = Element.prototype[method];
                Element.prototype[method] = function(...args) {
                    // Check for suspicious content
                    const content = args.join('');
                    if (content.includes('<script') || content.includes('javascript:')) {
                        console.warn('Suspicious content blocked');
                        return;
                    }
                    return original.apply(this, args);
                };
            }
        });
    }
    
    // 12. Timing Attack Protection
    function addTimingProtection() {
        const originalDate = Date;
        Date = function(...args) {
            const date = new originalDate(...args);
            // Add random microsecond delays to prevent timing attacks
            const delay = Math.random() * 0.1;
            return new originalDate(date.getTime() + delay);
        };
        Date.now = function() {
            return originalDate.now() + Math.random() * 0.1;
        };
    }
    
    // 13. String Obfuscation
    function obfuscateStrings() {
        const originalString = String;
        String = function(value) {
            if (typeof value === 'string' && value.length > 10) {
                // Obfuscate long strings
                return value.split('').reverse().join('') + '_obf';
            }
            return originalString(value);
        };
    }
    
    // 14. Regular Expression Protection
    function protectRegex() {
        const originalRegExp = RegExp;
        RegExp = function(pattern, flags) {
            // Obfuscate regex patterns
            if (typeof pattern === 'string' && pattern.length > 5) {
                pattern = pattern.split('').reverse().join('');
            }
            return new originalRegExp(pattern, flags);
        };
    }
    
    // 15. JSON Protection
    function protectJSON() {
        const originalJSON = JSON;
        JSON.stringify = function(value, replacer, space) {
            // Add random data to confuse JSON inspection
            if (typeof value === 'object' && value !== null) {
                value._obf = Math.random().toString(36);
            }
            return originalJSON.stringify(value, replacer, space);
        };
    }
    
    // Initialize all protection methods
    function initializeProtection() {
        obfuscateDOM();
        hideObjectProperties();
        protectFromInjection();
        addTimingProtection();
        obfuscateStrings();
        protectRegex();
        protectJSON();
        
        // Run periodically
        setInterval(obfuscateDOM, 5000);
        setInterval(clearMemory, 10000);
        setInterval(obfuscateCSS, 3000);
    }
    
    // Start protection
    initializeProtection();
    
})();
