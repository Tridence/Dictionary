class SearchWord {
  constructor() {
    this.args = {
      wrapper: document.querySelector(".wrapper"),
      searchInput: document.querySelector("input"),
      removeIcon: document.querySelector(".search span"),
      infoText: document.querySelector(".info-text"),
    };

    this.returned = [];
  }
  searchWord() {
    const { wrapper, searchInput, removeIcon, infoText, audio } = this.args;
    removeIcon.addEventListener("click", () => {
      this.clearInput(searchInput, wrapper, infoText);
    });
    let num = 0;
    searchInput.addEventListener("keyup", ({ key }) => {
      if (key === "Enter") {
        num++;
        this.submitWord(wrapper, searchInput, infoText, audio);
      }
      if (num > 1) {
        let x = document.querySelector(".synonym .list");
        x.innerHTML = "";
        num = 1;
      }
    });
  }

  clearInput(searchInput, wrapper, infoText) {
    searchInput.value = "";
    wrapper.classList.remove("active");
    infoText.innerHTML = `Type any existing word and press enter to get meaning, example, synonyms, etc.`;
  }
  // fetch data function
  submitWord(wrapper, searchInput, infoText) {
    if (searchInput.value === "") {
      wrapper.classList.remove("active");
      infoText.innerHTML = `Type any existing word and press enter to get meaning, example,
      synonyms, etc.`;
      return;
    }
    infoText.innerHTML = `Searching the meaning of <span>"${searchInput.value}"</span>`;
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${searchInput.value}`;
    fetch(url)
      .then((r) => r.json())
      .then((res) => {
        let searchedWord = searchInput.value;
        let answer = { res, searchedWord };
        this.returned = answer;
        searchInput.value = `${searchedWord}`;
        this.postData(wrapper);
        this.openWrapper(wrapper);
      })
      .catch((error) => {
        console.log("Error:", error);
        infoText.innerHTML = `The Word "${searchInput.value}" is not found! Please search another word!`;
        this.closeWrapper(wrapper, searchInput);
      });
  }

  postData(wrapper) {
    let phonetic = wrapper.querySelector(".word p");
    let speech = wrapper.querySelector(".word span");
    let volume = wrapper.querySelector(".word i");
    let meaning = wrapper.querySelector(".meaning span");
    let example = wrapper.querySelector(".example span");
    let synonyms = wrapper.querySelector(".synonym .list");
    function random(num) {
      return Math.floor(Math.random() * num);
    }
    let audioChoosen = random(this.returned.res[0].phonetics.length);
    volume.addEventListener("click", (e) => {
      new Audio(this.returned.res[0].phonetics[audioChoosen].audio).play();
    });
    let a = random(this.returned.res[0].meanings[0].definitions.length);
    let c = this.returned.res[0].meanings[0].definitions[a].example;
    let d = this.returned.res[0].meanings[0].synonyms;
    let e = random(this.returned.res[0].meanings[0].synonyms.length);
    if (a !== undefined) {
      phonetic.innerHTML = this.returned.res[0].word;
      speech.innerHTML = `${this.returned.res[0].meanings[0].partOfSpeech} ${this.returned.res[0].phonetic}`;
      meaning.innerHTML =
        this.returned.res[0].meanings[0].definitions[a].definition;
      if (c !== undefined) {
        example.innerHTML = c;
      } else {
        example.innerHTML = "No example available!";
      }
      if (d[e] !== undefined) {
        d.slice().forEach((element) => {
          synonyms.innerHTML += `<span>${element}</span>`;
        });
      } else {
        synonyms.innerHTML = `<span>This word has no synonym</span>`;
      }
    }
  }

  openWrapper(wrapper) {
    setTimeout(() => {
      wrapper.classList.add("active");
    }, "500");
  }

  closeWrapper(wrapper) {
    setTimeout(() => {
      wrapper.classList.remove("active");
    }, "200");
  }
}

const newFedData = new SearchWord();
newFedData.searchWord();