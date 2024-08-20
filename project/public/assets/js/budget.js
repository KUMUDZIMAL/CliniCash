form=document.getElementById('budgetForm')
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the default way



    // Create FormData object
    const formData = new FormData(form);
    // Send the data using fetch
    const urlEncoded = new URLSearchParams(formData).toString();

    // Send the data using fetch
    fetch('/budget', {
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

    var category = document.getElementById('category').value;
    var allocated_amount = document.getElementById('allocated_amount').value;
    var budget_period = document.getElementById('budget_period').value;
    var start_date = document.getElementById('start_date').value;
    var end_date = document.getElementById('end_date').value;
    var department = document.getElementById('department').value;
  
    // Create a new entry
    var entryDiv = document.createElement('div');
    entryDiv.classList.add('pm-entry');
    entryDiv.innerHTML = `
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Allocated amount:</strong> ${allocated_amount}</p>
        <p><strong>Budget period:</strong> ${budget_period}</p>
        <p><strong>Start date: Status:</strong> ${start_date}</p>
        <p><strong>End date:</strong> ${end_date}</p>
        <p><strong>Department:</strong> ${department}</p>
       
        <button class="remove-btn" onclick="removeEntry(this)">Remove</button>
    `;

    // Append the new entry to the result div
    document.getElementById('result').appendChild(entryDiv);

    // Clear form fields
    document.getElementById('budgetForm').reset();
});

function removeEntry(button) {
    button.parentElement.remove(); // Remove the entry
}

   

