/**
 * Copyright © 2016-2019 Threema GmbH (https://threema.ch/).
 *
 * This file is part of Threema Web.
 *
 * Threema Web is free software: you can redistribute it and/or modify it
 * under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or (at
 * your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero
 * General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Threema Web. If not, see <http://www.gnu.org/licenses/>.
 */

import {AsyncEvent} from 'ts-events';

import './components';
import config from './config';
import './controllers';
import './directives';
import './filters';
import './partials/messenger';
import './partials/welcome';
import './services';
import './threema/container';

// Configure asynchronous events
AsyncEvent.setScheduler(function(callback) {
    // Replace the default setImmediate() call by a setTimeout(, 0) call
    setTimeout(callback, 0);
});

// Create app module and set dependencies
angular.module('3ema', [
    // Angular
    'ngAnimate',
    'ngSanitize',
    'ngAria',

    // 3rd party
    'ui.router',
    'angular-inview',
    'monospaced.qrcode',
    'luegg.directives',
    'pascalprecht.translate',
    'ngMaterial',

    // Own
    '3ema.filters',
    '3ema.components',
    '3ema.directives',
    '3ema.container',
    '3ema.services',
    '3ema.controllers',
    '3ema.welcome',
    '3ema.messenger',
])

// Set versions
.value('VERSION', config.VERSION)
.value('PROTOCOL_VERSION', 2)

// Configuration object
.constant('CONFIG', config)

// Set cache bust parameter
.constant('CACHE_BUST', `v=${config.VERSION}`)

// Constants to be used by controllers
.constant('BROWSER_MIN_VERSIONS', {
    FF: 60,
    CHROME: 65,
    OPERA: 52,
    SAFARI: 11,
})

// Set default route
.config(['$urlRouterProvider', ($urlRouterProvider) => {
    $urlRouterProvider.otherwise('/welcome');
}])

// Configure i18n / l10n
.config(['$translateProvider', ($translateProvider: ng.translate.ITranslateProvider) => {
    $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
    $translateProvider.useMessageFormatInterpolation();
    $translateProvider
        .useStaticFilesLoader({
            prefix: 'i18n/',
            suffix: '.json',
        })
        .uniformLanguageTag('java')
        .registerAvailableLanguageKeys(['cs', 'de', 'en', 'es', 'fr', 'nl', 'sk', 'uk', 'zh'], {
            'cs_*': 'cs',
            'de_*': 'de',
            'en_*': 'en',
            'es_*': 'es',
            'fr_*': 'fr',
            'nl_*': 'nl',
            'sk_*': 'sk',
            'uk_*': 'uk',
            'zh_*': 'zh',
        })
        .determinePreferredLanguage()
        .fallbackLanguage('en');
}])

// Configure theme
.config(['$mdThemingProvider', ($mdThemingProvider) => {
    $mdThemingProvider.theme('default')
        .primaryPalette('grey', {
             default: '800',
        })
        .accentPalette('teal', {
            default: '500',
        });
}])

// Optimizations: https://docs.angularjs.org/guide/production
.config(['$compileProvider', ($compileProvider) => {
    // Disable debug info for improved performance
    // TODO: Somehow breaks overflow: scroll on chat window.
    // Comment for now.
    // $compileProvider.debugInfoEnabled(false);
}])

// Add cache busting parameter to some HTTP requests
.config(['$httpProvider', ($httpProvider: ng.IHttpProvider) => {
    $httpProvider.interceptors.push(['CACHE_BUST', (CACHE_BUST: string) => {
        return {
            request: (conf) => {
                if (conf.url.indexOf('partials/') !== -1 ||
                    conf.url.indexOf('directives/') !== -1 ||
                    conf.url.indexOf('components/') !== -1 ||
                    conf.url.indexOf('i18n/') !== -1) {
                    const separator = conf.url.indexOf('?') === -1 ? '?' : '&';
                    conf.url = conf.url + separator + CACHE_BUST;
                }
                return conf;
            },
        };
    }]);
}])

;
