#!/usr/bin/env python3
# This is run as a GitHub action, so that we only scrape Kattis every once in a while
import json
import subprocess
import re
import sys
import random
import time
import html
from pathlib import Path
from urllib.request import urlopen
from urllib.error import HTTPError

def get_last_commit_date(filepath):
    """Get the last commit date for a file in ISO format."""
    result = subprocess.run(
        ['git', 'log', '-1', '--format=%cI', '--', filepath],
        capture_output=True,
        text=True
    )
    return result.stdout.strip()

def scrape_kattis_name_and_difficulty(prob_id: str):
    url = f"https://open.kattis.com/problems/{prob_id}"

    try:
        with urlopen(url, timeout=10) as response:
            response = response.read().decode('utf-8')
    except HTTPError as e:
        raise

    # Quick and dirty, but alas, thus is the nature of the scrape 
    difficulty_match = re.search(
        r'<span[^>]*class="[^"]*difficulty_number[^"]*"[^>]*>(\d+\.?\d*)',
        response
    )
    title_match = re.search(
        r'<title>(.*?)\s*&ndash;\s*(.*?)</title>',
        response
    )

    difficulty = difficulty_match.group(1) if difficulty_match else "Difficulty not found"
    title = title_match.group(1) if title_match else "Title not found"

    # Don't draw their ire!
    time.sleep(random.uniform(2.0, 5.0))
    print(".")

    return html.unescape(title), difficulty

def scrape_euler_name_and_difficulty(prob_id: str):
    url = f'https://projecteuler.net/problem={prob_id}'

    try:
        with urlopen(url, timeout=10) as response:
            response = response.read().decode('utf-8')
    except HTTPError as e:
        raise

    # Quick and dirty, but alas, thus is the nature of the scrape 
    difficulty_match = re.match(
        r'<br>Difficulty rating: (\d+(?:\.\d+)?)%',
        response
    )
    title_match = re.match(
        r'<title>(.*?)\s* - Project Euler</title>',
        response
    )

    difficulty = difficulty_match.group(1) if difficulty_match else "Difficulty not found"
    title = title_match.group(1) if title_match else "Title not found"

    # Don't draw their ire!
    time.sleep(random.uniform(2.0, 5.0))
    print(".")

    return html.unescape(title), difficulty

def do_kattis(problems: list):
    problems_dir = Path('problems/kattis')
    
    for filepath in problems_dir.rglob('*'):
        if filepath.is_file():
            date = get_last_commit_date(str(filepath))
            prob_id = filepath.stem
            lang = filepath.suffix[1:]  # Remove the leading dot
            
            prob_name, prob_difficulty = scrape_kattis_name_and_difficulty(prob_id)

            problems.append({
                'type': 'Kattis',
                'solutionPath': str(filepath),
                'yapfilePath': f'yap/kattis/{prob_id}.tex',
                'probName': prob_name,
                'probDifficulty': prob_difficulty,
                'probLink': f'https://open.kattis.com/problems/{prob_id}',
                'dateSolved': date,
                'lang': lang
            })

def do_euler(problems: list):
    problems_dir = Path('problems/project_euler')

    for filepath in problems_dir.rglob('*'):
        date = get_last_commit_date(str(filepath))
        prob_id = filepath.stem
        lang = filepath.suffix[1:]  # Remove the leading dot

        prob_name, prob_difficulty = scrape_euler_name_and_difficulty(prob_id)

        problems.append({
            'type': 'ProjectEuler',
            'solutionPath': str(filepath),
            'yapfilePath': f'yap/project_euler/{prob_id}.tex',
            'probName': prob_name,
            'probDifficulty': prob_difficulty,
            'probLink': f'https://projecteuler.net/problem={prob_id}',
            'dateSolved': date,
            'lang': lang
        })

def do_just_latex(problems: list):
    problems_dir = Path('problems/just_latex')

    for filepath in problems_dir.rglob('*'):
        date = get_last_commit_date(str(filepath))
        prob_text = open(filepath).read()
        prob_name_match = re.match(
            r'^% (.*)\n',
            prob_text
        )
        prob_name = prob_name_match.group(1) if prob_name_match else ""

        problems.append({
            'type': 'JustLaTeX',
            'solutionPath': str(filepath),
            'probName': prob_name,
            'dateSolved': date,
        })

def main():
    repo = sys.argv[1] if len(sys.argv) > 1 else ""
    
    problems = []
    do_kattis(problems)
    do_euler(problems)
    do_just_latex(problems)
    
    # Write to index.json
    Path('problems').mkdir(exist_ok=True)
    with open('problems/index.json', 'w') as f:
        json.dump(problems, f, indent=2)

if __name__ == '__main__':
    main()