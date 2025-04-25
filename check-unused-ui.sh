#!/bin/bash

UI_DIR="src/components/ui"
PROJECT_ROOT="src"

echo "🔍 Scanning for unused files in $UI_DIR..."
echo

unused=()

# Loop through all files in the ui directory
find "$UI_DIR" -type f | while read -r file; do
  # Get the path relative to src, e.g., components/ui/button.tsx
  relative_path="${file#src/}"
  
  # Remove the extension for import path comparison
  import_path="${relative_path%.*}"

   # Check if the file is imported anywhere else
  if ! grep -r --exclude-dir="$UI_DIR" --exclude-dir="node_modules" --exclude="check-unused-ui.sh" "$import_path" "$PROJECT_ROOT" > /dev/null; then
    echo "❌ Unused: $relative_path"
    unused+=("$relative_path")
  else
    echo "✅ Used: $relative_path"
  fi
done

echo
echo "📋 Summary:"
if [ ${#unused[@]} -eq 0 ]; then
  echo "🎉 All files are being used!"
else
  echo "⚠️ The following files appear to be unused:"
  for f in "${unused[@]}"; do
    echo " - $f"
  done
fi
