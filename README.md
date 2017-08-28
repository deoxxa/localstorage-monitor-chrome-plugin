# Local Storage Monitor

This is a Chrome plugin that tells you what local storage keys a page has
tried to access. This can be useful for finding undocumented features hidden
behind feature toggles or runtime development flags.

## Installation

1. clone this repository somewhere
2. read through all the code to make sure I'm not stealing your credit card
3. load the unpacked extension

## Usage

Once the extension is loaded, you can click the new "L" icon near your address
bar to see the localStorage activity for the current page. If there has been
no activity, this button will be disabled.

Right now this is just a list of keys that the page has tried to access. I'm
open to suggestions for other information to display.
