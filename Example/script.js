import { Stepper } from '../Stepper/Stepper.js';

const stepper = new Stepper(4);

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

let form2 = { 
    'Email Address': { type: 'text', required: 1 }, 
    'Phone Number': { type: 'number'} 
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
    'Would you recommend us?': { type: 'text' },
};

stepper.add('Personal Information', form1);
stepper.add('Contact Details', form2);
stepper.add('Address Information', form3);
stepper.add('Survey', form4);

const submitForm = async () => {
    try {
        const formData = await stepper.getData();
        
        console.log('Form data ready to send:', formData);
        
        const response = await fetch('test.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const responseData = await response.json();
        console.log('Response:', responseData);
    } catch (error) {
        console.error('Error:', error);
    }
};

submitForm();
