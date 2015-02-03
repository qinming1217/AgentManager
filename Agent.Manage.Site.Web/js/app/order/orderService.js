'use strict';

define(['app'], function (app) {
    var orderService = function ($resource, $q) {
        var webapi = app.config.webapi.url;

        var query = function (condition, pageIndex, pageSize) {
            condition.pageIndex = pageIndex;
            condition.pageSize = pageSize;
            condition.reqtype = "OrderQuery";

            var api = $resource(webapi);

            var defer = $q.defer();

            api.save(condition, function (data) {
                defer.resolve(data);
            }, function (data) {
                defer.reject(data);
            });

            return defer.promise;
        }

        return {
            Query: query
        }
    }

    orderService.$inject = ['$resource', '$q'];

    app.register.factory('orderService', orderService);
});