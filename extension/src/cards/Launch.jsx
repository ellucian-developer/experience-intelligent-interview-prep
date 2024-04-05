// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import React, { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';

import { Button, Grid, makeStyles, Snackbar, Typography } from '@ellucian/react-design-system/core'
import {
    spacing40,
    spacing80,
    heightHeaderBar,
} from '@ellucian/react-design-system/core/styles/tokens';

import { withIntl } from '../i18n/ReactIntlProviderWrapper';

import { useWorkflow } from './hooks/workflow';

import aiImage from '../assets/images/ai-icon.svg';

const useStyles = makeStyles(() => ({
    card: {
        marginTop: 0,
        marginRight: spacing40,
        marginBottom: 0,
        marginLeft: spacing40,
    },
    aiImage: {
        width: '3rem'
    },
    cardTextBox: {
        display: 'flex',
        justifyContent: 'center',
    },
    cardText: {
        width: '16rem',
    },
    icon: {
        width: heightHeaderBar,
        height: heightHeaderBar,
    },
}), { index: 2 });

function Launch() {
    const intl = useIntl();
    const classes = useStyles();

    const { requestInterview } = useWorkflow();
    const [ requestButtonEnabled, setRequestButtonEnabled ] = useState(true);
    const [ showRequested, setShowRequested ] = useState(false);

    const onRequestInterview = useCallback(() => {
        requestInterview();
        setRequestButtonEnabled(false);
        setShowRequested(true);
    }, [])

    return (
        <div className={classes.card}>
            <Grid
                container
                direction="column"
                justifyContent="flex-end"
                alignItems="stretch"
                textAlign="center"
                spacing={spacing80}
            >
                <Grid item xs={12}></Grid>

                <Grid item xs={12}>
                    <img
                        src={aiImage}
                        alt=""
                        className={classes.aiImage}
                    />
                    <div className={classes.cardTextBox}>
                        <Typography className={classes.cardText} component='div'>
                            {intl.formatMessage({ id: 'InterviewCard.cardText' })}
                        </Typography>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        disabled={!requestButtonEnabled}
                        onClick={onRequestInterview}
                        fluid="true"
                    >
                        {intl.formatMessage({ id: 'InterviewCard.requestButton' })}
                    </Button>
                </Grid>
            </Grid>
            <Snackbar
                open={showRequested}
                onClose={() => setShowRequested(false)}
                message={'Interview Requested - Refresh for notification'}
                variant='success'
            />
        </div>
    );
}

export default withIntl(Launch);