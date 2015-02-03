'use strict';

define(['app'], function (app) {
    var cashController = function ($scope, $routeParams, cashService) {
        //是否显示查询条件
        $scope.isShowCondition = true;
        //查询条件
        $scope.condition =
            {
                agentName: "",
                agentMobile: "",
                agentIdCard: "",
                payStatus: 0,
                applyTimeBegin: "",
                applyTimeEnd: "",
                payTimeBegin: "",
                payTimeEnd: ""
            };
        //分页大小
        $scope.pageSize = 10;
        //当前页
        $scope.pageIndex = 1;
        //查询结果订单信息
        $scope.cashList = new Object();
        //查询结果总记录数
        $scope.totalNum = 0;
        //查询结果总页数
        $scope.pageNum = 1;
        //本次提供佣金
        $scope.totalAmt = 0;
        //查询结果
        $scope.content = new Object();
        //收起或展开查询条件
        $scope.toggleCondition = function () {
            $scope.isShowCondition = !$scope.isShowCondition;
        }
        //重置查询条件
        $scope.clearCondition = function () {
            $scope.condition =
            {
                agentName: "",
                agentMobile: "",
                agentIdCard: "",
                payStatus: 0,
                applyTimeBegin: "",
                applyTimeEnd: "",
                payTimeBegin: "",
                payTimeEnd: ""
            };
            $scope.orderList = new Object();
        }
        //查询
        $scope.querycashList = function (isClickQuery) {
            if (isClickQuery) {
                $scope.pageIndex = 1;
            }
            cashService.Query($scope.condition, $scope.pageIndex, $scope.pageSize).then(function (data) {
                if (data.resCode == -1) {
                    window.parent.location.href = app.config.login.url;
                    return;
                }
                if (data.resCode == 0) {
                    //查询结果
                    $scope.content = data.content;
                    //查询结果订单信息
                    $scope.cashList = $scope.content.applyList;
                    //查询结果总记录数
                    $scope.totalNum = $scope.content.totalNum;
                    //查询结果总页数
                    $scope.pageNum = $scope.totalNum % $scope.pageSize == 0 ? parseInt($scope.totalNum / $scope.pageSize)
                                     : parseInt($scope.totalNum / $scope.pageSize) + 1;
                    //本次提供佣金
                    $scope.totalAmt = $scope.content.totalAmt;
                } else {
                    alert('查询异常');
                }
            },
                function (error) {
                    alert('通讯异常');
                });
        }
        //导出
        $scope.exportRecord = function () {
            if ($scope.condition.agentName == "" &&
                $scope.condition.agentMobile == "" &&
                $scope.condition.agentIdCard == "" &&
                $scope.condition.payStatus == 0 &&
                $scope.condition.applyTimeBegin == "" &&
                $scope.condition.applyTimeEnd == "" &&
                $scope.condition.payTimeBegin == "" &&
                $scope.condition.payTimeEnd == "") {
                alert('请选择导出范围');
                return;
            }
            document.cashQueryForm.submit();
        }
        //首页
        $scope.firstPage = function () {
            if ($scope.pageIndex != 1) {
                $scope.pageIndex = 1;
                $scope.querycashList();
            }
        }
        //上一页
        $scope.prePage = function () {
            if ($scope.pageIndex > 1) {
                $scope.pageIndex -= 1;
                $scope.querycashList();
            }
        }
        //下一页
        $scope.nextPage = function () {
            if ($scope.pageIndex < $scope.pageNum) {
                $scope.pageIndex += 1;
                $scope.querycashList();
            }
        }
        //尾页
        $scope.lastPage = function () {
            if ($scope.pageIndex != $scope.pageNum) {
                $scope.pageIndex = $scope.pageNum;
                $scope.querycashList();
            }
        }
        //跳转到指定页
        $scope.jumpPage = function () {
            if ($scope.pageIndex >= 1 && $scope.pageIndex <= $scope.pageNum) {
                $scope.querycashList();
            }
        }
    }

    cashController.$inject = ['$scope', '$routeParams', 'cashService'];

    app.register.controller('cashController', cashController);
});