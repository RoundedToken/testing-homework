describe('Каталог > ', () => {
    const bug = `?bug_id=${process.env.BUG_ID | 0}`;

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

    it('На странице товара отображается вся необходимая информация', async ({ browser }) => {
        //ПОДГОТОВКА
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();
        page.setDefaultTimeout(500);
        await page.setViewport({ width: 1440, height: 5000 });

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
    });

    it('На странице товара отображается кнопка addToCart', async ({ browser }) => {
        //ПОДГОТОВКА
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();
        page.setDefaultTimeout(500);
        await page.setViewport({ width: 1440, height: 5000 });
        const addToCartButton = '.ProductDetails-AddToCart';

        //ДЕЙСТВИЯ
        await page.goto(`http://localhost:3000/hw/store/catalog/0${bug}`);

        //ОЖИДАНИЯ
        await browser.assertView('addToCartImg', addToCartButton);
    });
});
