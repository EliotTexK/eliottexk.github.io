var daysLoaded = 0;

async function loadProblems() {

  // Get all unique dates and map them back to problems
  const dates2Probs = await mapDatesToProblems()

  console.log(dates2Probs)
  
  // Render
  const container = document.getElementById("problems");
  container.innerHTML = "";

  const squares = renderSquaresOfConsistency(dates2Probs, 40, 200);
  container.appendChild(squares)

  await render5MoreDays(dates2Probs, container)

  // Allow loading more
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  loadMoreBtn.addEventListener('click', async function () {
    await render5MoreDays(dates2Probs, container)
  });
}

function renderSquaresOfConsistency(Dates2Probs, squares_per_row, squares_total) {
  const container = document.createElement('div');
  container.style.cssText = `
    display: grid;
    grid-template-columns: repeat(${squares_per_row}, 1fr);
    gap: 4px;
    padding: 16px;
  `;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < squares_total; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const problems = Dates2Probs.get(dateStr) || [];
    const count = problems.length;
    
    const square = document.createElement('div');
    square.style.cssText = `
      aspect-ratio: 1;
      width: 100%;
      border: 1px solid #444;
      border-radius: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      font-weight: bold;
      cursor: pointer;
      box-sizing: border-box;
    `;
    
    if (count > 0) {
      // Green intensity based on number of problems
      const intensity = Math.min(count / 5, 1); // Max out at 5 problems
      const greenValue = Math.floor(100 + (intensity * 155)); // Range from #64 to #FF
      square.style.backgroundColor = `rgb(${Math.floor(greenValue * 0.3)}, ${greenValue}, ${Math.floor(greenValue * 0.4)})`;
      square.style.color = intensity > 0.5 ? '#fff' : '#333';
      square.textContent = count;
    } else {
      square.style.backgroundColor = 'transparent';
    }
    
    // Tooltip
    square.title = `${dateStr}: ${count} problem${count !== 1 ? 's' : ''}`;
    
    container.appendChild(square);
  }

  return container;
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
      todayProblems.map(renderProblemContainer)
    );

    for (const problemEl of renderedProblems) {
      container.appendChild(problemEl);
    }
  }
  daysLoaded += 5;
  Prism.highlightAll();

  if (daysLoaded >= dates2Probs.size) {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    loadMoreBtn.style.display = "none";
  }
}

async function renderProblemContainer(problem) {
  // Create the main container
  const container = document.createElement("div");
  container.className = "solution";

  // Create content wrapper with max height
  const contentWrapper = document.createElement("div");
  contentWrapper.className = "content-wrapper";
  contentWrapper.style.maxHeight = "400px";
  contentWrapper.style.overflow = "hidden";
  contentWrapper.style.position = "relative";
  contentWrapper.style.transition = "max-height 0.3s ease";
  contentWrapper.style.cursor = "pointer";

  // Render the Kattis-specific content
  const content = await renderProblem(problem);
  contentWrapper.appendChild(content);

  // Add fade overlay
  const fadeOverlay = document.createElement("div");
  fadeOverlay.className = "fade-overlay";
  fadeOverlay.style.position = "absolute";
  fadeOverlay.style.bottom = "0";
  fadeOverlay.style.left = "0";
  fadeOverlay.style.right = "0";
  fadeOverlay.style.height = "100px";
  fadeOverlay.style.background = "linear-gradient(to bottom, transparent, white)";
  fadeOverlay.style.pointerEvents = "none";

  // Create read more button
  const readMoreBtn = document.createElement("button");
  readMoreBtn.textContent = "...";
  readMoreBtn.className = "continue-button";
  
  readMoreBtn.addEventListener("mouseenter", () => {
    readMoreBtn.style.backgroundColor = "#f5f5f5";
    readMoreBtn.style.borderColor = "#bbb";
  });
  
  readMoreBtn.addEventListener("mouseleave", () => {
    readMoreBtn.style.backgroundColor = "transparent";
    readMoreBtn.style.borderColor ="rgba(221, 221, 221, 0.5)";
  });

  let isExpanded = false;

  const expand = () => {
    if (!isExpanded) {
      isExpanded = true;
      contentWrapper.style.maxHeight = "none";
      contentWrapper.style.cursor = "default";
      fadeOverlay.style.display = "none";
      readMoreBtn.textContent = "Show less";
    }
  };

  const collapse = () => {
    isExpanded = false;
    contentWrapper.style.maxHeight = "400px";
    contentWrapper.style.cursor = "pointer";
    fadeOverlay.style.display = "block";
    readMoreBtn.textContent = "...";
    container.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  contentWrapper.addEventListener("click", expand);
  readMoreBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent triggering contentWrapper click
    if (isExpanded) {
      collapse();
    } else {
      expand();
    }
  });

  container.appendChild(contentWrapper);

  // Check if content exceeds max height after everything loads
  setTimeout(() => {
    if (contentWrapper.scrollHeight > 400) {
      contentWrapper.appendChild(fadeOverlay);
      container.appendChild(readMoreBtn);
    }
  }, 100);

  return container;
}

// Return a div with the problem rendered in it
async function renderProblem(problem) {
  switch (problem.type) {
    case "Kattis": {
      return renderKattisProblem(problem);
    }
    case "ProjectEuler": {
      return renderEulerProblem(problem);
    }
    // default, just try to render it
    default: {
      return problem;
    }
  }
}

async function renderKattisProblem(problem) {
  // fetch code solution and yapfile
  const fetchYapPromise = fetch(problem.yapfilePath);
  const fetchSolutionCodePromise = fetch(problem.solutionPath);

  // create a div for it
  const div = document.createElement("div");

  // make a heading
  const h2 = document.createElement("h2");
  h2.style.display = "flex";
  h2.style.justifyContent = "space-between";
  h2.style.alignItems = "center";

  const title = document.createElement("span");

  const link = document.createElement("a");
  link.href = problem.probLink;
  link.textContent = problem.probName;
  link.target = "_blank";

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
    yapArea.textContent = yapText;
    
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
  div.appendChild(yapArea);
  div.appendChild(codeArea);

  return div;
}

async function renderEulerProblem(problem) {
  // fetch code solution and yapfile
  const fetchYapPromise = fetch(problem.yapfilePath);
  const fetchSolutionCodePromise = fetch(problem.solutionPath);

  // create a div for it
  const div = document.createElement("div");

  // make a heading
  const h2 = document.createElement("h2");
  h2.style.display = "flex";
  h2.style.justifyContent = "space-between";
  h2.style.alignItems = "center";

  const title = document.createElement("span");

  const link = document.createElement("a");
  link.href = problem.probLink;
  link.textContent = problem.probName;
  link.target = "_blank";

  const suffix = document.createTextNode(" - Project Euler");

  title.appendChild(link);
  title.appendChild(suffix);

  const difficulty = document.createElement("span");
  difficulty.textContent = `Difficulty: ${problem.probDifficulty}%`;

  // Calculate difficulty hue: green (120) at 0.0, red (0) at 50.0+
  const difficultyValue = parseFloat(problem.probDifficulty) || 0;
  const hue = Math.max(0, 140 - (difficultyValue / 50.0) * 120);

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
    yapArea.textContent = yapText;
    
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
  div.appendChild(yapArea);
  div.appendChild(codeArea);

  return div;
}

// Get a map from dates to problems
async function mapDatesToProblems() {
  // Get problem index: which sorts all problems by date submitted
  const problems = await fetch('problems/index.json', {cache: 'no-cache'}).then(response => response.json());

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