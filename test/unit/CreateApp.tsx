import React from 'react';
import { StaticRouter } from 'react-router';
import { Action, ApplicationState } from '../../src/client/store';
import { Provider } from 'react-redux';
import { Application } from '../../src/client/Application';
import { Store } from 'redux';

export const CreateApp = ({
    location = '',
    store,
}: {
    location?: string;
    store: Store<ApplicationState, Action>;
}) => {
    return (
        <StaticRouter location={location} basename="">
            <Provider store={store}>
                <Application />
            </Provider>
        </StaticRouter>
    );
};
