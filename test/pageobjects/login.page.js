const { expect, driver } = require('@wdio/globals');

class LoginPage {
    get txtStandardUser() { return $('~test-standard_user'); }
    get txtLockedOutUser() { return $('~test-locked_out_user'); }
    get errorMessage() { return $('~test-Error message'); }
    get btnSubmit() { return $('~test-LOGIN'); }

    async selectStandardUser() {
        await driver.execute("mobile: scroll", {    //scroll down
            strategy: "accessibility id",
            selector: "test-standard_user",
        });

        await driver.pause(2000);   //need to pause after the scroll to let the "click" to execute

        await this.txtStandardUser.click();

        await driver.execute("mobile: scroll", {    //scroll up
            strategy: "accessibility id",
            selector: "test-Username",
        });

        await driver.pause(2000);   //to give time to execute "click" login
    }

    async selectLockedOutUser() {
        await driver.execute("mobile: scroll", {    //scroll down
            strategy: "accessibility id",
            selector: "test-locked_out_user",
        });

        await driver.pause(2000);   //need to pause after the scroll to let the "click" to execute

        await this.txtLockedOutUser.click();

        await driver.execute("mobile: scroll", {    //scroll up
            strategy: "accessibility id",
            selector: "test-Username",
        });

        await driver.pause(2000);   //to give time to execute "click" login
    }

    async submitLogin() {
        await browser.waitUntil(async () => {
            return await this.btnSubmit.isEnabled();
        }, {
            timeout: 10000,
            timeoutMsg: 'Login button not enabled after 10 seconds'
        });
        await this.btnSubmit.click();
    }

    async validateErrorMessage() {
        try {
            const viewGroup = await $('~test-Error message');

            await browser.waitUntil(async () => {
                return await viewGroup.isDisplayed();
            }, {
                timeout: 5000,
                timeoutMsg: 'Error message view group not displayed after 10 seconds'
            });

            const textView = await viewGroup.$('android.widget.TextView');
            const message = await textView.getText();
            // expect(message.toLowerCase()).toContain('locked out');

            return message;

        } catch (error) {
            console.error(`Validation failed: ${error.message}`);
            expect(false).toBe(true);
        }
    }

    async validateSuccessfulLogin() {
        try {
            const isDisplayed = await browser.waitUntil(async () => {
                return await $('//android.widget.TextView[@text="PRODUCTS"]').isDisplayed();
            }, {
                timeout: 5000,
                timeoutMsg: 'Products page not loaded after 10 seconds'
            });
    
            // expect(await $('//android.widget.TextView[@text="PRODUCTS"]').isDisplayed()).toBe(true);

            return isDisplayed;
        } catch (error) {
            console.error(`Login validation failed: ${error.message}`);
            expect(false).toBe(true);
        }
    }
    
}

module.exports = new LoginPage();
