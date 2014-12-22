/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window, MainViewManager*/
define(function (require, exports, module) {
    "use strict";
    var CommandManager        = brackets.getModule("command/CommandManager"),
        Dialogs               = brackets.getModule("widgets/Dialogs"),
        DefaultDialogs        = brackets.getModule("widgets/DefaultDialogs"),
        ExtensionUtils        = brackets.getModule("utils/ExtensionUtils"),
        Menus                 = brackets.getModule("command/Menus"),
        ProjectManager        = brackets.getModule("project/ProjectManager"),
        NativeApp             = brackets.getModule('utils/NativeApp'),
        nameContextMenu       = "Open In Browser",
        hw                    = nameContextMenu,
        cmd_auted_id          = "hello.auto",
        filesMenu             = Menus.getMenu(Menus.AppMenuBar.FILE_MENU),
        contextMenu           = Menus.getContextMenu(Menus.ContextMenuIds.EDITOR_MENU);
    function OPINBR() {
        var contentBra = MainViewManager.getCurrentlyViewedFile()._path;
        var titleModal = ProjectManager.makeProjectRelativeIfPossible(contentBra);
        var booly = new RegExp(".htm").test(titleModal);
        if (booly) {
            var url = 'file:///';
            NativeApp.openURLInDefaultBrowser(url + titleModal);
        } else {
            var text = "is not a valid page to display" + '<br>' + titleModal;
            Dialogs.showModalDialog(DefaultDialogs.DIALOG_ID_INFO, hw, text);
        }
    }
    CommandManager.register(nameContextMenu, cmd_auted_id, $.proxy(OPINBR));
    contextMenu.addMenuItem(cmd_auted_id, "Ctrl-Shift-Y");
    filesMenu.addMenuDivider('before', 'hello.worl.min');
    filesMenu.addMenuItem(cmd_auted_id, "Ctrl-Shift-Y");
    //filesMenu.removeMenuDivider();
});
