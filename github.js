let request = new XMLHttpRequest();
let labels = document.querySelectorAll(".buttons a");
let loading = document.querySelector(".box1 .pleaseWait");
let components = [];
let componentsWeekly;
let componentsMonthly;
let componentsYearly;
let componentsAllTime;
let allComponents;
let colors;

$.getJSON("colors.json", function(json) {
  colors = json;
});

let Display = {
  title: document.querySelectorAll(".repo a"),
  description: document.getElementsByTagName("p"),
  footer_stars: document.getElementsByClassName("stars"),
  footer_lang: document.getElementsByClassName("lang"),
  lang_colors: document.getElementsByClassName("repo-color")
};

function Component(
  title,
  username,
  description,
  stars,
  language,
  link,
  languageColor
) {
  this.title = title;
  this.username = username;
  this.description = description;
  this.stars = stars;
  this.language = language;
  this.languageColor = languageColor;
  this.link = link;
}

function requesting(date, periods) {
  let repos;
  request.open(
    "GET",
    "https://api.github.com/search/repositories?q=stars:>1+created:>" +
      date.getFullYear() +
      "-" +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + date.getDate()).slice(-2) +
      "&s=stars",
    true
  );
  request.setRequestHeader(
    "Authorization",
    "Bearer " + "61c3c2fe3624020249532a73a2e5209dc53f240e"
  );
  request.onload = function() {
    console.log(request);
    // Begin accessing JSON data here
    let data = JSON.parse(this.response);
    console.log(data);
    repos = data.items;
    components = createComponents(10);
    console.log(components);
    if (periods == "week") {
      componentsWeekly = components;
    } else if (periods == "month") {
      componentsMonthly = components;
    } else if (periods == "year") {
      componentsYearly = components;
    } else if (periods == "all time") {
      componentsAllTime = components;
    }
  };
  // Send request
  request.send();

  function createComponents(x) {
    let arr = [];
    for (i = 0; i < x; i++) {
      arr[i] = new Component(
        repos[i].name,
        repos[i].owner.login,
        repos[i].description,
        repos[i].stargazers_count,
        repos[i].language,
        repos[i].html_url
      );
    }
    return arr;
  }
}

function setDisplay(components) {
  for (i = 0; i < components.length; i++) {
    Display.title[i].textContent =
      components[i].username + "/" + components[i].title;
    Display.description[i].textContent = components[i].description;
    Display.footer_stars[i].textContent = components[i].stars;
    Display.footer_lang[i].textContent = components[i].language;
    Display.title[i].setAttribute("href", components[i].link);
    Object.keys(colors).forEach(function(element, index) {
      if (components[i].language === element) {
        Display.lang_colors[i].style.backgroundColor = Object.values(colors)[
          index
        ];
      } else if (components[i].language === "C++") {
        Display.lang_colors[i].style.backgroundColor = colors.cpp;
      } else if (components[i].language === null) {
        Display.lang_colors[i].style.backgroundColor = "white";
      }
    });
  }
}

function setDate(period) {
  let date = new Date();
  let today = date.getDate();
  let dayOfWeek = date.getDay();
  if (period == "week") {
    if (dayOfWeek === 0) {
      dayOfWeek = 7;
    }
    let lastSunday = today - dayOfWeek;
    date.setDate(lastSunday);
    date.setHours(0, 0, 0, 0);
  } else if (period == "month") {
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
  } else if (period == "year") {
    date.setDate(1);
    date.setMonth(0);
    date.setHours(0, 0, 0, 0);
  } else if (period == "all time") {
    date.setFullYear(1970);
    date.setMonth(0);
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
  }
  return date;
}

requesting(setDate("week"), "week");
setTimeout(function() {
  requesting(setDate("month"), "month");
  setDisplay(componentsWeekly);
}, 2000);
setTimeout(function() {
  requesting(setDate("year"), "year");
}, 4000);
setTimeout(function() {
  requesting(setDate("all time"), "all time");
}, 6000);
setTimeout(function() {
  allComponents = [
    componentsWeekly,
    componentsMonthly,
    componentsYearly,
    componentsAllTime
  ];

  labels.forEach(function(element, index) {
    element.addEventListener("click", function() {
      for (i = 0; i < labels.length; i++) {
        if (labels[i].classList.contains("current")) {
          labels[i].classList.remove("current");
        }
      }
      event.target.classList.add("current");
      if (event.target.classList.contains("current")) {
        setDisplay(allComponents[index]);
      }
    });
  });

  loading.classList.add("fadeOut");
}, 8000);
setTimeout(function() {
  loading.style.display = "none";
}, 8800);
