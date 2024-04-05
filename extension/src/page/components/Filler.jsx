// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.
/* eslint-disable @calm/react-intl/missing-formatted-message */

import React from 'react';

import classNames from 'classnames';

import {
    Button,
    Card,
    CardContent,
    Chip,
    Grid,
    makeStyles,
    StatusLabel,
    Typography
} from '@ellucian/react-design-system/core'
import {
    colorBorderGlobalFocus,
    spacing20,
    spacing30,
    spacing40,
    spacing60,
    spacing90,
} from '@ellucian/react-design-system/core/styles/tokens';
import { Icon } from '@ellucian/ds-icons/lib';

import ronaldoImage from '../../assets/images/ronaldo.svg';
import trishImage from '../../assets/images/trish.png';

// initialize logging for this card
import { initializeLogging } from '../../util/log-level';
initializeLogging('default');

const useStyles = makeStyles(() => ({
    root: {
        height: '100%',
        marginTop: spacing90,
        marginLeft: spacing90,
        marginRight: spacing90,
    },
    bottom30: {
        marginBottom: spacing30,
    },
    bottom40: {
        marginBottom: spacing40,
    },
    left30: {
        marginLeft: spacing30,
    },
    left40: {
        marginLeft: spacing40,
    },
    right40: {
        marginRight: spacing40,
    },
    top40: {
        marginTop: spacing40,
    },
    tipsBox: {
        display: 'flex',
        flexDirection: 'column',
    },
    columnTitle: {
        marginBottom: spacing60,
    },
    tipsBoxsBox: {
        display: 'flex',
        flexDirection: 'column',
    },
    createHeaderBox: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: spacing30,
    },
    tipHeaderIcon: {
        marginRight: spacing30,
    },
    createControlsBox: {
        marginTop: spacing30,
    },
    chipBox: {
        display: 'flex',
        alignItems: 'center',
    },
    chipIcon: {
        marginLeft: spacing30,
    },
    eventBox: {
        borderLeftColor: colorBorderGlobalFocus,
        borderLeftWidth: spacing20,
        borderLeftStyle: 'solid',
        marginLeft: spacing30,
        marginBottom: spacing60,
    },
    storyBox: {
        display: 'flex',
    },
    storyInsideBox: {
        flex: '1 1 auto',
        marginLeft: spacing30,
        marginBottom: spacing30,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    storyImage: {
        width: '99.5px',
    },
}), { index: 2});

export default function Filler() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <div className={classes.tipsBox}>
                        <Typography className={classes.columnTitle} variant='h3' component='div'>
                            Tips to find your next job
                        </Typography>
                        <Card className={classes.bottom40}>
                            <CardContent>
                                <div className={classes.tipsBoxesBox}>
                                    <div className={classes.createHeaderBox}>
                                        <Icon className={classes.tipHeaderIcon} name='file-text'/>
                                        <Typography variant='body1' component='div'>
                                            Create or update your CV
                                        </Typography>
                                    </div>
                                    <Typography variant='body3' component='div'>
                                        Craft a strong CV for your first job by emphasizing contact details, education, skills, and relevant experiences. Tailor it to each application for maximum impact and increased chances of success
                                    </Typography>
                                    <div className={classes.createControlsBox}>
                                        <Chip label={
                                            <div className={classes.chipBox}>
                                                Done
                                                <Icon className={classes.chipIcon} name='check-feedback'/>
                                            </div>
                                        }/>
                                        <Chip className={classes.left30} label={
                                            <div className={classes.chipBox}>
                                                Give me more Details
                                                <Icon className={classes.chipIcon} name='plus-circle'/>
                                            </div>
                                        }/>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className={classes.bottom40}>
                            <CardContent>
                                <div className={classes.tipsBoxesBox}>
                                    <div className={classes.createHeaderBox}>
                                        <Icon className={classes.tipHeaderIcon} name='email'/>
                                        <Typography variant='body1' component='div'>
                                            What to do after an Interview.
                                        </Typography>
                                    </div>
                                    <Typography variant='body3' component='div'>
                                        After an interview, send a personalized thank-you email expressing gratitude for the opportunity and reiterating your interest in the position. Follow up with the hiring manager within a week to inquire about the next steps and demonstrate your enthusiasm.
                                    </Typography>
                                    <div className={classes.createControlsBox}>
                                        <Chip label={
                                            <div className={classes.chipBox}>
                                                Done
                                                <Icon className={classes.chipIcon} name='check-feedback'/>
                                            </div>
                                        }/>
                                        <Chip className={classes.left30} label={
                                            <div className={classes.chipBox}>
                                                Give me more Details
                                                <Icon className={classes.chipIcon} name='plus-circle'/>
                                            </div>
                                        }/>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <div className={classes.tipsBox}>
                        <Typography className={classes.columnTitle} variant='h3' component='div'>
                            Upcoming Events
                        </Typography>
                        <div className={classes.eventBox}>
                            <div className={classes.left40}>
                                <Typography className={classes.bottom30} variant='body3' component='div'>
                                    MAY 31 | 11-12PM | VIRTUAL
                                </Typography>
                                <Typography className={classes.bottom40} variant='body2' component='div'>
                                    Career Coaching for Graduate & Professional Students
                                </Typography>
                                <Button>Register</Button>
                            </div>
                        </div>
                        <div className={classes.eventBox}>
                            <div className={classes.left40}>
                                <Typography className={classes.bottom30} variant='body3' component='div'>
                                    JUNE 1 | 10:11PM | VIRTUAL
                                </Typography>
                                <Typography className={classes.bottom40} variant='body2' component='div'>
                                    Finding Your Place in the World of Work
                                </Typography>
                                <Button>Register</Button>
                            </div>
                        </div>
                        <div className={classes.eventBox}>
                            <div className={classes.left40}>
                                <Typography className={classes.bottom30} variant='body3' component='div'>
                                    JUNE 3 | 1-2PM | VIRTUAL
                                </Typography>
                                <Typography className={classes.bottom40} variant='body2' component='div'>
                                    How do You Find a Great Company to Work For?
                                </Typography>
                                <Button>Register</Button>
                            </div>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <div className={classes.tipsBox}>
                        <Typography className={classes.columnTitle} variant='h3' component='div'>
                            Alumni Stories
                        </Typography>
                        <Card
                            className={classes.bottom40}
                            spacingOptions={{
                                        spacing: 'none',
                                    }}
                        >
                            <CardContent>
                                <div className={classes.storyBox}>
                                    <img className={classes.storyImage} src={ronaldoImage} alt=""/>
                                    <div className={classes.storyInsideBox}>
                                        <Typography className={classes.top40} variant='h3' component='div'>
                                            {'Ronaldo\'s Story'}
                                        </Typography>
                                        <Typography variant='body3' component='div'>
                                            {'“I thought I wanted to be a doctor, but when that didn’t pan out, I was back at square one. I didn’t even know this career existed before--I wish I had!”'}
                                        </Typography>
                                        <div className={classes.top40}>
                                            <StatusLabel
                                                text="Changing Career"
                                            />
                                            <StatusLabel
                                                className={classes.left30}
                                                text="4 Year Degree"
                                            />
                                        </div>
                                    </div>
                                    <div className={classNames(classes.top40, classes.left40, classes.right40)}>
                                        <Icon name='bookmark'/>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card
                            className={classes.bottom40}
                            spacingOptions={{
                                        spacing: 'none',
                                    }}
                        >
                            <CardContent>
                                <div className={classes.storyBox}>
                                    <img className={classes.storyImage} src={trishImage} alt=""/>
                                    <div className={classes.storyInsideBox}>
                                        <Typography className={classes.top40} variant='h3' component='div'>
                                            {'Trish\'s Story'}
                                        </Typography>
                                        <Typography variant='body3' component='div'>
                                            {'“Thanks to Intelligent Interview Prep, I found my dream job! It guided me through the prep process for interviewing with the company I wanted to work for, definitely a great tool.”'}
                                        </Typography>
                                        <div className={classes.top40}>
                                            <StatusLabel
                                                text="Creative Career"
                                            />
                                            <StatusLabel
                                                className={classes.left30}
                                                text="5 Year Degree"
                                            />
                                        </div>
                                    </div>
                                    <div className={classNames(classes.top40, classes.left40, classes.right40)}>
                                        <Icon name='bookmark'/>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <Button variant='text'>
                        VIEW MORE TIPS
                    </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Button variant='text'>
                        VIEW ALL UPCOMING EVENTS
                    </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Button variant='text'>
                        VIEW MORE STORIES
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
}
