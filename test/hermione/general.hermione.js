const bug = '?bug_id=8';

describe('Общие тесты', () => {
    it('Адаптивная верстка', async ({ browser }) => {
        //ПОДГОТОВКА
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();

        //ДЕЙСТВИЯ И ОЖИДАНИЯ
        await page.goto(`http://localhost:3000/hw/store/${bug}`);

        //1440
        await page.setViewport({ width: 1440, height: 5000 });
        await browser.assertView('plain1440', 'body');

        //1250
        await page.setViewport({ width: 1250, height: 5000 });
        await browser.assertView('plain1250', 'body');

        //1100
        await page.setViewport({ width: 1100, height: 5000 });
        await browser.assertView('plain1100', 'body');

        //900
        await page.setViewport({ width: 900, height: 5000 });
        await browser.assertView('plain900', 'body');

        //700
        await page.setViewport({ width: 700, height: 5000 });
        await browser.assertView('plain700', 'body');

        //500
        await page.setViewport({ width: 500, height: 5000 });
        await browser.assertView('plain500', 'body');
    });

    it('Меню-гамбургер сворачивается после перехода по ссылке', async ({ browser }) => {
        //ПОДГОТОВКА
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();
        await page.setViewport({ width: 500, height: 5000 });

        const menuSelector = '.navbar-toggler';
        const navBarSelector = '.navbar';
        const deliveryLinkSelector = '.nav-link[href="/hw/store/delivery"]';

        //ДЕЙСТВИЯ
        await page.goto(`http://localhost:3000/hw/store/${bug}`);

        await page.click(menuSelector);
        await page.click(deliveryLinkSelector);

        //ОЖИДАНИЯ
        await browser.assertView('plain', navBarSelector);
    });

    it('Проверка статических страниц "главная", "контакты", "доставка"', async ({ browser }) => {
        //ПОДГОТОВКА
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();
        await page.setViewport({ width: 1440, height: 5000 });

        //ДЕЙСТВИЯ И ОЖИДАНИЯ
        await page.goto(`http://localhost:3000/hw/store/${bug}`);
        await browser.assertView('plainMain', 'body');

        await page.goto(`http://localhost:3000/hw/store/contacts${bug}`);
        await browser.assertView('plainContacts', 'body');

        await page.goto(`http://localhost:3000/hw/store/delivery${bug}`);
        await browser.assertView('plainDeliver', 'body');
    });

    it('У всех продуктов в каталоге есть имя, цена и ссылка на страницу', async ({ browser }) => {
        //ПОДГОТОВКА
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();
        page.setDefaultTimeout(500);
        await page.setViewport({ width: 1440, height: 5000 });

        //ДЕЙСТВИЯ
        await page.goto(`http://localhost:3000/hw/store/catalog${bug}`);

        const cardTitle = await browser.$$('.card-title').map((v) => v.getText());
        const cardPrice = await browser.$$('.card-text').map((v) => v.getText());
        const cardLink = await browser.$$('.card-link').map((v) => v.getAttribute('href'));

        //ОЖИДАНИЯ
        cardTitle.forEach((v) => expect(v).not.toBe(''));
        cardPrice.forEach((v) => expect(v).not.toBe(''));
        cardLink.forEach((v) => expect(v.startsWith('/hw/store/catalog/')).toBeTruthy());
    });

    it('На странице товара отображается вся необходимая информация и функционал', async ({
        browser,
    }) => {
        //ПОДГОТОВКА
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();
        page.setDefaultTimeout(500);
        await page.setViewport({ width: 1440, height: 5000 });
        const addToCartButton = '.ProductDetails-AddToCart';

        //ДЕЙСТВИЯ
        await page.goto(`http://localhost:3000/hw/store/catalog/1${bug}`);

        const productName = await browser.$('.ProductDetails-Name').getText();
        const productDescription = await browser.$('.ProductDetails-Description').getText();
        const productPrice = await browser.$('.ProductDetails-Price').getText();
        const productColor = await browser.$('.ProductDetails-Color').getText();
        const productMaterial = await browser.$('.ProductDetails-Material').getText();

        //ОЖИДАНИЯ
        expect(productName).not.toBe('');
        expect(productDescription).not.toBe('');
        expect(productPrice).not.toBe('');
        expect(productColor).not.toBe('');
        expect(productMaterial).not.toBe('');
        await browser.assertView('addToCartImg', addToCartButton);
    });

    it('Оформление заказа', async ({ browser }) => {
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
        // await page.goto(`http://localhost:3000/hw/store/catalog/1${bug}`);
        // await page.waitForSelector(addToCartSelector);
        // await page.click(addToCartSelector);
        // await page.evaluate(() => {
        //     localStorage.setItem(
        //         'example-store-cart',
        //         '{"0":{"name":"testName0","price":77,"count":1},"1":{"name":"testName","count":1,"price":88}}'
        //     );
        // });
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
        // await page.goto(`http://localhost:3000/hw/store/catalog/1${bug}`);
        // await page.waitForSelector(addToCartSelector);
        // await page.click(addToCartSelector);
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
