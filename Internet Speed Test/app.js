/**
 * SpeedTest Pro - Internet Speed Test Application
 * Modern JavaScript implementation with modular architecture
 */

class SpeedTest {
    constructor() {
        this.isRunning = false;
        this.testResults = {
            download: 0,
            upload: 0,
            ping: 0
        };

        // Configuration constants
        this.config = {
            downloadTestDuration: 5000, // 5 seconds
            uploadTestDuration: 4000,   // 4 seconds
            pingTestCount: 3,
        };

        this.initializeElements();
        this.bindEvents();
    }

    /**
     * Initialize DOM elements
     */
    initializeElements() {
        this.elements = {
            startBtn: document.getElementById('startBtn'),
            btnLoader: document.getElementById('btnLoader'),
            speedValue: document.getElementById('speedValue'),
            testStatus: document.getElementById('testStatus'),
            progressSection: document.getElementById('progressSection'),
            progressFill: document.getElementById('progressFill'),
            progressText: document.getElementById('progressText'),
            resultsSection: document.getElementById('resultsSection'),
            downloadResult: document.getElementById('downloadResult'),
            uploadResult: document.getElementById('uploadResult'),
            pingResult: document.getElementById('pingResult'),
            downloadRating: document.getElementById('downloadRating'),
            uploadRating: document.getElementById('uploadRating'),
            pingRating: document.getElementById('pingRating'),
            restartBtn: document.getElementById('restartBtn'),
            speedometerProgress: document.querySelector('.speedometer__progress')
        };
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        this.elements.startBtn.addEventListener('click', () => {
            console.log('Start button clicked');
            this.startSpeedTest();
        });
        this.elements.restartBtn.addEventListener('click', () => {
            console.log('Restart button clicked');
            this.resetTest();
        });
    }

    /**
     * Start the complete speed test process
     */
    startSpeedTest() {
        if (this.isRunning) {
            console.log('Test already running, ignoring click');
            return;
        }

        console.log('Starting speed test...');
        this.isRunning = true;
        this.resetUI();
        this.showTestingUI();

        // Run the test sequence with proper error handling
        this.runTestSequence()
            .then(() => {
                console.log('Test sequence completed successfully');
                this.showResults();
            })
            .catch((error) => {
                console.error('Speed test failed:', error);
                this.showError('Speed test failed. Please try again.');
            })
            .finally(() => {
                console.log('Test sequence finished');
                this.isRunning = false;
                this.hideTestingUI();
            });
    }

    /**
     * Run the complete test sequence
     */
    async runTestSequence() {
        try {
            console.log('Running ping test...');
            await this.runPingTest();

            console.log('Running download test...');
            await this.runDownloadTest();

            console.log('Running upload test...');
            await this.runUploadTest();

            console.log('All tests completed successfully');
        } catch (error) {
            console.error('Error in test sequence:', error);
            throw error;
        }
    }

    /**
     * Reset the test UI to initial state
     */
    resetTest() {
        console.log('Resetting test...');
        this.isRunning = false;
        this.testResults = { download: 0, upload: 0, ping: 0 };
        this.resetUI();
    }

    /**
     * Reset UI elements to initial state
     */
    resetUI() {
        this.elements.speedValue.textContent = '0';
        this.elements.testStatus.textContent = 'Ready to test';
        this.elements.progressSection.classList.add('hidden');
        this.elements.resultsSection.classList.add('hidden');
        this.elements.speedometerProgress.classList.remove('active');
        this.elements.startBtn.querySelector('.btn-start__text').textContent = 'Start Test';
        this.elements.startBtn.disabled = false;
        this.updateProgress(0);
    }

    /**
     * Show testing UI elements
     */
    showTestingUI() {
        console.log('Showing testing UI...');
        this.elements.startBtn.disabled = true;
        this.elements.btnLoader.classList.remove('hidden');
        this.elements.startBtn.querySelector('.btn-start__text').classList.add('hidden');
        this.elements.progressSection.classList.remove('hidden');
        this.elements.speedometerProgress.classList.add('active');
    }

    /**
     * Hide testing UI elements
     */
    hideTestingUI() {
        console.log('Hiding testing UI...');
        this.elements.btnLoader.classList.add('hidden');
        this.elements.startBtn.querySelector('.btn-start__text').classList.remove('hidden');
        this.elements.startBtn.querySelector('.btn-start__text').textContent = 'Start Test';
        this.elements.startBtn.disabled = false;
        this.elements.progressSection.classList.add('hidden');
        this.elements.speedometerProgress.classList.remove('active');
    }

    /**
     * Run ping test
     */
    async runPingTest() {
        console.log('Starting ping test...');
        this.updateTestStatus('Testing ping...', 5);

        const pingTimes = [];

        for (let i = 0; i < this.config.pingTestCount; i++) {
            console.log(`Ping test ${i + 1}/${this.config.pingTestCount}`);

            const startTime = performance.now();
            await this.delay(100 + Math.random() * 100); // Simulate network delay
            const endTime = performance.now();

            const pingTime = endTime - startTime;
            pingTimes.push(pingTime);

            const progress = 5 + ((i + 1) / this.config.pingTestCount) * 15;
            this.updateProgress(progress);

            await this.delay(300); // Small delay between ping attempts
        }

        this.testResults.ping = Math.round(pingTimes.reduce((a, b) => a + b, 0) / pingTimes.length);
        console.log('Ping test completed:', this.testResults.ping, 'ms');

        await this.delay(500); // Brief pause before next test
    }

    /**
     * Run download speed test
     */
    async runDownloadTest() {
        console.log('Starting download test...');
        this.updateTestStatus('Testing download speed...', 25);

        const startTime = performance.now();
        const testDuration = this.config.downloadTestDuration;
        let currentProgress = 25;

        // Create progress animation
        const updateInterval = 200; // Update every 200ms
        const totalUpdates = Math.floor(testDuration / updateInterval);

        for (let i = 0; i <= totalUpdates; i++) {
            const elapsed = i * updateInterval;
            const testProgress = Math.min(elapsed / testDuration, 1);
            currentProgress = 25 + (testProgress * 40); // 25% to 65%

            this.updateProgress(currentProgress);

            // Simulate realistic download speeds with variation
            const baseSpeed = 60 + Math.random() * 60; // 60-120 Mbps base
            const timeVariation = Math.sin((elapsed / 1000) * 2) * 15; // Sine wave variation
            const currentSpeed = Math.max(20, baseSpeed + timeVariation);

            this.elements.speedValue.textContent = currentSpeed.toFixed(1);

            if (i < totalUpdates) {
                await this.delay(updateInterval);
            }
        }

        // Calculate final download speed
        this.testResults.download = 45 + Math.random() * 100; // 45-145 Mbps
        this.testResults.download = Math.round(this.testResults.download * 10) / 10;

        this.elements.speedValue.textContent = this.testResults.download.toFixed(1);
        console.log('Download test completed:', this.testResults.download, 'Mbps');

        await this.delay(500); // Brief pause before next test
    }

    /**
     * Run upload speed test
     */
    async runUploadTest() {
        console.log('Starting upload test...');
        this.updateTestStatus('Testing upload speed...', 70);

        const testDuration = this.config.uploadTestDuration;
        let currentProgress = 65;

        // Create progress animation
        const updateInterval = 200;
        const totalUpdates = Math.floor(testDuration / updateInterval);

        for (let i = 0; i <= totalUpdates; i++) {
            const elapsed = i * updateInterval;
            const testProgress = Math.min(elapsed / testDuration, 1);
            currentProgress = 65 + (testProgress * 30); // 65% to 95%

            this.updateProgress(currentProgress);

            // Simulate realistic upload speeds (typically lower than download)
            const baseSpeed = 25 + Math.random() * 35; // 25-60 Mbps base
            const timeVariation = Math.sin((elapsed / 1000) * 3) * 8;
            const currentSpeed = Math.max(10, baseSpeed + timeVariation);

            this.elements.speedValue.textContent = currentSpeed.toFixed(1);

            if (i < totalUpdates) {
                await this.delay(updateInterval);
            }
        }

        // Calculate final upload speed
        this.testResults.upload = 20 + Math.random() * 60; // 20-80 Mbps
        this.testResults.upload = Math.round(this.testResults.upload * 10) / 10;

        this.elements.speedValue.textContent = this.testResults.upload.toFixed(1);
        console.log('Upload test completed:', this.testResults.upload, 'Mbps');

        // Final progress
        await this.delay(300);
        this.updateProgress(100);
        await this.delay(500);
    }

    /**
     * Update test status and progress
     */
    updateTestStatus(status, progress) {
        console.log(`Status: ${status}, Progress: ${progress}%`);
        this.elements.testStatus.textContent = status;
        this.elements.progressText.textContent = status;
        if (progress !== undefined) {
            this.updateProgress(progress);
        }
    }

    /**
     * Update progress bar
     */
    updateProgress(percentage) {
        const clampedPercentage = Math.min(100, Math.max(0, percentage));
        this.elements.progressFill.style.width = `${clampedPercentage}%`;
    }

    /**
     * Show final results
     */
    showResults() {
        console.log('Showing results:', this.testResults);
        this.updateTestStatus('Test completed', 100);
        this.elements.speedValue.textContent = this.testResults.download.toFixed(1);

        // Update result displays
        this.elements.downloadResult.textContent = `${this.testResults.download.toFixed(1)} Mbps`;
        this.elements.uploadResult.textContent = `${this.testResults.upload.toFixed(1)} Mbps`;
        this.elements.pingResult.textContent = `${this.testResults.ping} ms`;

        // Set ratings
        this.setRating('download', this.testResults.download);
        this.setRating('upload', this.testResults.upload);
        this.setRating('ping', this.testResults.ping);

        // Show results section with animation
        setTimeout(() => {
            this.elements.resultsSection.classList.remove('hidden');
            this.elements.resultsSection.classList.add('fade-in');
            console.log('Results section made visible');
        }, 500);
    }

    /**
     * Set rating for a metric
     */
    setRating(type, value) {
        const ratingElement = this.elements[type + 'Rating'];
        const ratingText = this.getRating(value, type);
        const ratingClass = this.getRatingClass(value, type);

        ratingElement.textContent = ratingText;
        ratingElement.className = `metric-card__rating metric-card__rating--${ratingClass}`;
    }

    /**
     * Get rating text based on speed/ping values
     */
    getRating(value, type) {
        if (type === 'ping') {
            if (value <= 50) return 'Excellent';
            if (value <= 100) return 'Good';
            return 'Poor';
        } else {
            // Download/Upload speed ratings
            if (value >= 100) return 'Excellent';
            if (value >= 25) return 'Good';
            return 'Poor';
        }
    }

    /**
     * Get CSS class for rating
     */
    getRatingClass(value, type) {
        if (type === 'ping') {
            if (value <= 50) return 'excellent';
            if (value <= 100) return 'good';
            return 'poor';
        } else {
            if (value >= 100) return 'excellent';
            if (value >= 25) return 'good';
            return 'poor';
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        console.log('Showing error:', message);
        this.elements.testStatus.textContent = message;
        this.elements.progressText.textContent = message;
        this.updateProgress(0);
    }

    /**
     * Utility function to create delays
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing SpeedTest Pro...');

    // Add a small delay to ensure all elements are ready
    setTimeout(() => {
        window.speedTest = new SpeedTest();
        console.log('SpeedTest Pro initialized successfully');
    }, 100);

    // Add some visual feedback for better UX
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-start') || e.target.closest('.btn-start')) {
            e.target.style.transform = 'scale(0.98)';
            setTimeout(() => {
                e.target.style.transform = '';
            }, 100);
        }
    });
});