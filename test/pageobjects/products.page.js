const { expect, browser } = require('@wdio/globals');

class ProductsPage {
    //totalPrice = 0;
    firstProductTitle = "";
    secondProductTitle = "";

    get btnFilter() {
        return $('~test-Modal Selector Button');
    }

    get btnCart() {
        return $('~test-Cart');
    }

    getFilterOption(filterOptionText) {
        return $(`//android.widget.TextView[@text='${filterOptionText}']`);
    }

    async clickFilterButton() {
        await this.btnFilter.click();
    }

    async selectFilterOption() {
        const filterOptionText = "Price (low to high)";
        const filterOption = await this.getFilterOption(filterOptionText);
        await browser.waitUntil(async () => await filterOption.isDisplayed(), {
            timeout: 5000,
            timeoutMsg: `${filterOptionText} option not displayed after 10 seconds`
        });
        await filterOption.click();
    }

    get products() {
        return $$('~test-Item');
    }

    async validateFirstProduct() {

        //scroll down
        await driver.execute("mobile: scroll", {
            strategy: "-android uiautomator",
            selector: 'new UiSelector().text("Sauce Labs Fleece Jacket")',
        });
    
        await driver.pause(2000);   //to give time to execute "click"

        await browser.waitUntil(async () => {
            const productList = await this.products;
            return productList.length > 0;
        }, {
            timeout: 5000,
            timeoutMsg: 'Products did not load within 5 seconds'
        });

        const expectedProductName = "Sauce Labs Fleece Jacket";
        let productFound = 0;

        const productList = await this.products;

        for (let product of productList) {
            if (productFound == 1) {
                break;
            }

            const productTitleGroup = await product.$("//*[@content-desc='test-Item title']");
            const productTitle = await productTitleGroup.getText();

            const productPriceGroup = await product.$("//*[@content-desc='test-Price']");
            const productPrice = await productPriceGroup.getText();
            //this.totalPrice += parseFloat(productPrice);

            if (productTitle === expectedProductName) {
                productFound += 1;
                this.firstProductTitle = productTitle;  //storing the 1st product name
                const productAddToCartGroup = await $$("//*[@text='ADD TO CART']");
                
                await productAddToCartGroup[3].waitForDisplayed({ timeout: 5000 });
                await productAddToCartGroup[3].click();
    
                const productRemoveGroup = await $("//android.widget.TextView[@text='REMOVE']");
                await productRemoveGroup.waitForDisplayed({ timeout: 5000 });
                const productRemoveButtonText = await productRemoveGroup.getText();

                return productRemoveButtonText.toLowerCase() === 'remove';
            }
        }
    }

    async validateSecondProduct() {
        //scroll up
        await driver.execute("mobile: scroll", {    //scroll up
            strategy: "-android uiautomator",
            selector: 'new UiSelector().text("Sauce Labs Bike Light")'
        });
    
        await driver.pause(2000);

        await browser.waitUntil(async () => {
            const productList = await this.products;
            return productList.length > 0;
        }, {
            timeout: 5000,
            timeoutMsg: 'Products did not load within 5 seconds'
        });

        const expectedProductName = "Sauce Labs Bike Light";
        let productFound = 0;

        const productList = await this.products;

        for (let product of productList) {
            if (productFound == 1) {
                break;
            }

            const productTitleGroup = await product.$("//*[@content-desc='test-Item title']");
            const productTitle = await productTitleGroup.getText();

            const productPriceGroup = await product.$("//*[@content-desc='test-Price']");
            const productPrice = await productPriceGroup.getText();

            if (productTitle === expectedProductName) {
                productFound += 1;
                this.secondProductTitle = productTitle;  //storing the 2nd product name
                await productTitleGroup.click();
                await productTitleGroup.waitForDisplayed({ timeout: 5000, reverse: true });

                const productNameGroup = await $(`//android.widget.TextView[@text='${productTitle}']`);
                await productNameGroup.waitForDisplayed({ timeout: 5000 });
                const productNameGroupText = await productNameGroup.getText();
                // expect(productNameGroupText).toContain(productTitle);

                const productPriceGroup = await $(`//android.widget.TextView[@text='${productPrice}']`);
                await productPriceGroup.waitForDisplayed({ timeout: 5000 });
                const productPriceGroupText = await productPriceGroup.getText();
                // expect(productPriceGroupText).toContain(productPrice);

    
                const productAddToCartGroup = await $("//*[@text='ADD TO CART']");
                await driver.execute("mobile: scroll", {    //scroll down
                    strategy: "-android uiautomator",
                    selector: 'new UiSelector().text("ADD TO CART")'
                });
                await driver.pause(2000);
                await productAddToCartGroup.waitForDisplayed({ timeout: 5000 });
                await productAddToCartGroup.click();

                await driver.execute("mobile: scroll", {    //scroll up
                    strategy: "-android uiautomator",
                    selector: 'new UiSelector().text("Sauce Labs Bike Light")'
                });
                await driver.pause(2000);

                const cartItemCountGroup = await $("//*[@text='2']");
                await productNameGroup.waitForDisplayed({ timeout: 5000 });
                const cartItemCount = await cartItemCountGroup.getText();
                // expect(cartItemCount).toEqual("2");

                //this.totalPrice += parseFloat(productPriceGroupText);

                //await this.btnCart.click();

                // return { name: productTitle, price: productPrice};
                return {
                    productTitle,
                    productPrice,
                    cartItemCount,
                };
            }
        }
    }
}

module.exports = new ProductsPage();
