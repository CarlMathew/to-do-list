const signUp = document.querySelector("#signupBtn");
const login = document.querySelector("#loginNowBtn");
const signBar = "#signUpBar";
const signBar2 = "#signUpBar2";
const loginBar = "#loginBar";
const loginBar2 = "#loginBar2";

$(signBar2).hide();
$(loginBar2).hide();

signUp.addEventListener("click", () => {
  anime({
    targets: signBar,
    translateY: [0, "400px"],
    duration: 2000,
    easing: "easeInOutExpo",
    complete: () => {
      $(signBar).hide(0, () => {
        $(signBar2).show(0, () => {
          anime({
            targets: signBar2,
            translateY: ["400px", 0],
            duration: 2000,
            easing: "easeInOutExpo",
          });
        });
      });
    },
  });
  anime({
    targets: loginBar,
    translateY: [0, "-400px"],
    duration: 2000,
    easing: "easeInOutExpo",
    complete: () => {
      $(loginBar).hide(0, () => {
        $(loginBar2).show(0, () => {
          anime({
            targets: loginBar2,
            translateY: ["-800px", 0],
            duration: 2000,
            easing: "easeInOutExpo",
          });
        });
      });
    },
  });
});

login.addEventListener("click", () => {
  anime({
    targets: signBar2,
    translateY: [0, "-500px"],
    duration: 2000,
    easing: "easeInOutExpo",
    complete: () => {
      $(signBar2).hide(0, () => {
        $(signBar).show(0, () => {
          anime({
            targets: signBar,
            translateY: ["-400px", 0],
            duration: 2000,
            easing: "easeInOutExpo",
          });
        });
      });
    },
  });
  anime({
    targets: loginBar2,
    translateY: [0, "400px"],
    duration: 2000,
    easing: "easeInOutExpo",
    complete: () => {
      $(loginBar2).hide(0, () => {
        $(loginBar).show(0, () => {
          anime({
            targets: loginBar,
            translateY: ["400px", 0],
            duration: 2000,
            easing: "easeInOutExpo",
          });
        });
      });
    },
  });
});

setTimeout(() => {
  $("#warningMessage").hide(1000);
  console.log("Hiding");
}, 5000);
