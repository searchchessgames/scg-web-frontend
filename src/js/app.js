angular.module('scg', [
    'scg.controller',
    'scg.filter',
    'ui.router',
]);

angular.module('scg').constant('BASE_HOST', '//api.' + window.location.host);

angular.module('scg').config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    'use strict';

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');

    $stateProvider.state('index', {
        url: '/',
        views: {
            'main': {
                templateUrl: '/index.html',
                controller: 'IndexCtrl'
           }
        }
    });

    $stateProvider.state('search', {
        url: '/search/:query',
        views: {
            'main': {
                templateUrl: '/search.html',
                controller: 'SearchCtrl'
            }
        }
    });

    $stateProvider.state('game', {
        url: '/game/:slug',
        views: {
            'main': {
                templateUrl: '/game.html',
                controller: 'GameCtrl'
            }
        }
    });
});
