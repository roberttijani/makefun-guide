#!/usr/bin/env node

/**
 * makefun-guide Interactive CLI Explorer
 * Built for make.fun participants and AI agent operators.
 * Referral link: https://make.fun/r/2mby0mc5 (Code: 2mby0mc5)
 */

import { execSync } from 'node:child_process';
import process from 'node:process';

const REFERRAL_URL = 'https://make.fun/r/2mby0mc5';
const REFERRAL_CODE = '2mby0mc5';
const API_ORIGIN = 'https://make.fun';

function printHeader() {
  console.log('\n' + '='.repeat(64));
  console.log('       make.fun AI Coding Bounties - Interactive Guide');
  console.log('='.repeat(64));
  console.log(`Referral Link : ${REFERRAL_URL}`);
  console.log(`Referral Code : ${REFERRAL_CODE}`);
  console.log('='.repeat(64) + '\n');
}

function checkEnvironment() {
  console.log('[1/3] Checking Local Development Environment:');

  // Check Node version
  const nodeVersion = process.version;
  const major = parseInt(nodeVersion.slice(1).split('.')[0], 10);
  if (major >= 20) {
    console.log(`  ✓ Node.js : ${nodeVersion} (Supported)`);
  } else {
    console.log(`  ! Node.js : ${nodeVersion} (Recommended: Node 22+)`);
  }

  // Check Git
  try {
    const gitVersion = execSync('git --version', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    console.log(`  ✓ Git     : ${gitVersion}`);
  } catch {
    console.log('  x Git     : Not found in PATH. Please install git.');
  }

  // Check GitHub CLI
  try {
    const ghVersion = execSync('gh --version', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).split('\n')[0].trim();
    console.log(`  ✓ GitHub  : ${ghVersion}`);
  } catch {
    console.log('  - GitHub  : gh CLI not detected (optional, helpful for repo setup)');
  }
}

async function fetchCompetitions() {
  console.log('\n[2/3] Fetching Live Open Competitions from make.fun API:');
  try {
    const res = await fetch(`${API_ORIGIN}/api/competitions?status=open`, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(6000)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const comps = Array.isArray(data.items) ? data.items : (Array.isArray(data) ? data : []);

    if (comps.length === 0) {
      console.log('  No open competitions returned at this moment.');
      return;
    }

    console.log('\n  ' + 'Slug'.padEnd(24) + 'Prize (USDC)'.padEnd(16) + 'Entries'.padEnd(12) + 'Title');
    console.log('  ' + '-'.repeat(78));
    for (const comp of comps.slice(0, 8)) {
      const slug = (comp.slug || comp.id || 'unknown').slice(0, 22).padEnd(24);
      const prize = `$${comp.rewardAmount || comp.total_usd || 'N/A'}`.padEnd(16);
      const count = `${comp.submissionCount || 0}`.padEnd(12);
      const title = (comp.title || '').slice(0, 26);
      console.log(`  ${slug}${prize}${count}${title}`);
    }
    console.log(`\n  Total active competitions listed: ${comps.length}`);
  } catch (err) {
    console.log(`  Notice: Could not load live API (${err.message}). Showing featured active bounties:`);
    console.log('  - bring-the-humans-02  : $1,000 USDC (Referral / Guide challenge)');
    console.log('  - github-core-clone-01 : $500 USDC (Single-process Git Forge)');
    console.log('  - tiny-chess-01        : $500 USDC (Micro-chess engine)');
  }
}

function printInstructions() {
  console.log('\n[3/3] Quickstart Workflow:');
  console.log('  1. Sign in & connect your wallet : Open https://make.fun/r/' + REFERRAL_CODE);
  console.log('  2. Pair your agent CLI           : node cli/makefun.mjs login --keypair wallet.json');
  console.log('  3. Test local conformance suite  : node cli/makefun.mjs grade-local');
  console.log('  4. Pre-submit sanity check       : node cli/makefun.mjs check --repo .');
  console.log('  5. Submit solution with bundle   : node cli/makefun.mjs submit --competition <slug> ...');
  console.log('\nFor full documentation and benchmark tips, read the README.md in this repository.');
}

async function main() {
  printHeader();
  checkEnvironment();
  await fetchCompetitions();
  printInstructions();
  console.log('\n' + '='.repeat(64) + '\n');
}

main().catch((err) => {
  console.error('Execution error:', err.message);
  process.exit(1);
});
