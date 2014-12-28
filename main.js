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
        obtainLanguaje = brackets.getLocale(),
        contextMenu    = Menus.getContextMenu(Menus.ContextMenuIds.EDITOR_MENU),
        menu           = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU),
        shortCut       = "Ctrl-Shift-O-P",
        COMMAND_ID     = "rfghdfhbdfydfg.open",
        titleRegister,
        popupTaxt;
    function returnLanguaje() {
        if (/it/gi.test(obtainLanguaje)) {
            popupTaxt = "Questa non è una pagina valida per visualizzazione";
            titleRegister = "Mostra nel Browser";
        } else if (/es/gi.test(obtainLanguaje)) {
            popupTaxt = "Esta no es una página válida para visualizar";
            titleRegister = "Mostrar en el Navegador";
        } else {
            popupTaxt = "is not a valid page to display";
            titleRegister = "Open in Browser";
        }
        return [popupTaxt, titleRegister];
    }
    returnLanguaje();
    function startOp() {
        var entry = ProjectManager.getSelectedItem().fullPath;
        var booly = ProjectManager.getSelectedItem()._name;
        if (/\.(htm|html|py|php|svg|jpg|jpeg|gif|png|ico|asp)$/i.test(booly)) {
            NativeApp.openURLInDefaultBrowser('file:///' + entry);
        } else {
            var text = popupTaxt + '<br>' + entry;
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
