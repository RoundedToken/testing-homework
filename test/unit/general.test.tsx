import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CreateApp } from './CreateApp';
import mockStore, { resetStore } from './mockStore';

describe('Общие тесты', () => {
    beforeEach(() => {
        resetStore();
    });

    it('Наличие ссылок на страницы в шапке', () => {
        //ПОДГОТОВКА
        const store = mockStore();
        const app = <CreateApp store={store} />;
        render(app);

        //ДЕЙСТВИЯ
        const catalogHref = screen.getByRole('link', { name: 'Catalog' }).getAttribute('href');
        const deliveryHref = screen.getByRole('link', { name: 'Delivery' }).getAttribute('href');
        const contactsHref = screen.getByRole('link', { name: 'Contacts' }).getAttribute('href');
        const cartHref = screen.getByRole('link', { name: 'Cart (1)' }).getAttribute('href');

        //ОЖИДАНИЯ
        expect(catalogHref).toBe('/catalog');
        expect(deliveryHref).toBe('/delivery');
        expect(contactsHref).toBe('/contacts');
        expect(cartHref).toBe('/cart');
        expect(screen.getByRole('link', { name: 'Contacts' })).toHaveAttribute('href', '/contacts');
    });

    it('Название магазина в шапке = ссылка на главную', () => {
        //ПОДГОТОВКА
        const store = mockStore();
        const app = <CreateApp store={store} />;
        render(app);

        //ДЕЙСТВИЯ
        const storeNameHref = screen
            .getByRole('link', { name: 'Example store' })
            .getAttribute('href');

        //ОЖИДАНИЯ
        expect(storeNameHref).toBe('/');
    });
});
