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
import requests

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
    print(f'scraping URL: {url}')

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        html_content = response.text
    except requests.HTTPError as e:
        raise

    # Quick and dirty, but alas, thus is the nature of the scrape 
    difficulty_match = re.search(
        r'<span[^>]*class="[^"]*difficulty_number[^"]*"[^>]*>(\d+\.?\d*)',
        html_content
    )
    title_match = re.search(
        r'<title>(.*?)\s*&ndash;\s*(.*?)</title>',
        html_content
    )

    difficulty = difficulty_match.group(1) if difficulty_match else "Difficulty not found"
    title = title_match.group(1) if title_match else "Title not found"

    # Don't draw their ire!
    time.sleep(random.uniform(2.0, 5.0))

    return html.unescape(title), difficulty

def scrape_euler_name(prob_id: str):
    url = f'https://projecteuler.net/problem={prob_id}'
    print(f'scraping URL: {url}')

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        html_content = response.text
    except requests.HTTPError as e:
        raise

    # Quick and dirty, but alas, thus is the nature of the scrape 
    title_match = re.search(
        r'<title>(.*?)\s* - Project Euler</title>',
        html_content
    )
    title = title_match.group(1) if title_match else "Title not found"

    # Don't draw their ire!
    time.sleep(random.uniform(2.0, 5.0))

    return html.unescape(title)

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

        prob_name = scrape_euler_name(prob_id)

        problems.append({
            'type': 'ProjectEuler',
            'solutionPath': str(filepath),
            'yapfilePath': f'yap/project_euler/{prob_id}.tex',
            'probName': prob_name,
            'probLink': f'https://projecteuler.net/problem={prob_id}',
            'dateSolved': date,
            'lang': lang
        })

def do_misc(problems: list):
    problems_dir = Path('problems/misc')

    for filepath in problems_dir.rglob('*'):
        date = get_last_commit_date(str(filepath))
        prob_id = filepath.stem
        prob_text = open(filepath).read()
        yap_text = open(f'yap/misc/{prob_id}.tex').read()
        prob_name_match = re.match(
            r'<!-- *(.*) *-->',
            yap_text
        )
        prob_name = prob_name_match.group(1) if prob_name_match else ""
        lang = filepath.suffix[1:]  # Remove the leading dot

        problems.append({
            'type': 'Misc',
            'solutionPath': str(filepath),
            'yapfilePath': f'yap/misc/{prob_id}.tex',
            'probName': prob_name,
            'dateSolved': date,
            'lang': lang
        })

def main():
    repo = sys.argv[1] if len(sys.argv) > 1 else ""
    
    problems = []
    do_kattis(problems)
    do_euler(problems)
    do_misc(problems)
    
    # Write to index.json
    Path('problems').mkdir(exist_ok=True)
    with open('problems/index.json', 'w') as f:
        json.dump(problems, f, indent=2)

if __name__ == '__main__':
    main()