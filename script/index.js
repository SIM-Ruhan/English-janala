const loadLessons = () => {
fetch("https://openapi.programming-hero.com/api/levels/all")
.then((res) => res.json())
.then((json) => displayLessons(json.data))

};

const manageSpinner =(status) => {
    if(status == true){
        document.getElementById("spin").classList.remove('hidden');
        document.getElementById("word-container").classList.add('hidden');
    }
    else{
            document.getElementById("word-container").classList.remove('hidden');
        document.getElementById("spin").classList.add('hidden'); 
    }
}

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN";
  window.speechSynthesis.speak(utterance);
}

const loadLevelWord = (id) => {
manageSpinner(true);
  fetch(`https://openapi.programming-hero.com/api/level/${id}`)
    .then((res) => res.json())
    .then((data) => {

      // remove active from all
      document.querySelectorAll(".lesson-btn").forEach(btn => {
        btn.classList.remove("active");
      });

      // add active to clicked button
      const clickBtn = document.getElementById(`lesson-btn-${id}`);
      clickBtn.classList.add("active");

      displayLevelWord(data.data);
    });
};


const createElements = (arr)=> {
    const htmlElement = arr.map((el) => `
    <span class="btn">${el}</span>
    `) 
    return htmlElement.join(" ");
}

const loadDetails = async (id) => {
const url = `https://openapi.programming-hero.com/api/word/${id}`;
const res = await fetch(url);
const details = await res.json();
displayDetails(details.data);
};
const displayDetails = (word) => {
const details = document.getElementById("details-container");
details.innerHTML = `

    <div class="">
<h2>${word.word} (<i class="fa-solid fa-microphone-lines"></i> :${word.pronunciation})</h2>
    </div>
    <div class="">
<h2 class="font-bold">Meaning</h2>
<p>${word.meaning}</p>
    </div>
    <div class="">
<h2 class="font-bold">Example</h2>
<p>${word.sentence}</p>
    </div>
    <div class="">
<h2 class="font-bold">synonyms</h2>
<div>${createElements(word.synonyms)}</div>
    </div>
 </div>
   
`;
document.getElementById("my_modal_5").showModal();
}

const displayLevelWord =(words)=>{
const wordContainer = document.getElementById("word-container");
 wordContainer.innerHTML ="";

 if(words.length == 0){
   wordContainer.innerHTML =`
   <div class="col-span-full text-center py-10 space-y-3">
<img src="./assets/alert-error.png" alt="Error" class="mx-auto">
    <p class="font-medium font-bangla text-[#79716B]">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি </p>
    <p class="text-4xl leading-10 font-medium font-bangla">নেক্সট Lesson এ যান</p>
</div>
   ` 
   manageSpinner(false);
   return;
 }

words.forEach(word => {
    const card = document.createElement("div");
    card.innerHTML = `
    <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-4">
    <h2 class="font-bold text-2xl">${word.word ? word.word : "not found"}</h2>
    <p class="font-semibold">Meaning /Pronounciation</p>
    <p class="text-2xl font-medium font-bangla">"${word.meaning ? word.meaning : "not found"} / ${word.pronunciation ? word.pronunciation : "not found"}</p>
    <div class="flex justify-between items-center">
        <button onclick="loadDetails(${word.id})" class="btn bg-[#1A91FF10]"><i class="fa-solid fa-circle-info"></i></button>
        <button onclick="pronounceWord('${word.word}')" class="btn bg-[#1A91FF10]"><i class="fa-solid fa-volume-high"></i></button>
    </div>
   </div>
    `
    wordContainer.append(card);
});
manageSpinner(false);
}

const displayLessons = (lessons) => {
    //1. get the container and make empty
    const levelContainer = document.getElementById("level-container");
    levelContainer.innerHTML = "";
//2. get into every lesson
for (let lesson of lessons) {
    //3. create element
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
    <button id="lesson-btn-${lesson.level_no}"
onclick="loadLevelWord(${lesson.level_no})" class="lesson-btn btn btn-outline btn-primary">
    <i class="fa-solid fa-book-open"></i> lesson - ${lesson.level_no} </button>
    `
    levelContainer.appendChild(btnDiv);
}
};



loadLessons();


document.getElementById('btn-search').addEventListener('click', ()=>{
const input = document.getElementById('input-search');
const searchValue = input.value.trim().toLowerCase();

fetch("https://openapi.programming-hero.com/api/words/all")
.then((res) => res.json())
.then((data) => {
    const allWords = data.data;
    const filterWord = allWords.filter((word) => 
        word.word.toLowerCase().includes(searchValue)
    );
    displayLevelWord(filterWord);
});

})