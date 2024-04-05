// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.
/* eslint-disable @calm/react-intl/missing-formatted-message */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import {
    makeStyles,
    Typography
} from '@ellucian/react-design-system/core'
import {
    spacing40,
} from '@ellucian/react-design-system/core/styles/tokens';

import autoAnimate from '@formkit/auto-animate';

import aiSpinner from '../../assets/images/ai-loader.gif';

// initialize logging for this card
import { initializeLogging } from '../../util/log-level';
initializeLogging('default');

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        alignItems: 'center',
    },
    spinnerImg: {
        height: '40px',
        marginRight: spacing40,
    },
}), { index: 2});

const interval = 3000;

export default function AiWait({messages}) {
    const classes = useStyles();

    const pickNextMessageIndex = useCallback((currentIndex) => {
        let newIndex = currentIndex;
        do {
            newIndex = Math.floor(Math.random() * messages.length);
        } while (newIndex === currentIndex);

        return newIndex;
    }, [messages]);

    const messageRef = useRef();
    const [ messageIndex, setMessageIndex ] = useState(pickNextMessageIndex(-1));

    useEffect(() => {
        // start the interval
        window.setInterval(() => {
            setMessageIndex(current => {
                setMessageIndex(pickNextMessageIndex(current));
            })
        }, interval);
    }, [])

    useEffect(() => {
        if (messageRef.current) {
            // autoAnimate(messageRef.current, { duration: 500 });
            autoAnimate(messageRef.current);
        }
    }, [messageRef])

    const message = messages[messageIndex];

    return (
        <div ref={messageRef}>
            <div className={classes.root} key={message}>
                <img
                    src={aiSpinner}
                    alt=""
                    className={classes.spinnerImg}
                />
                <Typography key={message} container='div'>
                    {`${message} ...`}
                </Typography>
            </div>
        </div>
    );
}

AiWait.propTypes = {
    messages: PropTypes.array.isRequired,
}
