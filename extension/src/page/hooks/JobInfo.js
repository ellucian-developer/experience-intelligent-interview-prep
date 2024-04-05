// Copyright 2021-2024 Ellucian Company L.P. and its affiliates.

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { useCardInfo } from '@ellucian/experience-extension-utils';
import { MultiDataQueryProvider, userTokenDataConnectQuery, useDataQuery } from '@ellucian/experience-extension-extras';

import log from 'loglevel';

const logger = log.getLogger('default');

const Context = createContext({});

function JobInfoProviderInternal({ children }) {

    // Experience SDK hooks
    const {
        cardConfiguration: {
            academicProgramPipeline,
            generateCompanyInfoPipeline,
            generateInterviewResponsePipeline,
            generateInterviewTipsPipeline,
        } = {}
    } = useCardInfo();

    const [ company, setCompany ] = useState(process.env.useMockJobInfo === 'true' ? 'Star Fleet' : undefined);
    const [ position, setPosition ] = useState(process.env.useMockJobInfo === 'true' ? 'Science Officer' : undefined);
    const [ taskId, setTaskId ] = useState();

    const { data: programData } = useDataQuery({ resource: academicProgramPipeline });
    // eslint-disable-next-line no-unused-vars
    const { data: companyData, isError: companyIsError,  isLoading: companyIsLoading,  setEnabled: companySetEnabled,  setQueryKeys: companySetQueryKeys } = useDataQuery({queryId: 'company-info', resource: generateCompanyInfoPipeline });
    // eslint-disable-next-line no-unused-vars
    const { data: interviewTipsData,  isError: interviewTipsIsError,  isLoading: interviewTipsIsLoading,  setEnabled: interviewTipsSetEnabled,  setQueryKeys: interviewTipsSetQueryKeys } = useDataQuery({queryId: 'interview-tips', resource: generateInterviewTipsPipeline });
    // eslint-disable-next-line no-unused-vars
    const { data: interviewData,  isError: interviewIsError,  isLoading: interviewIsLoading,  setEnabled: interviewSetEnabled,  setQueryKeys: interviewSetQueryKeys } = useDataQuery({queryId: 'interview-response', resource: generateInterviewResponsePipeline });

    const [ interviewMessagesHistory, setInterviewMessagesHistory ] = useState([]);
    const [ interviewAiResponse, setInterveiwAiResponse ] = useState();
    const [ interviewAiResponsePending, setInterveiwAiResponsePending ] = useState(false);

    const program = useMemo(() => {
        let program;
        if (programData) {
            ({ program } = programData);
        }

        return program;
    }, [ programData])

    const generateCompanyInfo = useCallback(() => {
        companySetQueryKeys({
            queryId: 'company-info',
            searchParameters: {
                company,
            }
        });
        companySetEnabled(true);
    }, [company])

    const companyInformation = useMemo(() => {
        let companyInformation;
        if (companyData) {
            const { message: { content, finishReason } = {} } = companyData;
            if (finishReason === 'stop' && content && typeof content === 'string') {
                try {
                    companyInformation = JSON.parse(content.replace(/```json\n|\n```|\n/g, '')).companyInfo;
                } catch(error) {
                    companyInformation = 'Sorry AI didn\'t respond as expected';
                }
            }
        }

        return companyInformation;
    }, [ companyData])

    const generateInterviewTips = useCallback(() => {
        interviewTipsSetQueryKeys({
            queryId: 'interview-tips',
            searchParameters: {
                company,
                position,
                program
            }
        });
        interviewTipsSetEnabled(true);
    }, [company, position, program])

    const interviewTips = useMemo(() => {
        let interviewTips;
        if (interviewTipsData) {

            const { message: { content, finishReason } = {} } = interviewTipsData;
            if (finishReason === 'stop') {
                try {
                    interviewTips = JSON.parse(content.replace(/```json\n|\n```|\n/g, '')).tips;
                    if (!Array.isArray(interviewTips)) {
                        interviewTips = [];
                    }
                } catch(error) {
                    interviewTips = 'Sorry AI didn\'t respond as expected';
                }
            }
        }

        return interviewTips;
    }, [interviewTipsData])

    const generateNextQuestion = useCallback(() => {
        const body = {
            company,
            position,
            program,
            type: interviewMessagesHistory.length === 0 ? 'initial' : 'next-question',
            messages: interviewMessagesHistory
        }

        setInterveiwAiResponsePending(true);
        interviewSetQueryKeys( { queryId: 'interview-response', body } );
        interviewSetEnabled(true);
    }, [company, interviewMessagesHistory, position, program])

    const generateResponseEvaluation = useCallback((userAnswer) => {
        const body = {
            company,
            position,
            program,
            type: 'evaluate-answer',
            messages: [
                ...interviewMessagesHistory,
                {
                    role: 'user',
                    content: userAnswer,
                }
            ]
        }

        setInterveiwAiResponsePending(true);
        interviewSetQueryKeys( { queryId: 'interview-response', body } );
        interviewSetEnabled(true);
    }, [interviewMessagesHistory])

    const generateEvaluation = useCallback(() => {
        const body = {
            company,
            position,
            program,
            type: 'evaluate-interview',
            messages: interviewMessagesHistory,
        }

        setInterveiwAiResponsePending(true);
        interviewSetQueryKeys( { queryId: 'interview-response', body } );
        interviewSetEnabled(true);
    }, [interviewMessagesHistory])

    useEffect(() => {
        if (interviewData && !interviewIsLoading && interviewAiResponsePending) {
            setInterveiwAiResponsePending(false);

            const { message, message: { finishReason } = {}, messageHistory } = interviewData;
            if (finishReason === 'stop') {
                // make sure response doesn't have extra ```json\n and \n``` surrounding it
                // shouldn't happen with current prompts and request are all flagged as JSON for OpenAI
                message.content = message.content.replace(/```json\n|\n```|\n/g, '');
                delete message.finishReason;

                setInterveiwAiResponse(message);
                setInterveiwAiResponsePending(false);

                setInterviewMessagesHistory(() => messageHistory);
            }
        }
    }, [ interviewAiResponsePending, interviewMessagesHistory, interviewData, interviewIsLoading ])

    const contextValue = useMemo(() => {
        return {
            company,
            companyInformation,
            generateCompanyInfo,
            generateEvaluation,
            generateInterviewTips,
            generateNextQuestion,
            generateResponseEvaluation,
            interviewAiResponse,
            interviewAiResponsePending,
            interviewIsLoading,
            interviewTips,
            position,
            setCompany,
            setPosition,
            setTaskId,
            taskId,
        }
    }, [
        company,
        companyInformation,
        generateCompanyInfo,
        generateEvaluation,
        generateInterviewTips,
        generateNextQuestion,
        generateResponseEvaluation,
        interviewAiResponse,
        interviewAiResponsePending,
        interviewIsLoading,
        interviewTips,
        position,
        setPosition,
        setTaskId,
        taskId,
    ]);

    useEffect(() => {
        logger.debug(`JobInfoProvider mounted`);

        return () => {
            logger.debug(`JobInfoProvider mounted`);
        }
    }, []);

    return (
        <Context.Provider value={contextValue}>
            {children}
        </Context.Provider>
    )
}

JobInfoProviderInternal.propTypes = {
    children: PropTypes.object.isRequired,
}

export function JobInfoProvider({children}) {
    const {
        cardConfiguration: {
            academicProgramPipeline,
            generateCompanyInfoPipeline,
            generateInterviewResponsePipeline,
            generateInterviewTipsPipeline,
        } = {}
    } = useCardInfo();

    if (!academicProgramPipeline || academicProgramPipeline === '') {
        const message = '"academicProgramPipeline" is not configured. See card configuration';
        logger.error(message);
        throw new Error(message);
    }
    if (!generateCompanyInfoPipeline || generateCompanyInfoPipeline === '') {
        const message = '"generateCompanyInfoPipeline" is not configured. See card configuration';
        logger.error(message);
        throw new Error(message);
    }
    if (!generateInterviewResponsePipeline || generateInterviewResponsePipeline === '') {
        const message = '"generateInterviewResponsePipeline" is not configured. See card configuration';
        logger.error(message);
        throw new Error(message);
    }
    if (!generateInterviewTipsPipeline || generateInterviewTipsPipeline === '') {
        const message = '"generateInterviewTipsPipeline" is not configured. See card configuration';
        logger.error(message);
        throw new Error(message);
    }

    const optionsCommon = useMemo(() => ({
        enabled: false,
        cacheEnabled: false,
        queryFunction: userTokenDataConnectQuery,
    }), []);

    const options = [
        { ...optionsCommon,
            enabled: true,
            cacheEnabled: true,
            resource: academicProgramPipeline,
        },
        { ...optionsCommon,
            queryKeys: { queryId: 'company-info'},
            enabled: process.env.useMockData === 'true',
            resource: generateCompanyInfoPipeline,
        },
        { ...optionsCommon,
            queryKeys: { queryId: 'interview-tips'},
            resource: generateInterviewTipsPipeline,
        },
        { ...optionsCommon,
            queryKeys: { queryId: 'interview-response' },
            queryParameters: { queryMethod: 'POST'},
            resource: generateInterviewResponsePipeline,
        }
    ]

    return (
        <MultiDataQueryProvider options={options}>
            <JobInfoProviderInternal>
                {children}
            </JobInfoProviderInternal>
        </MultiDataQueryProvider>
    );
}

JobInfoProvider.propTypes = {
    children: PropTypes.object.isRequired,
}

export function useJobInfo() {
    return useContext(Context);
}
