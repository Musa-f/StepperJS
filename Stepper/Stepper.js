import { UI } from './UI.js';

export class Stepper {
    constructor(stepCount) {
        this.stepCount = stepCount;
        this.currentStep = 0;
        this.maxStepReached = 0;
        this.steps = [];
        this.data = {};
        this.formCompleted = false;
        this.formCompletedPromise  = new Promise(resolve => {
            this.resolveForm = resolve;
        });
        
        const container = document.querySelector('#stepper-container');
        this.ui = new UI(container);
        
        this.ui.bindNextButton(() => this.next());
        this.ui.bindCancelButton(() => this.cancel());
        this.ui.bindStepButtons((stepIndex) => this.goToStep(stepIndex));
    }

    async getData() {
        if (this.formCompleted)
            return this.data;

        return await this.formCompletedPromise;
    }

    add(title, formFields) {
        if (this.steps.length >= this.stepCount) {
            console.error('Cannot add more steps than defined in stepCount');
            return;
        }
        const step = { title, formFields };
        this.steps.push(step);
        this.ui.renderStepHeader(this.steps, this.currentStep, this.maxStepReached);
        if (this.steps.length === 1) this.renderStep(0);
    }

    renderStep(index) {
        const step = this.steps[index];
        this.ui.renderFormFields(step.formFields, this.data);
    }

    next() {
        if (!this.validateStep()) {
            this.ui.showMessage('Please fill all required fields.');
            return;
        }
    
        this.saveData();
        
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            this.maxStepReached = Math.max(this.maxStepReached, this.currentStep);
            this.updateUI();
        } else {
            alert('Form submitted!');
            this.formCompleted = true;
            this.resolveForm(this.data);
        }
    }

    validateStep() {
        const inputs = this.ui.body.querySelectorAll('input[required], textarea[required], select[required]');
        for (let input of inputs) {
            if (!input.value.trim()) return false;
        }
        return true;
    }   

    goToStep(stepIndex) {
        if (stepIndex <= this.maxStepReached) {
            this.saveData();
            this.currentStep = stepIndex;
            this.updateUI();
            this.ui.clearMessage();
        }
    }

    updateUI() {
        this.ui.updateStepStatus(this.currentStep, this.maxStepReached);
        this.renderStep(this.currentStep);
    }

    saveData() {
        const inputs = this.ui.body.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            this.data[input.name] = input.value;
        });
    }

    cancel() {
        console.log('Form cancelled');
        this.resetForm();
    }

    resetForm() {
        this.data = {};
        this.currentStep = 0;
        this.maxStepReached = 0;
        this.updateUI();
        this.ui.clearMessage();
    }
}