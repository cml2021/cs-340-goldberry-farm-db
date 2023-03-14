const updateCropForm = document.getElementById('update-crop-form');

updateCropForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const cropId = document.getElementById('crop-to-update');
    const cropName = document.getElementById('update-crop-name');
    const cropQuantity = document.getElementById('update-crop-quantity');
    const cropUnitPrice = document.getElementById('update-crop-unit-price');
    const cropYear = document.getElementById('update-crop-year');
    const cropRelatedSeedId = document.getElementById('update-related-seed');
    // const cropRelatedSeasonIds = document.getElementById('update-related-season');

    const cropIdValue = cropId.value;
    const cropNameValue = cropName.value;
    const cropQuantityValue = cropQuantity.value;
    const cropUnitPriceValue = cropUnitPrice.value;
    const cropYearValue = cropYear.value;
    const cropRelatedSeedIdValue = cropRelatedSeedId.value;
    // const cropRelatedSeasonIdsValue = cropRelatedSeasonIds.value;

    const data = {
        cropId: cropIdValue,
        cropName: cropNameValue,
        cropQuantity: cropQuantityValue,
        cropUnitPrice: cropUnitPriceValue,
        cropYear: cropYearValue,
        cropRelatedSeedId: cropRelatedSeedIdValue,
        // cropRelatedSeasonIds: cropRelatedSeasonIdsValue
    }

    const updateCrop = async () => {
        const response = await fetch("/update-crop", {
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

    updateCrop();
});