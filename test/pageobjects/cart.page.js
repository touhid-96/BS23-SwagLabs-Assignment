const { expect, browser } = require('@wdio/globals');
const fs = require('fs');
const csvParser = require('csv-parser');

class YourCartPage {
    totalPriceExpected = 0;

    get btnFinish() {
        return ('~test-FINISH');
    }

    get btnCart() {
        return $('~test-Cart');
    }

    get btnCheckOut() {
        return $('~test-CHECKOUT');
    }

    get products() {
        return $$('~test-Item');
    }

    get productPrices() {
        return $$('~test-Price');
    }

    get checkoutUserInfo() {
        return $('~test-Checkout: Your Info');
    }

    get firstNameTxtField() {
        return $('~test-First Name');
    }

    get lastNameTxtField() {
        return $('~test-Last Name');
    }

    get zipCodeTxtField() {
        return $('~test-Zip/Postal Code');
    }

    //TtOoUuHhIiDd1692

    get continueBtn() {
        return $('~test-CONTINUE')
    }

    async clickFinishBtn() {
        await this.btnFinish.click();
    }



    async clickCartButton() {
        await this.btnCart.click();
    }

    async clickContinueBtn() {
        await this.continueBtn.click();
    }

    async sumTotalPrice() {
        await browser.waitUntil(async () => {
            const productPriceList = await this.productPrices;
            return productPriceList.length > 0;
        }, {
            timeout: 5000,
            timeoutMsg: 'Products did not load within 5 seconds'
        });

        // const productPriceList = await this.productPrices;
        // for (let price of productPriceList) {
        //     const productPriceGroup = await price.$("//*[@content-desc='test-Price']");
        //     const productPrice = await productPriceGroup.getText();
        //     const productPriceNumValue = productPrice.match(/[\d.]+/g)[0];
        //     this.totalPrice += parseFloat(productPriceNumValue);

        //     console.log("----------------------productPrice: " + productPrice);
        // }

        //scroll down
        await driver.execute("mobile: scroll", {
            strategy: "-android uiautomator",
            selector: 'new UiSelector().textContains("Total:")',
        });

        // const productTaxPath = await $("//android.widget.TextView[contains(@text, 'Tax:')]");
        // const productTaxString = await productTaxPath.getText();
        // const productTaxNumValue = productTaxString.match(/[\d.]+/g)[0];
        // const productTax = parseFloat(productTaxNumValue);

        const itemTotalPath = await $("//android.widget.TextView[contains(@text, 'Item total:')]");
        const itemTotalString = await itemTotalPath.getText();
        const itemTotalNumValue = itemTotalString.match(/[\d.]+/g)[0];
        const itemTotalActual = parseFloat(itemTotalNumValue);

        console.log("---------------------totalPrice : "+ this.totalPriceExpected);
        console.log("---------------------itemTotal : "+ itemTotalActual);
        // console.log("---------------------tax : "+ productTax)

        return itemTotalActual;
    }

    async inputUserData() {
        await browser.waitUntil(async () => {
            return await this.checkoutUserInfo.isDisplayed();
        }, {
            timeout: 5000,
            timeoutMsg: 'Checkout information page did not load within 5 seconds'
        });

        const userData = [];
        await new Promise((resolve, reject) => {
            fs.createReadStream("userData.csv") // Provide the correct path
            .pipe(csvParser())
            .on('data', (row) => userData.push(row))
            .on('end', resolve)
            .on("error", reject);
        });

        await this.firstNameTxtField.setValue(userData[0].FirstName.toString());
        await this.lastNameTxtField.setValue(userData[0].LastName.toString());
        await this.zipCodeTxtField.setValue(userData[0].Zip.toString());
    }

    async clickCheckOutButton() {

        const productPriceList = await $$("//android.widget.TextView[contains(@text, '$')]");
        for (let price of productPriceList) {
            const productPrice = await price.getText();
            const productPriceNumValue = productPrice.match(/[\d.]+/g)[0];
            this.totalPriceExpected += parseFloat(productPriceNumValue);

            console.log("----------------------productPrice: " + productPrice);
        }

        //scroll down
        await driver.execute("mobile: scroll", {
            strategy: "-android uiautomator",
            selector: 'new UiSelector().text("CHECKOUT")',
        });

        await driver.pause(2000);
        await this.btnCheckOut.click();
    }

    async validateProductsList() {
        await browser.waitUntil(async () => {
            const productList = await this.products;
            return productList.length > 0;
        }, {
            timeout: 5000,
            timeoutMsg: 'Products did not load within 5 seconds'
        });

        const expectedProductNames = ["Sauce Labs Fleece Jacket", "Sauce Labs Bike Light"];
        const Cart_ProductNames = [];

        const productList = await this.products;
        let i = 0;
        for (let product of productList) {
            const ProductTitleTxtView = await product.$(`//*[@text='${expectedProductNames[i]}']`);
            const _productName = await ProductTitleTxtView.getText();
            Cart_ProductNames.push(_productName);

            i++;
        }

        // const ProductTitleTxtView1 = await product.$("//*[@text='Sauce Labs Fleece Jacket']");
        // const Cart_FirstProductName = await ProductTitleTxtView1.getText();

        // const ProductTitleTxtView2 = await product.$("//*[@text='Sauce Labs Bike Light']");
        // const Cart_SecondProductName = await ProductTitleTxtView2.getText();

        return {
            Cart_FirstProductName: Cart_ProductNames[0],
            Cart_SecondProductName: Cart_ProductNames[1],
        };
    }
}

module.exports = new YourCartPage();