// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import { useData } from '@ellucian/experience-extension-utils';
import { useJobInfo } from '../../page/hooks/JobInfo';

import log from 'loglevel';
const logger = log.getLogger('default');

async function completeTask({ authenticatedEthosFetch, coaching = false, taskId }) {
    if (!taskId) {
        logger.info('No taskId on the URL. Can\'t complete a workflow task');
        return
    }

    const resourcePath = `workflow-external-tasks/${taskId}/complete`;
    try {
        const start = new Date();

        const body = {
            outcome: coaching ? 'completed_coaching' : 'completed',
            output: [
                {
                    name: 'evaluation',
                    type: 'string',
                    value: '3'
                }
            ]
        }

        const response = await authenticatedEthosFetch(resourcePath, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/vnd.hedtech.integration.v1.0.0+json',
                Accept: 'application/vnd.hedtech.integration.v1.0.0+json'
            },
            body: JSON.stringify(body)
        });

        const end = new Date();
        logger.debug(`post ${resourcePath} time: ${end.getTime() - start.getTime()}`);

        let result;
        if (response) {
            switch (response.status) {
                case 200:
                    try {
                        const data = await response.json();

                        result = {
                            data,
                            status: 'success'
                        };
                    } catch (error) {
                        result = {
                            error: {
                                message: 'unable to parse response',
                                statusCode: 500
                            }
                        };
                    }
                    break;
                default:
                    result = {
                        error: {
                            message: 'server error',
                            statusCode: response.status
                        }
                    };
            }
        }

        return result;
    } catch (error) {
        logger.error(`unable to post to: ${resourcePath}`, error);
        throw error;
    }
}

export function useWorkflow() {
    // Experience SDK hooks
    const { authenticatedEthosFetch } = useData();
    const { taskId } = useJobInfo();

    return {
        canCompleteTask: authenticatedEthosFetch && taskId,
        completeTask: ({ coaching }) => completeTask({ authenticatedEthosFetch, coaching, taskId }),
    }
}


