Hipster-ws
==========

A GNOME Shell workspace indicator much like the ones you find in tiling window
managers, for the hipster pseudo-NEET scum who loves retro looks.

<img src=http://a.pomf.se/3In6.gif /> (Haskell logo not included)

The workspaces are clickable, and you can hold the button down and swipe it
through them. It works along with the "Status title bar" extension as can be
seen in the image.

Also, you need to change the workspace names manually either through
`dconf-editor` with the value `org.gnome.desktop.wm.preferences.workspace-names`
or a GNOME Shell extension.

## Installing

Put the `hipsterWorkspaces@shou.gnusokyo` folder in
`~/.local/share/gnome-shell/extensions/` and restart GNOME Shell by typing `r`
in the run prompt (Alt-F2 by default).

## Styling

It only has four CSS classes,
* `.hipster-ws`

Normal workspace color.

* `.hipster-ws-current`

Highlight current workspace.

* `.hipster-ws-urgent`

Highlight urgent workspace.

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
    color: #e78584 !important;
}

.hipster-ws-urgent {
    color: #ff0090 !important;
}

.hipster-separator {
    padding: 0px 4px;
}
```
