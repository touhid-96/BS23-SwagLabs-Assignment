const LoginPage = require('../pageobjects/login.page')
const ProductsPage = require('../pageobjects/products.page')
const YourCartPage = require('../pageobjects/cart.page')

describe('Regression Test On Swag Labs Mobile App', () => {
    // it('should display locked-out error for locked-out user login attempt', async () => {
    //     await LoginPage.selectLockedOutUser();
    //     await LoginPage.submitLogin();

    //     //assertion
    //     const errorMessage = await LoginPage.validateErrorMessage();
    //     expect(errorMessage).toContain('locked out');
    // });

    it('should successfully log in with valid standard user credentials', async () => {
        await LoginPage.selectStandardUser();
        await LoginPage.submitLogin();

        //assertion
        const loginSuccess = await LoginPage.validateSuccessfulLogin(); // Capture the validation result
        expect(loginSuccess).toBe(true); // Assert the result

    });

    it('should add product to cart and verify button change to remove', async () => {
        await ProductsPage.clickFilterButton();
        await ProductsPage.selectFilterOption();

        //assertion
        const isButtonChanged = await ProductsPage.validateFirstProduct(); // Capture the validation result
        expect(isButtonChanged).toBe(true);
    });

    it('should add to cart product and verify cart badge is changed', async () => {
        // await ProductsPage.validateSecondProduct();

        // Assertion
        const { productTitle, productPrice, cartItemCount } = await ProductsPage.validateSecondProduct();
        expect(productTitle).toEqual("Sauce Labs Bike Light");  // product name
        expect(productPrice).toBeDefined(); // product price
        expect(cartItemCount).toEqual("2"); // cart icon badge (2)
    });

    it('should show the two products previously added', async () => {
        await YourCartPage.clickCartButton();
        await YourCartPage.validateProductsList();

        // Assertion
        const { Cart_FirstProductName, Cart_SecondProductName } = await YourCartPage.validateProductsList();
        expect(Cart_FirstProductName).toEqual(ProductsPage.firstProductTitle);
        expect(Cart_SecondProductName).toEqual(ProductsPage.secondProductTitle);

        console.log(Cart_FirstProductName);
        console.log(ProductsPage.secondProductTitle);
    });

    it('should verify the total product price in cart page', async () => {
        await YourCartPage.clickCheckOutButton();
        await YourCartPage.inputUserData();
        await YourCartPage.clickContinueBtn();

        // Assertion
        const itemTotalActual = await YourCartPage.sumTotalPrice();
        expect(itemTotalActual).toEqual(YourCartPage.totalPriceExpected);
    });

    it('should verify the checkout is complete', async () => {
        await YourCartPage.clickFinishBtn();
    })
});

