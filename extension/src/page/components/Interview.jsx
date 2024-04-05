/* eslint-disable max-depth */
/* eslint-disable complexity */
// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useIntl } from 'react-intl';

import classNames from 'classnames';

import {
    Button,
    makeStyles,
    Step,
    StepButton,
    StepLabel,
    StepProgress,
} from '@ellucian/react-design-system/core'
import {
    spacing40,
    spacing50,
} from '@ellucian/react-design-system/core/styles/tokens';

import { usePageControl } from '@ellucian/experience-extension-utils';

import { useJobInfo } from '../hooks/JobInfo';
import { useWorkflow } from '../hooks/workflow';
import CompanyInformation from './CompanyInformation';
import InterviewTips from './InterviewTips';
import Chat from './Chat';

const useStyles = makeStyles(() => ({
    root: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderTop: '1px solid #D9D9D9',
    },
    stepProgress: {
        width: '66%',
        marginBottom: spacing40,
    },
    contentBox: {
        maxHeight: '100%',
        width: '66%',
    },
    contentBoxFullHeight: {
        height: '100%',
    },
    buttonBox: {
        width: '66%',
        marginTop: spacing50,
        marginBottom: spacing50,
        display: 'flex',
        justifyContent: 'flex-end',
    },
    buttonBoxHide: {
        display: 'none',
    },
    twoButtons: {
        justifyContent: 'space-between',
    }
}), { index: 2});

export default function Interview() {
    const intl = useIntl();
    const classes = useStyles();
    const history = useHistory();
    const { taskId } = useParams();

    // Experience SDK hooks
    const { setPageToolbar } = usePageControl();

    const { canCompleteTask, completeTask } = useWorkflow();

    const {
        company,
        generateCompanyInfo,
        generateInterviewTips,
        setTaskId
    } = useJobInfo();

    const [ step, setStep ] = useState(0);

    useEffect(() => {
        if (generateCompanyInfo) {
            generateCompanyInfo();
        }
    }, [generateCompanyInfo])

    useEffect(() => {
        if (generateInterviewTips) {
            generateInterviewTips();
        }
    }, [generateInterviewTips])

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

    useEffect(() => {
        // ensure company is defined
        if (!company) {
            if (taskId) {
                history.push(`/${taskId}`);
            } else {
                history.push('/');
            }
        }
    }, [company]);

    return (
        <div className={classes.root} >
            <StepProgress className={classes.stepProgress} nonLinear activeStep={step}>
                {[0, 1, 2].map(currentStep => {
                    return (
                        <Step key={currentStep}>
                            <StepButton
                                onClick={() => setStep(currentStep)}
                            >
                                <StepLabel>
                                    {intl.formatMessage({ id: `Interview.step${currentStep}Label` })}
                                </StepLabel>
                            </StepButton>
                        </Step>
                    )
                })}
            </StepProgress>
            <div className={classNames(classes.contentBox, { [classes.contentBoxFullHeight]: step === 2 })}>
                <CompanyInformation show={step === 0}/>
                <InterviewTips show={step === 1}/>
                <Chat show={step === 2}/>
            </div>
            <div className={classNames(classes.buttonBox, { [classes.twoButtons]: step === 1, [classes.buttonBoxHide]: step === 2})}>
                {step === 1 && (
                    <Button
                        color='secondary'
                        onClick={() => setStep(step => step - 1)}
                    >
                        {intl.formatMessage({ id: 'Interview.backButton' })}
                    </Button>
                )}
                {step !== 2 && (
                    <Button
                        onClick={() => setStep(step => step + 1)}
                    >
                        {intl.formatMessage({ id: 'Interview.continueButton' })}
                    </Button>
                )}
            </div>
        </div>
    );
}