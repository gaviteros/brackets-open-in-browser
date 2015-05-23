/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets */
/*jslint vars: true */
/*global define, brackets, $, window*/
define(function (require, exports, module) {
    "use strict";
    var MainViewManager = brackets.getModule("view/MainViewManager"),
        NativeApp = brackets.getModule('utils/NativeApp'),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        PreferencesManager = brackets.getModule("preferences/PreferencesManager"),
        prefs = PreferencesManager.getExtensionPrefs("open.in.browser"),
        Dialogs = brackets.getModule("widgets/Dialogs"),
        getLocale = brackets.getLocale(),
        objectK = "extensionFile",
        o = {
            language: function (l) {
                var popupTaxt,
                    titleRegister,
                    nothing;
                if (/it/gi.test(l)) {
                    popupTaxt = "Questa non è una pagina valida per visualizzazione";
                    titleRegister = "Mostra nel Browser";
                    nothing = "nulla qui intorno";
                } else if (/es/gi.test(l)) {
                    popupTaxt = "Esta no es una página válida para visualizar";
                    titleRegister = "Mostrar en el Navegador";
                    nothing = "nada por aqui";
                } else if (/fr/gi.test(l)) {
                    popupTaxt = "Page à afficher invalide";
                    titleRegister = "Ouvrir dans le Navigateur";
                    nothing = "rien ici";
                } else if (/pt/gi.test(l)) {
                    popupTaxt = "Não é um arquivo válido para exibir";
                    titleRegister = "Abrir no Navegador";
                    nothing = "nada por aqui";
                } else {
                    popupTaxt = "is not a valid page to display";
                    titleRegister = "Open in Browser";
                    nothing = "nothing around here";
                }
                return {
                    popupTaxt: popupTaxt,
                    titleRegister: titleRegister,
                    nothing: nothing
                };
            },
            button: function (path, lng) {
                $('<a/>').attr({
                    'id': "openFileBrackets_OIB",
                    'class': "openInBrowser_OIB",
                    'title': lng
                }).click(function () {
                    NativeApp.openURLInDefaultBrowser('file:///' + path);
                }).appendTo($('#main-toolbar .buttons'));
            },
            removeButton: function (el) {
                if ($(el).length) {
                    $(el).remove();
                }
            },
            isArray: function (arr) {
                if (Array.isArray === 'undefined') {
                    Array.isArray = function () {
                        return arr instanceof Array;
                    };
                } else {
                    return Array.isArray(arr);
                }
            },
            setPrefs: function (b) {
                prefs.set(objectK, b);
                prefs.save();
            },
            getPrefs: function () {
                return prefs.get(objectK);
            },
            savePrefs: function () {
                var extensions = ["htm", "html", "jpg", "jpeg", "gif", "png", "ico"];
                if (!this.isArray(this.getPrefs())) {
                    o.setPrefs(extensions);
                }
            },
            tested: function () {
                return this.getPrefs().join("|");
            },
            ls: function () {
                var lsf = (window.localStorage.getItem("open-in-browser-firstStart")) ? false : true;
                var lst = (window.localStorage.getItem("open-in-browser-tooltip")) ? false : true;
                return {
                    lsf: lsf,
                    lst: lst
                };
            },
            firstStart: function () {
                if (this.ls().lsf) {
                    Dialogs.showModalDialog("open.in.browser-OIBB", "Open in Browser.", "<b>features</b><p>adds a button in toolbar for open file in browser</p><b>preferences</b><p>open File : menu > debug > open preferences file.<br>edit item : <i>\"open.in.browser.extensionFile\"</i> > only array.</p>");
                    window.localStorage.setItem("open-in-browser-firstStart", false);
                }
            },
            after: function () {
                if (this.ls().lst) {
                    $('<div/>').attr({
                        'class': "openInBrowser_tooltip",
                        "style": "top:" + ($("#openFileBrackets_OIB").offset().top - 12) + "px;"
                    }).html("<span>×</span>Open in Browser").click(function () {
                        $(".openInBrowser_tooltip").remove();
                    }).insertAfter($("#main-toolbar"));
                    window.localStorage.setItem("open-in-browser-tooltip", false);
                }
            }
        };
    ExtensionUtils.loadStyleSheet(module, "simple.css");
    MainViewManager.on("currentFileChange", function () {
        o.savePrefs();
        var path = MainViewManager.getCurrentlyViewedPath(MainViewManager.ACTIVE_PANE);
        if (typeof path === "string") {
            var name = path.substring(path.lastIndexOf("/") + 1),
                regexp = new RegExp("\\.(" + o.tested() + ")$", "i"),
                isFile = (regexp.test(name)) ? true : false;
            o.removeButton("#openFileBrackets_OIB");
            if (path && isFile) {
                o.button(path, o.language(getLocale).titleRegister);
                o.after();
            } else {
                o.removeButton("#openFileBrackets_OIB");
            }
        } else {
            o.removeButton("#openFileBrackets_OIB");
        }
    });
    o.firstStart();
});
