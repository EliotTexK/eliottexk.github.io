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
  // fetch code solution
  fetchSolutionCodePromise = fetch(problem.solutionContentURL)

  // fetch yap file


  // create a div for it
  const div = document.createElement("div");
  div.className = "solution";

  // make a heading
  const h2 = document.createElement("h2");
  h2.textContent = `${problem.name}`;

  // Make an area for the code to be put
  const codeArea = document.createElement("pre");
  const code = document.createElement("code");
  code.className = `language-${problem.lang}`;

  const solutionCodeResult = await fetchSolutionCodePromise;
  const solutionCodeText = await solutionCodeResult.text();
  code.textContent = solutionCodeText;

  codeArea.appendChild(code);
  div.appendChild(h2);
  div.appendChild(codeArea);

  return div
}

// Get a map from dates to problems
async function mapDatesToProblems() {
  // For each file, get last commit and file contents
  const kattisProblems = await getKattisProblems();

  // TODO: other problem types go here

  // Concatenate all problems
  const problems = kattisProblems.concat([]);

  // Sort newest first
  problems.sort((a, b) => new Date(b.date) - new Date(a.date));

  const dateMap = new Map();

  for (const problem of problems) {
    // Extract just the date part (YYYY-MM-DD) from the ISO timestamp
    const date = problem.date.split('T')[0];

    if (!dateMap.has(date)) {
      dateMap.set(date, []);
    }

    dateMap.get(date).push(problem);
  }

  return dateMap;
}

// Get a list of Kattis solutions in the repo
async function getKattisProblems() {
  const repo = "EliotTexK/eliottexk.github.io";
  const dir = "problems/kattis";
  const res = await fetch(`https://api.github.com/repos/${repo}/contents/${dir}`);
  const files = await res.json();

  const problems = await Promise.all(files.map(async (file) => {
    const commitRes = await fetch(
      `https://api.github.com/repos/${repo}/commits?path=${dir}/${file.name}&per_page=1`
    );
    const commits = await commitRes.json();

    return {
      type: "Kattis",
      name: file.name,
      date: commits[0].commit.author.date,
      lang: getLanguage(file.name),
      solutionContentURL: file.download_url,
    };
  }));
  return problems;
}

function getLanguage(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const langMap = {
    'cpp': 'cpp',
    'cc': 'cpp',
    'cxx': 'cpp',
    'py': 'python',
    'rs': 'rust'
  };
  return langMap[ext] || 'cpp';
}