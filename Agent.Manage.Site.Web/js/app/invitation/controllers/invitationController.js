'use strict';

define(['app'], function (app) {
    var invitationController = function ($scope, $routeParams) {
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
            var timestamp = Math.round(new Date().getTime() / 1000);
            window.parent.document.getElementById("myIframe").src = "biz.html#/invitation?v=" + timestamp;
            if ($scope.files == null || $scope.files.length == 0) {
                alert('请先选择文件！');
                return;
            }
            document.invitationForm.action = app.config.webapi.url + '?reqtype=InvitationUpload';
            document.invitationForm.submit();
        }
    }
    invitationController.$inject = ['$scope', '$routeParams'];

    app.register.controller('invitationController', invitationController);
});