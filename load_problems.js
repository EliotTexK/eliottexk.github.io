var daysLoaded = 0;

async function loadProblems() {

  // Get all unique dates and map them back to problems
  const dates2Probs = await mapDatesToProblems()

  // Render
  const container = document.getElementById("problems");
  container.innerHTML = "";

  await render5MoreDays(dates2Probs, container)

  // Allow loading more
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  loadMoreBtn.addEventListener('click', async function () {
    await render5MoreDays(dates2Probs, container)
  });
}

async function render5MoreDays(dates2Probs, container) {
  const sortedDates = Array.from(dates2Probs.keys())
    .sort((a, b) => b.localeCompare(a))
    .slice(daysLoaded, daysLoaded + 5);

  for (const date of sortedDates) {
    const todayProblems = dates2Probs.get(date);

    const dateDiv = document.createElement("div");
    const dateH1 = document.createElement("h1");
    dateH1.textContent = `${date}`;

    dateDiv.appendChild(dateH1);
    container.appendChild(dateDiv);

    const renderedProblems = await Promise.all(
      todayProblems.map(renderProblem)
    );

    for (const problemEl of renderedProblems) {
      container.appendChild(problemEl);
    }
  }
  daysLoaded += 5;
  Prism.highlightAll();

  if (daysLoaded >= dates2Probs.keys.length) {
    console.log("end");
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    loadMoreBtn.style.display = "none";
  }
}

// Return a div with the problem rendered in it
async function renderProblem(problem) {
  switch (problem.type) {
    case "Kattis": {
      return renderKattisProblem(problem)
    }
  }
}

async function renderKattisProblem(problem) {
  // fetch code solution and yapfile
  const fetchYapPromise = fetch(problem.yapfilePath)
  const fetchSolutionCodePromise = fetch(problem.solutionPath)

  // create a div for it
  const div = document.createElement("div");
  div.className = "solution";

  // make a heading
  const h2 = document.createElement("h2");
  h2.style.display = "flex";
  h2.style.justifyContent = "space-between";
  h2.style.alignItems = "center";

  const title = document.createElement("span");

  const link = document.createElement("a");
  link.href = problem.probLink;
  link.textContent = problem.probName;
  link.target = "_blank"; // Optional: opens in new tab

  const suffix = document.createTextNode(" - Kattis");

  title.appendChild(link);
  title.appendChild(suffix);

  const difficulty = document.createElement("span");
  difficulty.textContent = `Difficulty: ${problem.probDifficulty}`;

  // Calculate difficulty hue: green (120) at 0.0, red (0) at 6.0+
  const difficultyValue = parseFloat(problem.probDifficulty) || 0;
  const hue = Math.max(0, 140 - (difficultyValue / 6.0) * 120);

  difficulty.style.backgroundColor = `hsl(${hue}, 70%, 50%)`;
  difficulty.style.color = "white";
  difficulty.style.padding = "4px 12px";
  difficulty.style.borderRadius = "4px";
  difficulty.style.fontSize = "0.9em";
  difficulty.style.fontWeight = "bold";

  h2.appendChild(title);
  h2.appendChild(difficulty);

  // Render the yap
  const yapArea = document.createElement("div");
  
  const yapResult = await fetchYapPromise;
  if (yapResult.ok) {
    const yapText = await yapResult.text();
    yapArea.textContent = yapText; // LaTeX source
    
    // Let MathJax process the LaTeX
    if (window.MathJax) {
      MathJax.typesetPromise([yapArea]);
    }
  }

  // Make an area for the code to be put
  const codeArea = document.createElement("pre");
  const code = document.createElement("code");
  code.className = `language-${problem.lang}`;

  const solutionCodeResult = await fetchSolutionCodePromise;
  const solutionCodeText = await solutionCodeResult.text();
  code.textContent = solutionCodeText;

  codeArea.appendChild(code);
  div.appendChild(h2);
  div.appendChild(yapArea)
  div.appendChild(codeArea);

  return div
}

// Get a map from dates to problems
async function mapDatesToProblems() {
  // Get problem index: which sorts all problems by date submitted
  const problems = await fetch('problems/index.json').then(response => response.json());

  // Sort newest first
  problems.sort((a, b) => new Date(b.date) - new Date(a.date));

  const dateMap = new Map();

  for (const problem of problems) {
    // Extract just the date part (YYYY-MM-DD) from the ISO timestamp
    const date = problem.dateSolved.split('T')[0];

    if (!dateMap.has(date)) {
      dateMap.set(date, []);
    }

    dateMap.get(date).push(problem);
  }

  return dateMap;
}