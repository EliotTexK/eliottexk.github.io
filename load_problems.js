async function loadProblems() {
  const repo = "EliotTexK/eliottexk.github.io";
  const dir = "kattis";

  // List files in /kattis
  const res = await fetch(`https://api.github.com/repos/${repo}/contents/${dir}`);
  const files = await res.json();

  // For each file, get last commit and file contents
  const problems = await Promise.all(files.map(async (file) => {
    const commitRes = await fetch(`https://api.github.com/repos/${repo}/commits?path=${dir}/${file.name}&per_page=1`);
    const commits = await commitRes.json();

    const contentRes = await fetch(file.download_url);
    const content = await contentRes.text();

    return {
      name: file.name,
      date: commits[0].commit.author.date,
      content: content
    };
  }));

  // Sort newest first
  problems.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Render
  const container = document.getElementById("problems");
  container.innerHTML = "";
  
  problems.forEach(p => {
    const lang = getLanguage(p.name);
    const div = document.createElement("div");
    div.className = "solution";
    
    const h2 = document.createElement("h2");
    h2.textContent = `${p.name} – ${new Date(p.date).toLocaleDateString()}`;
    
    const pre = document.createElement("pre");
    const code = document.createElement("code");
    code.className = `language-${lang}`;
    code.textContent = p.content;
    
    pre.appendChild(code);
    div.appendChild(h2);
    div.appendChild(pre);
    container.appendChild(div);
  });

  Prism.highlightAll();
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