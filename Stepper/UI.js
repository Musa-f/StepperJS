export class UI {
    constructor(container) {
        this.container = container;
        this.header = this.createHeader();
        this.body = this.createBody();
        this.footer = this.createFooter();
        this.messageBox = this.createMessageBox();
    }

    createMessageBox() {
        const messageBox = document.createElement('div');
        messageBox.classList.add('stepper-message');
        this.container.insertBefore(messageBox, this.footer);
        return messageBox;
    }

    createHeader() {
        const header = document.createElement('div');
        header.classList.add('stepper-header');
        this.container.appendChild(header);
        return header;
    }

    createBody() {
        const body = document.createElement('div');
        body.classList.add('stepper-body');
        this.container.appendChild(body);
        return body;
    }

    createFooter() {
        const footer = document.createElement('div');
        footer.classList.add('stepper-footer');
        footer.innerHTML = `
            <button class="btn-cancel">Cancel</button>
            <button class="btn-next">Next</button>
        `;
        this.container.appendChild(footer);
        return footer;
    }

    renderStepHeader(steps, currentStep, maxStepReached) {
        this.header.innerHTML = '';
        
        steps.forEach((step, index) => {
            const stepBtn = document.createElement('button');
            stepBtn.classList.add('step');
            stepBtn.innerText = step.title;
            stepBtn.dataset.step = index;
            this.header.appendChild(stepBtn);
        });
        
        this.updateStepStatus(currentStep, maxStepReached);
    }

    updateStepStatus(currentStep, maxStepReached) {
        this.header.querySelectorAll('.step').forEach((step, index) => {
            const stepIndex = parseInt(step.dataset.step);
            step.classList.remove('step-active', 'step-done');
            const hasCheckmark = step.innerText.startsWith('✓ ');
            
            if (stepIndex <= maxStepReached && stepIndex !== currentStep) {
                step.classList.add('step-done');

                if (!hasCheckmark) {
                    step.innerText = '✓ ' + step.innerText;
                }
            }
            
            if (stepIndex === currentStep) {
                step.classList.add('step-active');
            }
        });
    }

    renderFormFields(fields, data) {
        this.body.innerHTML = '';
        const form = document.createElement('div');
        form.classList.add('form-group-container');
        Object.entries(fields).forEach(([label, options]) => {
            const fieldGroup = document.createElement('div');
            fieldGroup.classList.add('form-group');
            const inputElement = this.createInputField(label, options, data);
            fieldGroup.innerHTML = `<label>${label}${options.required ? ' *' : ''}</label>`;
            fieldGroup.appendChild(inputElement);
            form.appendChild(fieldGroup);
        });
        this.body.appendChild(form);

        this.clearMessage();
    }

    createInputField(label, options, data) {
        let input;
        const name = label.toLowerCase().replace(/\s+/g, '_');
        const value = options.value || name;

        if (options.type === 'textarea') {
            input = document.createElement('textarea');
            input.value = data[value] || '';
        } else if (options.type === 'select') {
            input = document.createElement('select');
            (options.choices || []).forEach(choice => {
                const option = document.createElement('option');
                option.value = choice;
                option.innerText = choice;
                if (data[value] === choice) option.selected = true;
                input.appendChild(option);
            });
        } else {
            input = document.createElement('input');
            input.type = options.type || 'text';
            input.value = data[value] || '';
        }
        input.name = value; 
        if (options.required) input.setAttribute('required', true);
        return input;
    }

    showMessage(text) {
        this.messageBox.innerText = text;
        this.messageBox.classList.add('form-message');
    }

    clearMessage() {
        this.messageBox.innerText = '';
        this.messageBox.classList.remove('form-message');
        this.messageBox.classList.remove('error-message');
    }

    bindNextButton(nextCallback) {
        const nextBtn = this.footer.querySelector('.btn-next');
        nextBtn.addEventListener('click', nextCallback);
    }

    bindCancelButton(cancelCallback) {
        const cancelBtn = this.footer.querySelector('.btn-cancel');
        cancelBtn.addEventListener('click', cancelCallback);
    }
    
    bindStepButtons(stepClickCallback) {
        this.header.addEventListener('click', (e) => {
            if (e.target.classList.contains('step')) {
                if (e.target.classList.contains('step-done')) {
                    const clickedStep = parseInt(e.target.dataset.step);
                    stepClickCallback(clickedStep);
                }
            }
        });
    }
}