'use strict';

define(['app'], function (app) {
    var financialController = function ($scope, $routeParams) {
        $scope.files = null;
        $scope.setPath = function (files) {
            $scope.files = files;
            $scope.$apply(function () {
                $scope.filesName = $scope.files[0].name;
                var suffix = $scope.filesName.substr($scope.filesName.lastIndexOf('.'));
                if (suffix != '.xlsx' && suffix != '.xls') {
                    $scope.files = null;
                    $scope.filesName = "";
                    alert('只能上传xlsx和xls文件！')
                }
            })
        }
        $scope.upload = function () {
            if ($scope.files == null || $scope.files.length == 0) {
                alert('请先选择文件！');
                return false;
            }

            document.feedback.action = app.config.webapi.url + '?reqtype=FinancialUpload';
            document.feedback.submit();
        }
    }
    financialController.$inject = ['$scope', '$routeParams'];

    app.register.controller('financialController', financialController);
});