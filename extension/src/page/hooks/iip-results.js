// Copyright 2021-2023 Ellucian Company L.P. and its affiliates.

import { useCardInfo, useData } from '@ellucian/experience-extension-utils';

import log from 'loglevel';
const logger = log.getLogger('default');

async function storeResults({
    authenticatedEthosFetch,
    cardId,
    cardPrefix,
    company,
    iipResultsPipeline,
    position,
    rating
}) {
    const urlSearchParameters = new URLSearchParams({
        cardId,
        cardPrefix,
    }).toString();
    const resourcePath = `${iipResultsPipeline}?${urlSearchParameters}`

    const ratingNumber = Number(rating);
    const body = {
        company: company,
        position: position,
        rating: isNaN(ratingNumber) ? 1 : ratingNumber
    }

    try {
        const start = new Date();

        const response = await authenticatedEthosFetch(resourcePath, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
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

export function useIipResults() {
    // Experience SDK hooks
    const { authenticatedEthosFetch } = useData();
    const {
        cardConfiguration: {
            iipResultsPipeline,
        },
        cardId,
        serverConfigContext: { cardPrefix },
    } = useCardInfo();


    return {
        storeResults: (data) => storeResults({ ...data, authenticatedEthosFetch, cardId, cardPrefix, iipResultsPipeline }),
    }
}


