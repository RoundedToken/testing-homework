import React from 'react';
import { addToCart, clearCart } from '../../src/client/store';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { CreateApp } from './CreateApp';
import mockStore, { resetStore } from './mockStore';

describe('Корзина', () => {
    beforeEach(() => {
        resetStore();
    });

    it('Проверка отправки заказа', async () => {
        //ПОДГОТОВКА
        const store = mockStore();
        const app = <CreateApp store={store} location="/cart" />;
        const user = userEvent.setup();
        render(app);

        //ДЕЙСТВИЯ
        const nameInput = screen.getByRole('textbox', {
            name: /name/i,
        });
        const phoneInput = screen.getByRole('textbox', {
            name: /phone/i,
        });
        const addressInput = screen.getByRole('textbox', {
            name: /address/i,
        });
        const checkoutButton = screen.getByRole('button', {
            name: /checkout/i,
        });

        await user.type(nameInput, 'TestName');
        await user.type(phoneInput, '1234567890');
        await user.type(addressInput, 'TestAddress');
        await user.click(checkoutButton);

        //ОЖИДАНИЯ
        expect(
            screen.getByRole('heading', {
                name: /well done!/i,
            })
        ).toBeInTheDocument();
    });

    it('Проверка кнопки clearCart и наличия ссылки на каталог в пустой корзине', async () => {
        //ПОДГОТОВКА
        const store = mockStore();
        const app = <CreateApp store={store} location="/cart" />;
        const user = userEvent.setup();
        render(app);

        //ДЕЙСТВИЯ
        await user.click(
            screen.getByRole('button', {
                name: /clear shopping cart/i,
            })
        );

        //ОЖИДАНИЯ
        expect(
            screen.getByText(/cart is empty\. please select products in the \./i)
        ).toBeInTheDocument();
        expect(JSON.stringify(store.getState().cart)).toBe('{}');
        expect(
            within(screen.getByText(/cart is empty\. please select products in the \./i)).getByRole(
                'link',
                {
                    name: /catalog/i,
                }
            )
        ).toHaveAttribute('href', '/catalog');
    });

    it('Сохранение корзины в localStorage', () => {
        //ПОДГОТОВКА
        const store = mockStore();
        const app = <CreateApp store={store} />;
        render(app);

        //ДЕЙСТВИЯ
        store.dispatch(
            addToCart({
                id: 1,
                name: 'testName',
                price: 88,
                description: 'testDescription',
                material: 'testMaterial',
                color: 'testColor',
            })
        );

        //ОЖИДАНИЯ
        expect(localStorage.getItem('example-store-cart')).toBe(
            '{"0":{"name":"testName0","price":77,"count":2},"1":{"name":"testName","count":1,"price":88}}'
        );
    });

    it('Отображение количества неповторяющихся товаров', () => {
        //ПОДГОТОВКА
        const store = mockStore();
        const app = <CreateApp store={store} />;
        render(app);

        //ОЖИДАНИЕ
        expect(
            screen.getByRole('link', {
                name: /cart \(1\)/i,
            })
        ).toBeInTheDocument();
    });

    it('Отображение таблицы с нужными ячейками', () => {
        //ПОДГОТОВКА
        const store = mockStore();
        const app = <CreateApp store={store} location="/cart" />;
        render(app);

        //ОЖИДАНИЕ
        expect(
            screen.getByRole('cell', {
                name: /testname0/i,
            })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('cell', {
                name: /\$77/i,
            })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('cell', {
                name: /2/i,
            })
        ).toBeInTheDocument();
        expect(
            within(
                screen.getByRole('row', {
                    name: /order price: \$154/i,
                })
            ).getByRole('cell', {
                name: /\$154/i,
            })
        ).toBeInTheDocument();
        expect(
            within(
                screen.getByRole('row', {
                    name: /1 testname0 \$77 2 \$154/i,
                })
            ).getByRole('cell', {
                name: /\$154/i,
            })
        ).toBeInTheDocument();
    });
});
