// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import ReactMarkdown from 'react-markdown';

import {
    makeStyles,
    Typography
} from '@ellucian/react-design-system/core'
import {
    spacing50,
    spacing60,
} from '@ellucian/react-design-system/core/styles/tokens';

import AiWait from './AiWait';

import { useJobInfo } from '../hooks/JobInfo';

const waitMessages = [
    "Holding for company info...",
    "Just a sec, we're cooking up some details for you!",
    "Patience is a virtue...especially when waiting for AI-generated info!",
    "Keep calm and wait for the magic AI to work its charm!",
    "Grab a coffee while we whip up the company details for you!",
    "Just a few more seconds...the AI is hard at work!",
    "Busy brewing company info...please wait!",
    "Whoosh! The AI is working its magic…",
    "Hold tight, we're almost ready with the deets!",
    "Don't blink, you might miss the AI-generated company info!",
    "Tick tock…AI's on the clock generating those details!",
    "Stay tuned, the company info is on its way!",
    "Shhh...let the AI do its thing!",
    "The AI is crunching numbers to bring you the company info!",
    "Almost there...just a few more moments!",
    "Mission: Get info from AI...in progress!",
    "Keep calm and carry on, info is on its way!",
    "AI at work, generating company details for your job hunt!",
    "Breathe in, breathe out...AI-generated info coming soon!",
    "Hold onto your hat, the company info is on its way!"
]

const useStyles = makeStyles(() => ({
    root: {
        display: 'none',
        border: '1px solid #E9E9E9',
        borderRadius: '20px',
        boxShadow: '0px 2px 13px 0px #343F550F, 0px 2px 2px 0px #343F550F',
    },
    show: {
        display: 'block',
    },
    content: {
        margin: `${spacing50} ${spacing50} ${spacing60} ${spacing50}`,
    },
    messagesGridItem: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'radial-gradient(30.79% 39.56% at 63.96% 100%, rgba(83, 83, 209, 0.25) 0%, rgba(255, 255, 255, 0.25) 97.7%), #FFF',
    },
}), { index: 2});

export default function CompanyInformation({show}) {
    const intl = useIntl();
    const classes = useStyles();

    const {
        company,
        companyInformation,
    } = useJobInfo();

    return (
        <div className={classNames(classes.root, {[classes.show]: show})}>
            <div className={classes.content}>
            {!companyInformation && (
                <AiWait messages={waitMessages}/>
            )}
            {companyInformation && (
                <>
                    <Typography variant='h4' component='div'>
                        {intl.formatMessage({ id: 'Interview.aboutCompany' }, { company })}
                    </Typography>
                    <Typography component='div'>
                        <ReactMarkdown>
                            {companyInformation}
                        </ReactMarkdown>
                    </Typography>
                </>
            )}
            </div>
        </div>
    );
}

CompanyInformation.propTypes = {
    show: PropTypes.bool.isRequired,
}