'use strict';

define(['app'], function (app) {
    var reportController = function ($scope) {
        //查询条件
        $scope.condition =
            {
                applyTimeBegin: "",
                applyTimeEnd: ""
            };


        //导出
        $scope.exportReport = function () {
            if (
                $scope.condition.applyTimeBegin == "" &&
                $scope.condition.applyTimeEnd == "") {
                alert('请选择导出范围');
                return;
            }
            document.reportForm.submit();
        }
    }

    reportController.$inject = ['$scope'];

    app.register.controller('reportController', reportController);
});