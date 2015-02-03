'use strict';

define(['app'], function (app) {
    var commisionService = function ($resource, $q) {
        var webapi = app.config.webapi.url;

        var query = function (condition, pageIndex, pageSize) {
            condition.pageIndex = pageIndex;
            condition.pageSize = pageSize;
            condition.reqtype = "CommisionQuery";

            var api = $resource(webapi);

            var defer = $q.defer();

            api.save(condition, function (data) {
                defer.resolve(data);
            }, function (data) {
                defer.reject(data);
            });

            return defer.promise;
        }

        var init = function () {
            var condition = new Object();
            condition.reqtype = "InitSalesManager";

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
            Init: init
        }
    }

    commisionService.$inject = ['$resource', '$q'];

    app.register.factory('commisionService', commisionService);
});