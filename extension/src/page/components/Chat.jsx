/* eslint-disable max-depth */
/* eslint-disable complexity */
// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import ReactMarkdown from 'react-markdown';

import classNames from 'classnames';

import {
    Avatar,
    Chip,
    Grid,
    IconButton,
    InputAdornment,
    makeStyles,
    TextField,
    Tooltip,
    Typography
} from '@ellucian/react-design-system/core'
import {
    colorBrandNeutral200,
    iris200,
    spacing30,
    spacing40,
    spacing50,
    spacing60,
    spacing80,
} from '@ellucian/react-design-system/core/styles/tokens';
import { Icon } from '@ellucian/ds-icons/lib';

import { usePageControl, useUserInfo } from '@ellucian/experience-extension-utils';

import aiImage from '../../assets/images/ai-icon.svg';

import AiWait from './AiWait';

import { randomPathColorName } from '../../util/path';
import { useJobInfo } from '../hooks/JobInfo';
import { useWorkflow } from '../hooks/workflow';
import { useIipResults } from '../hooks/iip-results';

// initialize logging for this card
import { initializeLogging } from '../../util/log-level';
initializeLogging('default');

import log from 'loglevel';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';

const logger = log.getLogger('default');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const avatarColor = randomPathColorName();

function scrollMessages(scrollElement) {
    return () => {
        scrollElement.scrollTo({
            top: 10000,
            left: 0,
            behavior: 'smooth'
        })
    }
}

const questionWaitMessages = [
    "Hang in there! The questions are on their way.",
    "Do a little dance while you wait for your questions!",
    "Think of a fun icebreaker question to ask during your interview.",
    "Grab a snack and come back for your questions.",
    "Take a deep breath and get ready for some great questions.",
    "Who's ready for an interview? You are!",
    "Check your email while you wait for your interview questions.",
    "Count to 10 and your questions will magically appear.",
    "Imagine yourself acing the interview with these questions.",
    "Think positive thoughts while waiting for your questions.",
    "Do a quick stretch to stay energized during your interview.",
    "Review your resume while you wait for your questions.",
    "Visualize yourself crushing this interview with these questions.",
    "Don't worry, the questions are coming soon!",
    "Pretend you're already in the interview and practice your answers.",
    "Send good vibes out into the universe for great interview questions.",
    "Take a sip of water and get ready for your questions.",
    "Take a moment to relax and visualize a successful interview.",
    "Trust that OpenAI is working hard to generate the best questions for you.",
    "Clear your mind and be open to the interview questions headed your way."
]

const evalWaitMessages = [
    "Just a friendly reminder AI is hard at work!",
    "Buckle up, we're almost there!",
    "Enjoy the suspense while the AI crunches the numbers.",
    "High-five to the AI for its evaluation skills!",
    "The AI evaluation is like unwrapping a present!",
    "Tick-tock, tick-tock... AI never stops!",
    "Your patience will pay off with a thoughtful evaluation.",
    "AI evaluation in progress... sit tight!",
    "Waiting is half the fun... or so they say!",
    "Don't worry, AI is on it!",
    "Hang tight, the AI is working its magic!",
    "The AI is evaluating you with precision and care.",
    "This wait will feel like a breeze once the evaluation is in.",
    "AI is cooking up a storm for your evaluation!",
    "One step closer to your interview question evaluation!",
    "Take a deep breath... the AI is on the case!",
    "The AI evaluation is like a mystery waiting to be solved!",
    "In the homestretch for your interview question assessment!",
    "Hold on tight, the AI is almost ready to reveal the evaluation!",
    "Get ready for some insightful feedback from the AI!"]

const useStyles = makeStyles(() => ({
    root: {
        height: '100%',
        display: 'none',
    },
    show: {
        display: 'block',
    },
    messagesGridItem: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'radial-gradient(30.79% 39.56% at 63.96% 100%, rgba(83, 83, 209, 0.25) 0%, rgba(255, 255, 255, 0.25) 97.7%), #FFF',
    },
    messagesOuterBox: {
        // height 0 constrains it to not overflow parent
        height: '0',
        flex: '1 1 auto',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: spacing40,
    },
    messagesInnerBox: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: 'auto',
    },
    messagesBox: {
        // marginTop: spacing40,
    },
    messageRow: {
        maxWidth: '66%',
        marginBottom: spacing40,
        display: 'flex',
        alignItems: 'center',
    },
    appMessageRow: {
        alignSelf: 'flex-start',
        marginLeft: spacing50,
    },
    userMessageRow: {
        alignSelf: 'flex-end',
        marginRight: spacing80,
    },
    message: {
        padding: `0px ${spacing40}`,
        boxShadow: '0px 2px 13px 0px rgba(52, 63, 85, 0.06), 0px 2px 2px 0px rgba(52, 63, 85, 0.06)',
        borderRadius: '0.375rem',
    },
    appMessage: {
        backgroundColor: '#EEEEFA',
        border: `1px solid ${iris200}`,
    },
    userCard: {
        backgroundColor: '#FFFFFF',
        border: `1px solid ${colorBrandNeutral200}`,
        marginRight: spacing40,
    },
    aiImage: {
        height: spacing60,
        width: spacing60,
        marginRight: spacing40,
    },
    noIcon: {
        marginLeft: spacing80,
    },
    userAvatar: {
    },
    controlsBox: {
        flex: '0 1 auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'end',
        marginBottom: spacing40,
    },
    micImg: {
        '&:hover svg': {
            fill: '#FFFFFF !important',
        }
    },
    micOnImg: {
        '& svg': {
            fill: '#026BC8 !important',
        }
    },
    replyField: {
        marginLeft: spacing40,
        marginRight: spacing40,
        width: '75%',
    },
    submitButton: {
        marginLeft: spacing30,
    },
    aiWaitBox: {
        marginLeft: spacing50,
        marginBottom: spacing60,
    },
    spinnerImg: {
        height: '40px',
    },
    informationText: {
        width: '75%',
    },
    buttonBox: {
        marginTop: spacing40,
        display: 'flex',
        justifyContent: 'space-between',
    },
    yesChip: {
        marginRight: spacing40,
    },
    advisorChip: {
        marginRight: spacing40,
    },
}), { index: 2});

export default function Chat({show}) {
    const intl = useIntl();
    const classes = useStyles();
    const history = useHistory();
    const { taskId } = useParams();

    // Experience SDK hooks
    const user = useUserInfo();
    const { setPageToolbar } = usePageControl();

    const { canCompleteTask, completeTask } = useWorkflow();
    const { storeResults } = useIipResults();

    const messagesScrollRef = useRef();
    const messagesRef = useRef();

    const {
        company,
        generateNextQuestion,
        generateEvaluation,
        generateResponseEvaluation,
        interviewAiResponse,
        interviewAiResponsePending,
        position,
        setTaskId
    } = useJobInfo();

    const [ recognition, setRecognition ] = useState();
    const [ transcribing, setTranscribing ] = useState(false);
    const [ state, setState ] = useState('initial');
    const [ showAiWait, setShowAiWait ] = useState(false);
    const [ messages, setMessages ] = useState([]);
    const [ replyMode, setReplyMode ] = useState('none')
    const [ reply, setReply ] = useState('');
    const [ enteredReply, setEnteredReply ] = useState();
    const [ done, setDone ] = useState(false);
    const [ questionNumber, setQuestionNumber ] = useState(1);
    const [ answeredYesNo, setAnsweredYesNo ] = useState();
    const [ advisorDone, setAdvisorDone ] = useState();
    const [ evaluationRating, setEvaluationRating ] = useState();

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

    const addMessages = useCallback(paramMessages => {
        const newMessages = [ ...messages ];
        for (const message of paramMessages) {
            newMessages.push(message);
        }
        setMessages(() => newMessages);
    }, [ messages ])

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

    useEffect(() => {
        switch(state) {
            case 'initial':
                // kick off the AI
                generateNextQuestion();
                setState('show-next-question');
                break;
            case 'show-next-question':
                if (!interviewAiResponsePending) {
                    setShowAiWait(false);
                    setReplyMode('text-long');
                    setState('process-answer');
                    const { content } = interviewAiResponse;
                    try {
                        const { question } = JSON.parse(content);
                        if (question) {
                            if (questionNumber === 1) {
                                addMessages([
                                    { type: 'assistant', message: intl.formatMessage({ id: 'Interview.firstQuestion'}, { name: user.firstName, question}) },
                                ]);
                            } else {
                                addMessages([
                                    { type: 'assistant', message: intl.formatMessage({ id: 'Interview.nextQuestion'}, { question}) },
                                ]);
                            }
                            setQuestionNumber(current => current+1);
                        } else {
                            addMessages([ { type: 'app', message: 'Sorry AI didn\'t respond as expected' }, ]);
                        }
                    } catch(error) {
                        logger.error('failed to parse next question', error);
                        addMessages([ { type: 'app', message: 'Sorry AI didn\'t respond as expected' }, ]);
                        setState('done');
                    }
                } else {
                    setShowAiWait(questionWaitMessages);
                }
                break;
            case 'process-answer':
                if (enteredReply) {
                    setEnteredReply();
                    setReplyMode('none');
                    generateResponseEvaluation(enteredReply);
                    setState('show-answer-evaluation');
                }
                break;
            case 'show-answer-evaluation':
                if (!interviewAiResponsePending) {
                    setShowAiWait(false);
                    const { content } = interviewAiResponse;
                    try {
                        const { rating, feedback } = JSON.parse(content);
                        if (rating && feedback) {
                            addMessages([
                                { type: 'assistant', message: `Your answer got a rating of **${rating}** out of 1-5.\n\n${feedback}` },
                                { type: 'app', message: 'Are you ready for another question?' },
                            ]);
                            setAnsweredYesNo();
                            setReplyMode('yes-no');
                            setState('generate-next-question');
                        } else {
                            addMessages([ { type: 'app', message: 'Sorry AI didn\'t respond as expected' }, ]);
                        }
                    } catch(error) {
                        logger.error('failed to parse evaluation:', content, error);
                        addMessages([ { type: 'app', message: 'Sorry AI didn\'t respond as expected' }, ]);
                        setState('done');
                    }
                } else {
                    setShowAiWait(evalWaitMessages);
                }
                break;
            case 'generate-next-question':
                if (answeredYesNo === true) {
                    addMessages([
                        { type: 'user', message: intl.formatMessage({ id: 'Interview.yesAnotherQuestionChip' }) },
                    ]);
                    generateNextQuestion();
                    setState('show-next-question');
                    setReplyMode('none');
                } else if (answeredYesNo === false) {
                    addMessages([
                        { type: 'user', message: intl.formatMessage({ id: 'Interview.noMoreQuestionsChip' }) },
                    ]);
                    if (questionNumber === 1) {
                        // haven't answered any questions
                        setState('done');
                        setDone(true);
                        setReplyMode('none');
                    } else {
                        setState('show-review');
                        generateEvaluation();
                        setReplyMode('none');
                    }
                }
                break;
            case 'show-review':
                if (!interviewAiResponsePending) {
                    setShowAiWait(false);
                    const { content } = interviewAiResponse;
                    try {
                        const { rating, feedback } = JSON.parse(content);
                        if (rating && feedback) {
                            addMessages([
                                { type: 'assistant', message: `Overall your rating is a **${rating}** out of 1-5.\n\n${feedback}` },
                                { type: 'app', message: 'Would you like to request coaching from your advisor?' },
                            ]);
                            setAdvisorDone();
                            setReplyMode('advisor-done');
                            setState('answer-advisor-done');
                            setEvaluationRating(rating);
                        } else {
                            addMessages([ { type: 'app', message: 'Sorry AI didn\'t respond as expected' }, ]);
                            setState('done');
                        }
                    } catch(error) {
                        logger.error('failed to parse evaluation:', content, error);
                        addMessages([ { type: 'app', message: 'Sorry AI didn\'t respond as expected' }, ]);
                        setState('done');
                    }
                } else {
                    setShowAiWait(evalWaitMessages);
                }
                break;
            case 'answer-advisor-done':
                if (advisorDone) {
                    setReplyMode('none');
                    storeResults({ company, position, rating: evaluationRating });
                }
                if (advisorDone === 'advisor') {
                    // fire request to start advisor workflow
                    addMessages([
                        { type: 'user', message: intl.formatMessage({ id: 'Interview.yesAdvisor' }) },
                        { type: 'app', message: 'You got it, I have sent a request to your advisor and they will reach out to you soon. Good luck!' },
                    ]);
                    setState('done');
                    completeTask({coaching: true});
                } else if (advisorDone === 'done') {
                    addMessages([
                        { type: 'user', message: intl.formatMessage({ id: 'Interview.noAdvisor' }) },
                        { type: 'app', message: 'Alright, this chat is complete. Thanks for using Intelligent Interview Prep.' },
                    ]);
                    setState('done');
                    completeTask({coaching: false});
                }
                break;
            default:
                break;
        }
    }, [
        addMessages,
        advisorDone,
        answeredYesNo,
        evaluationRating,
        done,
        enteredReply,
        interviewAiResponse,
        interviewAiResponsePending,
        position,
        state
    ])

    useEffect(() => {
        const { current: messagesElement } = messagesRef;
        const { current: messagesScrollElement } = messagesScrollRef;
        let messagesObserver, messagesResizeObserver;
        if (messagesElement && messagesScrollElement) {
            // observe messages mutations
            messagesObserver = new MutationObserver(scrollMessages(messagesScrollElement));
            messagesObserver.observe(messagesElement, { childList: true })

            messagesResizeObserver = new ResizeObserver(scrollMessages(messagesScrollElement));
            messagesResizeObserver.observe(messagesScrollElement);
        }

        return () => {
            if (messagesObserver) {
                messagesObserver.disconnect();
            }
            if (messagesResizeObserver) {
                messagesResizeObserver.disconnect();
            }
        }
    }, [messagesRef, messagesScrollRef])

    useEffect(() => {
        const recognition = new SpeechRecognition();
        setRecognition(recognition);
        recognition.continuous = true;
        recognition.lang = 'en-US';
        recognition.onstart = (event) => {
            console.log('onstart event', JSON.stringify(event))
        };
        recognition.onerror = (event) => {
            console.log('onerror event', JSON.stringify(event))
        };

        return () => {
            recognition.stop();
        }
    }, [])

    useEffect(() => {
        function processResults(event) {
            let newReply = '';
            const { resultIndex, results } = event;
            console.log('resultIndex', resultIndex);
            for (let i = resultIndex; i < results.length; ++i) {
                const result = results[i];
                if (result.isFinal) {
                    // add this to the reply
                    newReply += result[0].transcript;
                }
            }
            setReply(reply => reply + newReply);
        }
        if (recognition) {
            recognition.addEventListener('result', processResults);
            recognition.addEventListener('end', () => {
                setTranscribing(false);
            });
        }

        return () => {
            if (recognition) {
                recognition.stop();
                recognition.removeEventListener('result', processResults);
            }
        }
    }, [recognition])

    const toggleTranscription = useCallback(() => {
        if (recognition) {
            if (transcribing) {
                recognition.stop();
                setTranscribing(false);
                console.log('stopping transcription');
            } else {
                recognition.start();
                setTranscribing(true);
                console.log('starting transcription');
            }
        }
    }, [recognition, transcribing])

    const enterReply = useCallback(() => {
        if (reply && reply.length > 3) {
            setEnteredReply(reply);
            setReply('');
            addMessages([ { type: 'user', message: reply } ]);
            recognition.stop();
            setTranscribing(false);
        }
    }, [addMessages, reply])

    return (
        <Grid container direction='row' spacing='0' className={classNames(classes.root, {[classes.show]: show})}>
            <Grid item xs='12' className={classes.messagesGridItem}>
                <div className={classes.messagesOuterBox} ref={messagesScrollRef}>
                    <div className={classNames(classes.messagesInnerBox, classes.messagesBox)} ref={messagesRef}>
                        {messages.map((entry, index) => {
                            return (
                                <div
                                    key={index}
                                    className={classNames(
                                        classes.messageRow,
                                        {
                                            [classes.appMessageRow]: entry.type !== 'user',
                                            [classes.userMessageRow]: entry.type === 'user'
                                        }
                                    )}
                                    >
                                    {entry.type === 'app' && (
                                        <img
                                            src={aiImage}
                                            alt=''
                                            className={classes.aiImage}
                                        />
                                    )}
                                    <div
                                        className={classNames(
                                            classes.message,
                                            {
                                                [classes.noIcon]: !['app', 'user'].includes(entry.type),
                                                [classes.appMessage]: entry.type !== 'user',
                                                [classes.userCard]: entry.type === 'user'
                                        })}
                                    >
                                        <Typography component='div'>
                                            <ReactMarkdown>
                                                { entry.message }
                                            </ReactMarkdown>
                                        </Typography>
                                    </div>
                                    {entry.type === 'user' && (
                                        <Avatar className={classes.userAvatar} color={avatarColor}>{user.firstName.slice(0, 1)}</Avatar>
                                    )}
                                </div>
                            )
                        })}
                        {showAiWait && (
                            <div className={classes.aiWaitBox}>
                                <AiWait messages={showAiWait}/>
                            </div>
                        )}
                    </div>
                </div>
                {replyMode.startsWith('text') && (
                    <div className={classes.controlsBox}>
                        <TextField
                            className={classes.replyField}
                            fullWidth
                            label='Reply'
                            onChange={(e) => setReply(e.target.value)}
                            value={reply}
                            multiline={replyMode === 'text-long'}
                            minRows={1}
                            maxRows={10}
                            InputProps={{
                                endAdornment:
                                    <InputAdornment position='end'>
                                        <Tooltip title='Dictate'>
                                            <IconButton
                                                className={classNames(
                                                    classes.micImg,
                                                    {
                                                        [classes.micOnImg]: transcribing,
                                                    }
                                                )}
                                                color='secondary'
                                                onClick={toggleTranscription}
                                            >
                                                <svg
                                                    width='17'
                                                    height='16'
                                                    viewBox='0 0 17 16'
                                                    fill='#5B5E65'
                                                    xmlns='http://www.w3.org/2000/svg'
                                                >
                                                    <path
                                                        fillRule='evenodd'
                                                        clipRule='evenodd'
                                                        d='M13.1311 6H12.6311C12.3549 6 12.1311 6.22375 12.1311 6.5V8C12.1311 10.3375 10.1158 12.2131 7.73142 11.9806C5.65329 11.7778 4.1311 9.90969 4.1311 7.82187V6.5C4.1311 6.22375 3.90735 6 3.6311 6H3.1311C2.85485 6 2.6311 6.22375 2.6311 6.5V7.755C2.6311 10.5563 4.63017 13.0534 7.3811 13.4328V14.5H5.6311C5.35485 14.5 5.1311 14.7238 5.1311 15V15.5C5.1311 15.7763 5.35485 16 5.6311 16H10.6311C10.9074 16 11.1311 15.7763 11.1311 15.5V15C11.1311 14.7238 10.9074 14.5 10.6311 14.5H8.8811V13.4447C11.5595 13.0772 13.6311 10.7781 13.6311 8V6.5C13.6311 6.22375 13.4074 6 13.1311 6ZM8.1311 11C9.78798 11 11.1311 9.65688 11.1311 8V3C11.1311 1.34313 9.78798 0 8.1311 0C6.47423 0 5.1311 1.34313 5.1311 3V8C5.1311 9.65688 6.47423 11 8.1311 11ZM6.6311 3C6.6311 2.17281 7.30392 1.5 8.1311 1.5C8.95829 1.5 9.6311 2.17281 9.6311 3V8C9.6311 8.82719 8.95829 9.5 8.1311 9.5C7.30392 9.5 6.6311 8.82719 6.6311 8V3Z'
                                                        />
                                                </svg>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title='Submit'>
                                            <IconButton className={classes.submitButton} color='primary' onClick={enterReply}>
                                                <Icon name='arrow-up'/>
                                            </IconButton>
                                        </Tooltip>
                                    </InputAdornment>
                            }}
                        />
                    </div>
                )}
                {replyMode === 'yes-no' && (
                    <div className={classes.controlsBox}>
                        <Chip
                            className={classes.yesChip}
                            label={intl.formatMessage({ id: 'Interview.yesAnotherQuestionChip'})}
                            onClick={() => setAnsweredYesNo(true)}
                        />
                        <Chip
                            className={classes.noChip}
                            label={intl.formatMessage({ id: 'Interview.noMoreQuestionsChip'})}
                            onClick={() => setAnsweredYesNo(false) }
                        />
                    </div>
                )}
                {replyMode === 'advisor-done' && (
                    <div className={classes.controlsBox}>
                        <Chip
                            className={classes.advisorChip}
                            label={intl.formatMessage({ id: 'Interview.yesAdvisor'})}
                            onClick={() => setAdvisorDone('advisor')}
                        />
                        <Chip
                            className={classes.noAdvisorChip}
                            label={intl.formatMessage({ id: 'Interview.noAdvisor'})}
                            onClick={() => setAdvisorDone('done')}
                        />
                    </div>
                )}
            </Grid>
        </Grid>
    );
}

Chat.propTypes = {
    show: PropTypes.bool.isRequired,
}