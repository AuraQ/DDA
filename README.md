# DDA Helper

This widget aids in making your application DDA compliant.

## Contributing

For more information on contributing to this repository visit [Contributing to a GitHub repository](https://world.mendix.com/display/howto50/Contributing+to+a+GitHub+repository)!

## Typical usage scenario

## Features and Limitations
-	Can allocate roles to any html element
-	Can assign alternative text to html elements
-	Can aid with field set creation
-	Links validation messages to the fields triggering the messages
-	Can link radio button labels to the actual inputs 
-	Can turn spans into labels and link them to inputs.
-	The widget subscribes to the view entity’s updates, you should make sure your entity is the one getting refreshed when expecting visibility changes in the DOM.


## Installation
Import the widget to your project and add it to any view. Configure the properties to determine how the widget will behave in your application.

## Events
- **On change**: The microflow that will be run when an item is checked or unchecked.
- **Show Progress Bar**: Whether to show a progress bar when executing the on change microflow.
- **Progress Message**: The message to show in the progress bar.

# Properties

## Alternative text
This set of options allows you to provide alternative text for elements that are not readable to a screen-reader (i.e. images, videos, etc.). You will need to target the elements you want alternative text for with classes, and provide the alternative text, and target classes using the “alt text entities” widget input. 
You can apply any of the three properties screen readers look at (alt, aria-label and/or title) using the Boolean inputs provided, these will apply across the board to any Class- Alt text association you have specified.
An overwrite property also exists. You can use this to set whether an already existing property would be replaced by any of the above (i.e. an image element might have an alt attribute already assigned before the widget attempts to assign one)

## Roles
Using this part of the widget allows you to allocate roles to any elements. Once enabled you just need to give your element a class of “elementrole-<DesiredRole>”. This comes with an overwrite switch as well.
For example: When having two buttons simulate a radio box you can give them a “elementrole-radio” class, and the widget will allocate a role=’radio’ attribute to the buttons.

## Fieldsets and Legends
In order to create field sets and legends you only need to toggle this option, and give desired elements a class of “form-fieldset” or “form-legend” correspondingly to the role desired.
Items with a “form-fieldset” class will be converted to fieldsets, while items with a “form-legend” class will be wrapped in a <legend /> tag.

## Validation messages
Enabling this option will link validation messages to the corresponding fields through aria-describedby and/or aria-labelledby, as configured.

## Labels
If radio labels are enabled, labels used for radio buttons will contain a “for” attribute pointing at that input’s ID.
If custom labels are enabled, any item with a class of custom-label will be converted into a <label /> and be given a “for” attribute pointing at the next sibling’s ID.

## Known errors
•	Trying to turn a dataview into a fieldset will cause an error 
