'use strict';

define(['app'], function (app) {
    var invitationService = function ($resource, $http, $q) {
        var webapi = app.config.webapi.url + '?reqtype=InvitationUpload';

        var upload = function (files) {

            //var fd = new FormData();
            //fd.append("file", files[0]);

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

            //api.save(files, function (data) {
            //    defer.resolve(data);
            //}, function (data) {
            //    defer.reject(data);
            //});

            return defer.promise;
        }

        return {
            Upload: upload
        }
    }

    invitationService.$inject = ['$resource', '$http', '$q'];

    app.register.factory('invitationService', invitationService);
});