/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets */
define(function (require, exports, module) {
    "use strict";
    var ProjectManager = brackets.getModule("project/ProjectManager"),
        AppInit = brackets.getModule('utils/AppInit'),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        NativeApp = brackets.getModule('utils/NativeApp'),
        MainViewManager = brackets.getModule("view/MainViewManager"),
        obtainLanguaje = brackets.getLocale(),
        titleRegister,
        nothing,
        popupTaxt;

    function returnLanguaje() {
        if (/it/gi.test(obtainLanguaje)) {
            popupTaxt = "Questa non è una pagina valida per visualizzazione";
            titleRegister = "Mostra nel Browser";
            nothing = "nulla qui intorno";
        } else if (/es/gi.test(obtainLanguaje)) {
            popupTaxt = "Esta no es una página válida para visualizar";
            titleRegister = "Mostrar en el Navegador";
            nothing = "nada por aqui";
        } else if (/fr/gi.test(obtainLanguaje)) {
            popupTaxt = "Page à afficher invalide";
            titleRegister = "Ouvrir dans le Navigateur";
            nothing = "rien ici";
        } else if (/pt/gi.test(obtainLanguaje)) {
            popupTaxt = "Não é um arquivo válido para exibir";
            titleRegister = "Abrir no Navegador";
            nothing = "nada por aqui";
        } else {
            popupTaxt = "is not a valid page to display";
            titleRegister = "Open in Browser";
            nothing = "nothing around here";
        }
        return [popupTaxt, titleRegister, nothing];
    }
    returnLanguaje();

    function removeButton(el) {
        if ($(el).length) {
            $(el).remove();
        }
    }

    function startOp() {
        MainViewManager.on("currentFileChange", function () {
            var entry = ProjectManager.getSelectedItem().fullPath,
                booly = ProjectManager.getSelectedItem()._name;
            removeButton("#open-notification");
            if (/\.(htm|html|py|php|svg|jpg|jpeg|gif|png|ico|asp)$/i.test(booly)) {
                $('<a/>').attr({
                    'id': "open-notification",
                    'class': "openInBrowser",
                    'title': titleRegister
                }).click(function () {
                    NativeApp.openURLInDefaultBrowser('file:///' + entry);
                }).appendTo($('#main-toolbar .buttons'));
            } else {
                removeButton("#open-notification");
            }
        });
    }

    AppInit.appReady(function () {
        ExtensionUtils.loadStyleSheet(module, "toolbar.css");
        startOp();
    });
});
