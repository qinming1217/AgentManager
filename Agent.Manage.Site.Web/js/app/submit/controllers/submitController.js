﻿'use strict';

define(['app'], function (app) {
    var submitController = function ($scope, $routeParams, submitService) {
        //是否显示查询条件
        $scope.isShowCondition = true;
        //查询条件
        $scope.condition =
            {
                customerName: "",
                mobileNo: "",
                idCard: "",
                agentIdCard: "",
                isKnow: 0,
                applyTimeBegin: "",
                applyTimeEnd: "",
                applyId: "",
                agentName: "",
                inviteTimeBegin: "",
                inviteTimeEnd: "",
                status: 0,
                vbsBid: ""
            };
        //分页大小
        $scope.pageSize = 10;
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
        //弹出交单确认框
        $scope.alterConfrim = function (index) {
            window.parent.showConfirm($scope.orderList[index], index, function (index, vbsBid) {
                $scope.$apply(function () {
                    $scope.orderList[index].vbsBid = vbsBid;
                    $scope.orderList[index].canSubmitOrder = 0;
                });
            });
            window.parent.showCover();
        }
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
                isKnow: 0,
                applyTimeBegin: "",
                applyTimeEnd: "",
                applyId: "",
                agentName: "",
                inviteTimeBegin: "",
                inviteTimeEnd: "",
                status: 0,
                vbsBid: ""
            };
        }
        //查询
        $scope.queryOrderList = function (isClickQuery) {
            if (isClickQuery) {
                $scope.pageIndex = 1;
            }
            submitService.Query($scope.condition, $scope.pageIndex, $scope.pageSize).then(function (data) {
                if (data.resCode == -1) {
                    window.parent.location.href = app.config.login.url;
                    return;
                }
                if (data.resCode == 0) {
                    //查询结果
                    $scope.content = data.content;
                    //查询结果订单信息
                    $scope.orderList = $scope.content.orderList;
                    //查询结果总记录数
                    $scope.totalNum = $scope.content.totalNum;
                    //查询结果总页数
                    $scope.pageNum = $scope.totalNum % $scope.pageSize == 0 ? parseInt($scope.totalNum / $scope.pageSize)
                                     : parseInt($scope.totalNum / $scope.pageSize) + 1;
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
    submitController.$inject = ['$scope', '$routeParams', 'submitService'];

    app.register.controller('submitController', submitController);
});