import { CartApi, ExampleApi } from '../../src/client/api';
import { initStore } from '../../src/client/store';

const cart = new CartApi();
cart.getState = () => {
    return {
        0: {
            name: 'testName0',
            price: 77,
            count: 2,
        },
    };
};

const api = new ExampleApi('');
api.checkout = () => {
    return Promise.resolve({
        data: { id: 1 },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
    });
};
api.getProducts = () => {
    return Promise.resolve({
        data: [
            {
                name: 'testName0',
                price: 77,
                id: 0,
            },
        ],
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
    });
};
api.getProductById = (id: number) => {
    return Promise.resolve({
        data: {
            name: 'testName',
            price: 33,
            id: id,
            description: 'testDescription',
            color: 'testColor',
            material: 'testMaterial',
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
    });
};

let mockStore = initStore(api, cart);

export default () => mockStore;

export const resetStore = () => (mockStore = initStore(api, cart));
