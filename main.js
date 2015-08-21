/*jslint vars: true */ /*global define, brackets, $, window, Mustache, console*/

/*
 *
 *
 *    AVRIL ALEJANDRO COMMONS PE.
 *
 *
 */
define(function (require, exports, module) {
    "use strict";
    var MainViewManager = brackets.getModule("view/MainViewManager"),
        NativeApp = brackets.getModule('utils/NativeApp'),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        CommandManager = brackets.getModule('command/CommandManager'),
        AppInit = brackets.getModule('utils/AppInit'),
        PreferencesManager = brackets.getModule("preferences/PreferencesManager"),
        KeyBindingManager = brackets.getModule('command/KeyBindingManager'),
        prefs = PreferencesManager.getExtensionPrefs("open.in.browser"),
        Dialogs = brackets.getModule("widgets/Dialogs"),
        panelDialog = require('text!dialog.html'),
        getLocale = brackets.getLocale(),
        objectK = "extensionFileDefault",
        objectCHR = "extensionFileChrome",
        keyid = objectK + "_keyBindingOpenInBrowser",
        extensions = ["jpg", "jpeg", "gif", "png", "ico"],
        chrome = ["html", "htm"],
        shortIn = [{
            "key": "Alt-Shift-O",
            "platform": "win",
            "platform-exception": "mac"
        }, {
            "key": "Alt-Shift-O",
            "platform": "mac"
        }, {
            "key": "Alt-Shift-O",
            "platform": "linux"
        }],
        short = "Alt-Shift-O",
        o = {
            language: function (l) {
                var titleRegister;
                if (/it/gi.test(l)) {
                    titleRegister = "Mostra nel Browser";
                } else if (/es/gi.test(l)) {
                    titleRegister = "Mostrar en el Navegador";
                } else if (/fr/gi.test(l)) {
                    titleRegister = "Ouvrir dans le Navigateur";
                } else if (/pt/gi.test(l)) {
                    titleRegister = "Abrir no Navegador";
                } else if (/hr/gi.test(l)) {
                    titleRegister = "Otvori u web pregledniku";
                } else {
                    titleRegister = "Open in Browser";
                }
                return titleRegister;
            },
            open: function (pth, boo) {
                if (typeof pth === "string") {
                    if (boo) {
                        NativeApp.openLiveBrowser('"' + pth.toString() + '"');
                    } else {
                        NativeApp.openURLInDefaultBrowser('"' + pth.toString() + '"');
                    }
                }
            },
            button: function (path, lng, boo) {
                var self = this;
                $('<a/>').attr({
                    'id': "openFileBrackets_OIB",
                    'class': "openInBrowser_OIB",
                    'title': lng
                }).click(function () {
                    self.open(path, boo);
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
            hasDATA: function (oja, fli) {
                var rx = $.inArray(fli, oja),
                    rtrn = (rx > -1) ? true : false;
                return rtrn;
            },
            setPrefs: function (idk, b) {
                prefs.set(idk, b);
                prefs.save();
            },
            getPrefs: function (idk) {
                return prefs.get(idk);
            },
            savePrefs: function (idk, objx) {
                if (!this.isArray(this.getPrefs(idk))) {
                    o.setPrefs(idk, objx);
                }
            },
            tested: function (idk) {
                return this.getPrefs(idk).join("|");
            },
            ls: function () {
                var lsf = (window.localStorage.getItem("open-in-browser-firstStart6")) ? false : true;
                var lst = (window.localStorage.getItem("open-in-browser-tooltip2")) ? false : true;
                return {
                    lsf: lsf,
                    lst: lst
                };
            },
            firstStart: function () {
                if (this.ls().lsf) {
                    Dialogs.showModalDialog("open.in.browser-OIBB", "Open in Browser.", '<b>new</b> <p>fixed bug : blank browser tab<p/> <b> <span>features</span> <p>add shortcut Alt-Shift+O (all platforms) </p> </b> <p>add preferences > open whit chrome</p> <p>adds a button in toolbar for open file in browser</p> <b> <span>preferences</span> </b> <p> <span>open File : menu > debug > open preferences file.</span> <br> <span>edit item :</span> <i>\"open.in.browser.extensionFileDefault\"</i> <span> > only array.</span> <br> <i>\"open.in.browser.extensionFileChrome\"</i> <span> > only array.</span> </p>');
                    window.localStorage.setItem("open-in-browser-firstStart6", false);
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
                    window.localStorage.setItem("open-in-browser-tooltip2", false);
                }
            },
            getKey: function (kbm, cid) {
                kbm.getKeyBindings(cid);
            },
            removeKey: function (kbm, key, platform) {
                kbm.removeBinding(key, (platform || "all"));
            },
            addKey: function (kbm, cid, shortcut, platform) {
                kbm.addBinding(cid, shortcut, platform);
            },
            addSC: function (str, call) {
                CommandManager.register(str, keyid, call);
                KeyBindingManager.addBinding(keyid, short, "all");
            }
        };
    ExtensionUtils.loadStyleSheet(module, "simple.css");
    MainViewManager.on("currentFileChange", function () {
        o.savePrefs(objectK, extensions);
        o.savePrefs(objectCHR, chrome);
        var path = MainViewManager.getCurrentlyViewedPath(MainViewManager.ACTIVE_PANE);
        if (typeof path === "string") {
            var name = path.substring(path.lastIndexOf("/") + 1),
                regexp = new RegExp("\\.(" + (o.tested(objectK) + "|" + o.tested(objectCHR)) + ")$", "i"),
                isFile = (regexp.test(name)) ? true : false,
                thisFile = name.substring(name.lastIndexOf(".") + 1);
            o.removeButton("#openFileBrackets_OIB");
            if (path && isFile) {
                if (o.hasDATA(o.getPrefs(objectCHR), thisFile)) {
                    o.button(path, o.language(getLocale), true);
                } else {
                    o.button(path, o.language(getLocale), false);
                }
                o.after();
            } else {
                o.removeButton("#openFileBrackets_OIB");
            }
        } else {
            o.removeButton("#openFileBrackets_OIB");
        }
    });

    function handler() {
        try {
            var path = MainViewManager.getCurrentlyViewedPath(MainViewManager.ACTIVE_PANE);
            if (typeof path === "string") {
                var name = path.substring(path.lastIndexOf("/") + 1),
                    regexp = new RegExp("\\.(" + (o.tested(objectK) + "|" + o.tested(objectCHR)) + ")$", "i"),
                    isFile = (regexp.test(name)) ? true : false,
                    thisFile = name.substring(name.lastIndexOf(".") + 1);
                if (isFile) {
                    if (o.hasDATA(o.getPrefs(objectCHR), thisFile)) {
                        o.open(path, true);
                    } else {
                        o.open(path, false);
                    }
                }
            }
        } catch (err) {}
    }
    AppInit.htmlReady(function () {
        o.addSC(o.language(getLocale), handler);
    });
    o.firstStart();
});
