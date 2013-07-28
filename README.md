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

It only has three CSS classes,
* `.hipster-ws`

For workspaces that aren't visible.

* `.hipster-ws-current`

For the currently visible workspace.

* `.hipster-separator`

For the `::` separator.

You have to add style rules to your current theme's `gnome-shell.css` file,
either found in `~/.themes/<your current theme>/gnome-shell/gnome-shell.css`
or in `/usr/share/gnome-shell/theme/gnome-shell.css`.

For example, here is what I added to the bottom of my `gnome-shell.css`:

```
.hipster-ws {
    font-family: droid sans mono;
    color: #d0d0d0 !important;
    padding: 0px 4px;
}

.hipster-ws-current {
    font-family: droid sans mono;
    color: #e78584 !important;
    padding: 0px 4px;
}

.hipster-separator {
    padding: 0px 4px;
}
```
