describe('Общие тесты > ', () => {
    const bug = `?bug_id=${process.env.BUG_ID | 0}`;

    it('Адаптивная верстка', async ({ browser }) => {
        //ПОДГОТОВКА
        const puppeteer = await browser.getPuppeteer();
        const [page] = await puppeteer.pages();

        //ДЕЙСТВИЯ И ОЖИДАНИЯ
        await page.evaluateOnNewDocument(() => localStorage.setItem('example-store-cart', '{}'));
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
});
