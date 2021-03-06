/**
 * @fileoverview Validates if the HTML of a page is AMP valid
 */

import * as amphtmlValidator from 'amphtml-validator';

import { Category } from '../../enums/category';
import { RuleContext } from '../../rule-context';
import { IRule, IRuleBuilder } from '../../types';
import { debug as d } from '../../utils/debug';

const debug: debug.IDebugger = d(__filename);

import { ITargetFetchEnd } from '../../types';

/*
 * ------------------------------------------------------------------------------
 * Public
 * ------------------------------------------------------------------------------
 */

const rule: IRuleBuilder = {
    create(context: RuleContext): IRule {
        let validPromise;
        const errorsOnly = context.ruleOptions && context.ruleOptions['errors-only'] || false;
        let events: Array<ITargetFetchEnd> = [];

        const onTargetFetchEnd = (fetchEnd: ITargetFetchEnd) => {
            const { response: { body: { content }, statusCode } } = fetchEnd;

            if (statusCode !== 200 || !content) {
                return;
            }

            // events has to be an array in order to work with the local connector.
            events.push(fetchEnd);
            validPromise = amphtmlValidator.getInstance();
        };

        const onScanEnd = async () => {
            if (!events || events.length === 0) {
                debug('No valid content');

                return;
            }

            for (const event of events) {
                const { resource, response: { body: { content } } } = event;
                const validator = await validPromise;
                const result = validator.validateString(content);

                for (let i = 0; i < result.errors.length; i++) {
                    const error = result.errors[i];
                    let message = error.message;

                    if (error.specUrl !== null) {
                        message += ` (${error.specUrl})`;
                    }

                    // We ignore errors that are not 'ERROR' if user has configured the rule like that
                    if (errorsOnly && error.severity !== 'ERROR') {
                        debug(`AMP error doesn't meet threshold for reporting`);
                    } else {
                        await context.report(resource, null, message, null, { column: error.column, line: error.line });
                    }
                }
            }

            // clear events for watcher.
            events = [];
        };

        return {
            'scan::end': onScanEnd,
            'targetfetch::end': onTargetFetchEnd
        };
    },
    meta: {
        docs: {
            category: Category.performance,
            description: `Require HTML page to be AMP valid.`
        },
        recommended: false,
        schema: [{
            additionalProperties: false,
            properties: { 'errors-only': { type: 'boolean' } },
            type: 'object'
        }],
        worksWithLocalFiles: true
    }
};

module.exports = rule;
