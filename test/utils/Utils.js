class Utils {
    static async scrollToElement(locator) {
        try {
            await locator.waitForDisplayed({ timeout: 10000 });
            const elementLocation = await locator.getLocation();
            const elementSize = await locator.getSize();
            const windowSize = await browser.getWindowSize();
            const viewportHeight = windowSize.height;

            if (elementLocation.y + elementSize.height > viewportHeight || elementLocation.y < 0) {
                const screenHeight = await browser.getWindowSize();
                const startX = screenHeight.width / 2;
                let startY = screenHeight.height * 0.8;
                const endY = screenHeight.height * 0.2;

                let isElementVisible = false;
                while (!isElementVisible) {
                    await browser.touchAction([
                        { action: 'press', x: startX, y: startY },
                        { action: 'wait', ms: 800 },
                        { action: 'moveTo', x: startX, y: endY },
                        { action: 'release' }
                    ]);

                    startY = endY;
                    const updatedLocation = await locator.getLocation();
                    isElementVisible = updatedLocation.y >= 0 && updatedLocation.y + elementSize.height <= viewportHeight;
                }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error(`Error occurred while scrolling to find element: '${errorMessage}'`);
            throw error;
        }
    }
}

module.exports = Utils;
