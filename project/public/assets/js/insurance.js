

function toggleInsuranceFields() {
    var insuranceValue = document.getElementById('insurance').value;
    var display = insuranceValue === 'yes' ? 'block' : 'none';
    document.getElementById('insurance-amount-group').style.display = display;
    document.getElementById('insurance-paid-group').style.display = display;
    document.getElementById('insurance-remaining-group').style.display = display;
    calculateRemaining();
}

function calculateRemaining() {
    var totalAmount = parseFloat(document.getElementById('total-amount').value) || 0;
    var insuranceAmount = parseFloat(document.getElementById('insurance-amount').value) || 0;
    var insurancePaid = parseFloat(document.getElementById('insurance-paid').value) || 0;

    var remainingInsurance = insuranceAmount - insurancePaid;
    document.getElementById('insurance-remaining').value = remainingInsurance > 0 ? remainingInsurance : 0;
}

form=document.getElementById('pm-form')
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the default way



    // Create FormData object
    const formData = new FormData(form);
    // Send the data using fetch
    const urlEncoded = new URLSearchParams(formData).toString();

    // Send the data using fetch
    fetch('/patient', {
        method: 'POST',
        body: urlEncoded,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Data stored successfully!');
        } else {
            alert('There was an error storing the data.');
        }
    })
    .catch(error => console.error('Error:', error));
    // Retrieve input values

    var expenseCategory = document.getElementById('expense-category').value;
    var expenseDescription = document.getElementById('expense-description').value;
    var dateOfExpense = document.getElementById('date-of-expense').value;
    var department = document.getElementById('department').value;
    var invoiceNo = document.getElementById('invoice-no').value;
    var totalAmount = document.getElementById('total-amount').value;
    var insurance = document.getElementById('insurance').value;
    var insuranceAmount = document.getElementById('insurance-amount').value;
    var insurancePaid = document.getElementById('insurance-paid').value;
    var insuranceRemaining = document.getElementById('insurance-remaining').value;


    // Display the input values
    var resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
       <h2>Submitted Information:</h2>
<table border="1" cellpadding="10" cellspacing="0">
    <tr>
        <th>Field</th>
        <th>Value</th>
    </tr>
    <tr>
        <td><strong>Expense Category:</strong></td>
        <td>${expenseCategory}</td>
    </tr>
    <tr>
        <td><strong>Expense Description:</strong></td>
        <td>${expenseDescription}</td>
    </tr>
    <tr>
        <td><strong>Date of Expense:</strong></td>
        <td>${dateOfExpense}</td>
    </tr>
    <tr>
        <td><strong>Department:</strong></td>
        <td>${department}</td>
    </tr>
    <tr>
        <td><strong>Invoice No.:</strong></td>
        <td>${invoiceNo}</td>
    </tr>
    <tr>
        <td><strong>Total Amount:</strong></td>
        <td>${totalAmount}</td>
    </tr>
    <tr>
        <td><strong>Insurance:</strong></td>
        <td>${insurance}</td>
    </tr>
    ${insurance === 'yes' ? `
        <tr>
            <td><strong>Insurance Amount:</strong></td>
            <td>${insuranceAmount}</td>
        </tr>
        <tr>
            <td><strong>Insurance Amount Paid:</strong></td>
            <td>${insurancePaid}</td>
        </tr>
        <tr>
            <td><strong>Remaining Insurance Amount:</strong></td>
            <td>${insuranceRemaining}</td>
        </tr>
    ` : ''}
</table>

    `;
});
    
