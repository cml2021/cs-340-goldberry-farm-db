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

    // console.log("request data in update_seed: ", data)

    const xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-seed", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(data));

   //TODO figure out how to reload page. CORS?
});