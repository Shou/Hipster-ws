
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
// - Listen to URGENT windows and glow (not flash) workspace.
// - Clickable and scrollable workspaces.


// | classes can go to hell!!!
// Workspaces :: IO Widget
function Workspaces(){
    let btn = new PanelMenu.Button
    let topBox = new St.BoxLayout()
    let wscounter = global.screen.n_workspaces

    log("-- hipster: wscounter: " + wscounter)

    for (let i = 0; i < wscounter; i++) {
        let className = "hipster-ws"
        if (global.screen.get_active_workspace_index() == i)
            className += " hipster-ws-current"

        let con = new St.Bin({ style_class: className })
        let txt = Meta.prefs_get_workspace_name(i)
        let lab = new St.Label({ text: txt })
        con.set_child(lab)
        /* TODO clickable workspaces, maybe scrollable
        addClickEvent(con, function(wsindex){
            return function(){
                global.screen.get_workspace_by_index(wsindex).activate(1)
            }
        }(i))
        */
        topBox.add_actor(con)
    }

    // Add window title, works with StatusTitleBar extension
    let con = new St.Bin({ style_class: "hipster-separator" })
    let lab = new St.Label({ text: "::" })
    con.set_child(lab)
    topBox.add_actor(con)

    btn.actor.add_actor(topBox)

    return btn
}

// refresh :: IO ()
function refresh(){
    log("-- hipster: Change!")
    if (workspaces === null) workspaces = Workspaces()
    let ws = workspaces.actor.get_children()[0].get_children()
    for (var i = 0; i < ws.length - 1; i++) {
        if (ws[i].has_style_class_name("hipster-ws")
        || ws[i].has_style_class_name("hipster-ws-current")) {
            ws[i].remove_style_class_name("hipster-ws-current")
            if (global.screen.get_active_workspace_index() == i)
                ws[i].add_style_class_name("hipster-ws-current")
        }
    }
}

// connectAndTrack :: Widget -> String -> IO () -> IO ()
function connectAndTrack(s, n, f){
    let id = s.connect(n, f)
    log(id)
}

// addClickEvent :: Widget -> IO () -> IO ()
function addClickEvent(s, f){
    s.connect("enter-event", Lang.bind(s, f))
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
    connectAndTrack( global.window_manager
                   , "switch-workspace"
                   , Lang.bind(workspaces, refresh)
                   )
    /*
    connectAndTrack( global.display
                   , "window-marked-urgent"
                   , Lang.bind(workspaces, function(){
                        
                     })
                   )
    */
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

