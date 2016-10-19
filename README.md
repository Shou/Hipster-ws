Hipster-ws
==========

A GNOME Shell workspace indicator much like the ones you find in tiling window
managers, for the hipster pseudo-NEET who loves retro looks.

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

You can edit the default `stylesheet.css` file included with the extension in
its folder
`~/.local/share/gnome-shell/extensions/hipsterWorkspaces@shou.gnusokyo`.

