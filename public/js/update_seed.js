const updateSeedForm = document.getElementById('update-seed-form');

updateSeedForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const seedId = document.getElementById('seed-to-update');
    const seedName = document.getElementById('updated-seed-name');
    const seedPrice = document.getElementById('updated-seed-price');
    const seedDaysToGrow = document.getElementById('updated-seed-growth-days');
    const seedCanRegrow = document.getElementById('updated-seed-can-regrow');
    const seedRelatedCropId = document.getElementById('updated-related-crop');

    const seedIdValue = seedId.value;
    const seedNameValue = seedName.value;
    const seedPriceValue = seedPrice.value;
    const seedDaysToGrowValue = seedDaysToGrow.value;
    const seedCanRegrowValue = seedCanRegrow.value;
    const seedRelatedCropIdValue = seedRelatedCropId.value;

    const data = {
        seedId: seedIdValue,
        name: seedNameValue,
        price: seedPriceValue,
        growthDays: seedDaysToGrowValue,
        canRegrow: seedCanRegrowValue,
        relatedCropId: seedRelatedCropIdValue
    }

    const updateSeed = async () => {
        const response = await fetch("/update-seed", {
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

    updateSeed();
});