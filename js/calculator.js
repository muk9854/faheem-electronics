(function () {
  "use strict";

  var APPLIANCES = [
    { key: "fan", name: "Fan", types: [["AC Fan", 80], ["DC Fan", 35], ["Exhaust Fan", 40]] },
    { key: "tubelight", name: "Tubelight", types: [["36W", 36], ["40W", 40], ["60W", 60]] },
    { key: "bulb", name: "LED Bulb", types: [["5W", 5], ["7W", 7], ["12W", 12], ["15W", 15], ["18W", 18]] },
    { key: "tv", name: "LED TV", types: [["32 inch", 60], ["42 inch", 100], ["55 inch", 150], ["65 inch", 200]] },
    { key: "fridge", name: "Refrigerator", types: [["Inverter", 150], ["Normal", 250]] },
    { key: "washer", name: "Washing Machine", types: [["Inverter", 300], ["Normal", 500]] },
    { key: "iron", name: "Iron", types: [["Plastic Body", 800], ["Metal Body", 1000]] },
    { key: "splitac", name: "Split AC", types: [["1.0 Ton", 1500], ["1.5 Ton", 2000], ["2.0 Ton", 2400]] },
    { key: "invac", name: "Inverter AC", types: [["1.0 Ton", 800], ["1.5 Ton", 1200], ["2.0 Ton", 1600]] },
    { key: "pump", name: "Water Pump", types: [["0.5 HP", 400], ["1.0 HP", 750], ["1.5 HP", 1100], ["2.0 HP", 1500]] },
    { key: "microwave", name: "Microwave", types: [["Standard", 1200]] },
    { key: "computer", name: "Computer", types: [["Desktop PC", 200]] },
    { key: "laptop", name: "Laptop", types: [["Standard", 65]] }
  ];

  var TIERS = [
    { max: 300, name: "EcoFlow RIVER 3", img: "images/products/ecoflow-river-3-portable-power-station.jpg", spec: "300W output \u00b7 245Wh LiFePO4 \u00b7 X-Boost up to 600W", wh: 245, price: "PKR 60,000", alt: "Budget alternative: RIVER 2 (300W, 256Wh) \u2014 PKR 63,000" },
    { max: 600, name: "EcoFlow RIVER 3 Max Plus", img: "images/products/ecoflow-river-3-max-plus-portable-power-station.jpg", spec: "600W output \u00b7 858Wh expandable \u00b7 X-Boost up to 1200W", wh: 858, price: "PKR 120,000", alt: "" },
    { max: 1000, name: "EcoFlow DELTA 3 2000 Air", img: "images/products/ecoflow-delta-3-air-2000-portable-power-station.png", spec: "1000W output \u00b7 1920Wh LiFePO4", wh: 1920, price: "PKR 205,000", alt: "Budget alternative: DELTA 3 1000 Air (500W, 960Wh) \u2014 PKR 125,000" },
    { max: 1800, name: "EcoFlow DELTA 3 Classic", img: "images/products/ecoflow-delta-3-classic-portable-power-station.webp", spec: "1800W output \u00b7 1024Wh LiFePO4 \u00b7 X-Stream fast charging", wh: 1024, price: "PKR 160,000", alt: "Alternative: DELTA 3 (1800W, 1024Wh) \u2014 PKR 170,000" },
    { max: 2400, name: "EcoFlow DELTA 3 Max", img: "images/products/ecoflow-delta-3-max.webp", spec: "2400W output \u00b7 2048Wh LFP \u00b7 X-Boost up to 3400W", wh: 2048, price: "PKR 250,000", alt: "" },
    { max: 3600, name: "EcoFlow DELTA 3 Ultra", img: "images/products/ecoflow-delta-3-ultra-series-portable-power-station.webp", spec: "3600W output \u00b7 3072Wh LiFePO4 \u00b7 surge 7200W", wh: 3072, price: "PKR 400,000", alt: "" },
    { max: 4000, name: "EcoFlow DELTA Pro 3", img: "images/products/ecoflow-delta-pro-3-portable-power-station.jpg", spec: "4000W output \u00b7 4096Wh LFP \u00b7 expandable up to 12kWh", wh: 4096, price: "PKR 800,000", alt: "" }
  ];

  var grid = document.getElementById("calcGrid");
  var totalWattsEl = document.getElementById("totalWatts");
  var totalKwEl = document.getElementById("totalKw");
  var result = document.getElementById("calcResult");
  var empty = document.getElementById("calcEmpty");
  if (!grid || !result || !empty) return;

  var resultImg = document.getElementById("resultImg");
  var resultName = document.getElementById("resultName");
  var resultSpec = document.getElementById("resultSpec");
  var resultAlt = document.getElementById("resultAlt");
  var resultRuntime = document.getElementById("resultRuntime");
  var resultPrice = document.getElementById("resultPrice");
  var solutionBtn = document.getElementById("solutionBtn");

  var rows = [];

  function formatWatts(n) {
    return n.toLocaleString("en-US");
  }

  function buildRow(app) {
    var row = document.createElement("div");
    row.className = "calc-row";

    var name = document.createElement("div");
    name.className = "calc-row__name";
    name.textContent = app.name;

    var select = document.createElement("select");
    select.className = "calc-row__type";
    select.setAttribute("aria-label", app.name + " type");
    app.types.forEach(function (t) {
      var opt = document.createElement("option");
      opt.value = t[1];
      opt.textContent = t[0] + " (" + t[1] + "W)";
      select.appendChild(opt);
    });

    var qty = document.createElement("input");
    qty.type = "number";
    qty.className = "calc-row__qty";
    qty.min = "0";
    qty.max = "99";
    qty.value = "0";
    qty.setAttribute("inputmode", "numeric");
    qty.setAttribute("aria-label", app.name + " quantity");

    var total = document.createElement("div");
    total.className = "calc-row__total";
    total.textContent = "0 W";

    row.appendChild(name);
    row.appendChild(select);
    row.appendChild(qty);
    row.appendChild(total);

    select.addEventListener("change", recalc);
    qty.addEventListener("input", recalc);

    grid.appendChild(row);
    rows.push({ app: app, select: select, qty: qty, total: total });
  }

  APPLIANCES.forEach(buildRow);

  function recalc() {
    var total = 0;
    rows.forEach(function (r) {
      var w = parseInt(r.select.value, 10) || 0;
      var q = parseInt(r.qty.value, 10) || 0;
      if (q < 0) q = 0;
      var rowTotal = w * q;
      r.total.textContent = formatWatts(rowTotal) + " W";
      total += rowTotal;
    });
    totalWattsEl.textContent = formatWatts(total);
    totalKwEl.textContent = "(" + (total / 1000).toFixed(2) + " kW)";
    renderResult(total);
  }

  function runtimeText(wh, watts) {
    var hours = (wh * 0.85) / watts;
    var h = Math.floor(hours);
    var m = Math.round((hours - h) * 60);
    if (h <= 0) return "Est. runtime at this load: about " + m + " minutes";
    return "Est. runtime at this load: about " + h + " hr " + m + " min";
  }

  function renderResult(total) {
    if (total <= 0) {
      result.hidden = true;
      empty.hidden = false;
      return;
    }
    empty.hidden = true;
    result.hidden = false;

    var tier = null;
    for (var i = 0; i < TIERS.length; i++) {
      if (total <= TIERS[i].max) { tier = TIERS[i]; break; }
    }

    if (tier) {
      resultImg.src = tier.img;
      resultImg.alt = tier.name + " at Faheem Electronics";
      resultName.textContent = tier.name;
      resultSpec.textContent = tier.spec;
      resultAlt.textContent = tier.alt || "";
      resultRuntime.textContent = runtimeText(tier.wh, total);
      resultPrice.textContent = tier.price;
    } else {
      resultImg.src = "images/products/ecoflow-delta-pro-3-portable-power-station.jpg";
      resultImg.alt = "Custom EcoFlow system";
      resultName.textContent = "Custom EcoFlow System";
      resultSpec.textContent = "Your load is above 4kW \u2014 a single EcoFlow unit may not be enough. Let our engineers design a custom system for you.";
      resultAlt.textContent = "";
      resultRuntime.textContent = "";
      resultPrice.textContent = "";
    }
  }

  if (solutionBtn) {
    solutionBtn.addEventListener("click", function () {
      var target = document.getElementById("calcResult");
      if (!target || target.hidden) target = document.getElementById("calcGrid");
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  recalc();
})();