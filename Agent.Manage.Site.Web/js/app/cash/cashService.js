'use strict';

define(['app'], function (app) {
    var cashService = function ($resource, $q) {
        var webapi = app.config.webapi.url;

        var query = function (condition, pageIndex, pageSize) {
            condition.pageIndex = pageIndex;
            condition.pageSize = pageSize;
            condition.reqtype = "QueryWithdrawApply";

            var api = $resource(webapi);

            var defer = $q.defer();

            api.save(condition, function (data) {
                defer.resolve(data);
            }, function (data) {
                defer.reject(data);
            });

            return defer.promise;
        }

        var exportapply = function (condition) {
            condition.reqtype = "ExportWithdrawApply";

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
            Query: query,
            Export: exportapply
        }
    }

    cashService.$inject = ['$resource', '$q'];

    app.register.factory('cashService', cashService);
});