$headers = @{ "Content-Type" = "application/json" }
$body = @{
    username = "TestPinUser" + (Get-Random)
    password = "password123"
    pin = "1234"
    balance = 10000
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8081/api/auth/register" -Method Post -Headers $headers -Body $body -ErrorAction Stop
    Write-Host "Response:" ($response | ConvertTo-Json)
} catch {
    Write-Host "Error:" $_.Exception.Response.StatusCode.value__
    Write-Host "Details:" $_.ErrorDetails.Message
}
