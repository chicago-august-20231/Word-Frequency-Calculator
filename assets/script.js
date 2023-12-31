document.addEventListener("DOMContentLoaded", function () {
  var backgroundImage = document.querySelector("#background-image");
  var languageIcon = document.querySelector("#language-icon");
  var languageToggles = document.querySelectorAll(
    'input[type="radio"][name="language-tab"]'
  );
  var themeIcon = document.querySelector("#theme-icon");
  var themeToggles = document.querySelectorAll(
    'input[type="radio"][name="theme-tab"]'
  );
  var themeContainer = document.querySelector("#theme-container");
  var languageContainer = document.querySelector("#languages-container");
  var titleText = document.querySelector("#title-text");
  var appDescriptionLine = document.querySelector("#app-description-line");
  var keyContainer = document.querySelector("#key-container");
  var imageOfKey = document.querySelector("#image-of-key");
  var errorMessageLine = document.querySelector("#error-message-line");
  var inputField = document.querySelector("#input-field");
  var quoteButton = document.querySelector("#quote-button");
  var submitButton = document.querySelector("#submit-button");
  var resultsContainer = document.querySelector("#results-container");
  var wordFrequencyDisplay = document.querySelector("#word-frequency-display");
  var pastSearchesLine = document.querySelector("#past-searches-line");
  var pastSearchesContainer = document.querySelector("#past-searches");
  var clearButton = document.querySelector("#clear-past-searches-button");

  async function getFrequency(wordInputted) {
    requesturl = `https://api.datamuse.com/words?sp=${wordInputted}&md=f`;
    const response = await fetch(requesturl);
    const data = await response.json();
    try {
      if (data[0].tags.length === 0) {
        return 0;
      }
      if (data[0].tags && data[0].tags.length > 0) {
        var frequencyRate = data[0].tags[0].split(":")[1];
        return frequencyRate;
      } else {
        return 0;
      }
    } catch (error) {
      console.log("Error occured, ");
    }
  }

  function assignFrequencyClass(wordSpan, frequencyRate) {
    var selectedTheme = document.querySelector(
      'input[name="theme-tab"]:checked'
    ).id;
    if (selectedTheme === "rainbow-theme") {
      if (frequencyRate > 1000) {
        wordSpan.classList.add("rainbow-extremely-common");
      } else if (frequencyRate >= 400 && frequencyRate < 1000) {
        wordSpan.classList.add("rainbow-very-common");
      } else if (frequencyRate >= 80 && frequencyRate < 400) {
        wordSpan.classList.add("rainbow-common");
      } else if (frequencyRate >= 5 && frequencyRate < 80) {
        wordSpan.classList.add("rainbow-uncommon");
      } else if (frequencyRate >= 1 && frequencyRate < 5) {
        wordSpan.classList.add("rainbow-very-uncommon");
      } else if (frequencyRate > 0.5 && frequencyRate < 1) {
        wordSpan.classList.add("rainbow-rare");
      } else if (frequencyRate > 0.001 && frequencyRate < 0.5) {
        wordSpan.classList.add("rainbow-extremely-rare");
      } else {
        wordSpan.classList.add("rainbow-error");
      }
    } else if (selectedTheme === "sky-theme") {
      if (frequencyRate > 1000) {
        wordSpan.classList.add("sky-extremely-common");
      } else if (frequencyRate >= 400 && frequencyRate < 1000) {
        wordSpan.classList.add("sky-very-common");
      } else if (frequencyRate >= 80 && frequencyRate < 400) {
        wordSpan.classList.add("sky-common");
      } else if (frequencyRate >= 5 && frequencyRate < 80) {
        wordSpan.classList.add("sky-uncommon");
      } else if (frequencyRate >= 1 && frequencyRate < 5) {
        wordSpan.classList.add("sky-very-uncommon");
      } else if (frequencyRate > 0.5 && frequencyRate < 1) {
        wordSpan.classList.add("sky-rare");
      } else if (frequencyRate > 0.001 && frequencyRate < 0.5) {
        wordSpan.classList.add("sky-extremely-rare");
      } else {
        wordSpan.classList.add("sky-error");
      }
    }
    if (selectedTheme === "earth-theme") {
      if (frequencyRate > 1000) {
        wordSpan.classList.add("earth-extremely-common");
      } else if (frequencyRate >= 400 && frequencyRate < 1000) {
        wordSpan.classList.add("earth-very-common");
      } else if (frequencyRate >= 80 && frequencyRate < 400) {
        wordSpan.classList.add("earth-common");
      } else if (frequencyRate >= 5 && frequencyRate < 80) {
        wordSpan.classList.add("earth-uncommon");
      } else if (frequencyRate >= 1 && frequencyRate < 5) {
        wordSpan.classList.add("earth-very-uncommon");
      } else if (frequencyRate > 0.5 && frequencyRate < 1) {
        wordSpan.classList.add("earth-rare");
      } else if (frequencyRate > 0.001 && frequencyRate < 0.5) {
        wordSpan.classList.add("earth-extremely-rare");
      } else {
        wordSpan.classList.add("earth-error");
      }
    }
  }

  //takes in expanded text
  async function setFrequency(expandedText) {
    inputField.value = "";
    resultsContainer.textContent = ""; // resets results container.
    pastSearchesLine.style.display = "inline"; // makes past searches text inline.
    clearButton.style.display = "inline"; // makes clear button inline instead of hidden.
    keyContainer.style.display = "block";
    var arrayOfUserInput = expandedText.split(/ *- *| +|—+/); // array is created by splitting the string at spaces, hyphens, and dashes.
    var noHyphensArray = arrayOfUserInput.map(function (word) {
      // gets rid of all hyphens to prevent bugs.
      return word.replace(/-/g);
    });

    var noHyphensOrUndefinedArray = noHyphensArray.filter(function (word) {
      return word !== "undefined";
    }); // only returns items that are undefined.
    var noHyphensOrUndefinedString = noHyphensArray.join(" "); // turning noHyphensArray into a string.
    var apiSearchableArray = noHyphensOrUndefinedString.match(
      // regex method that returns anything that is text followed by an apostraphy or text or hyphen or numerical digits.
      /[a-zA-Z]+('[a-zA-Z]+)*|('[a-zA-Z]+)+|-|\d+/g
    );

    for (let i = 0; i < apiSearchableArray.length; i++) {
      if (apiSearchableArray.length === noHyphensOrUndefinedArray.length) {
        // checking for descrepencies between api searchable words and punctuation words.
        const wordInputted = apiSearchableArray[i];
        const punctuationWord = noHyphensOrUndefinedArray[i];

        // Check if the word does not end in apostraphy s. Also checks if it is not undefined.
        if (!wordInputted.endsWith("'s") && wordInputted !== undefined) {
          const frequencyRate = await getFrequency(wordInputted); // calls api with word input.
          const wordSpan = document.createElement("span"); // creates element for that word.
          wordSpan.textContent = punctuationWord + " "; // sets text content to punctuation accurate version of that word.
          wordSpan.id = "word";
          assignFrequencyClass(wordSpan, frequencyRate); // calls frequency class fuction to alter the background color of that word.
          resultsContainer.appendChild(wordSpan); //appends element
          wordSpan.addEventListener(
            "click",
            () => getSelectedWordFrequency(wordInputted, frequencyRate) // adds event listener to each each word that returns specific information about thgat word when clicked.
          );
        } else if (wordInputted.endsWith("'s") && wordInputted !== undefined) {
          // if word ends with apostraphy s does the same as the above steps.
          const wordBeforeApostrophe = wordInputted.replace(/'s$/, ""); //This line grabs the value that is before the "'s"
          //The function then runs as normal again, but with the form of the word without the "'s."
          const wordSpan = document.createElement("span");
          const frequencyRate = await getFrequency(wordBeforeApostrophe);
          assignFrequencyClass(wordSpan, frequencyRate);
          wordSpan.textContent = wordInputted + " ";
          wordSpan.id = "word";
          resultsContainer.appendChild(wordSpan);
          wordSpan.addEventListener("click", () =>
            getSelectedWordFrequency(wordBeforeApostrophe, frequencyRate)
          );
        }
      } else {
        // if length of 2 arrays are different does the same as above, but instead of text content to puctuation word, sets to the word the api has searched.
        const wordInputted = apiSearchableArray[i];

        // Check if the word contains only letters and apostrophes (no numbers)
        if (!wordInputted.endsWith("'s") && wordInputted !== undefined) {
          const frequencyRate = await getFrequency(wordInputted);
          const wordSpan = document.createElement("span");
          wordSpan.textContent = wordInputted + " "; // change occurs here.
          wordSpan.id = "word";
          assignFrequencyClass(wordSpan, frequencyRate);
          resultsContainer.appendChild(wordSpan);
          wordSpan.addEventListener("click", () =>
            getSelectedWordFrequency(wordInputted, frequencyRate)
          );
        } else if (wordInputted.endsWith("'s") && wordInputted !== undefined) {
          const wordBeforeApostrophe = wordInputted.replace(/'s$/, "");
          const wordSpan = document.createElement("span");
          const frequencyRate = await getFrequency(wordBeforeApostrophe);
          assignFrequencyClass(wordSpan, frequencyRate);
          wordSpan.textContent = wordInputted + " "; // change occurs here.
          wordSpan.id = "word";
          resultsContainer.appendChild(wordSpan);
          wordSpan.addEventListener("click", () =>
            getSelectedWordFrequency(wordBeforeApostrophe, frequencyRate)
          );
        }
      }
    }
  }

  function saveToLocalStorage(textInput, savedSearches) {
    savedSearches.push(textInput);
    localStorage.setItem("Past Searches", JSON.stringify(savedSearches));
    updatePastSearches();
  }

  function expandContractionWords(textInput) {
    // turns inputted tex into an array
    var inputArray = textInput.split(" ");
    // only runs fuction if input is fewer than 140 words
    if (inputArray.length <= 140) {
      // saves searches into local storage.
      saveToLocalStorage(textInput, savedSearches);
      //Dictionary of contractions
      const contractionWords = {
        "don't": "do not",
        "Don't": "Do not",
        "won't": "will not",
        "Won't": "Will not",
        "can't": "can not",
        "Can't": "Can not",
        "I'm": "I am",
        "it's": "it is",
        "It's": "It is",
        "they're": "they are",
        "he's": "he is",
        "you're": "you are",
        "You're": "You are",
        "doesn't": "does not",
        "Doesn't": "Does not",
        "they've": "they have",
        "They've": "They have",
        "I'd": "I would",
        "I'll": "I will",
        "you'll": "you will",
        "You'll": "You will",
        "he's": "he is",
        "He's": "He is",
        "she's": "she is",
        "She's": "She is",
        "She'll": "She will",
        "she'll": "she will",
        "He'll": "He will",
        "he'll": "he will",
        "There's": "There is",
        "there's": "there is",
        "who's": "who is",
        "Who's": "Who is",
        "You'd": "You would",
        "you'd": "you would",
        "We'd": "We Would",
        "we'd": "we would",
        "Who'd": "Who would",
        "who'd": "who would",
        "why'd": "why would",
        "Why'd": "Why would",
        "how'd": "how would",
        "How'd": "How would",
        "Why's": "Why is",
        "why's": "why is",
        "you've": "you have",
        "You've": "You have",
        "could've": "could have",
        "Could've": "Could have",
        "He'd": "He would",
        "he'd": "he would",
        "Here's": "Here is",
        "here's": "here is",
        "He's": "He is",
        "he's": "he is",
        "She's": "She is",
        "she's": "she is",
        "How'd": "How did",
        "how'd": "how did",
        "I've": "I have",
        "Might've": "Might have",
        "might've": "might have",
        "Let's": "Let us",
        "let's": "let us",
        "Should've": "Should have",
        "should've": "should have",
        "Would've": "Would have",
        "would've": "would have",
        "That'll": "That will",
        "that'll": "that will",
        "That's": "That is",
        "that's": "that is",
        "aren't": "are not",
        "Aren't": "Are not",
        "Couldn't": "Could not",
        "couldn't": "could not",
        "shouldn't": "should not",
        "Shouldn't": "Should not",
        "Wouldn't": "Would not",
        "wouldn't": "would not",
        "Wasn't": "Was not",
        "wasn't": "was not",
        "Weren't": "Were not",
        "weren't": "were not",
        "mustn't": "must not",
        "Mustn't": "Must not",
        "That'd": "That would",
        "that'd": "that would",
        "These're": "These are",
        "these're": "these are", // comment
        //We will add a bunch more contractions here.
      };

      //Creates an array containing all inputted word, split at the space using regex
      const trimmedText = textInput.trim();
      const contractedWords = trimmedText.split(/\s+/);

      //Initiates an empty array for the new expanded words to be added to.
      const expandedWords = [];

      //Loops through the contractedWords array, looks for matches in the dictionary. Then adds the expanded versions to the expandedWords array.
      for (i = 0; i < contractedWords.length; i++) {
        word = contractedWords[i];
        const expandedWord = contractionWords[word] || word;
        expandedWords.push(expandedWord);
      }
      // turns expanded words array into a string.
      const expandedText = expandedWords.join(" ");

      //Returns the expanded text, which is then fed back into the setFrequency function instead of the inital user input.
      inputField.textContent = "";

      return expandedText;

      //if input is bigger than 140 words, returns error message.
    } else {
      submitFewerMessage = document.createElement("h3");
      submitFewerMessage.textContent =
        "Please submit fewer than 140 words at a time.";
      errorMessageLine.appendChild(submitFewerMessage);
      setTimeout(() => {
        errorMessageLine.removeChild(submitFewerMessage);
      }, 2000);

      return;
    }
  }

  function getSelectedWordFrequency(wordInputted, frequencyRate) {
    wordFrequencyDisplay.style.display = "block";
    if (frequencyRate !== undefined) {
      // checks that word frequency exists.
      wordFrequencyDisplay.removeAttribute("class");
      assignFrequencyClass(wordFrequencyDisplay, frequencyRate); // call assignfrequency class to change background color of wordFrequencyDisplay.
      var selectedLanguage = document.querySelector(
        'input[name="language-tab"]:checked'
      ).id; // checks language display, and responds accordingly.
      wordFrequencyDisplay.textContent = "";
      if (selectedLanguage === "korean-tab") {
        wordFrequencyDisplay.textContent = `평균적으로, "${wordInputted}"이라는 단어는 영어로 백만 단어 당 ${frequencyRate} 나타납니다.`;
      } else if (selectedLanguage === "polish-tab") {
        wordFrequencyDisplay.textContent = `Średnio te słowo, "${wordInputted}" pokazuje się ${frequencyRate} razy na milion po Angielsku`;
      } else if (selectedLanguage === "french-tab") {
        wordFrequencyDisplay.textContent = `En moyenne, le mot, "${wordInputted}" apparaît ${frequencyRate} 
        fois par million de mots en anglais.`;
      } else if (selectedLanguage === "mandarin-tab") {
        wordFrequencyDisplay.textContent = `平均而言，${wordInputted}一词每百万字出现 ${frequencyRate} 次。`;
      } else {
        wordFrequencyDisplay.textContent = `On average, the word, "${wordInputted}" appears ${frequencyRate} times per million words in English.`;
      }
    } else {
      // if frequency rate is undefined returns error message.
      var selectedLanguage = document.querySelector(
        'input[name="language-tab"]:checked'
      ).id;
      wordFrequencyDisplay.textContent = "";
      wordFrequencyDisplay.classList.add("error");
      if (selectedLanguage === "korean-tab") {
        wordFrequencyDisplay.textContent = `${wordInputted}의 빈도를 찾을 수 없었습니다. `;
      } else if (selectedLanguage === "polish-tab") {
        wordFrequencyDisplay.textContent = `Nie udało mi się znaleźć częstotliwości dla ${wordInputted}.`;
      } else if (selectedLanguage === "mandarin-tab") {
        wordFrequencyDisplay.textContent = `我无法获得频率值 ${wordInputted}.`;
      } else if (selectedLanguage === "french-tab") {
        wordFrequencyDisplay.textContent = `Je n'ai pas pu obtenir une valeur de fréquence pour ${wordInputted}.`;
      } else {
        wordFrequencyDisplay.textContent = `I could not get a frequency value for ${wordInputted}.`;
      }
    }
  }

  function changeLanguage(event) {
    if (event.target.checked) {
      wordFrequencyDisplay.removeAttribute("class");
      languageIcon.style.display = "inline";
      const selectedLanguage = event.target.id;
      wordFrequencyDisplay.textContent = "";
      wordFrequencyDisplay.style.display = "none";
      keyContainer.style.display = "none";
      resultsContainer.textContent = "";
      switch (selectedLanguage) {
        case "english-tab":
          appDescriptionLine.textContent =
            "Check the frequency of English words per million instances";
          submitButton.textContent = "Get Frequency";
          quoteButton.textContent = "Get poem";
          inputField.placeholder = "Paste text here or generate a random poem";
          pastSearchesLine.textContent = "Past Searches";
          clearButton.textContent = "Clear";
          languageContainer.style.display = "none";

          break;
        case "korean-tab":
          appDescriptionLine.textContent = "영어 단어 빈도를 계산기";
          submitButton.textContent = "빈도를 찾기";
          quoteButton.textContent = "인용문을 생성하기";
          inputField.placeholder = "텍스트를 입력하거나 인용문를 생성하세요";
          pastSearchesLine.textContent = "이전 검색";
          clearButton.textContent = "치우기";
          languageContainer.style.display = "none";

          break;
        case "polish-tab":
          appDescriptionLine.textContent =
            "Sprawdź Częstotliwość Słów Angielskich";
          submitButton.textContent = "Znajdź Częstotliwość Słów";
          quoteButton.textContent = "Generuj Losową Cytatę";
          inputField.placeholder =
            "Wpisz tutaj tekst lub wygeneruj losowe słowo";
          pastSearchesLine.textContent = "Przeszłe Wyszukiwania";
          clearButton.textContent = "Wyczyść";
          languageContainer.style.display = "none";

          break;
        case "mandarin-tab":
          appDescriptionLine.textContent = "检查每百万个实例中英语单词的频率";
          submitButton.textContent = "获取频率";
          quoteButton.textContent = "获得报价";
          inputField.placeholder = "粘贴文本或生成随机引用？";
          pastSearchesLine.textContent = "过去的搜索";
          clearButton.textContent = "清除";
          languageContainer.style.display = "none";
          break;
        case "french-tab":
          appDescriptionLine.textContent =
            "Vérifiez la fréquence des mots anglais par million d'instances";
          submitButton.textContent = "Obtenir la fréquence";
          quoteButton.textContent = "Obtenez un poème";
          inputField.placeholder =
            "Coller du texte ou générer un devis aléatoire ?";
          pastSearchesLine.textContent = "Recherches passées";
          clearButton.textContent = "Claire";
          languageContainer.style.display = "none";
          break;
        default:
      }
    }
  }

  function updatePastSearches() {
    pastSearchesContainer.textContent = "";
    savedSearches = [];
    var pastSearches = JSON.parse(localStorage.getItem("Past Searches")) || [];
    pastSearches.forEach(function (pastSearch) {
      savedSearches.push(pastSearch);
      var pastSearchLine = document.createElement("p");
      pastSearchLine.className = "past-search-row";
      pastSearchLine.id = "past-search-line";
      pastSearchLine.textContent = pastSearch;
      pastSearchLine.addEventListener("click", function () {
        inputField.value = "";
        inputField.value = pastSearch;
      });
      pastSearchesContainer.appendChild(pastSearchLine);
    });
    if (pastSearches.length > 0) {
      pastSearchesLine.style.display = "inline";
      clearButton.style.display = "inline";
    }

    return savedSearches;
  }

  function removeSearches() {
    pastSearchesContainer.textContent = "";
    window.localStorage.removeItem("Past Searches");
    savedSearches = [];
    clearButton.style.display = "none";
    pastSearchesLine.style.display = "none";
  }

  function showLanguages() {
    languageIcon.style.display = "";
    if (languageContainer.style.display === "inline") {
      languageContainer.style.display = "none";
    } else {
      languageContainer.style.display = "inline";
    }
  }

  function showThemes() {
    themeIcon.style.display = "";
    if (themeContainer.style.display === "inline") {
      themeContainer.style.display = "none";
    } else {
      themeContainer.style.display = "inline";
    }
  }

  function getPoem() {
    requestURl = "https://poetrydb.org/linecount,random/4;1";
    fetch(requestURl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        inputField.value = "";
        poemArray = data[0].lines;
        poet = data[0].author;
        poemString = poemArray.join("\n");
        inputField.value = poemString + "\n" + poet;
      });
  }

  function changeTheme(event) {
    const selectedTheme = event.target.id;
    resultsContainer.textContent = "";
    keyContainer.style.display = "none";
    wordFrequencyDisplay.style.display = "none";
    if (selectedTheme === "spooky-theme") {
      titleText.style.backgroundColor = "black";
      titleText.style.color = "white";
      backgroundImage.style.backgroundImage =
        "url('./assets/icons/spookybackground2.png')";
    } else if (selectedTheme === "rainbow-theme") {
      titleText.style.backgroundColor = "white";
      titleText.style.color = "black";
      backgroundImage.style.backgroundImage =
        "url('./assets/icons/rainbow11.jpg')";
      titleText.style.boxShadow = "5px 5px 5px grey";
      imageOfKey.src = "./assets/icons/key.png";
      titleText.style.backgroundColor = "white";
      inputField.style.backgroundColor = "white";
      quoteButton.style.backgroundColor = "#1e88e5";
      submitButton.style.backgroundColor = "#1e88e5";
      clearButton.style.backgroundColor = "#1e88e5";
      quoteButton.style.color = "white";
      submitButton.style.color = "white";
      clearButton.style.color = "white";
    } else if (selectedTheme === "sky-theme") {
      titleText.style.backgroundColor = "white";
      titleText.style.color = "black";
      backgroundImage.style.backgroundImage =
        "url('./assets/icons/skybackground.png')";
      imageOfKey.src = "./assets/icons/skykey.png";
      titleText.style.boxShadow = "5px 5px 5px grey";
      pastSearchesContainer.style.color = "grey";
      titleText.style.backgroundColor = "white";
      inputField.style.backgroundColor = "white";
      quoteButton.style.backgroundColor = "powderblue";
      submitButton.style.backgroundColor = "powderblue";
      clearButton.style.backgroundColor = "powderblue";
      quoteButton.style.color = "black";
      submitButton.style.color = "black";
      clearButton.style.color = "black";
    } else if (selectedTheme === "earth-theme") {
      titleText.style.backgroundColor = "white";
      inputField.style.backgroundColor = "white";

      titleText.style.color = "black";
      backgroundImage.style.backgroundImage =
        "url('./assets/icons/sunbackground.png')";
      imageOfKey.src = "./assets/icons/sunkey2.png";
      titleText.style.boxShadow = "5px 5px 5px grey";
      titleText.style.backgroundColor = "antiquewhite";
      inputField.style.backgroundColor = "antiquewhite";
      quoteButton.style.backgroundColor = "black";
      submitButton.style.backgroundColor = "black";
      clearButton.style.backgroundColor = "black";
      quoteButton.style.color = "white";
      submitButton.style.color = "white";
      clearButton.style.color = "white";
    }

    themeContainer.style.display = "none";
  }

  quoteButton.addEventListener("click", getPoem);

  updatePastSearches();

  //The submit button now calls both functions asyncronously, waiting for one to finish before running the other.
  submitButton.addEventListener("click", async function () {
    //runs expandContractionWords and returns result expanded text.
    const expandedText = expandContractionWords(inputField.value);
    // runs setFrequecy with expandedText.
    await setFrequency(expandedText);
  });

  languageIcon.addEventListener("click", showLanguages);
  themeIcon.addEventListener("click", showThemes);

  languageToggles.forEach((languageToggle) => {
    languageToggle.addEventListener("change", changeLanguage);
  });

  themeToggles.forEach((themeToggle) => {
    themeToggle.addEventListener("change", changeTheme);
  });

  clearButton.addEventListener("click", removeSearches);
});
