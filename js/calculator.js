(function () {
  "use strict";

  /* Appliance ke saath startup multiplier.
     Motor/compressor wali cheezein chalte waqt se kahin zyada kheenchti hain. */
  var APPLIANCES = [
    { key: "fan", name: "Fan", types: [["AC Fan", 80, 1.5], ["DC Fan", 35, 1], ["Exhaust Fan", 40, 1.5]] },
    { key: "tubelight", name: "Tubelight", types: [["36W", 36, 1], ["40W", 40, 1], ["60W", 60, 1]] },
    { key: "bulb", name: "LED Bulb", types: [["5W", 5, 1], ["7W", 7, 1], ["12W", 12, 1], ["15W", 15, 1], ["18W", 18, 1]] },
    { key: "tv", name: "LED TV", types: [["32 inch", 60, 1], ["42 inch", 100, 1], ["55 inch", 150, 1], ["65 inch", 200, 1]] },
    { key: "fridge", name: "Refrigerator", types: [["Inverter", 150, 1.5], ["Normal", 250, 3]] },
    { key: "washer", name: "Washing Machine", types: [["Inverter", 300, 1.5], ["Normal", 500, 3]] },
    { key: "iron", name: "Iron", types: [["Plastic Body", 800, 1], ["Metal Body", 1000, 1]] },
    { key: "splitac", name: "Split AC", types: [["1.0 Ton", 1500, 3], ["1.5 Ton", 2000, 3], ["2.0 Ton", 2400, 3]] },
    { key: "invac", name: "Inverter AC", types: [["1.0 Ton", 800, 1.5], ["1.5 Ton", 1200, 1.5], ["2.0 Ton", 1600, 1.5]] },
    { key: "pump", name: "Water Pump", types: [["0.5 HP", 400, 3], ["1.0 HP", 750, 3], ["1.5 HP", 1100, 3], ["2.0 HP", 1500, 3]] },
    { key: "microwave", name: "Microwave", types: [["Standard", 1200, 1.5]] },
    { key: "computer", name: "Computer", types: [["Desktop PC", 200, 1]] },
    { key: "laptop", name: "Laptop", types: [["Standard", 65, 1]] }
  ];

  /* Products — rated, surge aur price sab products page se.
     surge sirf wahan barha hua hai jahan page par likha hai (X-Boost ya surge).
     Jahan kuch nahi likha, surge = rated — koi number andaze se nahi dala. */
  var PRODUCTS = [
    { name: "EcoFlow RIVER 3", rated: 300, surge: 600, wh: 245,
      spec: "300W output · 245Wh LiFePO4 · X-Boost up to 600W",
      price: "PKR 60,000", img: "images/products/ecoflow-river-3-portable-power-station.webp",
      url: "ecoflow-river-3-karachi.html" },
    { name: "EcoFlow RIVER 2", rated: 300, surge: 600, wh: 256,
      spec: "300W output · 256Wh LFP · surge 600W",
      price: "PKR 63,000", img: "images/products/ecoflow-river-2-portable-power-station.webp",
      url: "ecoflow-river-2-karachi.html" },
    { name: "EcoFlow DELTA 3 1000 Air", rated: 500, surge: 800, wh: 960,
      spec: "500W output · 960Wh LiFePO4 · X-Boost 800W",
      price: "PKR 125,000", img: "images/products/ecoflow-delta-3-1000-air-portable-power-station.webp",
      url: "ecoflow-delta-3-1000-air-karachi.html" },
    { name: "EcoFlow RIVER 3 Max Plus", rated: 600, surge: 1200, wh: 858,
      spec: "600W output · 858Wh expandable · X-Boost up to 1200W",
      price: "PKR 120,000", img: "images/products/ecoflow-river-3-max-plus-portable-power-station.webp",
      url: "ecoflow-river-3-max-plus-karachi.html" },
    { name: "EcoFlow DELTA 3 Air 2000", rated: 1000, surge: 1000, wh: 1920,
      spec: "1000W output · 1920Wh LiFePO4",
      price: "PKR 205,000", img: "images/products/ecoflow-delta-3-air-2000-portable-power-station.webp",
      url: "ecoflow-delta-3-air-2000-karachi.html" },
    { name: "EcoFlow DELTA 3 Classic", rated: 1800, surge: 1800, wh: 1024,
      spec: "1800W output · 1024Wh LiFePO4 · X-Stream fast charging",
      price: "PKR 160,000", img: "images/products/ecoflow-delta-3-classic-portable-power-station.webp",
      url: "ecoflow-delta-3-classic-karachi.html" },
    { name: "EcoFlow DELTA 3", rated: 1800, surge: 1800, wh: 1024,
      spec: "1800W output · 1024Wh LiFePO4 · X-Stream fast charging",
      price: "PKR 170,000", img: "images/products/ecoflow-delta-3-portable-power-station.webp",
      url: "ecoflow-delta-3-karachi.html" },
    { name: "EcoFlow DELTA 3 Max", rated: 2400, surge: 3400, wh: 2048,
      spec: "2400W output · 2048Wh LFP · X-Boost up to 3400W",
      price: "PKR 250,000", img: "images/products/ecoflow-delta-3-max.webp",
      url: "ecoflow-delta-3-max-karachi.html" },
    { name: "EcoFlow DELTA 3 Ultra", rated: 3600, surge: 7200, wh: 3072,
      spec: "3600W output · 3072Wh LiFePO4 · surge 7200W",
      price: "PKR 400,000", img: "images/products/ecoflow-delta-3-ultra-series-portable-power-station.webp",
      url: "ecoflow-delta-3-ultra-karachi.html" },
    { name: "EcoFlow DELTA Pro 3", rated: 4000, surge: 8000, wh: 4096,
      spec: "4000W output · 4096Wh LFP · expandable up to 12kWh",
      price: "PKR 800,000", img: "images/products/ecoflow-delta-pro-3-portable-power-station.webp",
      url: "ecoflow-delta-pro-3-karachi.html" }
  ];

  var BIGGEST = PRODUCTS[PRODUCTS.length - 1];

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
  var resultLink = document.getElementById("resultLink");
  var surgeNote = document.getElementById("surgeNote");
  var solutionBtn = document.getElementById("solutionBtn");

  var rows = [];

  function fmt(n) { return n.toLocaleString("en-US"); }

  function buildRow(app) {
    var row = document.createElement("div");
    row.className = "calc-row";

    var name = document.createElement("div");
    name.className = "calc-row__name";
    name.textContent = app.name;

    var select = document.createElement("select");
    select.className = "calc-row__type";
    select.setAttribute("aria-label", app.name + " type");
    app.types.forEach(function (t, i) {
      var opt = document.createElement("option");
      opt.value = String(i);
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

  /* Running total, aur peak = running + sab se bara single startup jhatka.
     Sab cheezein ek saath start nahi hotin, isliye sirf sab se bara extra jorte hain. */
  function tally() {
    var running = 0, biggestKick = 0, kickFrom = "";
    rows.forEach(function (r) {
      var t = r.app.types[parseInt(r.select.value, 10) || 0];
      var w = t[1], mult = t[2];
      var q = parseInt(r.qty.value, 10) || 0;
      if (q < 0) q = 0;
      var rowTotal = w * q;
      r.total.textContent = fmt(rowTotal) + " W";
      running += rowTotal;
      if (q > 0) {
        var kick = w * mult - w;
        if (kick > biggestKick) { biggestKick = kick; kickFrom = r.app.name + " (" + t[0] + ")"; }
      }
    });
    return { running: running, peak: Math.round(running + biggestKick),
             kick: Math.round(biggestKick), kickFrom: kickFrom };
  }

  function recalc() {
    var t = tally();
    totalWattsEl.textContent = fmt(t.running);
    totalKwEl.textContent = "(" + (t.running / 1000).toFixed(2) + " kW)";
    render(t);
  }

  function runtimeText(wh, watts) {
    var hours = (wh * 0.85) / watts;
    var h = Math.floor(hours);
    var m = Math.round((hours - h) * 60);
    if (h <= 0) return "Est. runtime at this load: about " + m + " minutes";
    return "Est. runtime at this load: about " + h + " hr " + m + " min";
  }

  function rupees(p) { return parseInt(p.price.replace(/[^0-9]/g, ""), 10); }

  /* Jo products running aur startup dono utha lein, un mein se sab se sasta.
     Agar koi aur bhi fit hota ho jiski battery kaafi bari ho, usey upgrade ke tor par dikhate hain. */
  function pick(t) {
    var fit = PRODUCTS.filter(function (p) {
      return p.rated >= t.running && p.surge >= t.peak;
    });
    if (!fit.length) return null;
    fit.sort(function (a, b) { return rupees(a) - rupees(b); });
    var best = fit[0];
    var upgrade = null;
    for (var i = 1; i < fit.length; i++) {
      if (fit[i].wh >= best.wh * 1.5) { upgrade = fit[i]; break; }
    }
    return { best: best, upgrade: upgrade };
  }

  function render(t) {
    if (t.running <= 0) {
      result.hidden = true;
      empty.hidden = false;
      if (surgeNote) surgeNote.hidden = true;
      return;
    }
    empty.hidden = true;
    result.hidden = false;

    if (surgeNote) {
      surgeNote.hidden = false;
      surgeNote.innerHTML = t.kick > 0
        ? "Running load <strong>" + fmt(t.running) + " W</strong>, but starting load peaks at about <strong>"
          + fmt(t.peak) + " W</strong> &mdash; " + t.kickFrom + " draws roughly " + fmt(t.kick)
          + " W extra the moment it kicks in. Sizing below allows for that."
        : "Running load <strong>" + fmt(t.running) + " W</strong>. None of these appliances has a motor or compressor, so there is no significant starting surge.";
    }

    var sel = pick(t);
    var p = sel && sel.best;

    if (p) {
      resultImg.src = p.img;
      resultImg.alt = p.name + " at Faheem Electronics";
      resultName.textContent = p.name;
      resultSpec.textContent = p.spec;
      resultAlt.textContent = sel.upgrade
        ? "Longer backup: " + sel.upgrade.name.replace("EcoFlow ", "") + " (" + fmt(sel.upgrade.wh)
          + "Wh vs " + fmt(p.wh) + "Wh) \u2014 " + sel.upgrade.price
        : "";
      resultRuntime.textContent = runtimeText(p.wh, t.running);
      resultPrice.textContent = p.price;
      if (resultLink) { resultLink.href = p.url; resultLink.textContent = "View " + p.name.replace("EcoFlow ", "") + " →"; resultLink.hidden = false; }
    } else {
      resultImg.src = BIGGEST.img;
      resultImg.alt = "Custom EcoFlow system from Faheem Electronics";
      resultName.textContent = "More Than One Unit";
      resultSpec.textContent = "Your load needs about " + fmt(t.peak) + " W at startup, which is beyond a single "
        + BIGGEST.name.replace("EcoFlow ", "") + " (" + fmt(BIGGEST.rated) + " W). We will design a multi-unit system for you.";
      resultAlt.textContent = "Largest single unit: " + BIGGEST.name.replace("EcoFlow ", "") + " — " + BIGGEST.price;
      resultRuntime.textContent = "";
      resultPrice.textContent = "";
      if (resultLink) { resultLink.href = BIGGEST.url; resultLink.textContent = "View " + BIGGEST.name.replace("EcoFlow ", "") + " →"; resultLink.hidden = false; }
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
