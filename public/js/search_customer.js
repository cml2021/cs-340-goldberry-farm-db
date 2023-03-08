const searchCustomerForm = document.getElementById("search-customer-form");

searchCustomerForm.addEventListener("submit", function(e) {

    e.preventDefault();

    const customerName = document.getElementById("search-customer-name");
    const customerNameValue = customerName.value;

    const data = {
        customerName: customerNameValue
    }

    const searchCustomer = async () => {
        response = await fetch('/search-customer', {
            "method": "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(data)
        }) 
        if (response.status === 200) {
            const customerId = document.getElementById("customer-search-result");
            const data = response.body;
            customerId.value = data.customer_id;    // TODO get this to render
        }
    }

    searchCustomer();
})