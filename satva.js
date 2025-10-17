const loginBtn = document.getElementById("loginBtn");
    const modal = document.getElementById("loginModal");
    const closeModal = document.getElementById("closeModal");
    loginBtn.onclick = () => modal.style.display = "flex";
    closeModal.onclick = () => modal.style.display = "none";
    window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; }

  
    const reasonModal = document.getElementById("reasonModal");
    const closeReason = document.getElementById("closeReason");
    const freeBtns = [document.getElementById("freeBtn"), document.getElementById("freeBtnHero")];
    freeBtns.forEach(btn => {
      btn.onclick = (e) => { e.preventDefault(); reasonModal.style.display = "flex"; };
    });
    closeReason.onclick = () => reasonModal.style.display = "none";
    document.querySelectorAll(".reasonBtn").forEach(btn => {
      btn.onclick = () => {
        reasonModal.style.display = "none";
        modal.style.display = "flex"; 
      };
    });

    
    const questions = [
      "Over the last 2 weeks, how often have you felt nervous or anxious?",
      "Over the last 2 weeks, how often have you had trouble sleeping?",
      "Over the last 2 weeks, how often have you felt sad or depressed?",
      "Over the last 2 weeks, how often have you had trouble relaxing?",
      "Over the last 2 weeks, how often have you felt low energy?",
      "Over the last 2 weeks, how often have you lost interest in activities?",
      "Over the last 2 weeks, how often have you felt stressed?",
      "Over the last 2 weeks, how often have you had negative thoughts?",
      "Over the last 2 weeks, how often have you felt hopeful?",
      "Over the last 2 weeks, how often have you felt calm and peaceful?"
    ];
    const answers = [
      { text: "Not at all", value: 0 },
      { text: "Several days", value: 1 },
      { text: "More than half the days", value: 2 },
      { text: "Nearly every day", value: 3 }
    ];
    let currentQ = 0; let score = [];
    function loadQuestion() {
      document.getElementById("question-text").innerText = questions[currentQ];
      let optionsDiv = document.getElementById("options"); optionsDiv.innerHTML = "";
      answers.forEach(ans => {
        let btn = document.createElement("button");
        btn.innerText = ans.text;
        btn.onclick = () => { score[currentQ] = ans.value; document.getElementById("nextBtn").style.display = "block"; };
        optionsDiv.appendChild(btn);
      });
      document.getElementById("nextBtn").style.display = "none";
    }
    document.getElementById("nextBtn").onclick = () => {
      currentQ++;
      if (currentQ < questions.length) loadQuestion(); else showResults();
    };
    function showResults() {
      document.getElementById("screening").style.display = "none";
      document.getElementById("resultScreen").style.display = "flex";
      let total = score.reduce((a,b)=>a+b,0);
      let max = questions.length * 3; 
      let percent = Math.round((total/max)*100);
      let results = {
        "Stress / Anxiety": percent,
        "Depression": Math.max(0, percent-10),
        "Calmness": 100 - percent,
        "Happiness": 80 - Math.floor(percent/2),
        "Emotional Balance": 100 - Math.abs(50-percent)
      };
      let resultsDiv = document.getElementById("results");
      resultsDiv.innerHTML = "";
      for (let key in results) {
        let bar = document.createElement("div");
        bar.innerHTML = `<p>${key}: ${results[key]}%</p>
          <div class="progress-bar">
            <div class="progress-fill" style="width:0%">${results[key]}%</div>
          </div>`;
        resultsDiv.appendChild(bar);
        setTimeout(()=>{ bar.querySelector(".progress-fill").style.width = results[key] + "%"; }, 200);
      }
    }

   
    document.getElementById("screeningLink").onclick = (e)=>{
      e.preventDefault();
      hideAll(); document.getElementById("screening").style.display = "flex";
      currentQ = 0; loadQuestion();
    };
    document.getElementById("stressLink").onclick = (e)=>{
      e.preventDefault();
      hideAll(); document.getElementById("stress").style.display = "block";
      startBreathing();
    };
    document.getElementById("calmHealthLink").onclick = (e)=>{
      e.preventDefault();
      hideAll(); document.getElementById("calmhealth").style.display = "block";
    };
    document.getElementById("journeyBtn").onclick = (e)=>{
      e.preventDefault(); hideAll(); document.getElementById("hero").style.display = "flex";
    };
    document.getElementById("solutionLink").onclick = (e)=>{
      e.preventDefault(); hideAll(); document.getElementById("hero").style.display = "flex";
    };

    function hideAll() {
      document.querySelector(".hero").style.display = "none";
      document.getElementById("screening").style.display = "none";
      document.getElementById("resultScreen").style.display = "none";
      document.getElementById("stress").style.display = "none";
      document.getElementById("calmhealth").style.display = "none";
    }

    
    const circle = document.getElementById("breathingCircle");
    const text = document.getElementById("instructionText");
    function startBreathing() {
      function cycle() {
        text.textContent = "Breathe In... (5s)";
        circle.textContent = "Breathe In";
        setTimeout(() => { text.textContent = "Breathe Out... (7s)"; circle.textContent = "Breathe Out"; }, 5000);
        setTimeout(cycle, 12000);
      }
      cycle();
    }

  
    const contactModal = document.getElementById("contactModal");
    const closeContact = document.getElementById("closeContact");
    document.getElementById("contactLink").onclick = (e)=>{ e.preventDefault(); contactModal.style.display="flex"; };
    closeContact.onclick = ()=> contactModal.style.display="none";
    document.getElementById("sendBtn").onclick = ()=>{
      document.getElementById("successMsg").style.display="block";
      setTimeout(()=>{ contactModal.style.display="none"; document.getElementById("successMsg").style.display="none"; },2000);
    };