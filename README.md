Hipster-ws
==========

A GNOME Shell workspace indicator much like the ones you find in tiling window
managers, for the hipster pseudo-NEET scum who loves retro looks.

<img src=http://a.pomf.se/9Tx7.png /> (Haskell logo not included)

Something worth noting is that it works along with the "Status title bar"
extension.

Also, you need to change the workspace names manually either through
`dconf-editor` with the value `org.gnome.desktop.wm.preferences.workspace-names`
or a GNOME Shell extension.

## Styling

It only has two classes,
* `.hipster-ws`

For workspaces that aren't visible.

* `hipster-ws-current`

For the currently visible workspace.
