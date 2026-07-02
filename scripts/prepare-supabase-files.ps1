param(
  [Parameter(Mandatory = $true)]
  [string]$AdminEmail,

  [Parameter(Mandatory = $false)]
  [string]$SupabaseUrl = "",

  [Parameter(Mandatory = $false)]
  [string]$AnonKey = ""
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$templateRoot = Join-Path $projectRoot "supabase"
$outputBase = Join-Path (Split-Path -Parent $projectRoot) "outputs"
$outputRoot = Join-Path $outputBase "supabase-ready"

New-Item -ItemType Directory -Force -Path $outputRoot | Out-Null

function Write-Utf8File {
  param(
    [string]$Path,
    [string]$Content
  )

  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($Path, $Content, $utf8NoBom)
}

function Replace-AdminEmail {
  param(
    [string]$InputText
  )

  return $InputText.Replace("your-admin-email@example.com", $AdminEmail.Trim().ToLower())
}

$schemaTemplate = Get-Content -Raw (Join-Path $templateRoot "schema.sql")
$storageTemplate = Get-Content -Raw (Join-Path $templateRoot "storage.sql")
$seedTemplate = Get-Content -Raw (Join-Path $templateRoot "seed.sql")
$envTemplate = Get-Content -Raw (Join-Path $projectRoot ".env.local.example")

$schemaReady = Replace-AdminEmail -InputText $schemaTemplate
$storageReady = Replace-AdminEmail -InputText $storageTemplate
$seedReady = $seedTemplate
$envReady = $envTemplate.Replace("your-admin-email@example.com", $AdminEmail.Trim().ToLower())

if ($SupabaseUrl) {
  $envReady = $envReady.Replace("NEXT_PUBLIC_SUPABASE_URL=", "NEXT_PUBLIC_SUPABASE_URL=$SupabaseUrl")
}

if ($AnonKey) {
  $envReady = $envReady.Replace("NEXT_PUBLIC_SUPABASE_ANON_KEY=", "NEXT_PUBLIC_SUPABASE_ANON_KEY=$AnonKey")
}

Write-Utf8File -Path (Join-Path $outputRoot "01-schema.sql") -Content $schemaReady
Write-Utf8File -Path (Join-Path $outputRoot "02-storage.sql") -Content $storageReady
Write-Utf8File -Path (Join-Path $outputRoot "03-seed.sql") -Content $seedReady
Write-Utf8File -Path (Join-Path $outputRoot ".env.local.txt") -Content $envReady

$summary = @"
Generated files:

1. 01-schema.sql
2. 02-storage.sql
3. 03-seed.sql
4. .env.local.txt

Output folder:
$outputRoot
"@

Write-Host $summary
