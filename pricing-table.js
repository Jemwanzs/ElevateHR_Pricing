//Defining the Prices (monthly rates)
const products = [
    { name: "ElevateHR HRIM", prices: [25, 25, 25] },
    { name: "ElevateHR Payroll", prices: [200, 225, 250] },
    { name: "ElevateHR Leave", prices: [225, 250, 275] },
    { name: "ElevateHR Salary Advance", prices: [100, 125, 125] },
    { name: "ElevateHR Mobile App (IOS & Android)", prices: [50, 50, 50] },
    { name: "ElevateHR ESS (Web)", prices: [20, 20, 20] },
    { name: "ElevateHR Digital Salary Payments", prices: [125, 125, 125] },
    { name: "ElevateHR Payroll & HR Compliance", prices: [400, 475, 500] }
];

const tableBody = document.getElementById("productRows");
const minLimits = { annual: 1000, semiAnnual: 500, monthly: 100 };
const maxLimits = { annual: 115000, semiAnnual: 580, monthly: 100 };
const minLimitsCompliance = { annual: 500, semiAnnual: 250, monthly: 50 };
const maxLimitsCompliance = { annual: 5000, semiAnnual: 2500, monthly: 500 };

// Populate table
products.forEach((product, index) => {
    let row = document.createElement("tr");
    row.innerHTML = `
        <td><input type="checkbox" class="product-checkbox"></td>
        <td>${product.name}</td>
        <td class="annual-price">0</td>
        <td class="semi-annual-price">0</td>
        <td class="monthly-price">0</td>
    `;
    tableBody.appendChild(row);
});

// Function to update pricing
function updatePricing() {
    let companySize = parseInt(document.getElementById("companySize").value) || 0;
    let totalAnnual = 0, totalSemiAnnual = 0, totalMonthly = 0;
    
    document.querySelectorAll("#productRows tr").forEach((row, index) => {
        let checkbox = row.querySelector(".product-checkbox");
        let annualPrice = 0, semiAnnualPrice = 0, monthlyPrice = 0;

        if (checkbox.checked) {
            let prices = products[index].prices;
            annualPrice = prices[0] * 12 * companySize;
            semiAnnualPrice = prices[1] * 6 * companySize;
            monthlyPrice = prices[2] * companySize;
            
            if (companySize === 0) {
                annualPrice = 0;
                semiAnnualPrice = 0;
                monthlyPrice = 0;
            } else if (products[index].name === "ElevateHR Payroll & HR Compliance") {
                annualPrice = Math.max(minLimitsCompliance.annual, Math.min(annualPrice, maxLimitsCompliance.annual));
                semiAnnualPrice = Math.max(minLimitsCompliance.semiAnnual, Math.min(semiAnnualPrice, maxLimitsCompliance.semiAnnual));
                monthlyPrice = Math.max(minLimitsCompliance.monthly, Math.min(monthlyPrice, maxLimitsCompliance.monthly));
            }
            
        }

        row.querySelector(".annual-price").textContent = annualPrice.toLocaleString();
        row.querySelector(".semi-annual-price").textContent = semiAnnualPrice.toLocaleString();
        row.querySelector(".monthly-price").textContent = monthlyPrice.toLocaleString();

        totalAnnual += annualPrice;
        totalSemiAnnual += semiAnnualPrice;
        totalMonthly += monthlyPrice;
    });

    document.getElementById("totalAnnual").textContent = totalAnnual.toLocaleString();
    document.getElementById("totalSemiAnnual").textContent = totalSemiAnnual.toLocaleString();
    document.getElementById("totalMonthly").textContent = totalMonthly.toLocaleString();

    document.getElementById("subscriptionAnnual").textContent = totalAnnual > 0 ? Math.max(minLimits.annual, Math.min(totalAnnual, maxLimits.annual)).toLocaleString() : "0";
    document.getElementById("subscriptionSemiAnnual").textContent = totalSemiAnnual > 0 ? Math.max(minLimits.semiAnnual, Math.min(totalSemiAnnual, maxLimits.semiAnnual)).toLocaleString() : "0";
    document.getElementById("subscriptionMonthly").textContent = totalMonthly > 0 ? Math.max(minLimits.monthly, Math.min(totalMonthly, maxLimits.monthly)).toLocaleString() : "0";
}

// Event listeners
const companySizeInput = document.getElementById("companySize");
companySizeInput.addEventListener("input", updatePricing);

document.querySelectorAll(".product-checkbox").forEach(checkbox => {
    checkbox.addEventListener("change", function () {
        updatePricing();
        highlightRow(this);
    });
});

document.getElementById("selectAll").addEventListener("change", function () {
    const checkboxes = document.querySelectorAll(".product-checkbox");
    checkboxes.forEach(cb => {
        cb.checked = this.checked;
        highlightRow(cb);
    });
    updatePricing();
});

function highlightRow(checkbox) {
    checkbox.closest("tr").classList.toggle("highlight", checkbox.checked);
}

// Event listeners for product checkboxes
document.querySelectorAll(".product-checkbox").forEach(checkbox => {
    checkbox.addEventListener("change", function () {
        updatePricing();
        highlightRow(this);
        
        // If any checkbox is unchecked, uncheck the main "Select All" checkbox
        if (!this.checked) {
            document.getElementById("selectAll").checked = false;
        } else {
            // Check if all checkboxes are selected, then check the "Select All" checkbox
            const allChecked = [...document.querySelectorAll(".product-checkbox")].every(cb => cb.checked);
            document.getElementById("selectAll").checked = allChecked;
        }
    });
});

// Event listener for "Select All" checkbox
document.getElementById("selectAll").addEventListener("change", function () {
    const checkboxes = document.querySelectorAll(".product-checkbox");
    checkboxes.forEach(cb => {
        cb.checked = this.checked;
        highlightRow(cb);
    });
    updatePricing();
});
