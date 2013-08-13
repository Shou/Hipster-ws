
// {{{ License

/* Copyright (C) 2013
 *      Shou <gnusokyo@gmail.com>
 *
 * This file is part of Hipster-ws.
 *
 * Hipster-ws is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Hipster-ws is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Hipster-ws.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

// }}}

// {{{ Imports

const Lang = imports.lang
const Main = imports.ui.main
const Meta = imports.gi.Meta
const PanelMenu = imports.ui.panelMenu
const Shell = imports.gi.Shell
const St = imports.gi.St

// }}}

// TODO
// - Settings
//      - Colours.
//      - Font.
// - Default colours.
// - Glow (not flash or static color change) workspace.
// - Keep previous desktop so we can 'toggle' between two?


let keyDown = false


// mkWorkspace :: Int -> IO Widget
function mkWorkspace(i){
    log("-- hipster: mkWs " +  i)
    let className = "hipster-ws"
    if (global.screen.get_active_workspace_index() == i)
        className += " hipster-ws-current"

    let con = new St.Bin({ style_class: className })
    let txt = Meta.prefs_get_workspace_name(i)
    let lab = new St.Label({ text: txt })
    con.set_child(lab)

    con.reactive = true
    con.connect("button-press-event", function(a, e){
        global.screen.get_workspace_by_index(i).activate(1)
    })
    con.connect("enter-event", function(a, e){
        if (keyDown){
            global.screen.get_workspace_by_index(i).activate(1)
        }
    })

    return con
}

// | classes can go to hell!!!
// Workspaces :: IO Widget
function Workspaces(){
    let btn = new PanelMenu.Button
    let topBox = new St.BoxLayout()
    let wscounter = global.screen.n_workspaces

    log("-- hipster: wscounter: " + wscounter)

    for (let i = 0; i < wscounter; i++) {
        let con = mkWorkspace(i)
        topBox.add_actor(con)
    }

    // Add window title, works with StatusTitleBar extension
    let con = new St.Bin({ style_class: "hipster-separator" })
    let lab = new St.Label({ text: "::" })
    con.set_child(lab)
    topBox.add_actor(con)

    topBox.reactive = true
    topBox.connect("button-press-event", function(a, e){
        keyDown = true
    })
    topBox.connect("button-release-event", function(a, e){
        keyDown = false
    })


    btn.actor.add_actor(topBox)

    return btn
}

// refresh :: IO ()
function refresh(e, a){
    let wscounter = global.screen.n_workspaces
    // This should never happen!!!
    //if (workspaces === null) workspaces = Workspaces()
    let ws = workspaces.actor.get_children()[0].get_children()
    for (var i = 0; i < ws.length - 1; i++) {
        if (ws[i].has_style_class_name("hipster-ws")) {

            // Remove highlighting.
            ws[i].remove_style_class_name("hipster-ws-current")

            if (global.screen.get_active_workspace_index() == i) {
                // Add highlighting.
                ws[i].add_style_class_name("hipster-ws-current")

                // Remove flash.
                ws[i].remove_style_class_name("hipster-ws-urgent")
            }

            // Remove old workspace.
            if (i >= wscounter) ws[i].destroy()
        }
    }

    // Add new workspace.
    for (var i = 0; i < wscounter - ws.length; i++) {
        log(i)
        workspaces.actor.get_children()[0].insert_child_below(
            mkWorkspace(ws.length - 1 + i),
            ws[ws.length - 1]
        )
    }
}

// flash :: Int -> IO ()
function flash(n) {
    let currws = global.screen.get_active_workspace_index()
    if (currws != n) {
        let w = workspaces.actor.get_children()[0].get_children()[n]
        w.add_style_class_name("hipster-ws-urgent")
    }
}

// urgent :: e -> a -> IO ()
function urgent(e, a) {
    let tr = Shell.WindowTracker.get_default()
    let app = tr.get_window_app(a)
    let ws = getWindowsAndWorkspaces()

    for (let i in ws) {
        let b = false
        for (let j in ws[i]) {
            let app2 = tr.get_window_app(ws[i][j])
            if (app.get_id() === app2.get_id()) {
                flash(i)
                b = true
                break
            }
        }
        if (b) break
    }
}

// getWindowsAndWorkspaces :: IO (Int, [Window])
function getWindowsAndWorkspaces(){
    let display = global.screen.get_display()
    let windows = {}
    for (let i = 0; i < global.screen.n_workspaces; i++) {
        let ws = display.get_tab_list( Meta.TabList.NORMAL
                                     , global.screen
                                     , global.screen.get_workspace_by_index(i)
                                     )
        windows[i] = ws
    }

    return windows
}

// {{{ Init

// | this is impure and makes me feel dirty
// workspaces :: Widget
let workspaces
// appMenu :: Widget
let appMenu

// init :: IO ()
function init(){
    log("-- hipster: Initializing...")
    appMenu = Main.panel.statusArea.appMenu
    workspaces = Workspaces()
    log("-- hipster: Workspaces made!")
    global.window_manager.connect("switch-workspace", refresh)
    global.display.connect("window-marked-urgent", urgent)
}

// enable :: IO ()
function enable(){
    if (workspaces === null) {
        log("-- hipster: uh-oh!")
        init()
    }
    //Main.panel._leftBox.remove_actor(appMenu.actor.get_parent())
    Main.panel.statusArea.appMenu = workspaces
    let index = Main.panel._leftBox.get_children().length
    Main.panel._leftBox.insert_child_at_index(workspaces.actor.get_parent(), index - 1)

    //Main.panel.addToStatusArea("hipsterWorkspaces", workspaces)
    log("-- hipster: Enabled!")
}

// disable :: IO ()
function disable(){
    if (workspaces === null) log("-- hipster: Scream!")
    Main.panel.menuManager.removeMenu(workspaces.menu)
    Main.panel._leftBox.remove_actor(workspaces.actor.get_parent())
    workspaces.destroy()
    Main.panel.statusArea.appMenu = appMenu
    let index = Main.panel._leftBox.get_children().length
    Main.panel._leftBox.insert_child_at_index(appMenu.actor.get_parent(), index)

    workspaces = null
    log("-- hipster: Disabled!")
}

// }}}

// vim: expandtab ts=4 sw=4

