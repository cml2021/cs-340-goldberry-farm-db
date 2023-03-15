// This module is adapted from the NodeJS Starter App code
const deleteSaleForm = document.getElementById('delete-sale-form');

deleteSaleForm.addEventListener("submit", function(e) {

    e.preventDefault();

    const saleId = document.getElementById('sale-to-delete');
    const saleIdValue = parseInt(saleId.value);

    const saleData = {
        saleId: saleIdValue
    }

    const deleteSale = async () => {
        const response = await fetch("/delete-sale", {
            method: "DELETE",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(saleData)
        });
        if (response.status == 204) {
            window.location.reload();
        } else {
            console.log(response.status);
        }
    };

    deleteSale();
});