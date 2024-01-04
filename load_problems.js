var daysLoaded = 0;

async function loadProblems() {
  // For each file, get last commit and file contents
  const kattisProblems = await getKattisProblems();

  // TODO: other problem types go here

  // Concatenate all problems
  const problems = kattisProblems.concat([]);

  // Sort newest first
  problems.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Get all unique dates
  const dates2Probs = mapDatesToProblems(problems)

  // Render
  const container = document.getElementById("problems");
  container.innerHTML = "";

  render5MoreDays(dates2Probs, container)

  Prism.highlightAll();
}

function render5MoreDays(dates2Probs, container) {
  Array.from(dates2Probs.keys())
  .sort((a, b) => b.localeCompare(a))
  .slice(daysLoaded, daysLoaded+5)
  .forEach(date => {
    const todayProblems = dates2Probs.get(date);

    const dateDiv = document.createElement("div");
    const dateH1 = document.createElement("h1")
    dateH1.textContent = `${date}`

    dateDiv.appendChild(dateH1)
    container.appendChild(dateDiv)

    for (const problem of todayProblems) {
      const renderedProblem = renderProblem(problem)
      container.appendChild(renderedProblem)
    }
  });
  daysLoaded += 5;
}

// Return a div with the problem rendered in it
function renderProblem(problem) {
  const div = document.createElement("div");
  div.className = "solution";
  
  const h2 = document.createElement("h2");
  h2.textContent = `${problem.name}`;
  
  const pre = document.createElement("pre");
  const code = document.createElement("code");
  code.className = `language-${problem.lang}`;
  // code.textContent
  
  pre.appendChild(code);
  div.appendChild(h2);
  div.appendChild(pre);

  return div
}

// Get a map from dates to problems
function mapDatesToProblems(problems) {
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
      name: file.name,
      date: commits[0].commit.author.date,
      type: "Kattis",
      lang: getLanguage(file.name),
    };
  }));
  console.log(problems)
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