const updateSaleForm = document.getElementById('update-sale-form');

updateSaleForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const saleId = document.getElementById('sale-to-update');
    const customerName = document.getElementById('updated-customer-name');
    const cropName = document.getElementById('updated-crop-name');
    const saleQuantity = document.getElementById('updated-sale-quantity');
    const salePrice = document.getElementById('updated-sale-price');
    const saleDate = document.getElementById('updated-sale-date');
    const shippingStatus = document.getElementById('updated-shipping-status');

    const saleIdValue = saleId.value;
    const customerNameValue = customerName.value;
    const cropNameValue = cropName.value;
    const saleQuantityValue = saleQuantity.value;
    const salePriceValue = salePrice.value;
    const saleDateValue = saleDate.value;
    const shippingStatusValue = shippingStatus.value;

    const data = {
        saleId: saleIdValue,
        customerName: customerNameValue,
        cropName: cropNameValue,
        saleQuantity: saleQuantityValue,
        salePrice: salePriceValue,
        saleDate: saleDateValue,
        shippingStatus: shippingStatusValue
    }

    const updateSale = async () => {
        const response = await fetch("/update-sale", {
            "method": "PATCH",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(data)
        });
        
        if (response.status == 200) {
            window.location.reload();
        } else {
            console.log(response.status);
        };
    };

    updateSale();
});