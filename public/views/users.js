"use strict";
View.register("users", function (messageData) {
    if (messageData.form == "users" && messageData.btn == "save") {
        if (messageData.sessionUserData && messageData.login) {
            Storage.set("loginName", messageData.sessionUserData.username);
            Storage.set("loginHash", messageData.sessionUserData.loginHash);
            if(messageData.initial){
                View.load("index");
                return;
            }
        }
    }
    if (messageData.editData) {
        $(".btn.save").removeClass("btn-info").addClass("btn-success").attr("data-translate", "save.edited");
        $(".btn.cancel").removeClass("hidden");
        populateForm($("form").filter("[name='users']"), messageData.editData);
    }
    // write to table
    var tbody = $("table.data-table tbody");
    for (var i in messageData.users) {
        var user = messageData.users[i];
        tbody.append('<tr><td>' + user.username + '</td>' +
            '<td>' + t(user.admin ? "yes" : "no") + '</td>' +
            '<td><a href="#users" data-message="' + View.getAttributeMessage({id: user.id}) + '" data-translate="edit" ' +
            'class="btn btn-info btn-sm page-link"></a></td>' +
            '</tr>');
    }
});