let sound = new Audio();
const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: [],
  },

  eventHandlers: {
    oninput: null,
    onclose: null,
  },

  properties: {
    value: "",
    CapsLockLock: false,
    shift: false,
    enRu: false,
  },

  playSound(){
    sound.pause();
    sound.currentTime = 0;
    sound.src = './assets/nep.mp3';
    sound.play();
  },

  init() {
    //Create main elements
    this.elements.main = document.createElement("div");
    this.elements.keysContainer = document.createElement("div");

    //Setup main elements
    this.elements.main.classList.add("keyboard", "keyboard--hidden");
    this.elements.keysContainer.classList.add("keyboard__keys");
    this.elements.keysContainer.appendChild(this._createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll(
      ".keyboard__key"
    );

    //Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    // Automatically use keyboard for elements with .keyboard-input
    document.querySelectorAll(".use-keyboard-input").forEach((element) => {
      element.addEventListener("focus", () => {
        this.open(element.value, (currentValue) => {
          element.value = currentValue;
        });
      });
    });
  },

  keyLayoutRu: [
    "ё", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace",
    "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ",
    "CapsLock", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "Enter",
    "done", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".", "Shift",
    "ru", " ", "ArrowLeft", "ArrowRight"
  ],

  keyLayoutEn: [
    "`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace",
    "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]",
    "CapsLock", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "Enter",
    "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "Shift",
    "en", " ", "ArrowLeft", "ArrowRight"
  ],

  keyLayoutShiftEn: [
    "~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+", "Backspace",
    "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]",
    "CapsLock", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "Enter",
    "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "Shift",
    "en", " ", "ArrowLeft", "ArrowRight"
  ],

  keyLayoutShiftRu: [
    "Ё", "!", '"', "№", ";", "%", ":", "?", "*", "(", ")", "_", "+", "Backspace",
    "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ",
    "CapsLock", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "Enter",
    "done", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ",", "Shift",
    "ru", " ", "ArrowLeft", "ArrowRight"
  ],

  _createKeys(keyLayout = this.keyLayoutEn) {
    const fragment = document.createDocumentFragment();

    //Creates HTML for icon
    const createIconHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`;
    };

    keyLayout.forEach((key) => {
      let keyElement = document.createElement("button");
      const insertLineBreak = ["Backspace", "ъ", "]", "Enter", "Shift"].indexOf(key) !== -1;
      //Add atributes/calsses
      keyElement.setAttribute("type", "button");
      keyElement.setAttribute("data", key);
      keyElement.classList.add("keyboard__key");

      switch (key) {
        case "Backspace":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("backspace");

          keyElement.addEventListener("click", () => {
            this.playSound();
            var input = document.getElementById("focus");

            input.focus();
            var selectedTextArea = document.activeElement;
            var cursorSelect = selectedTextArea.selectionStart;

            this.properties.value =
              this.properties.value.substring(0, cursorSelect - 1) +
              this.properties.value.substring(
                cursorSelect,
                this.properties.value.length
              );

            this._triggerEvent("oninput");
            input.setSelectionRange(cursorSelect - 1, cursorSelect - 1);
          });

          break;

        case "CapsLock":
          keyElement.classList.add(
            "keyboard__key--wide",
            "keyboard__key--activatable"
          );
          keyElement.innerHTML = createIconHTML("keyboard_capslock");

          keyElement.addEventListener("click", () => {
            this.playSound();
            this._toggleCapsLock();
            keyElement.classList.toggle(
              "keyboard__key--active",
              this.properties.capsLock
            );
          });

          break;

        case "Shift":
          keyElement.classList.add(
            "keyboard__key--wide",
            "keyboard__key--toggle"
          );
          keyElement.innerHTML = "shift";

          keyElement.addEventListener("click", () => {
            this.playSound();
            this._toggleShift();
            keyElement.classList.toggle(
              "keyboard__key--shift",
              this.properties.shift
            );
          });

          break;

        case "en" || "ru":
          keyElement.classList.add("keyboard__key", "keyboard__key--toggle");
          keyElement.innerHTML = "en";

          keyElement.addEventListener("click", () => {
            this.playSound();
            this._toggleEnRu();
            keyElement.classList.toggle(
              "keyboard__key--shift",
              this.properties.enRu,
              (keyElement.innerHTML = this.properties.enRu ? "ru" : "en")
            );
          });

          break;

        case "Enter":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("keyboard_return");

          keyElement.addEventListener("click", () => {
            this.playSound();
            var input = document.getElementById("focus");
            input.focus();
            var selectedTextArea = document.activeElement;
            var cursorSelect = selectedTextArea.selectionStart;
            this.properties.value =
              this.properties.value.substring(0, cursorSelect) +
              "\n" +
              this.properties.value.substring(
                cursorSelect,
                this.properties.value.length
              );
            this._triggerEvent("oninput");
            input.setSelectionRange(cursorSelect + 1, cursorSelect + 1);
          });

          break;

        case " ":
          keyElement.classList.add("keyboard__key--extra-wide");
          keyElement.innerHTML = createIconHTML("space_bar");

          keyElement.addEventListener("click", () => {
            this.playSound();
            var input = document.getElementById("focus");
            input.focus();
            var selectedTextArea = document.activeElement;
            var cursorSelect = selectedTextArea.selectionStart;
            this.properties.value =
              this.properties.value.substring(0, cursorSelect) +
              " " +
              this.properties.value.substring(
                cursorSelect,
                this.properties.value.length
              );
            this._triggerEvent("oninput");
            input.setSelectionRange(cursorSelect + 1, cursorSelect + 1);
          });

          break;

        case "ArrowLeft":
          keyElement.classList.add("keyboard__key");
          keyElement.innerHTML = createIconHTML("arrow_left");

          keyElement.addEventListener("click", () => {
            this.playSound();
            this._selectTextLeft();
          });
          break;

        case "ArrowRight":
          keyElement.classList.add("keyboard__key");
          keyElement.innerHTML = createIconHTML("arrow_right");

          keyElement.addEventListener("click", () => {
            this.playSound();
            this._selectTextRight();
          });
          break;

        case "done":
          keyElement.classList.add(
            "keyboard__key--wide",
            "keyboard__key--dark"
          );
          keyElement.innerHTML = createIconHTML("check_circle");

          keyElement.addEventListener("click", () => {
            this.playSound();
            this.close();
            this._triggerEvent("onclose");
          });

          break;

        default:
          keyElement.textContent = key.toLowerCase();
          keyElement.addEventListener("click", () => {
            this.playSound();
            var input = document.getElementById("focus");
            input.focus();
            var selectedTextArea = document.activeElement;
            var cursorSelect = selectedTextArea.selectionStart;
            this.properties.value =
              this.properties.value.substring(0, cursorSelect) +
              (this.properties.shift
                ? this.properties.enRu
                  ? this.keyLayoutRu.indexOf(key.toLowerCase()) < 13
                    ? this.properties.capsLock
                      ? this.keyLayoutShiftRu[
                          this.keyLayoutEn.indexOf(key)
                        ].toLowerCase()
                      : this.keyLayoutShiftRu[
                          this.keyLayoutEn.indexOf(key)
                        ].toUpperCase()
                    : this.properties.capsLock
                    ? this.keyLayoutRu[
                        this.keyLayoutEn.indexOf(key)
                      ].toLowerCase()
                    : this.keyLayoutRu[
                        this.keyLayoutEn.indexOf(key)
                      ].toUpperCase()
                  : this.keyLayoutEn.indexOf(key.toLowerCase()) < 13
                  ? this.properties.capsLock
                    ? this.keyLayoutShiftEn[
                        this.keyLayoutEn.indexOf(key)
                      ].toLowerCase()
                    : this.keyLayoutShiftEn[
                        this.keyLayoutEn.indexOf(key)
                      ].toUpperCase()
                  : this.properties.capsLock
                  ? this.keyLayoutEn[
                      this.keyLayoutEn.indexOf(key)
                    ].toLowerCase()
                  : this.keyLayoutEn[
                      this.keyLayoutEn.indexOf(key)
                    ].toUpperCase()
                : this.properties.enRu
                ? this.properties.capsLock
                  ? this.keyLayoutRu[
                      this.keyLayoutEn.indexOf(key)
                    ].toUpperCase()
                  : this.keyLayoutRu[
                      this.keyLayoutEn.indexOf(key)
                    ].toLowerCase()
                : this.properties.capsLock
                ? key.toUpperCase()
                : key.toLowerCase()) +
              this.properties.value.substring(
                cursorSelect,
                this.properties.value.length
              );
            this._triggerEvent("oninput");
            input.setSelectionRange(cursorSelect + 1, cursorSelect + 1);
          });

          break;
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement("br"));
      }
    });

    return fragment;
  },

  _triggerEvent(handlerName) {
    // console.log(`Event Triggered! Event Name ${handlerName}`);
    if (typeof this.eventHandlers[handlerName] == "function") {
      this.eventHandlers[handlerName](this.properties.value);
    }
  },

  _selectTextLeft() {
    var input = document.getElementById("focus");
    input.focus();
    var selectedTextArea = document.activeElement;
    if (selectedTextArea.selectionStart != 0) {
      input.setSelectionRange(
        selectedTextArea.selectionStart - 1,
        selectedTextArea.selectionEnd - 1
      );
    }
  },

  _selectTextRight() {
    var input = document.getElementById("focus");
    input.focus();
    var selectedTextArea = document.activeElement;
    input.setSelectionRange(
      selectedTextArea.selectionStart + 1,
      selectedTextArea.selectionEnd + 1
    );
    input.focus();
  },

  _toggleCapsLock() {
    // console.log(`Caps Lock Toggled!`);
    this.properties.capsLock = !this.properties.capsLock;

    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        key.textContent = !this.properties.shift
          ? this.properties.capsLock
            ? key.textContent.toUpperCase()
            : key.textContent.toLowerCase()
          : this.properties.capsLock
          ? key.textContent.toLowerCase()
          : key.textContent.toUpperCase();
      }
    }
  },

  _toggleShift() {
    this.properties.shift = !this.properties.shift;
    for (i in this.elements.keys) {
      if (this.elements.keys[i].childElementCount === 0 && (i != 0 || i < 13)) {
        if (!this.properties.enRu) {
          this.elements.keys[i].textContent = this.properties.shift
            ? this.keyLayoutShiftEn[i].toUpperCase()
            : this.keyLayoutEn[i];
        } else {
          this.elements.keys[i].textContent = this.properties.shift
            ? this.keyLayoutShiftRu[i].toUpperCase()
            : this.keyLayoutRu[i];
        }
      }
      if (
        this.elements.keys[i].childElementCount === 0 &&
        (i == 0 || i >= 13)
      ) {
        this.elements.keys[i].textContent = !this.properties.shift
          ? this.properties.capsLock
            ? this.elements.keys[i].textContent.toUpperCase()
            : this.elements.keys[i].textContent.toLowerCase()
          : this.properties.capsLock
          ? this.elements.keys[i].textContent.toLowerCase()
          : this.elements.keys[i].textContent.toUpperCase();
      }
    }
  },

  _toggleEnRu() {
    this.properties.enRu = !this.properties.enRu;

    for (i in this.elements.keys) {
      if (this.elements.keys[i].childElementCount === 0 && (i != 0 || i < 13)) {
        if (!this.properties.enRu) {
          this.elements.keys[i].textContent = this.properties.shift
            ? this.keyLayoutShiftEn[i].toUpperCase()
            : this.keyLayoutEn[i];
        } else {
          this.elements.keys[i].textContent = this.properties.shift
            ? this.keyLayoutShiftRu[i].toUpperCase()
            : this.keyLayoutRu[i];
        }
      }

      if (
        this.elements.keys[i].childElementCount === 0 &&
        (i == 0 || i >= 13)
      ) {
        this.elements.keys[i].textContent = !this.properties.shift
          ? this.properties.enRu
            ? this.properties.capsLock
              ? this.keyLayoutRu[i].toUpperCase()
              : this.keyLayoutRu[i]
            : this.properties.capsLock
            ? this.keyLayoutEn[i].toUpperCase()
            : this.keyLayoutEn[i]
          : this.properties.enRu
          ? this.properties.capsLock
            ? this.keyLayoutRu[i]
            : this.keyLayoutRu[i].toUpperCase()
          : this.properties.capsLock
          ? this.keyLayoutEn[i]
          : this.keyLayoutEn[i].toUpperCase();
      }
    }
  },

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove("keyboard--hidden");
  },

  close() {
    this.properties.value = "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add("keyboard--hidden");
  },
};



window.addEventListener("DOMContentLoaded", function () {
  Keyboard.init();
});

document.onkeydown = function (event) {
  let kKey = document.querySelector(`button[data="${event.key}"`);
  kKey.classList.add("keyboard__k-key--active");
};

document.onkeyup = function (event) {
  document
    .querySelectorAll("button")
    .forEach((btn) => btn.classList.remove("keyboard__k-key--active"));
};
