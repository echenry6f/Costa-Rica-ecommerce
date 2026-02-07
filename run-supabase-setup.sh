#!/bin/bash
# Ticora Store — Run Supabase setup using credentials from supabase-credentials.txt
# Run this in your terminal: ./run-supabase-setup.sh

set -e
cd "$(dirname "$0")"

# Load nvm if available
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Credentials from supabase-credentials.txt
PROJECT_REF="wnfsukalmaycwdihumlb"
DB_PASSWORD="YJcJu7QnPmNj9UOY"
DB_URL="postgresql://postgres:${DB_PASSWORD}@db.${PROJECT_REF}.supabase.co:5432/postgres"

echo "1. Linking Supabase project..."
npx supabase link --project-ref "$PROJECT_REF" || {
  echo "   Link failed (run 'npx supabase login' first if needed)"
  echo "   Trying db push with direct URL instead..."
}

echo ""
echo "2. Pushing migrations..."
npx supabase db push --db-url "$DB_URL" && {
  echo ""
  echo "✓ Migrations applied successfully."
} || {
  echo ""
  echo "✗ db push failed. Run the schema manually:"
  echo "  1. Open https://supabase.com/dashboard/project/$PROJECT_REF/sql"
  echo "  2. Paste contents of supabase/schema.sql"
  echo "  3. Click Run"
}
