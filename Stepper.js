class Stepper {
    constructor(stepCount) {
        this.stepCount = stepCount;
        this.currentStep = 0;
        this.maxStepReached = 0;
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
            stepBtn.className = `step ${i === this.currentStep ? 'step-active' : ''}`;
            stepBtn.dataset.step = i;
            stepBtn.innerText = this.steps[i].title;
    
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

            const inputElement = this.formatInput(label, options);
            fieldGroup.innerHTML = `
                <label>${label}${options.required ? ' *' : ''}</label>
            `;
            fieldGroup.appendChild(inputElement);
            form.appendChild(fieldGroup);
        });

        this.body.appendChild(form);
    }

    formatInput(name, options) {
        let input;

        const defaultValue = name.toLowerCase().replace(/\s+/g, '_');
        const value = options.value || defaultValue;

        if (options.type == "textarea") {
            input = document.createElement("textarea");
            input.value = this.data[value] || "";
        } 
        else if (options.type == "select") {
            input = document.createElement("select");
            (options.choices || []).forEach(choice => {
                const option = document.createElement("option");
                option.value = choice;
                option.innerText = choice;
                if (this.data[name] === choice) {
                    option.selected = true; 
                }
                input.appendChild(option);
            });
        } else {
            input = document.createElement("input");
            input.type = options.type || "text"; 
            input.value = this.data[value] || "";
        }
    
        input.name = value;
        if (options.required) input.setAttribute("required", true);
    
        return input;
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
        this.maxStepReached++;
        this.showMessage('');
        this.saveData();

        if (this.currentStep <= this.maxStepReached) {
            const btn = this.header.querySelectorAll('.step')[this.currentStep];
            btn.classList.add('step-done');
            btn.addEventListener('click', () => this.goToStep(btn.dataset.step));
        }
    
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
        console.log("index: " + index);
        if (index > this.maxStepReached) return;
        this.saveData();
        this.currentStep = index;
        this.updateUI();
    }

    updateUI() {
        this.header.querySelectorAll('.step').forEach((btn, i) => {
            if(i == this.currentStep)
                this.header.querySelectorAll('.step')[i].classList.add('step-active');
            else
                this.header.querySelectorAll('.step')[i].classList.remove('step-active');
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
    'Full Name': { type: 'text', value: 'name', required: 1 }, 
    'Age': { type: 'number' } 
};

let form2 = { 
    'Email Address': { type: 'email', required: 1 }, 
    'Phone Number': { type: 'tel'} 
};

let form3 = { 
    'Street Address': { type: 'text', required: 1 }, 
    'City': { 
        type: 'select', 
        choices : ['Paris', 'Marseille', 'Toulon'],
        required: 1 
    }, 
    'ZIP Code': { type: 'number' } 
};

let form4 = { 
    'Feedback': { type: 'textarea' }, 
    'Would you recommend us?': { type: 'radio' },
};


stepper.add('Personal Information', form1);
stepper.add('Contact Details', form2);
stepper.add('Address Information', form3);
stepper.add('Survey', form4);


//TODO: Faire la partie suppression du formulaire
//TODO: Test avec fetch des données

//diviser en sous classes : classe UI, classe gestion erreur, la classe principale ne garde que les fonctions qui sont utilisés lors de l'instanciation