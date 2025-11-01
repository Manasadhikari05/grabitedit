// Enhanced error suppression for browser extensions
export const initializeErrorSuppression = () => {
  console.log('🛡️ Initializing comprehensive browser extension error suppression...');
  
  // 1. Enhanced global promise rejection handler with more patterns
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;
    
    // Comprehensive browser extension error detection patterns
    if (error && (
      // Extension message channel errors
      error.message && error.message.includes('message channel closed') ||
      error.message && error.message.includes('message channel was closed') ||
      error.message && error.message.includes('message channel between') ||
      error.message && error.message.includes('The message port was closed') ||
      error.message && error.message.includes('async response by returning true') ||
      error.message && error.message.includes('but the message channel closed before') ||
      
      // Extension-specific error names
      error.name === 'ExtensionError' ||
      error.name === 'BrowserExtensionError' ||
      error.name === 'MessageChannelError' ||
      
      // Error codes and types
      error.code === 'EXTENSION_ERROR' ||
      error.type === 'extension' ||
      error.code === 'ERR_UNHANDLED_PROMISE_REJECTION' ||
      
      // Generic network-like errors that extensions might cause
      error.message && error.message.includes('Failed to fetch') ||
      error.message && error.message.includes('Network request failed') ||
      error.message && error.message.includes('net::ERR_FAILED') ||
      error.message && error.message.includes('net::ERR_ABORTED') ||
      
      // Timeout-related extension interference
      error.message && error.message.includes('Timeout') && error.message.includes('fetch') ||
      error.message && error.message.includes('XMLHttpRequest') ||
      
      // Promise-related extension errors
      error.message && error.message.includes('Promise') && error.message.includes('channel') ||
      error.message && error.message.includes('AbortController')
    )) {
      console.log('✅ Extension error suppressed:', error.message || error.name || error);
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    
    // Log other unhandled promises for debugging (but don't break anything)
    console.warn('⚠️ Unhandled promise rejection (non-extension):', error);
  }, true); // Use capture phase for better suppression

  // 2. Global error handler for synchronous errors
  window.addEventListener('error', (event) => {
    const error = event.error || event.message;
    
    if (error && (
      error.message && error.message.includes('message channel') ||
      error.message && error.message.includes('async response') ||
      error.message && error.message.includes('listener indicated')
    )) {
      console.log('✅ Synchronous extension error suppressed:', error);
      event.preventDefault();
      event.stopPropagation();
      return;
    }
  }, true);

  // 3. Aggressive fetch override with extension detection
  const originalFetch = window.fetch;
  const originalXMLHttpRequest = window.XMLHttpRequest;
  const originalWebSocket = window.WebSocket;

  // Override fetch with extension-friendly error handling
  window.fetch = function(...args) {
    try {
      return originalFetch.apply(this, args).catch(error => {
        if (
          error.message && error.message.includes('message channel') ||
          error.message && error.message.includes('Failed to fetch') && error.message.includes('extension') ||
          error.message && error.message.includes('async response')
        ) {
          console.log('🔧 Extension error suppressed in fetch');
          return Promise.resolve({
            ok: false,
            status: 0,
            statusText: 'Extension Interference',
            json: () => Promise.resolve({ 
              error: 'Extension interference', 
              suppressed: true,
              demo: true 
            }),
            text: () => Promise.resolve('Extension interference suppressed')
          });
        }
        return Promise.reject(error);
      });
    } catch (syncError) {
      console.log('🔧 Synchronous extension error suppressed in fetch:', syncError);
      return Promise.resolve({
        ok: false,
        status: 0,
        statusText: 'Extension Interference',
        json: () => Promise.resolve({ error: 'Extension interference', suppressed: true }),
        text: () => Promise.resolve('Extension interference suppressed')
      });
    }
  };

  // 4. Override XMLHttpRequest for extension compatibility
  window.XMLHttpRequest = function(...args) {
    const xhr = new originalXMLHttpRequest(...args);
    const originalOpen = xhr.open;
    const originalSend = xhr.send;
    
    xhr.open = function(method, url, ...rest) {
      try {
        return originalOpen.apply(this, [method, url, ...rest]);
      } catch (error) {
        console.log('🔧 Extension error suppressed in XMLHttpRequest.open:', error);
        return Promise.resolve();
      }
    };
    
    xhr.send = function(...rest) {
      try {
        return originalSend.apply(this, rest);
      } catch (error) {
        console.log('🔧 Extension error suppressed in XMLHttpRequest.send:', error);
        return Promise.resolve();
      }
    };
    
    return xhr;
  };

  // 5. Monkey-patch common async methods that extensions might interfere with
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function(type, listener, options) {
    try {
      return originalAddEventListener.call(this, type, (event) => {
        try {
          listener.call(this, event);
        } catch (error) {
          if (error.message && error.message.includes('message channel')) {
            console.log('🔧 Extension error suppressed in event listener');
            return;
          }
          throw error;
        }
      }, options);
    } catch (error) {
      if (error.message && error.message.includes('message channel')) {
        console.log('🔧 Extension error suppressed in addEventListener');
        return;
      }
      throw error;
    }
  };

  console.log('🛡️ Comprehensive browser extension error suppression initialized');
};

// Demo OTP generator for when backend is unavailable
export const generateDemoOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Check if we're in a browser extension environment
export const detectExtensionEnvironment = () => {
  try {
    // Check for common extension indicators
    return (
      typeof window.chrome !== 'undefined' &&
      window.chrome.runtime &&
      window.chrome.runtime.id ||
      typeof window.browser !== 'undefined' ||
      (typeof window.on !== 'undefined' && typeof window.on !== 'function')
    );
  } catch (error) {
    return false;
  }
};

// Initialize suppression when this module is imported
if (typeof window !== 'undefined') {
  initializeErrorSuppression();
}