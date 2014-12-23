/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets */
define(function (require, exports, module) {
    "use strict";
    var CommandManager = brackets.getModule("command/CommandManager"),
        Menus          = brackets.getModule("command/Menus"),
        Dialogs        = brackets.getModule("widgets/Dialogs"),
        ProjectManager = brackets.getModule("project/ProjectManager"),
        AppInit        = brackets.getModule('utils/AppInit'),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        NativeApp      = brackets.getModule('utils/NativeApp'),
        contextMenu    = Menus.getContextMenu(Menus.ContextMenuIds.EDITOR_MENU),
        menu           = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU),
        titleRegister  = "Open in Browser",
        shortCut       = "Ctrl-Shift-Alt-R",
        COMMAND_ID     = "rfghdfhbdfydfg.open";
    function startOp() {
        var entry = ProjectManager.getSelectedItem().fullPath;
        var booly = ProjectManager.getSelectedItem()._name;
        if (/\.(htm|html|py|php|svg|jpg|jpeg|gif|png|ico|asp)$/i.test(booly)) {
            NativeApp.openURLInDefaultBrowser('file:///' + entry);
        } else {
            var text = "is not a valid page to display" + '<br>' + entry;
            Dialogs.showModalDialog(COMMAND_ID, booly, text);
        }
    }
    CommandManager.register(titleRegister, COMMAND_ID, startOp);
    contextMenu.addMenuItem(COMMAND_ID, shortCut);
    menu.addMenuItem(COMMAND_ID, shortCut);
    function addButton() {
        var $toolbar = $('#main-toolbar .buttons');
        var _button = $('<a/>').attr({
            'id': 'open-notification',
            'title': titleRegister
        }).click(startOp).appendTo($toolbar);
    }
    AppInit.appReady(function () {
        ExtensionUtils.loadStyleSheet(module, "toolbar.css");
        addButton();
    });
});
