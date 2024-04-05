// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import React, { useCallback, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useIntl } from 'react-intl';

import {
    Button,
    Grid,
    makeStyles,
    TextField,
    Typography
} from '@ellucian/react-design-system/core'
import {
    fontWeightNormal,
    spacing40,
    spacing50,
    spacing60,
    spacing90,
} from '@ellucian/react-design-system/core/styles/tokens';

import { usePageControl, useUserInfo } from '@ellucian/experience-extension-utils';

import aiImage from '../../assets/images/ai-icon.svg';
import Filler from './Filler';
import { useJobInfo } from '../hooks/JobInfo';
import { useWorkflow } from '../hooks/workflow';

// initialize logging for this card
import { initializeLogging } from '../../util/log-level';
initializeLogging('default');

const useStyles = makeStyles(() => ({
    root: {
        height: '100%',
        // display: 'flex',
        // flexDirection: 'column',
        background: 'radial-gradient(50% 90.59% at 50% 0%, rgba(83, 83, 209, 0.25) 0%, rgba(255, 255, 255, 0.25) 100%)',
        paddingTop: spacing50,
    },
    rootItem: {
        display: 'flex',
        justifyContent: 'center',
    },
    textField: {
        marginTop: spacing40,
    },
    submitButton: {
        marginTop: spacing40,
    },
    ttitleBox: {
        alignSelf: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: spacing50,
        marginBottom: spacing90,
    },
    hiBox: {
        display: 'flex',
        justifyContent: 'center',
    },
    aiImage: {
        width: '2rem',
        marginRight: spacing40,
    },
    companyMessage: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: spacing40,
        fontWeight: fontWeightNormal,
    },
    companyFieldAndButtonBox: {
        marginTop: spacing60,
        display: 'flex',
        alignItems: 'center',
    },
    companyTextField: {
        width: '32rem',
    },
    card: {
        width: '33%',
    },
    cardContent: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    informationText: {
        // width: '75%',
    },
    buttonBox: {
        marginTop: spacing40,
        display: 'flex',
        justifyContent: 'flex-end',
    },
    formInput: {
        // marginTop: spacing40,
        // marginBottom: spacing20,
        // display: 'block',
    },
}), { index: 2});

export default function JobInfo() {
    const intl = useIntl();
    const classes = useStyles();
    const history = useHistory();
    const { taskId } = useParams();

    // Experience SDK hooks
    const user = useUserInfo();
    const { setPageToolbar } = usePageControl();

    const { canCompleteTask, completeTask } = useWorkflow();
    const { company, position, setCompany, setPosition, setTaskId } = useJobInfo();

    useEffect(() => {
        if (canCompleteTask) {
            setPageToolbar({
                primaryCommands: [{
                    icon: 'completion',
                    label: 'Complete Task',
                    callback: () => {
                        completeTask();
                    }
                }],
            })
        }
    }, [canCompleteTask, completeTask]);

    useEffect(() => {
        if (taskId) {
            setTaskId(taskId);
        }
    }, [ taskId ])

    const startInterview = useCallback(() => {
        if (taskId) {
            history.push(`/interview/${taskId}`);
        } else {
            history.push('/interview');
        }
    }, [company]);

    return (
        <Grid container alignItems='center' spacing='0' className={classes.root}>
            <Grid item xs='12' className={classes.rootItem}>
                <div className={classes.hiBox}>
                    <img
                        src={aiImage}
                        alt=""
                        className={classes.aiImage}
                    />
                    <Typography className={classes.hi} variant='h1' component='div'>
                        {intl.formatMessage({ id: 'JobInfo.hi' }, { name: user.firstName })}
                    </Typography>
                </div>
            </Grid>
            <Grid item xs='12' className={classes.rootItem}>
                <Typography className={classes.companyMessage} variant='h2' component="div">
                    {intl.formatMessage({ id: 'JobInfo.companyMessage' })}
                </Typography>
            </Grid>
            <Grid item xs='12' className={classes.rootItem}>
                <TextField
                    className={classes.textField}
                    label="Company"
                    onChange={(e) => setCompany(e.target.value)}
                    required
                    value={company}
                />
            </Grid>
            <Grid item xs='12' className={classes.rootItem}>
                    <TextField
                        className={classes.textField}
                        label="Job Title"
                        onChange={(e) => setPosition(e.target.value)}
                        required
                        value={position}
                    />
            </Grid>
            <Grid item xs='12' className={classes.rootItem}>
                    <Button
                        className={classes.submitButton}
                        onClick={startInterview}
                    >
                        {intl.formatMessage({ id: 'JobInfo.submitButton' })}
                    </Button>
            </Grid>
            <Filler />
        </Grid>
    );
}
