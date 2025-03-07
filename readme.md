# StepperJS

**StepperJS** is a modular tool that allows you to complete a multi-step form. This form is fully customizable—you can create as many steps as needed and modify the CSS to fit your design.

You can also retrieve all form data upon submission for further processing.

![Example](./capture.png)

## Usage

### 1. Create the container
First, ensure you have the container in your HTML:
```html
<div id="stepper-container"></div>
```

### 2. Initialize the class
Start by initializing the stepper object. It takes the number of steps as a parameter:
```javascript
const stepper = new Stepper(4);
```

### 3. Create steps and forms
The `stepper.add` function must be called for each form step. It takes two arguments: the step title and the form object.
```javascript
stepper.add('Personal Information', form1);
```

The form should be structured as an object where each key represents an input field with its properties:
```javascript
let form1 = {
    'First Name': {
        type: 'text',
        value: 'name',
        required: 1
    },
    'Last Name': {
        type: 'text',
        value: 'name',
        required: 1
    },
    'Age': { type: 'number' }
};
```

Each input must include a type (e.g., text, number, select, textarea).
<li>The value is optional; by default, it takes the field name but can be customized.</li>
<li>The required property is optional. Set it to 1 to make the field mandatory, meaning the user must fill it before proceeding.</li>

If the input type is select, you need to specify the available choices:
```javascript
'City': 
    { 
        type: 'select', 
        choices : ['Paris', 'Marseille', 'Toulon'],
        required: 1 
    }
```

### 4. Retrieve form data
Use `stepper.getData()` to collect all form data upon submission.


## Styling Variables
You can customize the stepper's colors using CSS variables in stepper.css:
```css
:root {
    --color-primary: #6E94CF;
    --color-secondary: #d2e0f7;
    --color-text: #889bbb;
    --color-active-bg: #6E94CF;
    --color-active-text: #28487B;
    --color-done-hover: #abbcd6;
    --color-done-text: white;
    --color-border: #cbd5e1;
    --color-focus: #5c80b6;
    --color-cancel-bg: #b9cdee;
    --color-next-bg: #28487B;
    --color-next-text: #ffffff;
    --color-label: #6b7280;
    --color-error: rgb(189, 34, 34);
}
```