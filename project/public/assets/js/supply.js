form=document.getElementById('pm-form')
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the default way



    // Create FormData object
    const formData = new FormData(form);
    // Send the data using fetch
    const urlEncoded = new URLSearchParams(formData).toString();

    // Send the data using fetch
    fetch('/supply', {
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
            alert('Data stored successfully!');
        }
    })
    .catch(error => console.error('Error:', error));
    // Retrieve input values

    var medicalSupplies = document.getElementById('medical-supplies').value;
    var supplyDescription = document.getElementById('supply-description').value;
    var dateOfTransaction = document.getElementById('date-of-transaction').value;
    var verificationStatus = document.getElementById('verification-status').value;
    var invoiceNo = document.getElementById('invoice-no').value;
    var amountBySuppliers = document.getElementById('amount-by-suppliers').value;
    var departmentUnit = document.getElementById('department-unit').value;
    var productSuppliers = document.getElementById('product-suppliers').value;
    var notes = document.getElementById('notes').value;

    // Create a new entry
    var entryDiv = document.createElement('div');
    entryDiv.classList.add('pm-entry');
    entryDiv.innerHTML = `
        <p><strong>Medical Supplies:</strong> ${medicalSupplies}</p>
        <p><strong>Supply Description:</strong> ${supplyDescription}</p>
        <p><strong>Date of Transaction:</strong> ${dateOfTransaction}</p>
        <p><strong>Verification Status:</strong> ${verificationStatus}</p>
        <p><strong>Invoice No.:</strong> ${invoiceNo}</p>
        <p><strong>Amount By Suppliers:</strong> ${amountBySuppliers}</p>
        <p><strong>Department Unit:</strong> ${departmentUnit}</p>
        <p><strong>Product Suppliers:</strong> ${productSuppliers}</p>
        <p><strong>Notes:</strong> ${notes}</p>
        <button class="remove-btn" onclick="removeEntry(this)">Remove</button>
    `;

    // Append the new entry to the result div
    document.getElementById('result').appendChild(entryDiv);

    // Clear form fields
    document.getElementById('pm-form').reset();
});

function removeEntry(button) {
    button.parentElement.remove(); // Remove the entry
}

   

