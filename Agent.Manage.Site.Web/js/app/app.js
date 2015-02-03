
'use strict';

define(['param', 'appconfig'], function () {

    var app = angular.module('agent', ['ngRoute', 'ngResource']);

    app.config(['$routeProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$httpProvider',
        function ($routeProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $httpProvider) {

            //angular sys-collections
            app.register =
            {
                controller: $controllerProvider.register,
                directive: $compileProvider.directive,
                filter: $filterProvider.register,
                factory: $provide.factory,
                service: $provide.service
            };

            //Define routes - controllers will be loaded dynamically
            var route = function ($q, $rootScope, dependencies) {
                var defer = $q.defer();
                require(dependencies, function () {
                    defer.resolve();
                });

                return defer.promise;
            };

            $routeProvider
                .when('/', {
                    templateUrl: 'views/partials/default.html'
                })
                .when('/cash', {
                    templateUrl: 'views/partials/cashProcessing.html',
                    controller: 'cashController',
                    resolve: {
                        load: ['$q', '$rootScope', function ($q, $rootScope) {
                            return route($q, $rootScope, ['appDirectives', 'cashService', 'cashController']);
                        }]
                    }
                })
                .when('/commision', {
                    templateUrl: 'views/partials/commisionQuery.html',
                    controller: 'commisionController',
                    resolve: {
                        load: ['$q', '$rootScope', function ($q, $rootScope) {
                            return route($q, $rootScope, ['commisionService', 'commisionController']);
                        }]
                    }
                })
                .when('/financial', {
                    templateUrl: 'views/partials/financialFeedback.html',
                    controller: 'financialController',
                    resolve: {
                        load: ['$q', '$rootScope', function ($q, $rootScope) {
                            return route($q, $rootScope, [ 'financialController']);
                        }]
                    }
                })
                .when('/invitation', {
                    templateUrl: 'views/partials/invitationConfirm.html',
                    controller: 'invitationController',
                    resolve: {
                        load: ['$q', '$rootScope', function ($q, $rootScope) {
                            return route($q, $rootScope, ['invitationController']);
                        }]
                    }
                })
                .when('/order', {
                    templateUrl: 'views/partials/orderQuery.html',
                    controller: 'orderController',
                    resolve: {
                        load: ['$q', '$rootScope', function ($q, $rootScope) {
                            return route($q, $rootScope, ['appDirectives', 'orderService', 'orderController']);
                        }]
                    }
                })
                .when('/submit', {
                    templateUrl: 'views/partials/submitConfirm.html',
                    controller: 'submitController',
                    resolve: {
                        load: ['$q', '$rootScope', function ($q, $rootScope) {
                            return route($q, $rootScope, ['appDirectives', 'submitService', 'submitController']);
                        }]
                    }
                })
                .when('/report', {
                    templateUrl: 'views/partials/report.html',
                    controller: 'reportController',
                    resolve: {
                        load: ['$q', '$rootScope', function ($q, $rootScope) {
                            return route($q, $rootScope, ['appDirectives', 'reportController']);
                        }]
                    }
                })
                .otherwise({ redirectTo: '/' });

            //Post param 
            $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';

            $httpProvider.defaults.transformRequest = function (data) {
                //return angular.isObject(data) && !(data instanceof FileList) && !(value instanceof File) ? param(data) : (data instanceof FileList || data instanceof File) ? paramFile(data) : data;

                if (angular.isObject(data)) {
                    if (data instanceof FileList || data instanceof File) {
                        return paramFile(data);
                    }
                    else {
                        return param(data);
                    }
                }
                else
                    return data;
            }

            app.config =
            {
                'webapi': { 'url': appconfig.webapi },
                'login': { 'url': appconfig.login },
                'index': { 'url': appconfig.index }
            };

        }]);

    app.run(['$rootScope', '$window', '$location', '$log', '$timeout', function ($rootScope, $window, $location, $log, $timeout) {
        var locationChangeStartOff = $rootScope.$on('$locationChangeStart', locationChangeStart);
        var locationChangeSuccessOff = $rootScope.$on('$locationChangeSuccess', locationChangeSuccess);

        var routeChangeStartOff = $rootScope.$on('$routeChangeStart', routeChangeStart);
        var routeChangeSuccessOff = $rootScope.$on('$routeChangeSuccess', routeChangeSuccess);

        function locationChangeStart(event) {
            //$log.log('locationChangeStart');
            //$log.log(arguments);
        }

        function locationChangeSuccess(event) {
            //$log.log('locationChangeSuccess');
            //$log.log(arguments);
        }

        function routeChangeStart(event) {
            //$log.log('routeChangeStart');
            //$log.log(arguments);
        }

        function routeChangeSuccess(event) {
            //$log.log('routeChangeSuccess');
            //$log.log(arguments);
        }
    }]);

    return app;
});
