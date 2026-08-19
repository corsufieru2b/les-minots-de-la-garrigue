$ErrorActionPreference = 'Stop'

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$nextBin = Join-Path $projectRoot 'node_modules\next\dist\bin\next'
$localStorageFile = Join-Path $projectRoot '.next\node-localstorage.json'

if ($env:NODE_OPTIONS) {
  $sanitizedOptions = ($env:NODE_OPTIONS -split '\s+') | Where-Object { $_ -and $_ -notmatch '^--localstorage-file(?:=.*)?$' }
  if ($sanitizedOptions.Count -gt 0) {
    $env:NODE_OPTIONS = ($sanitizedOptions -join ' ')
  } else {
    Remove-Item Env:NODE_OPTIONS -ErrorAction SilentlyContinue
  }
}

New-Item -ItemType Directory -Force -Path (Split-Path -Parent $localStorageFile) | Out-Null

Set-Location $projectRoot

& node --localstorage-file $localStorageFile $nextBin dev @args