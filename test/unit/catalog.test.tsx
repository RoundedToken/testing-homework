import React from 'react';
import { addToCart, clearCart } from '../../src/client/store';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { CreateApp } from './CreateApp';
import mockStore, { resetStore } from './mockStore';

describe('Каталог', () => {
    beforeEach(() => {
        resetStore();
    });

    it('Первое нажатие addToCart добавляет в корзину, второе - увеличивает кол-во', async () => {
        //ПОДГОТОВКА
        const store = mockStore();
        const app = <CreateApp store={store} location="/catalog/1" />;
        const user = userEvent.setup();
        render(app);

        //ДЕЙСТВИЯ
        const addToCartButton = await screen.findByText('Add to Cart');
        await user.click(addToCartButton);
        await user.click(addToCartButton);

        //ОЖИДАНИЯ
        expect(store.getState().cart).toEqual({
            0: { name: 'testName0', price: 77, count: 2 },
            1: { name: 'testName', count: 2, price: 33 },
        });
    });

    it('Если товар уже в корзине, то информация об этом отображается НА СТРАНИЦЕ ТОВАРА', async () => {
        //ПОДГОТОВКА
        const store = mockStore();
        const app = <CreateApp store={store} location="/catalog/0" />;
        render(app);

        //ДЕЙСТВИЯ
        const inCartTitle = await screen.findByText('Item in cart');

        //ОЖИДАНИЯ
        expect(inCartTitle).toBeInTheDocument();
    });

    it('Если товар уже в корзине, то информация об этом отображается В КАТАЛОГЕ', async () => {
        //ПОДГОТОВКА
        const store = mockStore();
        const app = <CreateApp store={store} location="/catalog" />;
        render(app);

        //ДЕЙСТВИЯ
        const productCard = (await screen.findAllByTestId('0')).find((el) =>
            el.className.includes('ProductItem')
        );
        const inCartTitle = await within(productCard).findByText('Item in cart');

        //ОЖИДАНИЯ
        expect(inCartTitle).toBeInTheDocument();
    });
});
