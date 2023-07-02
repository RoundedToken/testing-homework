describe('Корзина > ', () => {
    const bug = `?bug_id=${process.env.BUG_ID | 0}`;

    it('Проверка номера заказа', async ({ browser }) => {
        //ПОДГОТОВКА
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();
        page.setDefaultTimeout(500);
        await page.setViewport({ width: 1440, height: 5000 });

        const addToCartSelector = '.ProductDetails-AddToCart';
        const nameInputSelector = '.Form-Field_type_name';
        const phoneInputSelector = '.Form-Field_type_phone';
        const addressInputSelector = '.Form-Field_type_address';
        const checkoutButtonSelector = '.Form-Submit';
        const orderNumberSelector = '.Cart-Number';
        const cartSuccessContainerSelector = '.Cart-SuccessMessage';
        const cartSuccessPSelector = '.Cart-SuccessMessage > p:nth-child(2)';

        //ДЕЙСТВИЯ
        await page.evaluateOnNewDocument(() =>
            localStorage.setItem(
                'example-store-cart',
                '{"0":{"name":"testName0","price":77,"count":1},"1":{"name":"testName","count":1,"price":88}}'
            )
        );

        await page.goto(`http://localhost:3000/hw/store/cart${bug}`);
        await page.waitForSelector(nameInputSelector);

        await page.type(nameInputSelector, 'testName');
        await page.type(phoneInputSelector, '1234567890');
        await page.type(addressInputSelector, 'testAddress');
        await page.click(checkoutButtonSelector);

        const orderNumber = await browser.$(orderNumberSelector).getText();

        //ОЖИДАНИЯ
        expect(Number(orderNumber) < 1000000).toBeTruthy();
    });

    it('Оформления заказа', async ({ browser }) => {
        //ПОДГОТОВКА
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();
        page.setDefaultTimeout(500);
        await page.setViewport({ width: 1440, height: 5000 });

        const addToCartSelector = '.ProductDetails-AddToCart';
        const nameInputSelector = '.Form-Field_type_name';
        const phoneInputSelector = '.Form-Field_type_phone';
        const addressInputSelector = '.Form-Field_type_address';
        const checkoutButtonSelector = '.Form-Submit';
        const orderNumberSelector = '.Cart-Number';
        const cartSuccessContainerSelector = '.Cart-SuccessMessage';
        const cartSuccessPSelector = '.Cart-SuccessMessage > p:nth-child(2)';

        //ДЕЙСТВИЯ
        await page.evaluateOnNewDocument(() =>
            localStorage.setItem(
                'example-store-cart',
                '{"0":{"name":"testName0","price":77,"count":1},"1":{"name":"testName","count":1,"price":88}}'
            )
        );

        await page.goto(`http://localhost:3000/hw/store/cart${bug}`);
        await page.waitForSelector(nameInputSelector);

        await page.type(nameInputSelector, 'testName');
        await page.type(phoneInputSelector, '1234567890');
        await page.type(addressInputSelector, 'testAddress');
        await page.click(checkoutButtonSelector);

        const orderNumber = await browser.$(orderNumberSelector).getText();

        //ОЖИДАНИЯ
        await browser.assertView('successImg', cartSuccessContainerSelector, {
            ignoreElements: [cartSuccessPSelector],
        });
    });

    it('Отображение корзины при перезагрузке страницы', async ({ browser }) => {
        //ПОДГОТОВКА
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();
        await page.setViewport({ width: 1440, height: 5000 });
        page.setDefaultTimeout(500);

        const cartTableSelector = '.Cart-Table';
        const addToCartSelector = '.ProductDetails-AddToCart';
        const clearCartSelector = '.Cart-Clear';

        //ДЕЙСТВИЯ
        await page.evaluateOnNewDocument(() =>
            localStorage.setItem(
                'example-store-cart',
                '{"0":{"name":"testName0","price":77,"count":1},"1":{"name":"testName","count":1,"price":88}}'
            )
        );

        await page.goto(`http://localhost:3000/hw/store/cart${bug}`);

        const table = await page.waitForSelector(cartTableSelector);
        const screen1 = await table.screenshot();

        await page.reload();

        const table2 = await page.waitForSelector(cartTableSelector);
        const screen2 = await table2.screenshot();

        await page.reload();

        await page.waitForSelector(clearCartSelector);
        await page.click(clearCartSelector);

        //ОЖИДАНИЯ
        expect(screen1).toEqual(screen2);
        await browser.assertView('emptyCartImg', 'body', { screenshotDelay: 500 });
    });
});
