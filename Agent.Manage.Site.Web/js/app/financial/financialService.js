'use strict';

define(['app'], function (app) {
    var financialService = function ($resource, $http, $q) {
        var webapi = app.config.webapi.url + '?reqtype=FinancialUpload';

        var upload = function (files) {

            var api = $resource(webapi);

            var defer = $q.defer();

            $http.post(webapi, files, {
                headers: { 'Content-Type': undefined }
            })
            .success(function (data, status, headers, congfig) {
                defer.resolve(data);
            }).error(function (data, status, headers, congfig) {
                defer.reject(status);
            });

            return defer.promise;
        }

        return {
            Upload: upload
        }
    }

    financialService.$inject = ['$resource', '$http', '$q'];

    app.register.factory('financialService', financialService);
});