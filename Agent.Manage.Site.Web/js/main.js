require.config({
    baseUrl: 'js/app',
    paths: {
        'param': 'common/paramResolver',
        'appconfig': 'common/appconfig',
        'appDirectives': 'common/directives',
        'app': 'app',
        'financialController': 'financial/controllers/financialController',
        'cashController': 'cash/controllers/cashController',
        'commisionController': 'commision/controllers/commisionController',
        'invitationController': 'invitation/controllers/invitationController',
        'orderController': 'order/controllers/orderController',
        'submitController': 'submit/controllers/submitController',
        'reportController':'report/controllers/reportController',
        'orderService': 'order/orderService',
        'cashService': 'cash/cashService',
        'submitService': 'submit/submitService',
        'commisionService': 'commision/commisionService',
        'fanancialService': 'financial/financialService',
        'invitationService':'invitation/invitationService'
    }
});

require(['app'], function (app) {
    angular.bootstrap(document, ['agent']);
});