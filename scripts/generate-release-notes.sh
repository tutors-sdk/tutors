#!/usr/bin/env bash
#
# generate-release-notes.sh
#
# Generate release notes from git log between two refs.
# Groups commits by conventional-commit type and lists merged PRs.
#
# Usage:
#   ./scripts/generate-release-notes.sh <FROM_REF> [TO_REF]
#
# Examples:
#   ./scripts/generate-release-notes.sh v14.0.0 v15.0.0
#   ./scripts/generate-release-notes.sh v15.0.0          # defaults TO_REF to HEAD
#

set -euo pipefail

FROM_REF="${1:?Usage: $0 <FROM_REF> [TO_REF]}"
TO_REF="${2:-HEAD}"

echo "# Release Notes: ${FROM_REF}..${TO_REF}"
echo ""
echo "Generated on $(date -u +%Y-%m-%d)"
echo ""

# Collect all non-merge commit subjects
commits=$(git log --no-merges --pretty=format:"%s" "${FROM_REF}..${TO_REF}")

print_section() {
  local title="$1"
  local pattern="$2"
  local matches

  matches=$(echo "$commits" | grep -iE "^${pattern}" | sed -E "s/^${pattern}[:(]?\s*//" | sort -u || true)

  if [ -n "$matches" ]; then
    echo "## ${title}"
    echo ""
    while IFS= read -r line; do
      echo "- ${line}"
    done <<< "$matches"
    echo ""
  fi
}

print_section "Features" "feat"
print_section "Bug Fixes" "fix"
print_section "Refactoring" "refactor"
print_section "Documentation" "docs"
print_section "Chores" "chore"
print_section "Tests" "test"

# List merged PRs
prs=$(git log --merges --pretty=format:"%s" "${FROM_REF}..${TO_REF}" | grep -i "Merge pull request" || true)

if [ -n "$prs" ]; then
  echo "## Merged Pull Requests"
  echo ""
  while IFS= read -r line; do
    echo "- ${line}"
  done <<< "$prs"
  echo ""
fi

# Catch-all: commits that don't match any conventional-commit prefix
other=$(echo "$commits" | grep -ivE "^(feat|fix|refactor|docs|chore|test)" | head -50 || true)

if [ -n "$other" ]; then
  echo "## Other Changes"
  echo ""
  while IFS= read -r line; do
    if [ -n "$line" ]; then
      echo "- ${line}"
    fi
  done <<< "$other"
  echo ""
fi
