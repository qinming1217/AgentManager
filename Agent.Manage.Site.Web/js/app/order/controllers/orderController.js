'use strict';

define(['app'], function (app) {
    var orderController = function ($scope, $routeParams, orderService) {
        $scope.salesManagerList =
            [
                { text: "张三", value: 0 },
                { text: "李四", value: 1 },
                { text: "王五", value: 2 }
            ]
        //是否显示查询条件
        $scope.isShowCondition = true;
        //查询条件
        $scope.condition =
            {
                customerName: "",
                mobileNo: "",
                idCard: "",
                agentIdCard: "",
                salesManager: 0,
                isSubmit: 0,
                applyTimeBegin: "",
                applyTimeEnd: ""
            };
        //分页大小
        $scope.pageSize = 2;
        //当前页
        $scope.pageIndex = 1;
        //查询结果订单信息
        $scope.orderList = new Object();
        //查询结果总记录数
        $scope.totalNum = 0;
        //查询结果总页数
        $scope.pageNum = 1;
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
                customerName: "",
                mobileNo: "",
                idCard: "",
                agentIdCard: "",
                salesManager: 0,
                isSubmit: 0,
                applyTimeBegin: "",
                applyTimeEnd: ""
            };
        }
        //查询
        $scope.queryOrderList = function () {
            orderService.Query($scope.condition, $scope.pageIndex, $scope.pageSize).then(function (data) {
                if (data.resCode == 0 && data.content.operationResult == true) {
                    //查询结果
                    $scope.content = data.content;
                    //查询结果订单信息
                    $scope.orderList = $scope.content.orderList;
                    //查询结果总记录数
                    $scope.totalNum = $scope.content.totalNum;
                    //查询结果总页数
                    $scope.pageNum = $scope.totalNum % $scope.pageSize == 0 ? parseInt($scope.totalNum / $scope.pageSize)
                                     : parseInt($scope.totalNum / $scope.pageSize) + 1;
                    $scope.isShowCondition = false;
                } else {
                    alert('查询异常');
                }
            },
                function (error) {
                    alert('通讯异常');
                });
        }
        //首页
        $scope.firstPage = function () {
            if ($scope.pageIndex != 1) {
                $scope.pageIndex = 1;
                $scope.queryOrderList();
            }
        }
        //上一页
        $scope.prePage = function () {
            if ($scope.pageIndex > 1) {
                $scope.pageIndex -= 1;
                $scope.queryOrderList();
            }
        }
        //下一页
        $scope.nextPage = function () {
            if ($scope.pageIndex < $scope.pageNum) {
                $scope.pageIndex += 1;
                $scope.queryOrderList();
            }
        }
        //尾页
        $scope.lastPage = function () {
            if ($scope.pageIndex != $scope.pageNum) {
                $scope.pageIndex = $scope.pageNum;
                $scope.queryOrderList();
            }
        }
        //跳转到指定页
        $scope.jumpPage = function () {
            if ($scope.pageIndex >= 1 && $scope.pageIndex <= $scope.pageNum) {
                $scope.queryOrderList();
            }
        }
    }
    orderController.$inject = ['$scope', '$routeParams', 'orderService'];

    app.register.controller('orderController', orderController);
});