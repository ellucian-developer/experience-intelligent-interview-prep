// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import React, { useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { withIntl } from '../i18n/ReactIntlProviderWrapper';

import { usePageControl, usePageInfo } from '@ellucian/experience-extension-utils';

import { JobInfoProvider } from './hooks/JobInfo';

import JobInfo from './components/JobInfo';
import Interview from './components/Interview';

// initialize logging for this card
import { initializeLogging } from '../util/log-level';
initializeLogging('default');

const Page = () => {
    const { basePath } = usePageInfo();
    const { setPageTitle } = usePageControl();

    useEffect(() => { setPageTitle('Intelligent Interview Prep')});

    return (
        <JobInfoProvider>
            <BrowserRouter basename={basePath}>
                <Switch>
                    <Route exact path="/interview/:taskId?" render={() => (
                        <Interview/>
                    )}/>
                    <Route path="/:taskId?" render={() => (
                        <JobInfo/>
                    )}/>
                </Switch>
            </BrowserRouter>
        </JobInfoProvider>
    );
};

export default withIntl(Page);
