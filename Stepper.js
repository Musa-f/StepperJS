class Stepper {
    constructor(stepCount) {
        this.stepCount = stepCount;
        this.currentStep = 0;
        this.steps = [];
        this.data = {};
        this.container = document.querySelector('#stepper-container');
        this.init();
    }

    init() {
        this.container.innerHTML = `
            <div class="stepper-header"></div>
            <div class="stepper-body">
                <div class="stepper-message"></div>
            </div>
            <div class="stepper-footer">
                <button class="btn-cancel">Cancel</button>
                <button class="btn-next">Next</button>
            </div>
        `;
        this.header = this.container.querySelector('.stepper-header');
        this.body = this.container.querySelector('.stepper-body');
        this.messageBox = this.container.querySelector('.stepper-message');
        this.footer = this.container.querySelector('.stepper-footer');
        this.nextBtn = this.footer.querySelector('.btn-next');
        this.cancelBtn = this.footer.querySelector('.btn-cancel');
        this.nextBtn.addEventListener('click', () => this.next());
        this.cancelBtn.addEventListener('click', () => this.destroy());
        this.renderHeader();
    }

    renderHeader() {
        this.header.innerHTML = '';
        for (let i = 0; i < this.steps.length; i++) {
            const stepBtn = document.createElement('button');
            stepBtn.className = `step ${i === 0 ? 'step-active' : ''}`;
            stepBtn.dataset.step = i;
            stepBtn.innerText = this.steps[i].title;
            stepBtn.addEventListener('click', () => {
                if (i < this.currentStep) {
                    this.goToStep(i);
                }
            });
            this.header.appendChild(stepBtn);
        }
    }

    add(title, formFields) {
        if (this.steps.length >= this.stepCount) {
            console.error('Cannot add more steps than defined in stepCount');
            return;
        }
        const step = { title, formFields };
        this.steps.push(step);
        this.renderHeader();
        if (this.steps.length === 1) this.renderStep(0);
    }

    renderStep(index) {
        const step = this.steps[index];
    
        const existingForm = this.body.querySelector('.form-group-container');
        if (existingForm) {
            existingForm.remove();
        }
    
        const form = document.createElement('div');
        form.className = 'form-group-container';
        
        Object.entries(step.formFields).forEach(([label, options]) => {
            const fieldGroup = document.createElement('div');
            fieldGroup.className = 'form-group';
            fieldGroup.innerHTML = `
                <label>${label}${options.required ? ' *' : ''}</label>
                <input type="${options.type}" name="${label}" value="${this.data[label] || ''}" ${options.required ? 'required' : ''}>
            `;
            form.appendChild(fieldGroup);
        });
    
        this.body.appendChild(form);
    }
        

    showMessage(text) {
        this.messageBox.innerHTML = text;
        this.messageBox.className = 'form-message';
    }    

    next() {
        if (!this.validateStep()) {
            this.showMessage('Please fill all required fields.');
            return;
        }
        this.showMessage('');
        this.saveData();
        this.header.querySelectorAll('.step')[this.currentStep].classList.add('step-done');
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            this.updateUI();
        } else {
            console.log('Form Data:', this.data);
            alert('Form submitted!');
        }
    }

    validateStep() {
        const inputs = this.body.querySelectorAll('input[required]');
        for (let input of inputs) {
            if (!input.value.trim()) {
                return false;
            }
        }
        return true;
    }

    goToStep(index) {
        this.saveData();
        this.currentStep = index;
        this.updateUI();
    }

    updateUI() {
        this.header.querySelectorAll('.step').forEach((btn, i) => {
            btn.classList.toggle('step-active', i === this.currentStep);
        });
        this.renderStep(this.currentStep);
        this.nextBtn.innerText = this.currentStep === this.steps.length - 1 ? 'Submit' : 'Next';
    }

    saveData() {
        const inputs = this.body.querySelectorAll('input');
        inputs.forEach(input => {
            this.data[input.name] = input.value;
        });
    }
}


const stepper = new Stepper(4);

let form1 = { 
    'Full Name': { type: 'text', required: 1 }, 
    'Age': { type: 'number', required: 0 } 
};

let form2 = { 
    'Email Address': { type: 'email', required: 1 }, 
    'Phone Number': { type: 'tel', required: 0 } 
};

let form3 = { 
    'Street Address': { type: 'text', required: 1 }, 
    'City': { type: 'text', required: 1 }, 
    'ZIP Code': { type: 'number', required: 0 } 
};

let form4 = { 
    'Feedback': { type: 'textarea', required: 0 }, 
    'Would you recommend us?': { type: 'radio', required: 0 } 
};


stepper.add('Personal Information', form1);
stepper.add('Contact Details', form2);
stepper.add('Address Information', form3);
stepper.add('Survey', form4);

//TODO: Gérer les multiselect dans le formulaire
//TODO: Faire la partie suppression du formulaire
//TODO: Test avec fetch des données