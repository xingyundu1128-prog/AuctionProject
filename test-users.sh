#!/bin/bash
# Quick test script - opens 3 browser windows with different users

echo "🎭 Opening 3 users in separate windows..."
echo ""
echo "Person 1 - Andy (user=1001)"
open -a "Safari" "http://localhost:8000/?user=1001"

sleep 1

echo "Person 2 - Bob (user=1002)"
open -a "Google Chrome" "http://localhost:8000/?user=1002" 2>/dev/null || open "http://localhost:8000/?user=1002"

sleep 1

echo "Person 3 - Cathy (user=1003)"
open -a "Firefox" "http://localhost:8000/?user=1003" 2>/dev/null || open "http://localhost:8000/?user=1003"

echo ""
echo "✅ All 3 users opened!"
echo "You should see different user badges in each window:"
echo "  👤 Andy"
echo "  👤 Bob"
echo "  👤 Cathy"
