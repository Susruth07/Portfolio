param(
  [int]$Port = 8000
)

$root = (Resolve-Path $PSScriptRoot).Path
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $Port)
$bufferSize = 8192

function Get-ContentType {
  param([string]$Path)

  switch ([System.IO.Path]::GetExtension($Path).ToLowerInvariant()) {
    ".html" { "text/html; charset=utf-8" }
    ".css" { "text/css; charset=utf-8" }
    ".js" { "application/javascript; charset=utf-8" }
    ".json" { "application/json; charset=utf-8" }
    ".svg" { "image/svg+xml" }
    ".png" { "image/png" }
    ".jpg" { "image/jpeg" }
    ".jpeg" { "image/jpeg" }
    default { "application/octet-stream" }
  }
}

function Write-Response {
  param(
    [System.Net.Sockets.NetworkStream]$Stream,
    [int]$StatusCode,
    [string]$StatusText,
    [string]$ContentType,
    [byte[]]$Body
  )

  $header = "HTTP/1.1 $StatusCode $StatusText`r`nContent-Type: $ContentType`r`nContent-Length: $($Body.Length)`r`nConnection: close`r`n`r`n"
  $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
  $Stream.Write($headerBytes, 0, $headerBytes.Length)
  if ($Body.Length -gt 0) {
    $Stream.Write($Body, 0, $Body.Length)
  }
}

try {
  $listener.Start()
  Write-Host "Serving $root at http://localhost:$Port/"

  while ($true) {
    $client = $listener.AcceptTcpClient()
    $stream = $client.GetStream()

    try {
      $buffer = New-Object byte[] $bufferSize
      $read = $stream.Read($buffer, 0, $buffer.Length)

      if ($read -le 0) {
        continue
      }

      $request = [System.Text.Encoding]::ASCII.GetString($buffer, 0, $read)
      $requestLine = ($request -split "`r`n")[0]
      $parts = $requestLine -split " "

      if ($parts.Length -lt 2 -or $parts[0] -ne "GET") {
        $body = [System.Text.Encoding]::UTF8.GetBytes("Method not allowed")
        Write-Response $stream 405 "Method Not Allowed" "text/plain; charset=utf-8" $body
        continue
      }

      $requestPath = [System.Uri]::UnescapeDataString(($parts[1] -split "\?")[0].TrimStart("/"))

      if ([string]::IsNullOrWhiteSpace($requestPath)) {
        $requestPath = "index.html"
      }

      $candidate = Join-Path $root $requestPath
      $resolved = [System.IO.Path]::GetFullPath($candidate)

      if (-not $resolved.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)) {
        $body = [System.Text.Encoding]::UTF8.GetBytes("Forbidden")
        Write-Response $stream 403 "Forbidden" "text/plain; charset=utf-8" $body
        continue
      }

      if (-not [System.IO.File]::Exists($resolved)) {
        $body = [System.Text.Encoding]::UTF8.GetBytes("Not found")
        Write-Response $stream 404 "Not Found" "text/plain; charset=utf-8" $body
        continue
      }

      $bytes = [System.IO.File]::ReadAllBytes($resolved)
      Write-Response $stream 200 "OK" (Get-ContentType $resolved) $bytes
    }
    finally {
      $stream.Close()
      $client.Close()
    }
  }
}
finally {
  $listener.Stop()
}
