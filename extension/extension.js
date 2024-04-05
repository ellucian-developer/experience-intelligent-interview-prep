// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

module.exports = {
    name: 'intelligent-interview-prep',
    publisher: '',
    cards: [{
        type: 'LaunchCard',
        source: './src/cards/Launch',
        title: 'Intelligent Interview Prep',
        displayCardType: 'intelligent-interview-prep',
        description: 'Launch\'s Intelligent Interview Prep',
        configuration: {
            client: [{
                key: 'academicProgramPipeline',
                label: 'Academic Program Pipeline',
                type: 'text',
                required: false
            }, {
                key: 'generateCompanyInfoPipeline',
                label: 'Generate Company Info Pipeline',
                type: 'text',
                required: true
            }, {
                key: 'generateInterviewTipsPipeline',
                label: 'Generate Interview Tips Pipeline',
                type: 'text',
                required: true
            }, {
                key: 'generateInterviewResponsePipeline',
                label: 'Generate Interview Response Pipeline',
                type: 'text',
                required: true
            }, {
                key: 'iipResultsPipeline',
                label: 'IIP Results Pipeline',
                type: 'text',
                required: true
            }, {
                key: 'requestInterviewWorkflowId',
                label: 'Request Interview Workflow Id',
                type: 'text',
                required: true
            }],
            server: [{
                key: 'ethosApiKey',
                label: 'Ethos API Key',
                type: 'password',
                required: true
            }, {
                key: 'openAiApiKey',
                label: 'OpenAI API Key',
                type: 'password',
                required: true
            }]
        }
    }],
    page: {
        fullWidth: true,
        source: './src/page'
    }
}
