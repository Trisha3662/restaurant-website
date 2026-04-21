document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('reservationForm');
    const inputs = form.querySelectorAll('input, select');
    const submitBtn = form.querySelector('button[type="submit"]');
    

    const dateInput = form.querySelector('input[name="date"]');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    

    const timeInput = form.querySelector('input[name="time"]');
    timeInput.setAttribute('min', '09:00');
    timeInput.setAttribute('max', '22:00');

    const phoneInput = form.querySelector('input[name="phone"]');
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 10) value = value.slice(0, 10);
        e.target.value = value;
    });

    const validateInput = (input) => {
        const errorElement = document.getElementById(`${input.name}-error`);
        let isValid = true;
        let errorMessage = '';

        switch(input.name) {
            case 'name':
                const nameRegex = /^[A-Za-z\s]{5,}$/;
                if (!nameRegex.test(input.value.trim())) {
                    errorMessage = 'Name must contain at least 5 letters (alphabets and spaces only)';
                    isValid = false;
                }
                break;

            case 'phone':
                const phoneRegex = /^\d{10}$/;
                if (!phoneRegex.test(input.value)) {
                    errorMessage = 'Please enter exactly 10 digits';
                    isValid = false;
                }
                break;

            case 'date':
                const selectedDate = new Date(input.value);
                if (selectedDate < new Date().setHours(0,0,0,0)) {
                    errorMessage = 'Please select a future date';
                    isValid = false;
                }
                break;

            case 'time':
                const hours = parseInt(input.value.split(':')[0]);
                if (hours < 9 || hours > 22) {
                    errorMessage = 'We are open from 9 AM to 10 PM';
                    isValid = false;
                }
                break;
        }

        if (errorElement) {
            errorElement.textContent = errorMessage;
            errorElement.classList.toggle('show', !isValid);
            input.classList.toggle('error', !isValid);
        }

        return isValid;
    };

    inputs.forEach(input => {
        input.addEventListener('input', () => validateInput(input));
        input.addEventListener('blur', () => validateInput(input));
    });
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        let isValid = true;
        inputs.forEach(input => {
            if (!validateInput(input)) isValid = false;
        });

        if (!isValid) return;

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span>Processing...';

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            showSuccessModal({
                name: form.name.value,
                guests: form.guests.value,
                date: form.date.value,
                time: form.time.value
            });
            
            form.reset();
        } catch (error) {
            showErrorModal('Something went wrong. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Reserve Now';
        }
    });

    document.querySelector('.cancel-btn').addEventListener('click', function() {
        form.reset();
        inputs.forEach(input => {
            const errorElement = document.getElementById(`${input.name}-error`);
            if (errorElement) {
                errorElement.classList.remove('show');
            }
            input.classList.remove('error');
        });
    });

    function showSuccessModal(data) {
        const modal = createModal(`
            <h2>Reservation Confirmed!</h2>
            <p>Thank you, ${data.name}!</p>
            <p>Your table for ${data.guests} guests on ${formatDate(data.date)} at ${data.time} has been reserved.</p>
            <button onclick="this.closest('.modal').remove()">Done</button>
        `);
        document.body.appendChild(modal);
    }

    function showErrorModal(message) {
        const modal = createModal(`
            <h2>Oops!</h2>
            <p>${message}</p>
            <button onclick="this.closest('.modal').remove()">Try Again</button>
        `);
        document.body.appendChild(modal);
    }

    function createModal(content) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `<div class="modal-content">${content}</div>`;
        
        setTimeout(() => modal.classList.add('active'), 10);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                setTimeout(() => modal.remove(), 300);
            }
        });
        
        return modal;
    }

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
});