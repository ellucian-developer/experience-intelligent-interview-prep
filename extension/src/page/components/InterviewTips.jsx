// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import React, { useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import ReactMarkdown from 'react-markdown';

import {
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from '@ellucian/react-design-system/core'
import {
    spacing50,
    spacing60,
} from '@ellucian/react-design-system/core/styles/tokens';

import AiWait from './AiWait';

import { useJobInfo } from '../hooks/JobInfo';

const waitMessages = [
    "Waiting for AI to share the wisdom...",
    "Generating interview tips, please hold...",
    "Just a moment, AI is cooking up advice for you!",
    "Hold tight, OpenAI is on the case!",
    "In the meantime, why not practice your smile for the interview?",
    "OpenAI is like a busy bee, creating tips just for you!",
    "The interview tips are almost ready, just a little longer...",
    "AI is hard at work for you - thanks for being patient!",
    "Just a little longer, OpenAI is crunching the data!",
    "Keep calm and wait for OpenAI's insights!",
    "Patience is a virtue, especially when waiting for AI-generated tips!",
    "Curiosity never killed the cat - it just made it wait for OpenAI!",
    "No need to stress - OpenAI is here to help you prepare!",
    "Hold on tight - OpenAI's interview tips are on the way!",
    "The wheels are turning, OpenAI is crafting tips for you!",
    "AI is on the case, creating interview tips just for you!",
    "Don't worry, OpenAI is in the lab cooking up advice!",
    "Breathe in, breathe out, and wait for OpenAI's awesome tips!",
    "The interview tips are brewing, just a little longer...",
    "Beep boop! OpenAI's advice is on the horizon!"
]

const useStyles = makeStyles(() => ({
    root: {
        height: '100%',
        display: 'none',
        border: '1px solid #E9E9E9',
        borderRadius: '20px',
        boxShadow: '0px 2px 13px 0px #343F550F, 0px 2px 2px 0px #343F550F',
        overflowY: 'auto',
    },
    show: {
        display: 'block',
    },
    content: {
        margin: `${spacing50} ${spacing50} ${spacing60} ${spacing50}`,
    },
    outerTipsBox: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    innerTipsBox: {
        flex: '1 1 auto',
        height: '0',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
    },
    innerInnerTipsBox: {
        display: 'flex',
        flexDirection: 'column',
    },
}), { index: 2 });

export default function InterviewTips({ show }) {
    const intl = useIntl();
    const classes = useStyles();

    const {
        interviewTips,
    } = useJobInfo();

    const rootRef = useRef();

    useEffect(() => {
        if (rootRef.current) {
            const { current: rootElement } = rootRef;
            const stepperHeight = rootElement.parentElement.parentElement.children[0].clientHeight;
            const buttonsHeight = rootElement.parentElement.parentElement.children[3].clientHeight;
            const windowHeight = window.innerHeight;
            const bannerHeaderHeight = document.querySelector('div[role=banner]').clientHeight;
            const pageHeaderHeight = document.querySelector('div[role=main]').children[0].clientHeight;

            rootElement.style.maxHeight = `${windowHeight - bannerHeaderHeight - pageHeaderHeight - stepperHeight - buttonsHeight - 16 - 24 - 24}px`;
        }
    }, [rootRef])

    return (
        <div className={classNames(classes.root, { [classes.show]: show })} ref={rootRef}>
            <div className={classes.content}>
                        {!interviewTips && (
                            <AiWait messages={waitMessages} />
                        )}
                        {interviewTips && (
                            <>
                                <Typography variant='h4' component='div'>
                                    {intl.formatMessage({ id: 'Interview.interviewNotes' })}
                                </Typography>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                {intl.formatMessage({ id: 'Interview.tipsTopic' })}
                                            </TableCell>
                                            <TableCell>
                                                {intl.formatMessage({ id: 'Interview.tipsExample' })}
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {interviewTips.map((row, index) => {
                                            return (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        <ReactMarkdown>
                                                            {row.topic}
                                                        </ReactMarkdown>
                                                    </TableCell>
                                                    <TableCell>
                                                        <ReactMarkdown>
                                                            {row.example}
                                                        </ReactMarkdown>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </>
                        )}
            </div>
        </div>
    );
}

InterviewTips.propTypes = {
    show: PropTypes.bool.isRequired,
}