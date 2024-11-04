document.addEventListener('DOMContentLoaded', function() {
    // Modal elements
    const modal = document.getElementById('orderModal');
    const openOrderButton = document.getElementById('openOrderForm');
    const closeButton = document.querySelector('.close-modal');
    
    // Form elements
    const quantityInputs = document.querySelectorAll('.quantity-input input');
    const plusButtons = document.querySelectorAll('.plus');
    const minusButtons = document.querySelectorAll('.minus');
    const orderTotal = document.getElementById('orderTotal');
    const orderForm = document.getElementById('orderForm');

    // Modal functions
    function openModal() {
        modal.style.display = 'block';
        // Small delay to ensure display: block is applied before adding active class
        setTimeout(() => {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }, 10);
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        // Wait for transition to finish before hiding modal
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    // Event listeners for modal
    openOrderButton.addEventListener('click', function(e) {
        e.preventDefault();
        openModal();
    });
    
    closeButton.addEventListener('click', function(e) {
        e.preventDefault();
        closeModal();
    });

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Prevent closing when clicking modal content
    modal.querySelector('.modal-content').addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Quantity control functions
    function updateQuantity(input, increment) {
        const currentValue = parseInt(input.value) || 0;
        const newValue = currentValue + increment;
        if (newValue >= 0) {
            input.value = newValue;
            updateTotal();
        }
    }

    // Event listeners for quantity buttons
    plusButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const input = button.parentElement.querySelector('input');
            updateQuantity(input, 1);
        });
    });

    minusButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const input = button.parentElement.querySelector('input');
            updateQuantity(input, -1);
        });
    });

    // Update total when quantity changes
    quantityInputs.forEach(input => {
        input.addEventListener('change', updateTotal);
    });

    function updateTotal() {
        const total = Array.from(quantityInputs).reduce((sum, input) => {
            return sum + (parseInt(input.value) || 0) * 20;
        }, 0);
        orderTotal.textContent = total;
    }

    // Handle form submission
    // In your existing script.js file
orderForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        items: Array.from(quantityInputs)
            .filter(input => parseInt(input.value) > 0)
            .map(input => ({
                name: input.parentElement.parentElement.querySelector('label').textContent,
                quantity: input.value
            })),
        total: orderTotal.textContent
    };

    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbwockJVpvvqgP5lZTeMLRAPVeETAPOwLpQWEyGvExYpdnmuxVmuBCJ69UXIBo2vIe-w/exec', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            alert('Commande reçue!');
            closeModal();
        } else {
            alert('Erreur lors de l\'envoi. Veuillez réessayer.');
        }
    } catch (error) {
        alert('Erreur de connexion. Veuillez réessayer.');
    }
});
});
