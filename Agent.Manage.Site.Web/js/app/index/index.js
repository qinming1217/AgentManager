function showCover() {
    $("#divCover").show();
}

var commitOrder = null;
function showConfirm(order, index, func) {
    $("#divInvitationConfirm").show();
    $("#lblOrderId").text(order.orderId);
    $("#lblCustomerName").text(order.customerName);
    $("#lblIdCard").text(order.idCard);
    $("#lblMobileNo").text(order.mobileNo);
    $("#index").val(index);
    $("#txtVbsBid").val("");
    $("#txtConfirmVbsBid").val("");

    commitOrder = func;
}

function hideCover() {
    $("#divCover").hide();
}

function hideConfirm() {
    $("#divInvitationConfirm").hide();
}

function closeConfirm() {
    $("#lblMessage").text("");
    hideCover();
    hideConfirm();
}

$(function () {
    //var height = $(window).height();
    //var width = $(window).width();
    //$("#divHead").height(height * 0.1);
    //$("#divLeft").height(height * 0.8);
    //$("#divRight").height(height * 0.8);
    //$("#divFoot").height(height * 0.1);
})